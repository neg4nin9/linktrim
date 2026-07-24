FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    unzip curl libpq-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring xml \
    && apt-get clean

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN php artisan config:cache && php artisan route:cache

EXPOSE 8080

CMD php artisan serve --host=0.0.0.0 --port=8080
