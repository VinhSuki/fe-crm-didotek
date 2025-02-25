import { createContext, useContext, useState } from "react";

interface INavbarContext {
  isOpenNavbar: boolean;
  setIsOpenNavbar: React.Dispatch<React.SetStateAction<boolean>>;
}
const NavbarContext = createContext<INavbarContext | null>(null);

interface NavbarProviderProps {
  children: React.ReactNode;
}

export const useNavbarContext = () => {
  const context = useContext(NavbarContext);
  return context;
};

const NavbarProvider = ({ children }: NavbarProviderProps) => {
  const [isOpenNavbar, setIsOpenNavbar] = useState(true);
  return (
    <NavbarContext.Provider value={{ isOpenNavbar, setIsOpenNavbar }}>
      {children}
    </NavbarContext.Provider>
  );
};

export default NavbarProvider;
