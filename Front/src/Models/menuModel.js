class MenuModel {
  static async getAllMenus() {
    try {
      // Récupérer tous les menus
      const menusResponse = await fetch(`http://nginx/menu`);
      // On vérifie d'abord que la réponse est OK
      if (!menusResponse.ok) {
        throw new Error(`Erreur API menus: ${menusResponse.statusText}`);
      }
      // Récupérer la réponse brute en texte pour le debug
      const rawMenus = await menusResponse.text();
      console.log('Réponse brute pour /menu :', rawMenus);

      // Tenter de parser le JSON
      const menus = JSON.parse(rawMenus);
      console.log('Tous les menus :', menus);

      // Récupérer tous les produits associés
      const menuProductsResponse = await fetch(`http://nginx/menuProduct`);
      if (!menuProductsResponse.ok) {
        throw new Error(`Erreur API menuProduct: ${menuProductsResponse.statusText}`);
      }
      const rawMenuProducts = await menuProductsResponse.text();
      console.log('Réponse brute pour /menuProduct :', rawMenuProducts);
      const menuProducts = JSON.parse(rawMenuProducts);
      console.log('Produits associés :', menuProducts);

      // Récupérer les détails de chaque menu et leurs produits associés
      const fullMenuDetails = await Promise.all(
        menus.map(async (menu) => {
          const productIds = [...new Set(menuProducts.filter(item => item.menu_id === menu.id).map(item => item.product_id))];
          const productDetailsPromises = productIds.map(id =>
            fetch(`http://nginx/product/${id}`)
              .then(res => res.text())
              .then(text => {
                console.log(`Réponse brute pour /product/${id} :`, text);
                return JSON.parse(text);
              })
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
