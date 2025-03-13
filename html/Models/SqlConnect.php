<?php
header('Content-Type: application/json');

// Utilisez le nom du service 'db' pour accéder au conteneur MySQL via Docker Compose.
$host = 'db';
$db   = getenv('MYSQL_DATABASE');
$user = getenv('MYSQL_USER');
$pass = getenv('MYSQL_PASSWORD');
$charset = 'utf8mb4';

$dsn = "mysql:host={$host};dbname={$db};charset={$charset}";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    // Par exemple, on récupère la liste des tables de la base
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll();
    echo json_encode([
        'status' => 'success',
        'data'   => $tables
    ]);
} catch (\PDOException $e) {
    echo json_encode([
        'status'  => 'error',
        'message' => $e->getMessage()
    ]);
    exit();
}
