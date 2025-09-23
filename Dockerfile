# Etapa 1: instalar dependencias PHP con Composer
FROM php:8.4-cli AS build-php
RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libjpeg-dev libpng-dev \
    && docker-php-ext-install exif gd pdo_pgsql
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader
COPY . .

# Etapa 2: compilar assets con Node
FROM node:current AS build-assets
WORKDIR /app
COPY package*.json vite.config.js ./
RUN npm install
COPY resources ./resources
COPY public ./public
RUN npm run build

# Etapa final: PHP + Apache
FROM php:8.4-apache
RUN apt-get update && apt-get install -y \
    libpq-dev git unzip libjpeg-dev libpng-dev \
    && docker-php-ext-install pdo pdo_pgsql gd exif \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html
COPY --from=build-php /app ./
COPY --from=build-assets /app/public/build ./public/build

RUN a2enmod rewrite
RUN php artisan config:cache && php artisan event:cache && php artisan view:cache
RUN php artisan storage:link

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80
