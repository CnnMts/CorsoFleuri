<?php
namespace App\Controllers;

use PDO;

class DbTestController {
    #[Route("GET", "/dbtest")]
    public function index() {
        error_log('Execution de DbTestController::index()');

        // Paramètres de connexion : ici, le host est le nom de service "db" défini dans votre docker-compose.yml
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
            $stmt = $pdo->query("SHOW TABLES");
            $tables = $stmt->fetchAll();
            echo json_encode([
                "status"  => "success",
                "message" => "Connexion réussie !",
                "tables"  => $tables
            ]);
        } catch (\PDOException $e) {
            echo json_encode([
                "status"  => "error",
                "message" => $e->getMessage()
            ]);
        }
    }
}
