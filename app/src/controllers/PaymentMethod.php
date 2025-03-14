<?php

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\PaymentMethodModel;
use App\Utils\Route;
use App\Utils\HttpException;
// use App\Middlewares\AuthMiddleware;
// use App\Middlewares\PaymentMethodMiddleware;

class PaymentMethod extends Controller {
  protected object $paymentMethod;

  public function __construct($param) {
    $this->paymentMethod = new PaymentMethodModel();

    parent::__construct($param);
  }

  #[Route("POST", "/paymentMethod")]
  public function createPaymentMethod() {
    $this->paymentMethod->add($this->body);

    return $this->paymentMethod->getLast();
  }

  #[Route("DELETE", "/paymentMethod/:id")]
  public function deletePaymentMethod() {
    return $this->paymentMethod->delete(intval($this->params['id']));
  }

  #[Route("GET", "/paymentMethod/:id")] 
  public function getPaymentMethod() {
    return $this->paymentMethod->get(intval($this->params['id']));
  }

  #[Route("GET", "/paymentMethod")]
  public function getPaymentMethods() {
      $limit = isset($this->params['limit']) ? intval($this->params['limit']) : null;
      return $this->paymentMethod->getAll($limit);
  }

  #[Route("PATCH", "/paymentMethod/:id")]
  public function updatePaymentMethod() {
    try {
      $id = intval($this->params['id']);
      $data = $this->body;

      # Check if the data is empty
      if (empty($data)) {
        throw new HttpException("Missing parameters for the update.", 400);
      }

      # Check for missing fields
      $missingFields = array_diff($this->paymentMethod->authorized_fields_to_update, array_keys($data));
      if (!empty($missingFields)) {
        throw new HttpException("Missing fields: " . implode(", ", $missingFields), 400);
      }

      $this->paymentMethod->update($data, intval($id));

      # Let's return the updated paymentMethod
      return $this->paymentMethod->get($id);
    } catch (HttpException $e) {
      throw $e;
    }
  }
}

//, middlewares: [AuthMiddleware::class, [PaymentMethodMiddleware::class, 'admin']] to add to all routes
