<?php

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\OrderItemModel;
use App\Utils\{Route,HttpException};
// use App\Middlewares\AuthMiddleware;
// use App\Middlewares\RoleMiddleware;

class OrderItem extends Controller {
  protected object $orderItem;

  public function __construct($param) {
    $this->orderItem = new OrderItemModel();

    parent::__construct($param);
  }

  #[Route("POST", "/orderItem")]
  public function createOrderItem() {
    $this->orderItem->add($this->body);

    return $this->orderItem->getLast();
  }

  #[Route("DELETE", "/orderItem/:id")]
  public function deleteOrderItem() {
    return $this->orderItem->delete(intval($this->params['id']));
  }

  #[Route("GET", "/orderItem/:id")] 
  public function getOrderItem() {
    return $this->orderItem->get(intval($this->params['id']));
  }

  #[Route("GET", "/orderItem")]
  public function getOrderItems() {
      $limit = isset($this->params['limit']) ? intval($this->params['limit']) : null;
      return $this->orderItem->getAll($limit);
  }

  #[Route("PATCH", "/orderItem/:id")]
  public function updateOrderItem() {
    try {
      $id = intval($this->params['id']);
      $data = $this->body;

      # Check if the data is empty
      if (empty($data)) {
        throw new HttpException("Missing parameters for the update.", 400);
      }

      # Check for missing fields
      $missingFields = array_diff($this->orderItem->authorized_fields_to_update, array_keys($data));
      if (!empty($missingFields)) {
        throw new HttpException("Missing fields: " . implode(", ", $missingFields), 400);
      }

      $this->orderItem->update($data, intval($id));

      # Let's return the updated order
      return $this->orderItem->get($id);
    } catch (HttpException $e) {
      throw $e;
    }
  }
}

//, middlewares: [AuthMiddleware::class, [RoleMiddleware::class, 'admin']]