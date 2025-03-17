<?php

namespace App\Models;

use \PDO;

class SqlConnect {
  public object $db;
  private string $host;
  private string $port;
  private string $dbname;
  private string $password;
  private string $user;

  public function __construct() {
    $this->host = "db";
    $this->dbname = getenv('MYSQL_DATABASE');
    $this->user = getenv('MYSQL_USER');
    $this->password = getenv('MYSQL_PASSWORD');
    $this->port = getenv('MYSQL_PORT');

    $dsn = 'mysql:host='.$this->host.';port='
    .$this->port.';dbname='.$this->dbname;
    $this->db = new PDO(
      $dsn,
      $this->user,
      $this->password
    );

    $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $this->db->setAttribute(PDO::ATTR_PERSISTENT, false);
  }

  /*========================= DATA TRANSFORM ================================*/

  public function transformDataInDot($data) {
    $dataFormated = [];

    foreach ($data as $key => $value) {
      $dataFormated[':' . $key] = $value;
    }

    return $dataFormated;
  }
}