import createMenuNameView from './createMenuNameView.js'; import createMenuPriceView from './createMenuPriceView.js';
import createMenuAppetizerView from './createMenuAppetizerView.js';
import createMenuMainCourseView from './createMenuMainCourseView.js';
import createMenuDessertView from './createMenuDessertView.js';
import createMenuDrinkView from './createMenuDrinkView.js';

const createMenuFormView = ({
  appetizers, mainCourses, desserts, drinks
}) => `
  <form id="create-menu-form">
    ${createMenuNameView()}
    ${createMenuPriceView()}
    ${createMenuAppetizerView({ appetizers })}
    ${createMenuMainCourseView({ mainCourses })}
    ${createMenuDessertView({ desserts })}
    ${createMenuDrinkView({ drinks })}
    <button type="submit" id="save-menu">ENREGISTRER</button>
  </form>
`;

export default createMenuFormView;
