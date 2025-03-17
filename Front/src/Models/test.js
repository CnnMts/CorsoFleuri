async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:8083/product');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const products = await response.json();
    console.log('Produits récupérés:', products);
    // Vous pouvez maintenant utiliser les produits dans votre application
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
  }
}

fetchProducts();
