async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:8083/product');
    if (!response.ok) {
      throw new Error('La réponse réseau n\'est pas correcte');
    }
    const products = await response.json();
    console.log('Produits récupérés:', products);

    // Sélectionne la liste où afficher les produits
    const productList = document.getElementById('product-list');

    // Boucle pour ajouter les produits dans la liste
    products.forEach(product => {
      const listItem = document.createElement('li');
      listItem.textContent = `${product.name} - ${product.sale_price}€`;
      productList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
  }
}

fetchProducts();