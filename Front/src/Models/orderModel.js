class OrderModel {
  static async fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur API (${url}): ${response.statusText}`);
    }
    return response.json();
  }

  static async getAllOrders() {
    try {
      const orders = await this.fetchData('http://localhost:8083/orders');
      console.log('[OrderModel] Commandes récupérées :', orders);

      const orderMenus = await this.fetchData('http://localhost:8083/orderMenu');
      console.log('[OrderModel] Menus commandés récupérés :', orderMenus);

      const menuChoices = await this.fetchData('http://localhost:8083/menuChoice');
      console.log('[OrderModel] Choix dans les Menus récupérés :', menuChoices);

      const menus = await this.fetchData('http://localhost:8083/menu');
      console.log('[OrderModel] Menus récupérés :', menus);

      const fullOrderDetails = await Promise.all(
        orders.map(async (order) => {
          const orderMenuDetails = await Promise.all(
            orderMenus
              .filter((orderMenu) => orderMenu.order_id === order.id)
              .map(async (orderMenu) => {
                const menuDetails = await Promise.all(
                  menus
                    .filter((menu) => menu.id === orderMenu.menu_id)
                    .map(async (menu) => {
                      const menuChoiceDetails = await Promise.all(
                        menuChoices
                          .filter((menuChoice) => menuChoice.order_menu_id === orderMenu.id)
                          .map(async (menuChoice) => {
                            const starter = await this.fetchData(`http://localhost:8083/product/${menuChoice.starter_id}`);
                            const mainCourse = await this.fetchData(`http://localhost:8083/product/${menuChoice.main_course_id}`);
                            const dessert = await this.fetchData(`http://localhost:8083/product/${menuChoice.dessert_id}`);
                            const drink = await this.fetchData(`http://localhost:8083/product/${menuChoice.drink_id}`);
                            return { starter, mainCourse, dessert, drink };
                          })
                      )
                      return { ...menu, menuChoice: menuChoiceDetails };
                      
                    })
                )
                return { ...orderMenu, menu: menuDetails };
              })
          );

          return { ...order, orderMenus: orderMenuDetails };
        })
      );

      console.log('[OrderModel] Détails des commandes complètes avec menus :', fullOrderDetails);
      return fullOrderDetails;
    } catch (error) {
      console.error('[MenuModel] Erreur :', error);
      throw error;
    }
  }
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
