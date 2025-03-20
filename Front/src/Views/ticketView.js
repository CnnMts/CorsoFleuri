const ticketView = ({ name, price, products }) => {
  const productList = products.map((product) => `<li>${product.name}</li>`).join('');

  return `
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
  `;
};

export default ticketView;
