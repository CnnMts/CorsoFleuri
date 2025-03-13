<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'vendor/autoload.php';

use App\Router;
use App\Controllers\{User, Auth, Product, Sale, Order, OrderItem, Delivery, Returns, DbTestController};

$controllers = [
    User::class,
    Auth::class,
    Product::class,
    Sale::class,
    Order::class,
    OrderItem::class,
    Delivery::class,
    Returns::class,
    DbTestController::class
];

$router = new Router();
$router->registerControllers($controllers);
$router->run();