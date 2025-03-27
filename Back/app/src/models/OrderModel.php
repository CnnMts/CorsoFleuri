<?php

namespace App\Models;

use \PDO;
use stdClass;

class OrderModel extends SqlConnect {
  private $table = "orders";
  public $authorized_fields_to_update = [
    'user_id', 'status_id', 'discount_id', 'payment_method_id'];

  /*========================= ADD ===========================================*/

  public function add(array $data) {
    $query = "
      INSERT INTO $this->table (user_id, status_id, discount_id, payment_method_id)
      VALUES (:user_id, :status_id, :discount_id, :payment_method_id)
    ";

    $req = $this->db->prepare($query);
    $req->execute($data);
  }

  /*========================= GET ===========================================*/

  public function get(int $id) {
    $req = $this->db->prepare("SELECT * FROM $this->table WHERE id = :id");
    $req->execute(["id" => $id]);

    return $req->rowCount() > 0 ? 
      $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
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

    return $req->rowCount() > 0 ? 
      $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
  }

  /*========================= UPDATE ========================================*/

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

  /*========================= TOGGLE ========================================*/
  public function toggleOrderStatus(int $orderId) {
    // Récupérer le statut actuel
    $stmt = $this->db->prepare("SELECT status_id FROM `orders` WHERE id = :orderId");
    $stmt->execute(['orderId' => $orderId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$row) {
        throw new Exception("Commande non trouvée");
    }

    $currentStatus = intval($row['status_id']);
    // Définir le nouveau statut : s'il est 1 (await_payment), on le passe à 2 (paid), sinon à 1.
    $newStatus = ($currentStatus === 1) ? 2 : 1;

    $stmt = $this->db->prepare("UPDATE `orders` SET status_id = :newStatus WHERE id = :orderId");
    $stmt->execute(['newStatus' => $newStatus, 'orderId' => $orderId]);

    return $newStatus;
  }


  /*========================= DELETE ========================================*/

  public function delete(int $id) {
    $req = $this->db->prepare("DELETE FROM $this->table WHERE id = :id");
    $req->execute(["id" => $id]);
    return new stdClass();
  }
}