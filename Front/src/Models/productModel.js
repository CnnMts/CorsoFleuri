class ProductModel {
  static async fetchProducts() {
    try {
      const response = await fetch('http://localhost:8083/product');
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return [];
    }
  }
}

export default ProductModel;
