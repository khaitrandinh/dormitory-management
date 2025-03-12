# Sử dụng PHP 8.2 FPM với Alpine Linux để tối ưu
FROM php:8.2-fpm

# Thiết lập thư mục làm việc
WORKDIR /var/www

# Cài đặt các dependencies cần thiết
RUN apt-get update && apt-get install -y \
    libpng-dev \
    zip \
    unzip \
    git \
    curl

# Cài đặt và kích hoạt PDO MySQL
RUN docker-php-ext-install pdo pdo_mysql && docker-php-ext-enable pdo_mysql

# Cài đặt Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Cài đặt các dependencies của Laravel
RUN composer install

# Cài đặt các dependencies của Laravel
RUN composer require fruitcake/laravel-cors

# Gán quyền cho thư mục storage và bootstrap/cache
RUN chmod -R 777 storage bootstrap/cache

# Mở cổng 8000
EXPOSE 8000

# Chạy Laravel khi container khởi động
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000


