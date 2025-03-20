const ticketView = (ticketData) => {
  if (!ticketData || !ticketData.products) {
    return `
      <div class="containerRight">
        <p>Aucun élément sélectionné dans le ticket.</p>
      </div>
    `;
  }

  const categoriesOrder = ['Plat', 'Entrée', 'Dessert', 'Boisson'];
  const orderedProducts = categoriesOrder
    .map((category) => ({
      category,
      items: ticketData.products.filter((product) => product.category === category)
    }))
    .filter((group) => group.items.length > 0);

  const productList = orderedProducts
    .map((group) => `
      <div class="category">
        <h3>${group.category}</h3>
        <ul>
          ${group.items.map((item) => `<li>${item.name}</li>`).join('')}
        </ul>
      </div>
    `)
    .join('');

  return `
    <div class="containerRight">
      <div class="containerTicket">
        <div class="nameMenu">
          <h2>${ticketData.name}</h2>
        </div>
        <div class="listMenu">
          <div class="listorder">
            ${productList}
          </div>
        </div>
      </div>
      <div class="OrderPriceContent">
        <div class="totalPrice">
          <h2>Total : ${ticketData.price} €</h2>
        </div>
      </div>
      <div class="containerPaymentButton">
        <button type="button" class="payment-button">Encaisser</button>
      </div>
    </div>
  `;
};

export default ticketView;
