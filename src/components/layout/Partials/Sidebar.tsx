import { Button } from "@/components/ui/button";
import { Images } from "@/constant";
import { useAuthContext } from "@/context/AuthContext";
import { useSidebarContext } from "@/context/SidebarContext";
import clsx from "clsx";
import {
  Box,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Hash,
  List,
  Package,
  Percent,
  Shield,
  Truck,
  User,
  UserCheck,
  Warehouse,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

interface IItem {
  url: string | "";
  icon?: React.ElementType;
  title: string;
  permission?: string;
  subItems?: IItem[];
}
interface ISidebarItem {
  title: string;
  items: IItem[];
}

const sidebarItems: ISidebarItem[] = [
  {
    title: "Quản lý sản phẩm",
    items: [
      {
        permission: "view-san-pham",
        title: "Sản phẩm",
        icon: Package,
        url: "/san-pham",
      },
      {
        permission: "view-loai-san-pham",
        title: "Loại sản phẩm",
        icon: List,
        url: "/loai-san-pham",
      },
      {
        permission: "view-don-vi-tinh",
        title: "Đơn vị tính",
        icon: Hash,
        url: "/don-vi-tinh",
      },
      {
        permission: "view-loai-giam-gia",
        title: "Loại giảm giá",
        icon: Percent,
        url: "/loai-giam-gia",
      },
      {
        permission: "view-thoi-gian-bao-hanh",
        title: "Thời gian bảo hành",
        icon: Clock,
        url: "/thoi-gian-bao-hanh",
      },
    ],
  },
  {
    title: "Quản lý nhân viên",
    items: [
      {
        permission: "view-nhan-vien",
        title: "Nhân viên",
        icon: UserCheck,
        url: "/nhan-vien",
      },
      {
        permission: "view-chuc-vu",
        title: "Chức vụ & quyền hạn",
        icon: Shield,
        url: "/chuc-vu",
      },
    ],
  },
  {
    title: "Quản lý kho",
    items: [
      {
        permission: "view-kho",
        title: "Kho",
        icon: Warehouse,
        url: "/kho",
      },
      {
        permission: "view-hoa-don-nhap-kho",
        title: "Nhập kho",
        icon: Box,
        url: "/nhap-kho",
      },
      {
        permission: "view-hoa-don-xuat-kho",
        title: "Xuất kho",
        icon: Box,
        url: "/xuat-kho",
      },
    ],
  },
  {
    title: "Quản lý đối tác",
    items: [
      {
        permission: "view-nha-phan-phoi",
        title: "Nhà phân phối",
        icon: Truck,
        url: "/nha-phan-phoi",
      },
      {
        permission: "view-khach-hang",
        title: "Khách hàng",
        icon: User,
        url: "/khach-hang",
      },
    ],
  },
];

export function Sidebar() {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const { isCollapsed, setIsCollapsed } = useSidebarContext();
  const [isHovered, setIsHovered] = useState(false);
  const showContent = !isCollapsed || isHovered;
  const authMethod = useAuthContext()

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={` h-screen bg-white text-gray-700 border-r border-gray-200 transition-all duration-500 ease-in-out ${
        isCollapsed && !isHovered ? "w-[80px]" : "w-[260px]"
      }`}
      onMouseEnter={() => isCollapsed && setIsHovered(true)}
      onMouseLeave={() => isCollapsed && setIsHovered(false)}
    >
      {/* Header */}
      <div
        className={clsx(
          "px-5 h-[70px]  flex border-b relative",
          showContent ? "py-2" : "py-5"
        )}
      >
        <div className="h-full overflow-hidden w-[140px]">
          <img
            src={showContent ? Images.mainLogo.url : Images.smallLogo.url}
            alt={showContent ? Images.mainLogo.name : Images.smallLogo.name}
            className={`object-contain h-full w-full`}
          />
        </div>
        {/* Nút thu/mở Sidebar */}
        <Button
          className={clsx(
            "absolute z-40 top-1/2 transform -translate-y-1/2 -right-3 h-6 w-6 bg-primary text-white rounded-full shadow-md hover:bg-secondary transition-all duration-300 p-0",
            showContent ? "opacity-100" : "opacity-0"
          )}
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronsRight className="h-full w-full" />
          ) : (
            <ChevronsLeft className="h-full w-full" />
          )}
        </Button>
      </div>

      {/* Menu */}
      <nav className="overflow-y-auto p-5 max-h-screen">
        {sidebarItems.map((items) => (
          <ul className="overflow-hidden mb-5" key={items.title}>
            {!isCollapsed && (
              <h3 className="text-emphasis text-sm mb-[14px] font-bold">
                {items.title}
              </h3>
            )}
            {items.items.map((subItems,i) => authMethod?.checkPermission(subItems.permission ?? "") && (
              <li
                key={subItems.title}
                className=" text-sm transition hover:text-primary"
              >
                <NavLink
                  to={subItems.url}
                  className={({ isActive }) =>
                    clsx(
                      "w-full flex",
                      isActive
                        ? "text-primary font-semibold"
                        : "hover:text-primary",
                      isCollapsed && !isHovered
                        ? "justify-center p-[10px]"
                        : "py-[10px] px-[18px]",
                        items.items.length - 1 === i && "pb-5 border-b"
                    )
                  }
                  onClick={() =>
                    subItems.subItems && toggleSection(subItems.title)
                  }
                >
                  {subItems.icon && (
                    <subItems.icon
                      className="h-4 w-4 transition-transform"
                      style={{
                        transform: openSections.includes(subItems.title)
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    />
                  )}
                  <span
                    className={clsx(
                      "flex-1 transition-all overflow-hidden whitespace-nowrap",
                      isCollapsed && !isHovered
                        ? "opacity-0 w-0"
                        : "opacity-100 ml-2 w-auto"
                    )}
                  >
                    {showContent && subItems.title}
                  </span>
                </NavLink>
                {/* {item.subItems &&
                    openSections.includes(item.title) &&
                    !isCollapsed && (
                      <ul className="ml-6 mt-2 space-y-1">
                        {item.subItems.map((subItem) => (
                          <li key={subItem.title}>
                            <Button
                              variant="ghost"
                              className="w-full text-left justify-start text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                              asChild
                            >
                              <a href={subItem.url}>{subItem.title}</a>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )} */}
              </li>
            ))}
          </ul>
        ))}
      </nav>
    </aside>
  );
}
