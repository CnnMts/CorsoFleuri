import createMenuNameView from './createMenuNameView.js';
import createMenuPriceView from './createMenuPriceView.js';
import createMenuAppetizerView from './createMenuAppetizerView.js';
import createMenuMainCourseView from './createMenuMainCourseView.js';
import createMenuDessertView from './createMenuDessertView.js';
import createMenuDrinkView from './createMenuDrinkView.js';

const createMenuFormView = () => `
  <form id="create-menu-form">
    ${createMenuNameView()}
    ${createMenuPriceView()}
    ${createMenuAppetizerView()}
    ${createMenuMainCourseView()}
    ${createMenuDessertView()}
    ${createMenuDrinkView()}
    <button type="submit" id="save-menu">ENREGISTRER</button>
  </form>
`;

export default createMenuFormView;
