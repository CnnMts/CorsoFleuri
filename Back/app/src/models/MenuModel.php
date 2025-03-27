<?php

namespace App\Models;

use \PDO;
use stdClass;

class MenuModel extends SqlConnect {
  private $table = "menu";
  public $authorized_fields_to_update = ['name', 'price', 'display'];

  /*========================= ADD ===========================================*/
  
  public function add(array $data) {
    $query = "
      INSERT INTO $this->table (name, price)
      VALUES (:name, :price)
    ";

    $req = $this->db->prepare($query);
    $req->execute($data);
  }

  /*========================= GET BY ID =====================================*/

  public function get(int $id) {
    $req = $this->db->prepare("SELECT * FROM $this->table WHERE id = :id");
    $req->execute(["id" => $id]);

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : 
      new stdClass();
  }

  /*========================= GET ALL =======================================*/

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
    
    return $req->fetchAll(PDO::FETCH_ASSOC);
  }

  /*========================= GET LAST ======================================*/

  public function getLast() {
    $req = $this->db->prepare(
      "SELECT * FROM $this->table ORDER BY id DESC LIMIT 1");
    $req->execute();

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : 
      new stdClass();
  }

/*========================= UPDATE ==========================================*/

  public function update(array $data, int $id) {
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

  /*========================= DELETE ========================================*/

  public function delete(int $menuId) {
    $deleteProductsQuery = "DELETE FROM menu_product WHERE menu_id = :menuId";
    $stmt1 = $this->db->prepare($deleteProductsQuery);
    $stmt1->execute(["menuId" => $menuId]);

    $deleteMenuQuery = "DELETE FROM menu WHERE id = :menuId";
    $stmt2 = $this->db->prepare($deleteMenuQuery);
    $stmt2->execute(["menuId" => $menuId]);

    return new stdClass();
}
}