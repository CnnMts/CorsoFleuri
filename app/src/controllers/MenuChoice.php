<?php

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\MenuChoiceModel;
use App\Utils\{Route,HttpException};
use App\Middlewares\AuthMiddleware;
use App\Middlewares\RoleMiddleware;

class MenuChoice extends Controller {
  protected object $menuChoice;

  public function __construct($param) {
    $this->menuChoice = new MenuChoiceModel();

    parent::__construct($param);
  }

  /*========================= POST ==========================================*/

  #[Route("POST", "/menuChoice",
  /* middlewares: [AuthMiddleware::class, [RoleMiddleware::class]]*/)]
  public function add() {
    $this->menuChoice->add($this->body);

    return $this->menuChoice->getLast();
  }

  /*========================= GET BY ID =====================================*/

  #[Route("GET", "/menuChoice/:id", 
  /*middlewares: [AuthMiddleware::class, [RoleMiddleware::class, 'admin']]*/)] 
  public function getMenuChoice() {
    return $this->menuChoice->get(intval($this->params['id']));
  }

  /*========================= GET ALL =======================================*/

  #[Route("GET", "/menuChoice", /*middlewares: [AuthMiddleware::class]*/)]
  public function getMenusProduct() {
      $limit = isset($this->params['limit']) ? 
        intval($this->params['limit']) : null;
      return $this->menuChoice->getAll($limit);
  }

  /*========================= PATCH =========================================*/

  #[Route("PATCH", "/menuChoice/:id", 
  /*middlewares: [AuthMiddleware::class, [RoleMiddleware::class, 'admin']]*/)]
  public function updateMenuChoice() {
    try {
      $id = intval($this->params['id']);
      $data = $this->body;

      # Check if the data is empty
      if (empty($data)) {
        throw new HttpException("Missing parameters for the update.", 400);
      }

      # Check for missing fields
      $missingFields = array_diff(
        $this->menuChoice->authorized_fields_to_update, array_keys($data));
      if (!empty($missingFields)) {
        throw new HttpException("Missing fields: " . 
          implode(", ", $missingFields), 400);
      }

      $this->menuChoice->update($data, intval($id));

      # Let's return the updated order
      return $this->menuChoice->get($id);
    } catch (HttpException $e) {
      throw $e;
    }
  }

  /*========================= DELETE =======================================*/

  #[Route("DELETE", "/menuChoice/:id", 
  /*middlewares: [AuthMiddleware::class, [RoleMiddleware::class, 'admin']]*/)]
  public function deleteMenuChoice() {
    return $this->menuChoice->delete(intval($this->params['id']));
  }
}