const orderMenusView = ({ name, quantity }) => {
  return `
    <div class="MenusNames">
      ${name} ${quantity > 1 ? 'x' + quantity : ''}
    </div>
  `;
};

export default orderMenusView;

