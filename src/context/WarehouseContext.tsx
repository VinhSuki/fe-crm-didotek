/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import warehouseApi from "@/apis/modules/warehouse.api";
import { useAuthContext } from "@/context/AuthContext";
import { IWarehouse } from "@/models/interfaces";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Định nghĩa kiểu dữ liệu cho props của WarehouseProvider
interface WarehouseProviderProps {
  children: React.ReactNode;
}

interface WarehouseContextType {
  list: IWarehouse[] | null; // Thông tin người dùng hoặc null nếu chưa đăng nhập
  selectedId: number | string | undefined;
  setSelectedId: React.Dispatch<
    React.SetStateAction<string | number | undefined>
  >;
}

// Tạo context với giá trị mặc định là undefined (nếu chưa có context provider)
const WarehouseContext = createContext<WarehouseContextType | null>(null);

export const useWarehouseContext = () => {
  const context = useContext(WarehouseContext);
  return context;
};

function WarehouseProvider({ children }: WarehouseProviderProps) {
  const [list, setList] = useState<IWarehouse[]>([]);
  const [selectedId, setSelectedId] = useState<number | string | undefined>(
    undefined
  );
  const authMethod = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token")
    console.log(token);
    const fetchApi = async () => {
      console.log("call api");
      const res = await warehouseApi.list({});
      if (res.data?.data) {
        setList(res.data.data);
      }
    };
    if (authMethod?.isAuthenticated && authMethod.checkPermission("view-kho") && token)
      fetchApi();
  }, [navigate]);

  return (
    <WarehouseContext.Provider value={{ list, selectedId, setSelectedId }}>
      {children}
    </WarehouseContext.Provider>
  );
}

export default WarehouseProvider;
