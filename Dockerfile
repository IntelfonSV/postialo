FROM php:8.3-apache

# ------------------------------------------------------
# Paquetes del sistema + extensiones PHP recomendadas
# ------------------------------------------------------
RUN apt-get update && apt-get install -y \
    git curl zip unzip \
    libpq-dev libonig-dev \
    libjpeg-dev libpng-dev libfreetype6-dev libzip-dev \
    gnupg ca-certificates \
 && docker-php-ext-configure gd --with-jpeg \
 && docker-php-ext-install pdo pdo_pgsql gd exif zip opcache \
 && a2enmod rewrite headers \
 && rm -rf /var/lib/apt/lists/*

# ------------------------------------------------------
# Node.js (estable) para construir Vite (Node 20.x)
# ------------------------------------------------------
RUN install -m 0755 -d /etc/apt/keyrings \
 && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
      | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
 && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" \
      > /etc/apt/sources.list.d/nodesource.list \
 && apt-get update && apt-get install -y nodejs \
 && npm --version && node --version

# ------------------------------------------------------
# Composer
# ------------------------------------------------------
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# ------------------------------------------------------
# Config PHP: OPcache recomendado para producción
# ------------------------------------------------------
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

# ------------------------------------------------------
# Código de la app
# ------------------------------------------------------
WORKDIR /var/www/html
COPY . .

# Si tu layout usa @vite importando CSS desde JS:
# Asegúrate de que resources/js/app.js haga:  import '../css/app.css'
# y que tailwind.config.js tenga los globs correctos.

# ------------------------------------------------------
# Dependencias PHP (sin dev), autoload optimizado
# ------------------------------------------------------
RUN composer install --no-dev --optimize-autoloader --no-interaction

# ------------------------------------------------------
# Clave de app, symlink de storage, caches y optimize
# (Requiere .env presente; si no existe, copia el example)
# ------------------------------------------------------
RUN if [ ! -f .env ] && [ -f .env.example ]; then cp .env.example .env; fi \
 && php artisan key:generate --force \
 && php artisan storage:link || true \
 && php artisan config:clear && php artisan view:clear && php artisan route:clear && php artisan event:clear \
 && php artisan optimize

# ------------------------------------------------------
# Migraciones (⚠️ Requiere DB accesible en build-time)
# Si tu DB no está disponible en build, comenta esta línea
# y ejecútalo luego con: docker exec app php artisan migrate --force
# ------------------------------------------------------
RUN php artisan migrate --force --ansi || true

# ------------------------------------------------------
# Frontend: instalar y compilar assets de Vite
# ------------------------------------------------------
RUN npm ci || npm install \
 && npm run build

# ------------------------------------------------------
# Apache: DocumentRoot -> /public
# ------------------------------------------------------
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# ------------------------------------------------------
# Permisos de runtime
# ------------------------------------------------------
RUN chown -R www-data:www-data /var/www/html \
 && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80
