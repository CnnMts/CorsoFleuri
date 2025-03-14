<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'vendor/autoload.php';

use App\Router;
use App\Controllers\{User, Auth, Product, Order, OrderItem, DbTestController, Role, Unit, PaymentMethod, OrderStatus, Menu, MenuProduct, Category};


$controllers = [
    User::class,
    Auth::class,
    Product::class,
    Order::class,
    OrderItem::class,
    DbTestController::class,
    Role::class,
    Unit::class,
    PaymentMethod::class,
    OrderStatus::class,
    DbTestController::class,
    Category::class,
    Menu::class,
    MenuProduct::class
];


$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = trim($uri, '/'); // "dbtest" dans ce cas
error_log("URI extrait: " . $uri);

$router = new Router();
$router->registerControllers($controllers);
$router->run();