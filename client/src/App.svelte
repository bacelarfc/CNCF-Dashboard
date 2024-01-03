<script>
    import { Router, Route } from "svelte-navigator";
    import Login from "./Login.svelte";
    import ProtectedRoute from "./components/ProtectedRoute.svelte";
    import Dashboard from "./Dashboard.svelte";
    import UserDetails from "./Users/UserDetails.svelte";
    import { onMount, onDestroy } from "svelte";
    import { isAuthenticated } from "./store/store.js";
    import "./styles/dashboard.scss";
    let stopListeningToStorage;
  
    onMount(() => {
      const token = localStorage.getItem("token");
      if (token) {
        isAuthenticated.set(true);
      }
      window.addEventListener("storage", syncAuthentication);
  
      stopListeningToStorage = () => {
        window.removeEventListener("storage", syncAuthentication);
      };
    });
  
    onDestroy(() => {
      if (stopListeningToStorage) {
        stopListeningToStorage();
      }
    });
  
    async function syncAuthentication(event) {
      if (event.key === "token") {
        if (event.newValue) {
          isAuthenticated.set(true);
        } else {
          isAuthenticated.set(false);
        }
      }
    }
  </script>
  
<Router>
    <Route path="/" component={Login} />
    <Route path="/dashboard">
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    </Route>

    <Route path="/user-details">
        <ProtectedRoute>
            <UserDetails />
        </ProtectedRoute>
    </Route>
</Router>

  