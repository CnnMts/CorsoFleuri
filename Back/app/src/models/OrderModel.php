<?php

namespace App\Models;

use \PDO;
use stdClass;

class OrderModel extends SqlConnect {
  private $table = "orders";
  public $authorized_fields_to_update = [
    'user_id', 'status_id', 'discount_id', 'payment_method_id'];

  /*========================= ADD ===========================================*/

  // public function add(array $data) {
  //   $query = "
  //     INSERT INTO $this->table (user_id, status_id, discount_id, payment_method_id)
  //     VALUES (:user_id, :status_id, :discount_id, :payment_method_id)
  //   ";

  //   $req = $this->db->prepare($query);
  //   $req->execute($data);
  // }

  public function createOrder($orderData) {
    try {
        // Démarrer une transaction
        $this->db->beginTransaction();

        // 1. Insérer la commande dans la table orders. Récupérer l'ID généré.
        $stmt = $this->db->prepare("INSERT INTO orders (total_price, status_id, user_id) VALUES (:total_price, :status_id, :user_id)");
        // Vous pouvez définir status_id par défaut à 1 (await_payment)
        $stmt->execute([
            'total_price' => $orderData->orders[0]->total_price,
            'status_id' => 1,
            'user_id' => $orderData->orders[0]->user_id // par exemple, depuis le token
        ]);
        $orderId = $this->db->lastInsertId();

        // 2. Pour chaque menu dans l'order (dans $orderData->orders), insérer dans order_menu
        foreach ($orderData->orders as $menuData) {
          // Récupère l'identifiant du menu à partir des données envoyées
          $menuId = $menuData->menu_id;
          // Vous pouvez vérifier en loguant
          error_log("menu_id dans ordermodel: " . $menuId);

          $stmt = $this->db->prepare("INSERT INTO order_menu (order_id, menu_id) VALUES (:order_id, :menu_id)");
          $stmt->execute([
              'order_id' => $orderId,
              'menu_id' => $menuId
          ]);
          $orderMenuId = $this->db->lastInsertId();

          $starter_id = isset($menuData->products->starter) && count($menuData->products->starter) > 0
                        ? $menuData->products->starter[0]->id
                        : null;
          $main_course_id = isset($menuData->products->main_course) && count($menuData->products->main_course) > 0
                        ? $menuData->products->main_course[0]->id
                        : null;
          $dessert_id = isset($menuData->products->dessert) && count($menuData->products->dessert) > 0
                        ? $menuData->products->dessert[0]->id
                        : null;
          $drink_id = isset($menuData->products->drink) && count($menuData->products->drink) > 0
                        ? $menuData->products->drink[0]->id
                        : null;
      
          $stmt = $this->db->prepare("
            INSERT INTO menu_choice (
              menu_id,
              order_id,
              order_menu_id, 
              starter_id, 
              main_course_id, 
              dessert_id, 
              drink_id
            ) VALUES (
              :menu_id,
              :order_id,
              :order_menu_id, 
              :starter_id, 
              :main_course_id, 
              :dessert_id, 
              :drink_id
            )
          ");
      
          $stmt->execute([
            'menu_id' => $menuId,
            'order_id' => $orderId, // Utilisation de l'order_id généré précédemment
            'order_menu_id' => $orderMenuId,
            'starter_id'    => $starter_id,
            'main_course_id'=> $main_course_id,
            'dessert_id'    => $dessert_id,
            'drink_id'      => $drink_id
          ]);
      }
      

        // Valider la transaction
        $this->db->commit();
        
        return ['order_id' => $orderId, 'success' => true];
    } catch (Exception $e) {
        $this->db->rollBack();
        throw new Exception("Erreur lors de la création de la commande : " . $e->getMessage());
    }
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

  /*========================= DISCOUNT ========================================*/
  public function updateDiscount(int $orderId, int $discount_id) {
    $stmt = $this->db->prepare("UPDATE `orders` SET discount_id = :discount_id WHERE id = :orderId");
    return $stmt->execute(['discount_id' => $discount_id, 'orderId' => $orderId]);
  }

  /*========================= DELETE ========================================*/

  public function delete(int $id) {
    $req = $this->db->prepare("DELETE FROM $this->table WHERE id = :id");
    $req->execute(["id" => $id]);
    return new stdClass();
  }
}