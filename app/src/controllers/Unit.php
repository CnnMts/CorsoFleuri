<?php

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\UnitModel;
use App\Utils\Route;
use App\Utils\HttpException;
use App\Middlewares\{AuthMiddleware,RoleMiddleware, Roles};


class Unit extends Controller {
  protected object $unit;

  public function __construct($param) {
    $this->unit = new UnitModel();

    parent::__construct($param);
  }

  /*========================= POST ==========================================*/

  #[Route("POST", "/unit",
    middlewares: [AuthMiddleware::class, 
    [RoleMiddleware::class, Roles::ROLE_ADMIN]])]
  public function createUnit() {
    $this->unit->add($this->body);

    return $this->unit->getLast();
  }

  /*========================= GET BY ID =====================================*/

  #[Route("GET", "/unit/:id",
    middlewares: [AuthMiddleware::class, 
    [RoleMiddleware::class, Roles::ROLE_ADMIN]])]
  public function getUnit() {
    return $this->unit->get(intval($this->params['id']));
  }

  /*========================= GET ALL =======================================*/

  #[Route("GET", "/unit",
    middlewares: [AuthMiddleware::class, 
    [RoleMiddleware::class, Roles::ROLE_ADMIN]])]
  public function getUnits() {
      $limit = isset($this->params['limit']) ? 
        intval($this->params['limit']) : null;
      return $this->unit->getAll($limit);
  }

  /*========================= PATCH =========================================*/

  #[Route("PATCH", "/unit/:id",
    middlewares: [AuthMiddleware::class, 
    [RoleMiddleware::class, Roles::ROLE_ADMIN]])]
  public function updateUnit() {
    try {
      $id = intval($this->params['id']);
      $data = $this->body;

      # Check if the data is empty
      if (empty($data)) {
        throw new HttpException("Missing parameters for the update.", 400);
      }

      # Check for missing fields
      $missingFields = array_diff(
        $this->unit->authorized_fields_to_update, array_keys($data));
      if (!empty($missingFields)) {
        throw new HttpException(
          "Missing fields: " . implode(", ", $missingFields), 400);
      }

      $this->unit->update($data, intval($id));

      # Let's return the updated unit
      return $this->unit->get($id);
    } catch (HttpException $e) {
      throw $e;
    }
  }

  /*========================= DELETE ========================================*/

  #[Route("DELETE", "/unit/:id",
    middlewares: [AuthMiddleware::class, 
    [RoleMiddleware::class, Roles::ROLE_ADMIN]])]
  public function deleteUnit() {
    return $this->unit->delete(intval($this->params['id']));
  }
}

