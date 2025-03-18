const Cash_register = (data) => {
  const {
    
  } = data;
  return `<div class="container">
    <nav class="container-left">
      <button type="button" class="menu-button">Menu</button>
      <button type="button" class="drink-button"> Boisson</button>
      <button type="button" class="dessert-button">Dessert/button>
    </nav>
    <div class="containerTop">
        <div class="logo"> <h2>Mon logo</h2> </div>
        <button type="button" class="order">COMMANDE</button>
        <button type="button" class="payment">A PAYER</button>
        <button type="button" class="gestion">GESTION</button>
    </div>
    <div class="containerMiddle">
        <div class="liqtProductOfMenu"></div>
    </div>
    <div class="containerRight">
        <div class="containerTikcet">
            <div class="nameMenu">
             <h2>Menu Gourmand</h2>
             <div class="listMenu">
                <div class="listorder">
                      <ul>
                          <li>Hot Dogs Truc</li>
                          <li>Boisson Machin</li>
                          <li>Dessert chose</li>
                      </ul>
                </div>
                <div class="leftContainerListMenu">
                  <div class="priceContainer">
                    <h2 id='price'> XX.X€</h2>
                  </div>
                  <div class="quantity">
                      <h2 id='quantity'>x1</h2> 
                  </div>
                  <div class="deletebuttonContainerListMenue">
                      <button class="delete-menu-list" type="button">🗑️</button>
                  </div>
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
      <div class="containerPaymentButton>
          <button type="button" class="payment-button">Encaisser</button>
      </div>
    </div>
  </div>

`;
};

export default (datas) => `
  <div class="Cash_register">
    ${datas.map((data) => Cash_register(data)).join('')}
  </div>
`;
