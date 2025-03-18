<?php

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\UserModel;
use App\Utils\Route;
use App\Utils\HttpException;
// use App\Middlewares\AuthMiddleware;
// use App\Middlewares\RoleMiddleware;

class User extends Controller {
  protected object $user;

  public function __construct($param) {
    $this->user = new UserModel();

    parent::__construct($param);
  }

  /*========================= POST ==========================================*/

  #[Route("POST", "/user")]
  public function createUser() {
    $this->user->add($this->body);

    return $this->user->getLast();
  }

  /*========================= GET BY ID =====================================*/

  #[Route("GET", "/user/:id")] 
  public function getUser() {
    return $this->user->get(intval($this->params['id']));
  }

  /*========================= GET ALL =======================================*/

  #[Route("GET", "/user")]
  public function getUsers() {
      $limit = isset($this->params['limit']) ? 
        intval($this->params['limit']) : null;
      return $this->user->getAll($limit);
  }

  /*========================= PATCH =========================================*/

  #[Route("PATCH", "/user/:id")]
  public function updateUser() {
    try {
      $id = intval($this->params['id']);
      $data = $this->body;

      # Check if the data is empty
      if (empty($data)) {
        throw new HttpException("Missing parameters for the update.", 400);
      }

      # Check for missing fields
      $missingFields = array_diff(
        $this->user->authorized_fields_to_update, array_keys($data));
      if (!empty($missingFields)) {
        throw new HttpException(
          "Missing fields: " . implode(", ", $missingFields), 400);
      }

      $this->user->update($data, intval($id));

      # Let's return the updated user
      return $this->user->get($id);
    } catch (HttpException $e) {
      throw $e;
    }
  }

  /*========================= DELETE ========================================*/

  #[Route("DELETE", "/user/:id")]
  public function deleteUser() {
    return $this->user->delete(intval($this->params['id']));
  }
}

//, middlewares: [AuthMiddleware::class, [RoleMiddleware::class, 'admin']] to add to all routes
