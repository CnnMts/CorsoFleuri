<?php

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\DiscountModel;
use App\Utils\Route;
use App\Utils\HttpException;
// use App\Middlewares\AuthMiddleware;
// use App\Middlewares\DiscountMiddleware;

class Discount extends Controller {
  protected object $discount;

  public function __construct($param) {
    $this->discount = new DiscountModel();

    parent::__construct($param);
  }

    /*========================= POST ========================================*/

  #[Route("POST", "/discount")]
  public function createDiscount() {
    $this->discount->add($this->body);

    return $this->discount->getLast();
  }

  /*========================= GET BY ID =====================================*/

  #[Route("GET", "/discount/:id")] 
  public function getDiscount() {
    return $this->discount->get(intval($this->params['id']));
  }

  /*========================= GET ALL =======================================*/

  #[Route("GET", "/discount")]
  public function getDiscounts() {
      $limit = isset($this->params['limit']) ? 
        intval($this->params['limit']) : null;
      return $this->discount->getAll($limit);
  }

  /*========================= PATCH =========================================*/

  #[Route("PATCH", "/discount/:id")]
  public function updateDiscount() {
    try {
      $id = intval($this->params['id']);
      $data = $this->body;

      # Check if the data is empty
      if (empty($data)) {
        throw new HttpException("Missing parameters for the update.", 400);
      }

      # Check for missing fields
      $missingFields = array_diff(
        $this->discount->authorized_fields_to_update, array_keys($data));
      if (!empty($missingFields)) {
        throw new HttpException(
          "Missing fields: " . implode(", ", $missingFields), 400);
      }

      $this->discount->update($data, intval($id));

      # Let's return the updated discount
      return $this->discount->get($id);
    } catch (HttpException $e) {
      throw $e;
    }
  }

  /*========================= DELETE ========================================*/

  #[Route("DELETE", "/discount/:id")]
  public function deleteDiscount() {
    return $this->discount->delete(intval($this->params['id']));
  }
}

//, middlewares: [AuthMiddleware::class, [DiscountMiddleware::class, 'admin']] to add to all routes
