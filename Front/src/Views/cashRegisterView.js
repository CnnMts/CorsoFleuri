import navTopView from './navTopView.js';
import menusView from './menusView.js';
import ticketView from './ticketView.js';

const CashRegister = ({ menus }) => `
    ${navTopView()}
    <div class="container">
      <div class="containerMiddle">
        <div class="listProductOfMenu">
          ${menus.map((menu) => menusView(menu)).join('')}
        </div>
      </div>
      ${ticketView({ name: 'Ticket', price: 0, products: [] })}
    </div>
  `;

export default (menuDetails) => {
  if (!menuDetails || menuDetails.length === 0) {
    return '<div>Aucune donnée disponible</div>';
  }

  return `
    <div class="Cash_register">
      ${CashRegister({ menus: menuDetails })}
    </div>
  `;
};
