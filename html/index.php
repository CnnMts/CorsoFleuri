<?php
header('Content-Type: application/json');
echo json_encode([
    'message' => 'Connexion réussie !',
    'timestamp' => time()
]);
