import '../../Styles/login.css';

const Login = () => 
   `
    <section class="login">
      <form action="" method="POST" class="login-form font-barlow">
        <div class="form-example">
          <label for="name" class="font-size-32">Enter your name: </label>
          <input type="text" name="name" id="name" required />
        </div>
        <div>
          <label for="password" class="font-size-32">Enter your password: </label>
          <input type="password" name="password" id="password" required />
        </div>
        <div>
          <button id="login-btn" type="button" class="border-black font-barlow font-size-32 color-white color-bg-negative">Login</button>
        </div>
      </form>
    </section>
  `;

export default Login;
