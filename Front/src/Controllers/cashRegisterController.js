import cashRegisterView from "../Views/cashRegisterView.js";



const CashRegisterController = class CashRegisterController {
  constructor(params) {
    this.el = document.querySelector('#app');
    this.params = params;
    this.data = [];
    this.popularMovies = [];

    this.run();
  }

render() {
  return `
    <div class="container-fluid">
      ${cashRegisterView(0)}
    </div>
  `;
}
}

export default CashRegisterController;
