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

 /*========================= LOGOUT =========================================*/

  #[Route("POST", "/auth/logout")]
  public function logout() {
      try {
          $success = $this->auth->logout();
          
          if ($success) {
            // Optionnel : renvoyer une réponse JSON indiquant la réussite
            header('Content-Type: application/json');
            echo json_encode(['success' => true, 'message' => 'Déconnexion réussie']);
            // Optionnel : rediriger vers la page login
            // header('Location: /login.php'); // ou /login.html selon votre architecture
          } else {
            throw new Exception("Erreur lors de la déconnexion.");
          }
      } catch (\Exception $e) {
          // Gérer l'erreur : renvoyer un code d'erreur
          header('HTTP/1.1 500 Internal Server Error');
          header('Content-Type: application/json');
          echo json_encode(['success' => false, 'message' => $e->getMessage()]);
      }
  }

  #[Route("POST", "/auth/log")]
  public function log() {
      return 'good';
  }

}