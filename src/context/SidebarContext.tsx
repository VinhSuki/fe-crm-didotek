/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

interface ISidebarContext {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
const SidebarContext = createContext<ISidebarContext>({
  isCollapsed: false,
  setIsCollapsed: () => {}, 
});

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  return context;
};

const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
