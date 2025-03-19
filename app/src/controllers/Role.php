<?php

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\RoleModel;
use App\Utils\Route;
use App\Utils\HttpException;
use App\Middlewares\{AuthMiddleware,RoleMiddleware, Roles};

class Role extends Controller {
  protected object $role;

  public function __construct($param) {
    $this->role = new RoleModel();

    parent::__construct($param);
  }

    /*========================= POST ========================================*/

  #[Route("POST", "/role",
    middlewares: [AuthMiddleware::class, 
    [RoleMiddleware::class, Roles::ROLE_ADMIN]])]
  public function createRole() {
    $this->role->add($this->body);

    return $this->role->getLast();
  }

  /*========================= GET BY ID =====================================*/

  #[Route("GET", "/role/:id",
    middlewares: [AuthMiddleware::class, 
    [RoleMiddleware::class, Roles::ROLE_ADMIN]])]
  public function getRole() {
    return $this->role->get(intval($this->params['id']));
  }

  /*========================= GET ALL =======================================*/

  #[Route("GET", "/role",
    middlewares: [AuthMiddleware::class, 
    [RoleMiddleware::class, Roles::ROLE_ADMIN]])]
  public function getRoles() {
      $limit = isset($this->params['limit']) ? 
        intval($this->params['limit']) : null;
      return $this->role->getAll($limit);
  }

  /*========================= PATCH =========================================*/

  #[Route("PATCH", "/role/:id",
    middlewares: [AuthMiddleware::class, 
    [RoleMiddleware::class, Roles::ROLE_ADMIN]])]
  public function updateRole() {
    try {
      $id = intval($this->params['id']);
      $data = $this->body;

      # Check if the data is empty
      if (empty($data)) {
        throw new HttpException("Missing parameters for the update.", 400);
      }

      # Check for missing fields
      $missingFields = array_diff(
        $this->role->authorized_fields_to_update, array_keys($data));
      if (!empty($missingFields)) {
        throw new HttpException(
          "Missing fields: " . implode(", ", $missingFields), 400);
      }

      $this->role->update($data, intval($id));

      # Let's return the updated role
      return $this->role->get($id);
    } catch (HttpException $e) {
      throw $e;
    }
  }

  /*========================= DELETE ========================================*/

  #[Route("DELETE", "/role/:id",
    middlewares: [AuthMiddleware::class, 
    [RoleMiddleware::class, Roles::ROLE_ADMIN]])]
  public function deleteRole() {
    return $this->role->delete(intval($this->params['id']));
  }
}