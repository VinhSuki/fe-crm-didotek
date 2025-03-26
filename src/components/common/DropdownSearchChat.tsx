import employeeApi from "@/apis/modules/employee.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { IEmployee } from "@/models/interfaces";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function DropdownSearchChat({
  currentId,
  onGetUserId,
}: {
  currentId: number;
  onGetUserId: (id: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [listUsers, setListUsers] = useState<IEmployee[]>([]);
  const filteredUsers = listUsers.filter((user) =>
    user.ho_ten.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchApi = async () => {
      const res = await employeeApi.list({});
      const data = res.data?.data;
      if (data) {
        const filterData = data.filter(
          (item: IEmployee) => item.ID !== currentId
        );
        setListUsers(filterData);
      }
    };
    fetchApi();
  }, [currentId]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <MessageCircle className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            1
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-2">
        <Input
          placeholder="Tìm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />
        <div className="max-h-40 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <DropdownMenuItem
                key={user.ID}
                onSelect={() => onGetUserId(Number(user.ID))} // Khi chọn user
                className="flex items-center gap-3 cursor-pointer"
              >
                <Avatar>
                  <AvatarImage
                  className="object-contain"
                    src={user.avatar || "https://via.placeholder.com/40"}
                  />
                  <AvatarFallback>
                    {user.ho_ten.trim().split(" ").pop()?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-semibold">{user.ho_ten}</p>
                  <p className="text-gray-500">{user.chuc_vu}</p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <p className="p-2 text-sm text-gray-500">Không có kết quả</p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
