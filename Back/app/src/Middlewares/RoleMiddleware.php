<?php

namespace App\Middlewares;

use App\Utils\JWT;

class RoleMiddleware {
    private string $requiredRole;

    public function __construct(string $requiredRole) {
        $this->requiredRole = $requiredRole;
    }

    public function handle(&$request) {
        if (!isset($request['username'])) {
            $headers = getallheaders();
            if (!isset($headers['Authorization'])) {
                return $this->unauthorizedResponse(
                    "Authorization header not found");
            }
    
            $authHeader = $headers['Authorization'];
            if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
                return $this->unauthorizedResponse(
                    "Invalid Authorization header format");
            }
    
            $jwt = $matches[1];
    
            if (!$payload = JWT::verify($jwt)) {
                return $this->unauthorizedResponse("Invalid token");
            }
    
            $request['username'] = $payload;
        }
        $userRole = $request['username']['role'] ?? null;

        if ($userRole !== (int) $this->requiredRole) {
            return $this->forbiddenResponse("Insufficient permissions");
        }
    
        return true;
    }

    private function unauthorizedResponse($message) {
        echo json_encode(['error' => $message]);
        http_response_code(401);
        return false;
    }

    private function forbiddenResponse($message) {
        echo json_encode(['error' => $message]);
        http_response_code(403);
        return false;
    }
}
