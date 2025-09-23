FROM php:8.4-apache


# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    libpq-dev git unzip libjpeg-dev libpng-dev \
    && docker-php-ext-install pdo pdo_pgsql gd exif \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Habilitar mod_rewrite de Apache
RUN a2enmod rewrite
RUN git config --global --add safe.directory /var/www/html
# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Copiar archivos del proyecto
COPY . .

# Instalar dependencias PHP
RUN composer install --no-dev --optimize-autoloader

# Generar la clave de la aplicación

RUN php artisan key:generate

RUN php artisan optimize

RUN php artisan config:clear && \
    php artisan view:clear && \
    php artisan route:clear



# Migrar la base de datos
RUN php artisan migrate --graceful --ansi --force

RUN php artisan storage:link

#install nodejs
RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash - \
    && apt-get install -y nodejs

# Instalar dependencias JS y compilar assets
RUN npm install && npm run build

# Cambiar el DocumentRoot a public
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

# Permisos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 777 /var/www/html/storage

EXPOSE 80
