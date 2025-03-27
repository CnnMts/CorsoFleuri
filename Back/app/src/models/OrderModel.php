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
  // Supposons que $menuData->productsDetails est un tableau d'objets contenant les produits,
// par exemple :
// [
//   { "id":3,  "name":"Taboule",     "category_id":1, ... },
//   { "id":5,  "name":"Chipolatas",  "category_id":2, ... },
//   { "id":9,  "name":"Frites",      "category_id":5, ... },
//   { "id":11, "name":"Tarte",       "category_id":3, ... }
// ]
//
// Vous devez définir le mapping de vos catégories tel que vous l'entendez.
// Par exemple, supposons :
//
// - category_id 1  => starter
// - category_id 2  => main_course
// - category_id 3  => dessert
// - category_id 4  => drink
//
// Si dans vos données le produit "Frites" a category_id 5 et n'est pas attendu, vous pouvez l'ignorer,
// ou bien définir une règle alternative (par exemple, traiter 5 comme "drink" ou "autre").
// Ici, nous utiliserons uniquement les valeurs 1, 2, 3 et 4.

// La fonction récupère les ID en fonction de category_id
  
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

          $productIds = $this->getProductIdsFromDetails($menuData->productsDetails);
          // $productIds est alors un tableau associatif avec :
          // [ 'starter_id' => ..., 'main_course_id' => ..., 'dessert_id' => ..., 'drink_id' => ... ]

          // Puis, lors de l'insertion dans menu_choice :
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
            'menu_id'         => $menuId,
            'order_id'        => $orderId, // Utilisez l'orderId généré précédemment
            'order_menu_id'   => $orderMenuId,
            'starter_id'      => $productIds['starter_id'],
            'main_course_id'  => $productIds['main_course_id'],
            'dessert_id'      => $productIds['dessert_id'],
            'drink_id'        => $productIds['drink_id']
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


  public function getProductIdsFromDetails($productsDetails) {
    // Initialisation avec des valeurs nulles par défaut.
    $result = [
        'starter_id'      => null,
        'main_course_id'  => null,
        'dessert_id'      => null,
        'drink_id'        => null
    ];

    // Parcourir chaque produit dans le tableau
    foreach ($productsDetails as $product) {
        if (!isset($product->category_id) || !isset($product->id)) {
            continue;
        }
        switch ($product->category_id) {
            case 1:
                // Starter
                $result['starter_id'] = $product->id;
                break;
            case 2:
                // Main course
                $result['main_course_id'] = $product->id;
                break;
            case 3:
                // Dessert
                $result['dessert_id'] = $product->id;
                break;
            case 4:
                // Drink
                $result['drink_id'] = $product->id;
                break;
            // Si vous souhaitez traiter category_id 5 comme une boisson par exemple, vous pouvez ajouter :
            // case 5:
            //     $result['drink_id'] = $product->id;
            //     break;
            default:
                // Vous pouvez ignorer toutes les autres valeurs ou les traiter différemment
                break;
        }
    }

    return $result;
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