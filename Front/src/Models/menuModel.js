class MenuModel {
  static async fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur API (${url}): ${response.statusText}`);
    }
    return response.json();
  }

  static async getAllMenus() {
    try {
      // Récupérer tous les menus
      const menus = await this.fetchData('http://localhost:8083/menu');
      console.log('[MenuModel] Menus récupérés :', menus);

      // Récupérer les produits associés aux menus
      const menuProducts = await this.fetchData('http://localhost:8083/menuProduct');
      console.log('[MenuModel] Produits associés récupérés :', menuProducts);

      // Récupérer les détails de chaque menu
      const fullMenuDetails = await Promise.all(
        menus.map(async (menu) => {
          const productIds = [...new Set(menuProducts
            .filter((item) => item.menu_id === menu.id)
            .map((item) => item.product_id))];

          const productDetails = await Promise.all(
            productIds.map((id) => this.fetchData(`http://localhost:8083/product/${id}`))
          );

          return { ...menu, products: productDetails };
        })
      );

      console.log('[MenuModel] Détails des menus complets :', fullMenuDetails);
      return fullMenuDetails;
    } catch (error) {
      console.error('[MenuModel] Erreur :', error);
      throw error;
    }
  }
}

export default MenuModel;
