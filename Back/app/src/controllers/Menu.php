<?php

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\MenuModel;
use App\Utils\{Route,HttpException};
use App\Middlewares\{AuthMiddleware,RoleMiddleware,Roles};

class Menu extends Controller {
  protected object $menu;

  public function __construct($param) {
    $this->menu = new MenuModel();

    parent::__construct($param);
  }

  /*========================= POST ==========================================*/

  #[Route("POST", "/menu",   
   /* middlewares: [AuthMiddleware::class, 
    [RoleMiddleware::class, Roles::ROLE_ADMIN]]*/)]
  public function add() {
    $this->menu->add($this->body);

    return $this->menu->getLast();
  }

  /*========================= GET BY ID =====================================*/

  #[Route("GET", "/menu/:id")] 
  public function getMenu() {
    return $this->menu->get(intval($this->params['id']));
  }

  /*========================= GET ALL =======================================*/

  #[Route("GET", "/menu",)]
  public function getMenus() {
      $limit = isset($this->params['limit']) ? 
        intval($this->params['limit']) : null;
      return $this->menu->getAll($limit);
  }

  /*========================= PATCH =========================================*/

  #[Route("PATCH", "/menu/:id", 
    /*middlewares: [AuthMiddleware::class, 
    [RoleMiddleware::class, Roles::ROLE_ADMIN]]*/)]
  public function updateMenu() {
    try {
      $id = intval($this->params['id']);
      $data = $this->body;

      # Check if the data is empty
      if (empty($data)) {
        throw new HttpException("Missing parameters for the update.", 400);
      }

      # Check for missing fields
      $missingFields = array_diff(
        $this->menu->authorized_fields_to_update, array_keys($data));
      if (!empty($missingFields)) {
        throw new HttpException("Missing fields: " . 
          implode(", ", $missingFields), 400);
      }

      $this->menu->update($data, intval($id));
      # Let's return the updated order
      return $this->menu->get($id);
    } catch (HttpException $e) {
      throw $e;
    }
  }

  /*========================= DELETE =======================================*/

  #[Route("DELETE", "/menu/:id", 
    /*middlewares: [AuthMiddleware::class, 
    [RoleMiddleware::class, Roles::ROLE_ADMIN]]*/)]
  public function deleteMenu() {
    return $this->menu->delete(intval($this->params['id']));
  }
}