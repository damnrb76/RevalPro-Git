import { createContext, ReactNode, useContext } from "react";
import { useLocalStorage } from "./use-local-storage";

type MenuLayout = "horizontal" | "vertical";

interface MenuLayoutContextType {
  layout: MenuLayout;
  toggleLayout: () => void;
}

const MenuLayoutContext = createContext<MenuLayoutContextType | undefined>(undefined);

export function MenuLayoutProvider({ children }: { children: ReactNode }) {
  const [layout, setLayout] = useLocalStorage<MenuLayout>("revalpro-menu-layout", "horizontal");

  const toggleLayout = () => {
    setLayout(layout === "horizontal" ? "vertical" : "horizontal");
  };

  return (
    <MenuLayoutContext.Provider value={{ layout, toggleLayout }}>
      {children}
    </MenuLayoutContext.Provider>
  );
}

export function useMenuLayout() {
  const context = useContext(MenuLayoutContext);
  if (context === undefined) {
    throw new Error("useMenuLayout must be used within a MenuLayoutProvider");
  }
  return context;
}