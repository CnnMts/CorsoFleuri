import '../Styles/ticket.css';

const ticketView = (ticketData) => {
  if (!ticketData || !ticketData.products) {
    return '<p>Aucun élément sélectionné dans le ticket.</p>';
  }

  const productList = ticketData.products
    .map((product) => `<li class="font-carlito font-size-32">${product}</li>`)
    .join('');

  return `
    <div class="ticket color-bg-tertiary color-white border-black" data-name="${ticketData.name}">
      <div class="nameMenu">
        <h2 class="font-barlow font-size-32">${ticketData.name}</h2>
      </div>
      <div class="listMenu">
        <div class="listOrder">
          <ul>
            ${productList}
          </ul>
        </div>
      </div>
      <div class="quatity">
        <p class="font-barlow font-size-32">× ${ticketData.quantity || 1} </p>
      </div>
    </div>
  `;
};

export default ticketView;
