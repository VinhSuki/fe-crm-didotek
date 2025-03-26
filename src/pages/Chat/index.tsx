import employeeApi from "@/apis/modules/employee.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/context/AuthContext";
import { IEmployee } from "@/models/interfaces";
import clsx from "clsx";
import Cookies from "js-cookie";
import { SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const token = Cookies.get("token");
const socket = new WebSocket(import.meta.env.VITE_SOCKET, [token ?? ""]); // Thay bằng WebSocket server của bạn

interface IMessage {
  SenderId?: number;
  ReceiverId?: number;
  Message: string;
}

export default function ChatApp() {
  const authMethod = useAuthContext();
  const currentId = Number(authMethod?.account?.ID);
  // const { id, userId } = { id: 1, userId: 2 };
  const params = useParams();
  const userId = Number(params.userId);
  const [user, setUser] = useState<IEmployee>(Object);
  useEffect(() => {
    const fetchApi = async () => {
      const res = await employeeApi.list({
        filters: [
          { field: "nhan_vien.id", condition: "=", value: String(userId) },
        ],
      });
      const data = res.data?.data ?? [];
      if (data.length > 0) {
        setUser(data[0]);
      }
    };
    if (userId) {
      fetchApi();
    }
  }, [userId]);
  const [value, setValue] = useState("");
  const [dataMessage, setDataMessage] = useState<IMessage[]>([]);

  useEffect(() => {
    // Khi WebSocket mở kết nối
    socket.onopen = () => {
      console.log("🔗 WebSocket Connected!");
    };

    // Nhận tin nhắn từ Server
    socket.onmessage = (event) => {
      console.log("📩 Received:", event.data);

      // Kiểm tra event.data có tồn tại và là chuỗi không
      if (!event.data || typeof event.data !== "string") {
        console.error("❌ Dữ liệu nhận được không hợp lệ:", event.data);
        return;
      }

      // Kiểm tra event.data có rỗng không
      if (event.data.trim() === "") {
        console.error("❌ Dữ liệu nhận được là chuỗi rỗng");
        return;
      }

      // Parse dữ liệu
      try {
        const data: IMessage = JSON.parse(event.data);
        console.log("Dữ liệu đã parse:", data);

        // Kiểm tra dữ liệu có đúng định dạng IMessage không
        if (
          data &&
          typeof data.SenderId === "number" &&
          typeof data.Message === "string"
        ) {
          setDataMessage((prev) => [
            ...prev,
            {
              ...data,
              ReceiverId: currentId, // Thêm ReceiverId
            },
          ]);
        } else {
          console.error("❌ Dữ liệu không đúng định dạng IMessage:", data);
        }
      } catch (error) {
        console.error("❌ Lỗi khi parse dữ liệu từ server:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    socket.onclose = (event) => {
      console.warn(
        `⚠️ WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`
      );
    };

    // Khi component unmount, đóng kết nối
    return () => {
      console.log("chay vao");
      socket.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (value.trim() === "") return;

    const messageData: IMessage = {
      Message: value,
      ReceiverId: Number(userId),
    };

    // Gửi tin nhắn qua WebSocket
    socket.send(JSON.stringify(messageData));
    setDataMessage((prev) => [
      ...prev,
      {
        ...messageData,
        SenderId: currentId,
      },
    ]);
    setValue("");
  };

  return (
    <div className="w-full flex flex-col h-screen space-y-2">
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 cursor-pointer border-b px-4 bg-white h-[70px]">
          <Avatar>
            <AvatarImage
            className="object-contain"
              src={user.avatar || "https://via.placeholder.com/40"}
            />
            <AvatarFallback>
              {user.ho_ten
                ? user.ho_ten.trim().split(" ").pop()?.charAt(0).toUpperCase()
                : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-semibold">{user.ho_ten ?? "..."}</p>
            <p className="text-gray-500">{user.chuc_vu ?? "..."}</p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 h-[500px] p-4 overflow-y-auto space-y-2">
          {dataMessage.map((data, index) => (
            <p
              className={clsx(
                data.SenderId === currentId ? "text-end" : "text-start",
                "px-4 py-2"
              )}
              key={index}
            >
              <span
                className={`rounded-lg px-4 py-2 text-white ${
                  data.SenderId === currentId ? "bg-yellow-500" : "bg-gray-500"
                }`}
              >
                {data.Message}
              </span>
            </p>
          ))}
        </CardContent>
      </Card>
      <div className="flex items-center gap-2 p-2 bg-white border-t rounded-md">
        <Input
          placeholder="Nhập tin nhắn..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Ngăn hành vi mặc định của phím Enter
              handleSendMessage(); // Gọi hàm gửi tin nhắn
            }
          }}
          className="flex-1"
        />
        <Button onClick={handleSendMessage}>
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
}
