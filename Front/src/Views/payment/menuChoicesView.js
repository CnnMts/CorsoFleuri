const menuChoicesView = ({ name, quantity }) => {
    return `
      <div class="MenuChoice">
        ${name} ${'x' + quantity}
      </div>
    `;
  };
  
  export default menuChoicesView;
  