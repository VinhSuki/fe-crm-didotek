import NavbarProvider from "@/context/NavbarContext";
import SidebarProvider from "@/context/SidebarContext";
import WarehouseProvider from "@/context/WarehouseContext";
import "./App.css";
import AuthProvider from "./context/AuthContext";
import AppRouter from "./routes/routes";

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <NavbarProvider>
          <WarehouseProvider>
            <AppRouter />
          </WarehouseProvider>
        </NavbarProvider>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
