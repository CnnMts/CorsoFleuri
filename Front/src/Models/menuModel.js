import fetch from 'node-fetch';

class MenuModel {
  static async getMenuDetails(menuId) {
    try {
      // Récupérer les détails du menu
      const menuResponse = await fetch(`http://localhost:8083/menu/${menuId}`);
      if (!menuResponse.ok) {
        throw new Error(`Erreur API menu: ${menuResponse.statusText}`);
      }
      const menuDetails = await menuResponse.json();
      console.log('Détails du menu :', menuDetails);

      // Récupérer les produits associés au menu
      const menuProductResponse = await fetch(`http://localhost:8083/menuProduct?menuId=${menuId}`);
      if (!menuProductResponse.ok) {
        throw new Error(`Erreur API menuProduct: ${menuProductResponse.statusText}`);
      }
      const menuProducts = await menuProductResponse.json();
      console.log('Produits associés au menu :', menuProducts);

      // Filtrer les IDs des produits associés au menu spécifique
      const productIds = [...new Set(menuProducts.filter(item => item.menu_id === menuId).map(item => item.product_id))];
      console.log('IDs des produits filtrés :', productIds);

      // Récupérer les détails des produits
      const productDetailsPromises = productIds.map(id =>
        fetch(`http://localhost:8083/product/${id}`).then(res => res.json())
      );
      const productDetails = await Promise.all(productDetailsPromises);
      console.log('Détails des produits filtrés :', productDetails);

      // Retourner les détails du menu avec les produits associés
      return {
        ...menuDetails,
        products: productDetails
      };
    } catch (error) {
      console.error('Erreur dans le modèle MenuModel :', error);
      throw error;
    }
  }
}

export default MenuModel;
