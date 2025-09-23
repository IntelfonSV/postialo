# ============================
# Etapa 1: dependencias PHP (Composer)
# ============================
FROM php:8.4-cli AS build-php

# Instalar extensiones necesarias
RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libjpeg-dev libpng-dev \
    && docker-php-ext-install exif gd pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# Instalar composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copiar solo composer.json y composer.lock (mejor uso de cache)
COPY composer.json composer.lock ./

# Instalar dependencias PHP sin ejecutar scripts (artisan aún no está)
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copiar el resto del proyecto (incluye artisan)
COPY . .

# Ejecutar los scripts de composer (package:discover, etc.)
RUN composer run-script post-autoload-dump


# ============================
# Etapa 2: compilar assets con Node/Vite
# ============================
FROM node:current AS build-assets
WORKDIR /app

# Copiar archivos de dependencias JS
COPY package*.json vite.config.js ./
RUN npm install

# Copiar fuentes de assets y compilar
COPY resources ./resources
COPY public ./public
RUN npm run build


# ============================
# Etapa 3: imagen final PHP + Apache
# ============================
FROM php:8.4-apache

# Instalar dependencias PHP necesarias
RUN apt-get update && apt-get install -y \
    libpq-dev git unzip libjpeg-dev libpng-dev \
    && docker-php-ext-install pdo pdo_pgsql gd exif \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

# Copiar proyecto con vendor/ ya listo
COPY --from=build-php /app ./

# Copiar solo los assets compilados
COPY --from=build-assets /app/public/build ./public/build

# Habilitar mod_rewrite
RUN a2enmod rewrite

# Configurar Apache para que apunte a /public
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf \
    && echo '<Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>' > /etc/apache2/conf-available/laravel.conf \
    && a2enconf laravel

# Cache de Laravel (ojo: no incluyo route:cache por si hay conflictos)
RUN php artisan config:cache && php artisan event:cache && php artisan view:cache

# Enlazar storage
RUN php artisan storage:link || true

# Permisos correctos para Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80
