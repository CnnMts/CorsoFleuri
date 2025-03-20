// ticketView.js
const ticketView = (ticketData) => {
  if (!ticketData || !ticketData.products) {
    return '<p>Aucun élément sélectionné dans le ticket.</p>';
  }

  const productList = ticketData.products
    .map((product) => `<li>${product}</li>`)
    .join('');

  return `
    <div class="ticket">
      <div class="nameMenu">
        <h2>${ticketData.name}</h2>
      </div>
      <div class="listMenu">
        <div class="listorder">
          <ul>
            ${productList}
          </ul>
        </div>
      </div>
    </div>
  `;
};

export default ticketView;
