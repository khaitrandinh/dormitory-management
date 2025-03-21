# Sử dụng PHP 8.2 FPM bản Debian-based (dễ cài ext hơn Alpine)
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www

# Install system dependencies + mysql client + PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev \
    zip \
    unzip \
    git \
    curl \
    libonig-dev \
    libzip-dev \
    mariadb-client \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy project files
COPY . .

# Install Laravel dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Set permissions
RUN chmod -R 777 storage bootstrap/cache

# Expose port
EXPOSE 8000

# CMD to run Laravel dev server AND migrate fresh seed
CMD php artisan migrate:fresh --seed && php artisan serve --host=0.0.0.0 --port=8000
