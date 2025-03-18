<?php

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\OrderMenuModel;
use App\Utils\{Route,HttpException};
// use App\Middlewares\AuthMiddleware;
// use App\Middlewares\RoleMiddleware;

class OrderMenu extends Controller {
  protected object $orderMenu;

  public function __construct($param) {
    $this->orderMenu = new OrderMenuModel();

    parent::__construct($param);
  }

  /*========================= POST ==========================================*/

  #[Route("POST", "/orderMenu")]
  public function createOrderMenu() {
    $this->orderMenu->add($this->body);

    return $this->orderMenu->getLast();
  }

  /*========================= GET BY ID =====================================*/

  #[Route("GET", "/orderMenu/:id")] 
  public function getOrderMenu() {
    return $this->orderMenu->get(intval($this->params['id']));
  }

  /*========================= GET ALL =====================================*/

  #[Route("GET", "/orderMenu")]
  public function getOrderMenus() {
      $limit = isset($this->params['limit']) ? 
      intval($this->params['limit']) : null;
      return $this->orderMenu->getAll($limit);
  }

  /*========================= GET BY ID =====================================*/

  #[Route("PATCH", "/orderMenu/:id")]
  public function updateOrderMenu() {
    try {
      $id = intval($this->params['id']);
      $data = $this->body;

      # Check if the data is empty
      if (empty($data)) {
        throw new HttpException("Missing parameters for the update.", 400);
      }

      # Check for missing fields
      $missingFields = array_diff(
        $this->orderMenu->authorized_fields_to_update, array_keys($data));
      if (!empty($missingFields)) {
        throw new HttpException(
          "Missing fields: " . implode(", ", $missingFields), 400);
      }

      $this->orderMenu->update($data, intval($id));

      # Let's return the updated order
      return $this->orderMenu->get($id);
    } catch (HttpException $e) {
      throw $e;
    }
  }

  /*========================= DELETE ========================================*/

  #[Route("DELETE", "/orderMenu/:id")]
  public function deleteOrderMenu() {
    return $this->orderMenu->delete(intval($this->params['id']));
  }
}

//, middlewares: [AuthMiddleware::class, [RoleMiddleware::class, 'admin']]