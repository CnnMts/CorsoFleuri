<?php

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\OrderModel;
use App\Utils\{Route,HttpException};
use App\Middlewares\{AuthMiddleware};

class Order extends Controller {
  protected object $order;

  public function __construct($param) {
    $this->order = new OrderModel();

    parent::__construct($param);
  }

  /*========================= POST ==========================================*/

  #[Route("POST", "/orders")]
  public function createOrder() {
    $this->order->add($this->body);

    return $this->order->getLast();
  }

  /*========================= GET BY ID =====================================*/

  #[Route("GET", "/orders/:id",
   /* middlewares: [AuthMiddleware::class]*/)]
  
  public function getOrder() {
    return $this->order->get(intval($this->params['id']));
  }

  /*========================= GET ALL =======================================*/

  #[Route("GET", "/orders",
    /*middlewares: [AuthMiddleware::class]*/)]

  public function getOrders() {
      $limit = isset($this->params['limit']) ?
       intval($this->params['limit']) : null;
      return $this->order->getAll($limit);
  }

  /*========================= PATCH =========================================*/

  #[Route("PATCH", "/orders/:id", 
   /* middlewares: [AuthMiddleware::class]*/)]

  public function updateOrder() {
    try {
      $id = intval($this->params['id']);
      $data = $this->body;

      # Check if the data is empty
      if (empty($data)) {
        throw new HttpException("Missing parameters for the update.", 400);
      }

      # Check for missing fields
      $missingFields = array_diff(
        $this->order->authorized_fields_to_update, array_keys($data));
      if (!empty($missingFields)) {
        throw new HttpException(
          "Missing fields: " . implode(", ", $missingFields), 400);
      }

      $this->order->update($data, intval($id));

      # Let's return the updated order
      return $this->order->get($id);
    } catch (HttpException $e) {
      throw $e;
    }
  }

  /*========================= TOGGLE =========================================*/
  #[Route("PATCH", "/orders/:id/toggle")]
  public function toggleStatus() {
    $orderId = intval($this->params['id']);
    try {
        $newStatus = $this->order->toggleOrderStatus($orderId);
        header('Content-Type: application/json');
        return['success' => true, 'newStatus' => $newStatus];
    } catch (Exception $e) {
        header('HTTP/1.1 500 Internal Server Error');
        header('Content-Type: application/json');
        return['success' => false, 'message' => $e->getMessage()];
    }
  }


  /*========================= DELETE ========================================*/

  #[Route("DELETE", "/orders/:id",
    middlewares: [AuthMiddleware::class])]

  public function deleteOrder() {
    return $this->order->delete(intval($this->params['id']));
  }
}
