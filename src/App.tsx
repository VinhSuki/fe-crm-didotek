import AuthProvider from "./context/AuthContext";
import AppRouter from "./routes/routes";
import "./App.css";
import NavbarProvider from "@/context/NavbarContext";
import SidebarProvider from "@/context/SidebarContext";

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <NavbarProvider>
          <AppRouter />
        </NavbarProvider>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
