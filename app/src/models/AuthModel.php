<?php

namespace App\Models;

use App\Models\SqlConnect;
use App\Utils\{HttpException, JWT};
use App\Middlewares\Roles;
use \PDO;
use \Exception;

class AuthModel extends SqlConnect {
  private string $table  = "user";
  private int $tokenValidity = 3600*24;
  private string $tableRole = "role";
  
  /*========================= REGISTER ======================================*/


  public function register(array $data) {
    $query = "SELECT username FROM $this->table WHERE username = :username";
    $req = $this->db->prepare($query);
    $req->execute(["username" => $data["username"]]);
    
    if ($req->rowCount() > 0) {
      throw new HttpException("User already exists!", 400);
    }

    $queryRole = "SELECT id FROM $this->tableRole WHERE name = :name";
    $reqRole = $this->db->prepare($queryRole);
    $reqRole->execute([
      'name' => 'admin'
    ]);
    $role = $reqRole->fetch(PDO::FETCH_ASSOC);
    var_dump($role);
    $roleId = $role['id'];
    

    $hashedPassword = password_hash($data["identification_code"],
      PASSWORD_BCRYPT);

    //To filter secure password on register
    if (strlen($data["identification_code"]) <= 5) {
      throw new Exception('Password must be at least 5 characters long.');
    }
    
    // if (!preg_match('/[A-Z]/', $data["identification_code"])) {
    //     throw new Exception('
    //     Password must include at least one uppercase letter.');
    // }
    
    if (!preg_match('/[0-9]/', $data["identification_code"])) {
        throw new Exception('Password must include at least one number.');
    }

    if ($data['role_id'] == null 
    || $data['username'] == null
    || $data['identification_code'] == null) {
      throw new Exception('Missing fields.');
    }

    // Create the user
    $queryAdd = "INSERT INTO $this->table (
      role_id, username, identification_code) 
      VALUES (:role_id, :username, :identification_code)";

    $req2 = $this->db->prepare($queryAdd);
    $req2->execute([
      "role_id" => $data['role_id'],
      "username" => $data['username'],
      "identification_code" => $hashedPassword
    ]);

    $userId = $this->db->lastInsertId();

    // Generate the JWT token
    $token = $this->generateJWT($userId, $roleId);

    return ['token' => $token];
  }

  /*========================= LOGIN =========================================*/

  public function login($username, $password) {
    $query = "SELECT user.*, role.name FROM $this->table 
      JOIN role ON user.role_id = role.id WHERE user.username = :username";
    $req = $this->db->prepare($query);
    $req->execute(['username' => $username]);

    $user = $req->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        if (password_verify($password, $user['identification_code'])) {
          $token = $this->generateJWT($user['id'], $user['role_id']);
            return ['token' => $token];
        }
        throw new HttpException("Mauvais code d'identification", 401);
    }
  }

  /*========================= JWT  ==========================================*/

  private function generateJWT(int $userId, int $role) {
    $payload = [
      'id' => $userId,
      'role' => $role,
      'exp' => time() + $this->tokenValidity
    ];
    return JWT::generate($payload);
  }
}