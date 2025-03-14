<?php

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\UnitModel;
use App\Utils\Route;
use App\Utils\HttpException;
// use App\Middlewares\AuthMiddleware;
// use App\Middlewares\UnitMiddleware;

class Unit extends Controller {
  protected object $unit;

  public function __construct($param) {
    $this->unit = new UnitModel();

    parent::__construct($param);
  }

  #[Route("POST", "/unit")]
  public function createUnit() {
    $this->unit->add($this->body);

    return $this->unit->getLast();
  }

  #[Route("DELETE", "/unit/:id")]
  public function deleteUnit() {
    return $this->unit->delete(intval($this->params['id']));
  }

  #[Route("GET", "/unit/:id")] 
  public function getUnit() {
    return $this->unit->get(intval($this->params['id']));
  }

  #[Route("GET", "/unit")]
  public function getUnits() {
      $limit = isset($this->params['limit']) ? intval($this->params['limit']) : null;
      return $this->unit->getAll($limit);
  }

  #[Route("PATCH", "/unit/:id")]
  public function updateUnit() {
    try {
      $id = intval($this->params['id']);
      $data = $this->body;

      # Check if the data is empty
      if (empty($data)) {
        throw new HttpException("Missing parameters for the update.", 400);
      }

      # Check for missing fields
      $missingFields = array_diff($this->unit->authorized_fields_to_update, array_keys($data));
      if (!empty($missingFields)) {
        throw new HttpException("Missing fields: " . implode(", ", $missingFields), 400);
      }

      $this->unit->update($data, intval($id));

      # Let's return the updated unit
      return $this->unit->get($id);
    } catch (HttpException $e) {
      throw $e;
    }
  }
}

//, middlewares: [AuthMiddleware::class, [UnitMiddleware::class, 'admin']] to add to all routes
