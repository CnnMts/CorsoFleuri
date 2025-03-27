const orderMenusView = ({ name, quantity }) => {
  return `
    <div class="MenusNames">
      ${name} ${'x' + quantity}
    </div>
  `;
};

export default orderMenusView;

