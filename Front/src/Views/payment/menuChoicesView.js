const menuChoicesView = ({ name, quantity }) => `
    <div class="MenuChoice">
      ${name} ${`x${quantity}`}
    </div>
  `;

export default menuChoicesView;
