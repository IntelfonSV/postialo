# ============================
# Etapa 1: dependencias PHP (Composer)
# ============================
FROM php:8.4-cli AS build-php

# Instalar extensiones necesarias
RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libjpeg-dev libpng-dev libfreetype6-dev libzip-dev \
 && docker-php-ext-configure gd --with-jpeg \
 && docker-php-ext-install exif gd pdo pdo_pgsql zip \
 && rm -rf /var/lib/apt/lists/*

# Instalar composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copiar solo composer.json y composer.lock (mejor uso de cache)
COPY composer.json composer.lock ./

# Instalar dependencias PHP sin ejecutar scripts (artisan aún no está)
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copiar el resto del proyecto (incluye artisan)
COPY . .

# Ejecutar los scripts de composer (package:discover, etc.)
RUN composer run-script post-autoload-dump --no-interaction


# ============================
# Etapa 2: compilar assets con Node/Vite
# ============================
FROM node:20 AS build-assets
WORKDIR /app

# Copiar archivos de dependencias JS
COPY package*.json vite.config.js ./
RUN npm ci

# Copiar fuentes de assets y compilar
COPY resources ./resources
COPY public ./public
RUN npm run build


# ============================
# Etapa 3: imagen final PHP + Apache
# ============================
FROM php:8.4-apache

# Instalar dependencias PHP necesarias + configurar GD y OPcache
RUN apt-get update && apt-get install -y \
      libpq-dev libjpeg-dev libpng-dev libfreetype6-dev libzip-dev \
  && docker-php-ext-configure gd --with-jpeg \
  && docker-php-ext-install pdo pdo_pgsql gd exif zip opcache \
  && a2enmod rewrite headers \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# OPcache recomendado para producción
RUN printf '%s\n' \
  "zend_extension=opcache" \
  "opcache.enable=1" \
  "opcache.enable_cli=0" \
  "opcache.memory_consumption=256" \
  "opcache.interned_strings_buffer=16" \
  "opcache.max_accelerated_files=20000" \
  "opcache.validate_timestamps=0" \
  "opcache.save_comments=1" \
  "opcache.fast_shutdown=1" \
  > /usr/local/etc/php/conf.d/opcache.ini

WORKDIR /var/www/html

# Copiar aplicación con vendor/ ya listo
COPY --from=build-php /app ./

# Copiar solo los assets compilados
COPY --from=build-assets /app/public/build ./public/build

# Apache apunta a /public
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf \
    && printf '%s\n' \
    '<Directory /var/www/html/public>' \
    '    AllowOverride All' \
    '    Require all granted' \
    '</Directory>' \
    > /etc/apache2/conf-available/laravel.conf \
    && a2enconf laravel

# Crear entrypoint en la imagen (sin depender del host)
RUN printf '%s\n' '#!/usr/bin/env bash' \
  'set -e' \
  'cd /var/www/html' \
  '' \
  '# Estructura de storage cuando el volumen está vacío' \
  'mkdir -p storage/framework/{cache,data,views,sessions} storage/app/public bootstrap/cache' \
  'chown -R www-data:www-data storage bootstrap/cache' \
  'chmod -R 775 storage bootstrap/cache' \
  '' \
  '# Symlink de storage' \
  'php artisan storage:link || true' \
  '' \
  '# Limpiar y regenerar caches en arranque (requiere .env y APP_KEY). No falla el contenedor si algo menor falla.' \
  'php artisan config:clear || true' \
  'php artisan route:clear || true' \
  'php artisan view:clear  || true' \
  'php artisan event:clear || true' \
  'php artisan config:cache --no-ansi || true' \
  'php artisan route:cache  --no-ansi || true' \
  'php artisan view:cache   --no-ansi || true' \
  'php artisan event:cache  --no-ansi || true' \
  '' \
  '# Migraciones opcionales' \
  'if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then' \
  '  echo "Ejecutando migraciones...";' \
  '  php artisan migrate --force --no-ansi || exit 1' \
  'fi' \
  '' \
  'exec apache2-foreground' \
  > /entrypoint.sh \
  && chmod +x /entrypoint.sh

# Permisos base (en imagen)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
