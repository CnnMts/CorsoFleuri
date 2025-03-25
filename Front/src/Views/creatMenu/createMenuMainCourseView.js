const createMenuMainCourseView = () => `
  <div class="form-group" id="main-course-group">
    <label>Plats principaux</label>
    <!-- Conteneur pour afficher les items sélectionnés -->
    <div class="main-course-items"></div> 
    <!-- Bouton pour ajouter de nouveaux plats principaux -->
    <button type="button" id="add-main-course" class="add-button">
      Ajouter un plat principal
    </button>
  </div>
`;

export default createMenuMainCourseView;
