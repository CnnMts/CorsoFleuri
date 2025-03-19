const Cash_register = ({ name, price, products }) => {
  // Générer la liste des produits
  const productList = products.map(product => `<li>${product.name}</li>`).join('');

  return `
    <div class="containerTop">
      <div class="logo"><h2>Mon logo</h2></div>
       <button type="button" class="order">COMMANDE</button>
      <button type="button" class="payment">A PAYER</button>
      <button type="button" class="gestion">GESTION</button>
    </div>
    <div class="container">
      <nav class="containerLeft">
        <button type="button" class="menu-button">Menu</button>
        <button type="button" class="drink-button">Boisson</button>
        <button type="button" class="dessert-button">Dessert</button>
      </nav>
      <div class="containerMiddle">
        <div class="listProductOfMenu"></div>
      </div>
      <div class="containerRight">
        <div class="containerTicket">
          <div class="nameMenu">
            <h2>${name}</h2>
          </div>
          <div class="listMenu">
            <div class="listorder">
              <ul>${productList}</ul>
            </div>
            <div class="leftContainerListMenu">
              <div class="priceContainer">
                <h2 id='price'>${price} €</h2>
              </div>
              <div class="quantity">
                <h2 id='quantity'>x1</h2>
              </div>
              <div class="deletebuttonContainerListMenu">
                <button class="delete-menu-list" type="button">🗑️</button>
              </div>
            </div>
          </div>
        </div>
        <div class="OrderPriceContent">
          <div class="titleOrder">
            <h2>COMMANDE</h2>
          </div>
          <div class="totalPrice">
            <h2>XX.XX€</h2>
          </div>
        </div>
        <div class="containerPaymentButton">
          <button type="button" class="payment-button">Encaisser</button>
        </div>
      </div>
    </div>
  `;
};

export default (menuDetails) => {
  if (!menuDetails || !menuDetails.name) {
    return `<div>Aucune donnée disponible</div>`;
  }

  return `
    <div class="Cash_register">
      ${Cash_register(menuDetails)}
    </div>
  `;
};
