class OrderModel {
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
        throw new Error(`Erreur lors de la création de l'ordre: ${response.statusText}`);
      }

      const data = await response.json();
      return data.order_id;
    } catch (error) {
      console.error('Erreur dans createOrder:', error);
      throw error;
    }
  }

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
        throw new Error(`Erreur lors de la création du choix de menu: ${response.statusText}`);
      }

      const data = await response.json();
      return data.menu_choice_id;
    } catch (error) {
      console.error('Erreur dans createMenuChoice:', error);
      throw error;
    }
  }

  static async createOrderMenu(orderMenu) {
    try {
      const response = await fetch('http://localhost:8083/orderMenu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderMenu)
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la création dans orderMenu: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur dans createOrderMenu:', error);
      throw error;
    }
  }
}

export default OrderModel;
