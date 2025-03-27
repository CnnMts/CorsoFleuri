import '../Styles/menus.css';

const menusView = ({ id, name, price }) => {
  const imgSrc = `/Assets/testMenu${id}.png`;

  return `
    <div class="containerMenus">
      <div class="imgMenu border-black">
        <img src="${imgSrc}" alt="${name}" />
        <div class="priceOnImgMenu">
          <h2 class="font-barlow font-size-32">${parseFloat(price).toFixed(2)}€</h2>
        </div>
      </div>
      <div class="buttonAdd">
        <button type="button" class="addMenuButton font-barlow font-size-32 border-black color-bg-negative color-white" data-name="${name}">Ajouter</button>
      </div>
    </div>
  `;
}

export default menusView;
