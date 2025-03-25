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
      const menus = await this.fetchData('http://localhost:8083/menu');
      console.log('[MenuModel] Menus récupérés :', menus);

      const menuProducts = await this.fetchData('http://localhost:8083/menuProduct');
      console.log('[MenuModel] Produits associés récupérés :', menuProducts);

      const fullMenuDetails = await Promise.all(
        menus.map(async (menu) => {
          const productDetails = await Promise.all(
            menuProducts
              .filter((item) => item.menu_id === menu.id)
              .map(async (item) => {
                const product = await this.fetchData(`http://localhost:8083/product/${item.product_id}`);
                return { ...product, quantity: item.quantity || 1 };
              })
          );

          return { ...menu, products: productDetails };
        })
      );

      console.log('[MenuModel] Détails des menus complets avec quantités :', fullMenuDetails);
      return fullMenuDetails;
    } catch (error) {
      console.error('[MenuModel] Erreur :', error);
      throw error;
    }
  }
}

export default MenuModel;
