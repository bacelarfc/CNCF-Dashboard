<script>
  import "./styles/login.css";
  import "toastr/build/toastr.min.css";
  import toastr from "toastr";
  import { onMount } from "svelte";
  import { login } from "./utils/auth.js";
  import { navigate } from "svelte-navigator";
  import { isAuthenticated, setAuthenticated } from "./store/store.js";

  let email = "";
  let password = "";
  let errorMessage = "";

  async function handleLogin() {
    try {
      const response = await login(email, password);
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        setAuthenticated(true); 
        toastr.success("Welcome " + email);
        navigate("/dashboard");
      } else {
        console.error("Failed to login");
      }
    } catch (error) {
      toastr.error(error.message);
      console.error("An error occurred during login:", error);
    }
  }

  onMount(() => {
    isAuthenticated.subscribe((value) => {
      if (value) {
        navigate("/dashboard");
      }
    });
  });
</script>

<div class="login">
  <div class="login-triangle" />
  <form
    class="login-container"
    on:submit|preventDefault={handleLogin}
    method="POST"
  >
    <h2>Login</h2>
    <label for="username">Username:</label>
    <input
      class="input-field"
      type="email"
      bind:value={email}
      placeholder="Email"
      required
    />
    <label for="password">Password:</label>
    <input
      class="input-field"
      type="password"
      bind:value={password}
      placeholder="Password"
      required
    />
    {#if errorMessage}
      <p>{errorMessage}</p>
    {/if}

    <br />
    <input id="submit-button" type="submit" value="Submit" />
  </form>
</div>
