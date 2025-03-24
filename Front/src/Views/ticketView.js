const ticketView = (ticketData) => {
  if (!ticketData || !ticketData.products) {
    return '<p>Aucun élément sélectionné dans le ticket.</p>';
  }

  const productList = ticketData.products
    .map((product) => `<li class="font-carlito font-size-32">${product}</li>`)
    .join('');

  return `
    <div class="ticket" data-name="${ticketData.name}">
      <div class="nameMenu">
        <h2 class="font-barlow font-size-48">${ticketData.name}</h2>
      </div>
      <div class="listMenu">
        <div class="listorder">
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
