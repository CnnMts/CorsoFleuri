const menusView = ({ id, name, price }) => {
  return `
    <div class="containerMenus">
      <div class="imgMenu">
        <img src="./Assets/testMenu${id}.png" alt="${name}" />
        <div class="priceOnImgMenu">
          <h2>${parseFloat(price).toFixed(2)}€</h2>
        </div>
      </div>
      <div class="buttonAdd">
        <button type="button" class="addMenuButton" data-name="${name}">Ajouter</button>
      </div>
    </div>
  `;
};

export default menusView;
