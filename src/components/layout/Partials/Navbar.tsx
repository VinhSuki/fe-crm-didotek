import DropdownSearchChat from "@/components/common/DropdownSearchChat";
import SelectSearchNoForm from "@/components/common/SelectSearchNoForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/context/AuthContext";
import { useNavbarContext } from "@/context/NavbarContext";
import { useWarehouseContext } from "@/context/WarehouseContext";
import clsx from "clsx";
import {
  Bell,
  ChevronDown,
  Expand,
  LogOut,
  Mail,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Navbar() {
  const [lang, setLang] = useState("EN");
  const [isOpen, setIsOpen] = useState(false);
  const navbar = useNavbarContext();
  const authMethod = useAuthContext();
  const warehouse = useWarehouseContext();
  const navigate = useNavigate();
  const handleGetUserIdMessage = (id: number) => {
    navigate("/chat/" + id);
  };
  return (
    <nav
      className={clsx(
        "flex items-center justify-between bg-white border-b px-6 transition-all duration-300",
        navbar?.isOpenNavbar
          ? "h-[70px] opacity-100 py-3"
          : "h-0 opacity-0 py-0"
      )}
    >
      {/* Left Section - Search */}
      <Input
        placeholder="Search"
        className="w-[300px] bg-background-input border-0 focus:border-0"
      />

      {/* Center Section - Actions */}
      <div className="flex items-center gap-3">
        {/* Language Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[120px]">
              {lang} ▼
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setLang("EN")}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLang("VN")}>
              Tiếng Việt
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <SelectSearchNoForm
          value={warehouse?.selectedId}
          onChange={(id) => warehouse?.setSelectedId(id)}
          options={warehouse?.list ?? []}
        />
        <DropdownSearchChat
          currentId={Number(authMethod?.account?.ID ?? 0)}
          onGetUserId={handleGetUserIdMessage}
        />
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="relative">
            <Mail className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              1
            </span>
          </Button>

          <Button variant="ghost" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              2
            </span>
          </Button>

          <Button variant="ghost">
            <Expand className="h-5 w-5 text-gray-600" />
          </Button>

          <Button variant="ghost">
            <Settings className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
        {/* Right Section - User Profile */}
        <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar>
                <AvatarImage
                  src={
                    authMethod?.account?.avatar ||
                    "https://via.placeholder.com/40"
                  }
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-semibold">{authMethod?.account!.ho_ten}</p>
                <p className="text-gray-500">{authMethod?.account?.chuc_vu}</p>
              </div>
              <ChevronDown
                className={clsx(
                  "h-4 w-4 text-gray-500 transition-all duration-500",
                  isOpen && "rotate-180"
                )}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Link to={"/hello"} className="flex gap-2">
                <User className="mr-2 h-4 w-4" />
                Hồ sơ của tôi
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={"/hello"} className="flex gap-2">
                <Settings className="mr-2 h-4 w-4" />
                Cài đặt
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="flex gap-2 text-red-600"
                onClick={() => authMethod?.logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
