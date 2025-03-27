const orderMenusView = ({ name, quantity }) => `
    <div class="MenusNames">
      ${name} ${`x${quantity}`}
    </div>
  `;

export default orderMenusView;
