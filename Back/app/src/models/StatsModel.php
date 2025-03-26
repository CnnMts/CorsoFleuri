<?php

namespace App\Models;

use \PDO;
use stdClass;

class StatsModel extends SqlConnect {
  /*========================= GET ALL =======================================*/

  public function getAll(Int $year) {
    $sql = "SELECT 
    orders.created_at AS DateVente,
    user.username AS Utilisateur,
    orders.id AS NumeroCommande,
    payment_method.name AS MoyenPaiement,
    menu.id AS MenuID,
    menu.name AS ProductName,
    order_menu.quantity AS ItemsQuantity,
    menu.price AS PrixVenteParItem,
    category.name AS CategorieProduit,
    product.purchase_price AS PrixAchat,
    discount.name AS RemiseVIP
    FROM 
			orders
    INNER JOIN 
			user ON orders.user_id = user.id
    INNER JOIN 
			payment_method ON orders.payment_method_id = payment_method.id
    INNER JOIN 
			order_menu ON orders.id = order_menu.order_id
    INNER JOIN 
			menu ON order_menu.menu_id = menu.id
    INNER JOIN 
			menu_product ON menu.id = menu_product.menu_id  -- Jointure ajoutée ici
    LEFT JOIN 
			product ON menu_product.product_id = product.id 
    LEFT JOIN 
			category ON product.category_id = category.id   -- Correction de la jointure sur category
    LEFT JOIN 
			discount ON orders.discount_id = discount.id
    WHERE 
			YEAR(orders.created_at) = :year
    ORDER BY 
			orders.created_at DESC";

    $req = $this->db->prepare($sql);
    $req->execute(["year" => $year]);
    
    return $req->fetchAll(PDO::FETCH_ASSOC);
  }
}