<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'vendor/autoload.php';

use App\Router;
use App\Controllers\{User, Auth, Product, Order, OrderMenu, DbTestController, Role, Unit, PaymentMethod, OrderStatus, Menu, MenuProduct, MenuChoice, Category, Discount, Stats};

// Ajouter les headers CORS dans le script PHP
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:8085");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(204);
    exit();
}

$controllers = [
    User::class,
    Auth::class,
    Product::class,
    Order::class,
    OrderMenu::class,
    DbTestController::class,
    Role::class,
    Unit::class,
    PaymentMethod::class,
    OrderStatus::class,
    DbTestController::class,
    Category::class,
    Menu::class,
    MenuProduct::class,
    MenuChoice::class,
    Discount::class,
    Stats::class
];

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = trim($uri, '/'); // "dbtest" dans ce cas
error_log("URI extrait: " . $uri);

$router = new Router();
$router->registerControllers($controllers);
$router->run();
