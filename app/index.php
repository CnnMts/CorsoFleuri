<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'vendor/autoload.php';

use App\Router;
use App\Controllers\{User, Auth, Product, Sale, Order, OrderItem, Delivery, Returns, DbTestController,Category, Menu, MenuProduct};

$controllers = [
    User::class,
    Auth::class,
    Product::class,
    Sale::class,
    Order::class,
    OrderItem::class,
    Delivery::class,
    Returns::class,
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