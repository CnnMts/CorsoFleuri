<?php 

namespace App\Controllers;

use App\Controllers\Controller;
use App\Models\StatsModel;
use App\Utils\Route;
use App\Utils\HttpException;
use App\Middlewares\{AuthMiddleware,RoleMiddleware, Roles};

class Stats extends Controller {

  protected object $stats;

  public function __construct($param) {
    $this->stats = new StatsModel();

    parent::__construct($param);
  }

  #[Route("GET", "/stats/:years")]
  public function getStats() {
      // Récupération de l'année depuis les paramètres
      $year = $this->params['years'];
      $data = $this->stats->getAll($year);
    
      header('Content-Type: text/csv; charset=utf-8');
      header('Content-Disposition: attachment; filename="stats_' . $year . '.csv"');
      
      $output = fopen('php://output', 'w');
      
      // Ajout du BOM pour une bonne lecture en UTF-8
      fputs($output, "\xEF\xBB\xBF");
      
      // Définition de l'ordre souhaité des colonnes
      $orderedColumns = [
          'DateVente',
          'Utilisateur',
          'NumeroCommande',
          'MoyenPaiement',
          'MenuID',
          'ProductName',
          'ItemsQuantity',
          'PrixVenteParItem',
          'CategorieProduit',
          'PrixAchat',
          'RemiseVIP'
      ];
      
      // Écriture de l'en-tête avec un séparateur point-virgule
      fputcsv($output, $orderedColumns, ';');
      
      // Pour chaque ligne, réorganiser les données en forçant le format de la date
      foreach ($data as $row) {
          $orderedRow = [];
          foreach ($orderedColumns as $col) {
              if ($col === 'DateVente' && !empty($row[$col])) {
                  // Reformatter la date au format 'jour/mois/année'
                  $orderedRow[] = date('d/m/Y', strtotime($row[$col]));
              } else {
                  $orderedRow[] = isset($row[$col]) ? $row[$col] : '';
              }
          }
          fputcsv($output, $orderedRow, ';');
      }
      
      fclose($output);
      exit();
  }
}