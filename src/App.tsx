import AuthProvider from "./context/Auth/AuthProvider";
import AppRouter from "./routes/routes";
import "./App.css";
import NavbarProvider from "@/context/NavbarContext";

function App() {
  return (
    <AuthProvider>
      <NavbarProvider>
        <AppRouter />
      </NavbarProvider>
    </AuthProvider>
  );
}

export default App;
