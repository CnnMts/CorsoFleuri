import orderMenusView from "./orderMenusView.js";
import menuChoicesView from "./menuChoicesView.js";

const ordersView = ({ id, status_id, total_price, menusNames, products }) => {
    return `
      <div class="containerOrders">
        <div class="Order">
          <h2>Commande Numéro : ${id}</h2>
          <div class="Menus">
            ${menusNames.map((menuObj) => orderMenusView(menuObj)).join('')}
          </div>

          <div class="Products">
            ${products.map((prod) => menuChoicesView(prod)).join('')}
          </div>

          <h2>${parseFloat(total_price).toFixed(2)}€</h2>
          <h2>${status_id}</h2>
        </div>
      </div>
    `;
  }
  
  export default ordersView;