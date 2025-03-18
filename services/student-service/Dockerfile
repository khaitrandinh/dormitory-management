# Sử dụng PHP 8.2 với FPM để chạy Laravel
FROM php:8.2-fpm

# Thiết lập thư mục làm việc
WORKDIR /var/www

# Cài đặt các dependency cần thiết cho Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev zip unzip git curl libonig-dev libzip-dev mariadb-client \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl

# Cài đặt Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy toàn bộ project vào container
COPY . .

# Cài đặt Laravel dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Phân quyền cho thư mục storage và bootstrap/cache
RUN chmod -R 777 storage bootstrap/cache

# Expose port cho container
EXPOSE 8000

# Chạy Laravel khi container khởi động
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
