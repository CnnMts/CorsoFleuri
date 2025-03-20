class OrderModel {
  // Créer un nouvel ordre dans la table "order"
  static async createOrder(order) {
    try {
      const response = await fetch('http://localhost:8083/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la création de l'ordre : ${response.statusText}`);
      }

      const data = await response.json();
      return data.order_id; // Retourne l'ID de l'ordre créé
    } catch (error) {
      console.error('Erreur dans createOrder :', error);
      throw error;
    }
  }

  // Créer un choix de menu dans la table "menuChoice"
  static async createMenuChoice(menuChoice) {
    try {
      const response = await fetch('http://localhost:8083/menuChoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(menuChoice)
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la création du choix de menu : ${response.statusText}`);
      }

      const data = await response.json();
      return data.menu_choice_id; // Retourne l'ID du choix de menu créé
    } catch (error) {
      console.error('Erreur dans createMenuChoice :', error);
      throw error;
    }
  }

  // Créer les détails d'un ordre dans la table "orderDetails"
  static async createOrderDetails(orderDetails) {
    try {
      const response = await fetch('http://localhost:8083/orderDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderDetails)
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'insertion des détails de l'ordre : ${response.statusText}`);
      }

      const data = await response.json();
      return data; // Retourne les données des détails insérés
    } catch (error) {
      console.error('Erreur dans createOrderDetails :', error);
      throw error;
    }
  }

  // Créer une relation dans la table "order_menu"
  static async createOrderMenu(orderMenuData) {
    try {
      const response = await fetch('http://localhost:8083/orderMenu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderMenuData)
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'insertion dans order_menu : ${response.statusText}`);
      }

      const data = await response.json();
      return data; // Retourne les données de la relation insérée
    } catch (error) {
      console.error('Erreur dans createOrderMenu :', error);
      throw error;
    }
  }
}

export default OrderModel;
