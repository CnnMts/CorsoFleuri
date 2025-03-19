import navTopView from './navTopView.js';
import menusView from './menusView.js';
import ticketView from './ticketView.js'


const Cash_register = ({ menus }) => {
  return `
    ${navTopView()}
    <div class="container">
      <div class="containerMiddle">
        <div class="listProductOfMenu">
          ${menus.map(menu => menusView(menu)).join('')}
        </div>
      </div>
      ${ticketView({ name: "Ticket", price: 0, products: [] })}
    </div>
  `;
};

export default (menuDetails) => {
  if (!menuDetails || menuDetails.length === 0) {
    return `<div>Aucune donnée disponible</div>`;
  }

  return `
    <div class="Cash_register">
      ${Cash_register({ menus: menuDetails })}
    </div>
  `;
};
