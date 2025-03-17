<?php

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\CategoryModel;
use App\Utils\{Route,HttpException};
use App\Middlewares\AuthMiddleware;
use App\Middlewares\RoleMiddleware;

class Category extends Controller {
  protected object $category;

  public function __construct($param) {
    $this->category = new CategoryModel();

    parent::__construct($param);
  }

  /*========================= POST ==========================================*/

  #[Route("POST", "/category",
  /* middlewares: [AuthMiddleware::class, [RoleMiddleware::class]]*/)]
  public function add() {
    $this->category->add($this->body);

    return $this->category->getLast();
  }

  /*========================= GET BY ID =====================================*/

  #[Route("GET", "/category/:id", 
  /*middlewares: [AuthMiddleware::class, [RoleMiddleware::class, 'admin']]*/)] 
  public function getCategory() {
    return $this->category->get(intval($this->params['id']));
  }

  /*========================= GET ALL =======================================*/

  #[Route("GET", "/category", /*middlewares: [AuthMiddleware::class]*/)]
  public function getCategories() {
      $limit = isset($this->params['limit']) ? 
        intval($this->params['limit']) : null;
      return $this->category->getAll($limit);
  }

  /*========================= PATCH =========================================*/

  #[Route("PATCH", "/category/:id", 
  /*middlewares: [AuthMiddleware::class, [RoleMiddleware::class, 'admin']]*/)]
  public function updateorder() {
    try {
      $id = intval($this->params['id']);
      $data = $this->body;

      # Check if the data is empty
      if (empty($data)) {
        throw new HttpException("Missing parameters for the update.", 400);
      }

      # Check for missing fields
      $missingFields = array_diff(
        $this->category->authorized_fields_to_update, array_keys($data));
      if (!empty($missingFields)) {
        throw new HttpException("Missing fields: " . 
          implode(", ", $missingFields), 400);
      }

      $this->category->update($data, intval($id));

      # Let's return the updated order
      return $this->category->get($id);
    } catch (HttpException $e) {
      throw $e;
    }
  }

  /*========================= DELETE =======================================*/

  #[Route("DELETE", "/category/:id", 
  /*middlewares: [AuthMiddleware::class, [RoleMiddleware::class, 'admin']]*/)]
  public function deleteCategory() {
    return $this->category->delete(intval($this->params['id']));
  }
}