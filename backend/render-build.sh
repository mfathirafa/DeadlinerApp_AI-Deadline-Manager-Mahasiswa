#!/usr/bin/env bash
set -e

echo "=== Installing Composer dependencies ==="
composer install --no-dev --optimize-autoloader --no-interaction

echo "=== Setting permissions ==="
chmod -R 775 storage bootstrap/cache

echo "=== Caching config, routes, views ==="
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "=== Running migrations ==="
php artisan migrate --force

echo "=== Build complete ==="