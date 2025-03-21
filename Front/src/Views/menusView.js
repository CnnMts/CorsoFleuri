const getMenuImage = (id) => {
  try {
    return `/Assets/testMenu${id}.png`;
  } catch {
    console.log(`Image manquante pour l'id ${id}, utilisation d'une image par défaut.`);
    return '/Assets/defaultMenu.png';
  }
};

const menusView = ({ id, name, price }) => {
  const imgSrc = getMenuImage(id);
  return `
    <div class="containerMenus">
      <div class="imgMenu">
        <img src="${imgSrc}" alt="${name}" />
        <div class="priceOnImgMenu">
          <h2>${parseFloat(price).toFixed(2)}€</h2>
        </div>
      </div>
      <div class="buttonAdd">
        <button type="button" class="addMenuButton" data-name="${name}">Ajouter</button>
      </div>
    </div>
  `;
}

export default menusView;
