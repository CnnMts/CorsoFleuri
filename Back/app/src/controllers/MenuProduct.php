<?php

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\MenuProductModel;
use App\Utils\{Route,HttpException};
use App\Middlewares\{AuthMiddleware,RoleMiddleware,Roles};

class MenuProduct extends Controller {
  protected object $menuProduct;

  public function __construct($param) {
    $this->menuProduct = new MenuProductModel();

    parent::__construct($param);
  }

  /*========================= POST ==========================================*/

  #[Route("POST", "/menuProduct",
  /*middlewares: [AuthMiddleware::class, 
  [RoleMiddleware::class, Roles::ROLE_ADMIN]]*/)]
  public function add() {
    $this->menuProduct->add($this->body);

    return $this->menuProduct->getLast();
  }

  /*========================= GET BY ID =====================================*/

  #[Route("GET", "/menuProduct/:id")] 
  public function getMenuProduct() {
    return $this->menuProduct->get(intval($this->params['id']));
  }

  /*========================= GET ALL =======================================*/

  #[Route("GET", "/menuProduct")]
  public function getMenusProduct() {
      $limit = isset($this->params['limit']) ? 
        intval($this->params['limit']) : null;
      return $this->menuProduct->getAll($limit);
  }

  /*========================= PATCH =========================================*/

  #[Route("PATCH", "/menuProduct/:id", 
    middlewares: [AuthMiddleware::class, 
    [RoleMiddleware::class, Roles::ROLE_ADMIN]])]
  public function updateMenuProduct() {
    try {
      $id = intval($this->params['id']);
      $data = $this->body;

      # Check if the data is empty
      if (empty($data)) {
        throw new HttpException("Missing parameters for the update.", 400);
      }

      # Check for missing fields
      $missingFields = array_diff(
        $this->menuProduct->authorized_fields_to_update, array_keys($data));
      if (!empty($missingFields)) {
        throw new HttpException("Missing fields: " . 
          implode(", ", $missingFields), 400);
      }

      $this->menuProduct->update($data, intval($id));

      # Let's return the updated order
      return $this->menuProduct->get($id);
    } catch (HttpException $e) {
      throw $e;
    }
  }

  /*========================= DELETE =======================================*/

  #[Route("DELETE", "/menuProduct/:id", 
    /*middlewares: [AuthMiddleware::class, 
    [RoleMiddleware::class, Roles::ROLE_ADMIN]]*/)]
  public function deleteMenuProduct() {
    return $this->menuProduct->delete(intval($this->params['id']));
  }
}