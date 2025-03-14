<?php

namespace App\Models;

use \PDO;
use stdClass;
use \Exception;
use App\Utils\{HttpException};

class UserModel extends SqlConnect {
  private $table = "user";
  public $authorized_fields_to_update = ['role_id', 'username', 'identification_code'];

  public function add(array $data) {
    $query = "SELECT identification_code FROM $this->table WHERE identification_code = :identification_code";
    $req = $this->db->prepare($query);
    $req->execute(["identification_code" => $data["identification_code"]]);
    
    if ($req->rowCount() > 0) {
      throw new HttpException("User already exists!", 400);
    }
   
    if (!preg_match('/^[0-9]*$/m', $data["identification_code"])) {
        throw new Exception('Identification code must only be composed of numbers.');
    }

    // if ($data['role_id'] == null 
    // || $data['username'] == null) {
    //   throw new Exception('Missing fields.');
    // }

    $query = "
      INSERT INTO $this->table (role_id, username, identification_code)
      VALUES (:role_id, :username, :identification_code)
    ";

    $req = $this->db->prepare($query);
    $req->execute($data);
  }

  public function delete(int $id) {
    $query = "SELECT * FROM $this->table WHERE id = :id";
    $req = $this->db->prepare($query);
    $req->execute(["id" => $id]);
    
    if ($req->rowCount() == 0) {
      throw new HttpException("User doesn't exists !", 400);
    }

    $req = $this->db->prepare("DELETE FROM $this->table WHERE id = :id");
    $req->execute(["id" => $id]);
    return new stdClass();
  }

  public function get(int $id) {
    $query = "SELECT * FROM $this->table WHERE id = :id";
    $req = $this->db->prepare($query);
    $req->execute(["id" => $id]);
    
    if ($req->rowCount() == 0) {
      throw new HttpException("User doesn't exists !", 400);
    }

    $req = $this->db->prepare("SELECT * FROM $this->table WHERE id = :id");
    $req->execute(["id" => $id]);

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
  }

  public function getAll(?int $limit = null) {
    $query = "SELECT * FROM {$this->table}";
    
    if ($limit !== null) {
        $query .= " LIMIT :limit";
        $params = [':limit' => (int)$limit];
    } else {
        $params = [];
    }
    
    $req = $this->db->prepare($query);
    foreach ($params as $key => $value) {
        $req->bindValue($key, $value, PDO::PARAM_INT);
    }
    $req->execute();

    if ($req->rowCount() == 0) {
      throw new HttpException("No users !", 400);
    }
    
    return $req->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getLast() {
    $req = $this->db->prepare("SELECT * FROM $this->table ORDER BY id DESC LIMIT 1");
    $req->execute();

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
  }

  public function update(array $data, int $id) {
    if (!preg_match('/^[0-9]*$/m', $data["identification_code"])) {
      throw new Exception('Identification code must only be composed of numbers.');
    }

    $request = "UPDATE $this->table SET ";
    $params = [];
    $fields = [];

    foreach ($data as $key => $value) {
        if (in_array($key, $this->authorized_fields_to_update)) {
            $fields[] = "$key = :$key";
            $params[":$key"] = $value;
        }
    }

    $params[':id'] = $id;
    $query = $request . implode(", ", $fields) . " WHERE id = :id";

    $req = $this->db->prepare($query);
    $req->execute($params);
    
    return $this->get($id);
  }
}