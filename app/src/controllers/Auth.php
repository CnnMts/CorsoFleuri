<?php 

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\AuthModel;
use App\Utils\{Route, HttpException};
use App\Middlewares\{AuthMiddleware,Roles,RoleMiddleware};

class Auth extends Controller {
  protected object $auth;

  public function __construct($params) {
    $this->auth = new AuthModel();
    parent::__construct($params);
  }

 /*========================= REGISTER =======================================*/

  #[Route("POST", "/auth/register",
  middlewares: [AuthMiddleware::class, 
  [RoleMiddleware::class, Roles::ROLE_ADMIN]])]
  public function register() {
      try {
          $data = $this->body;
          if (empty($data['username']) || empty($data['identification_code'])) {
              throw new HttpException("Missing username or identification code.", 400);
          }
          $user = $this->auth->register($data);
          return $user;
      } catch (\Exception $e) {
          throw new HttpException($e->getMessage(), 400);
      }
  }

 /*========================= LOGIN ==========================================*/

  #[Route("POST", "/auth/login")]
  public function login() {
      try {
          $data = $this->body;
          if (empty($data['username']) || empty($data['identification_code'])) {
              throw new HttpException(
                "Missing username or identification_code.", 400);
          }
          $token = $this->auth->login($data['username'], $data['identification_code']);
          return $token;
      } catch (\Exception $e) {
          throw new HttpException($e->getMessage(), 401);
      }
  }

}