<?php

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\RoleModel;
use App\Utils\Route;
use App\Utils\HttpException;
// use App\Middlewares\AuthMiddleware;
// use App\Middlewares\RoleMiddleware;

class Role extends Controller {
  protected object $role;

  public function __construct($param) {
    $this->role = new RoleModel();

    parent::__construct($param);
  }

  #[Route("POST", "/role")]
  public function createRole() {
    $this->role->add($this->body);

    return $this->role->getLast();
  }

  #[Route("DELETE", "/role/:id")]
  public function deleteRole() {
    return $this->role->delete(intval($this->params['id']));
  }

  #[Route("GET", "/role/:id")] 
  public function getRole() {
    return $this->role->get(intval($this->params['id']));
  }

  #[Route("GET", "/role")]
  public function getRoles() {
      $limit = isset($this->params['limit']) ? intval($this->params['limit']) : null;
      return $this->role->getAll($limit);
  }

  #[Route("PATCH", "/role/:id")]
  public function updateRole() {
    try {
      $id = intval($this->params['id']);
      $data = $this->body;

      # Check if the data is empty
      if (empty($data)) {
        throw new HttpException("Missing parameters for the update.", 400);
      }

      # Check for missing fields
      $missingFields = array_diff($this->role->authorized_fields_to_update, array_keys($data));
      if (!empty($missingFields)) {
        throw new HttpException("Missing fields: " . implode(", ", $missingFields), 400);
      }

      $this->role->update($data, intval($id));

      # Let's return the updated role
      return $this->role->get($id);
    } catch (HttpException $e) {
      throw $e;
    }
  }
}

//, middlewares: [AuthMiddleware::class, [RoleMiddleware::class, 'admin']] to add to all routes
