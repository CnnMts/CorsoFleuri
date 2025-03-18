class MenuModel {
  static async getAllMenus() {
    try {
      // Récupérer tous les menus
      const menusResponse = await fetch(`http://localhost:8083/menu`);
      if (!menusResponse.ok) {
        throw new Error(`Erreur API menus: ${menusResponse.statusText}`);
      }
      const menus = await menusResponse.json();
      console.log('Tous les menus :', menus);

      // Récupérer tous les produits associés
      const menuProductsResponse = await fetch(`http://localhost:8083/menuProduct`);
      if (!menuProductsResponse.ok) {
        throw new Error(`Erreur API menuProduct: ${menuProductsResponse.statusText}`);
      }
      const menuProducts = await menuProductsResponse.json();
      console.log('Produits associés :', menuProducts);

      // Récupérer les détails de chaque menu et leurs produits associés
      const fullMenuDetails = await Promise.all(
        menus.map(async (menu) => {
          const productIds = [...new Set(menuProducts.filter(item => item.menu_id === menu.id).map(item => item.product_id))];
          const productDetailsPromises = productIds.map(id =>
            fetch(`http://localhost:8083/product/${id}`).then(res => res.json())
          );
          const products = await Promise.all(productDetailsPromises);
          return {
            ...menu,
            products
          };
        })
      );

      console.log('Détails des menus complets :', fullMenuDetails);
      return fullMenuDetails;
    } catch (error) {
      console.error('Erreur dans le modèle MenuModel :', error);
      throw error;
    }
  }
}

export default MenuModel;
