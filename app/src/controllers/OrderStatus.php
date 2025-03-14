<?php

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\OrderStatusModel;
use App\Utils\Route;
use App\Utils\HttpException;
// use App\Middlewares\AuthMiddleware;
// use App\Middlewares\OrderStatusMiddleware;

class OrderStatus extends Controller {
  protected object $orderStatus;

  public function __construct($param) {
    $this->orderStatus = new OrderStatusModel();

    parent::__construct($param);
  }

  #[Route("POST", "/orderStatus")]
  public function createOrderStatus() {
    $this->orderStatus->add($this->body);

    return $this->orderStatus->getLast();
  }

  #[Route("DELETE", "/orderStatus/:id")]
  public function deleteOrderStatus() {
    return $this->orderStatus->delete(intval($this->params['id']));
  }

  #[Route("GET", "/orderStatus/:id")] 
  public function getOrderStatus() {
    return $this->orderStatus->get(intval($this->params['id']));
  }

  #[Route("GET", "/orderStatus")]
  public function getOrderStatuss() {
      $limit = isset($this->params['limit']) ? intval($this->params['limit']) : null;
      return $this->orderStatus->getAll($limit);
  }

  #[Route("PATCH", "/orderStatus/:id")]
  public function updateOrderStatus() {
    try {
      $id = intval($this->params['id']);
      $data = $this->body;

      # Check if the data is empty
      if (empty($data)) {
        throw new HttpException("Missing parameters for the update.", 400);
      }

      # Check for missing fields
      $missingFields = array_diff($this->orderStatus->authorized_fields_to_update, array_keys($data));
      if (!empty($missingFields)) {
        throw new HttpException("Missing fields: " . implode(", ", $missingFields), 400);
      }

      $this->orderStatus->update($data, intval($id));

      # Let's return the updated orderStatus
      return $this->orderStatus->get($id);
    } catch (HttpException $e) {
      throw $e;
    }
  }
}

//, middlewares: [AuthMiddleware::class, [OrderStatusMiddleware::class, 'admin']] to add to all routes
