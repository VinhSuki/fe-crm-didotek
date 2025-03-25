import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";  
import Cookies from "js-cookie";
import { useEffect, useState } from "react";


const token = Cookies.get("token");
const socket = new WebSocket("ws://localhost:5000", ["token", token ?? ""]); // Thay bằng WebSocket server của bạn

interface IMessage {
  senderId: number;
  message: string;
}

export default function ChatApp() {
  const { id, userId } = { id: 1, userId: 2 };

  const [value, setValue] = useState("");
  const [dataMessage, setDataMessage] = useState<IMessage[]>([
    {
      senderId: 1,
      message: "Ngu",
    },
  ]);

  useEffect(() => {
    // Khi WebSocket mở kết nối
    socket.onopen = () => {
      console.log("🔗 WebSocket Connected!");
    };

    // Nhận tin nhắn từ Server
    socket.onmessage = (event) => {
      const data: IMessage = JSON.parse(event.data);
      setDataMessage((prev) => [...prev, data]);
    };

    // Khi component unmount, đóng kết nối
    return () => {
      socket.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (value.trim() === "") return;

    const messageData: IMessage = {
      message: value,
      senderId: userId,
    };

    // Gửi tin nhắn qua WebSocket
    socket.send(JSON.stringify(messageData));
    setValue("");
  };

  return (
    <div className="w-full flex flex-col h-screen space-y-2">
      <Card className="flex-1 p-4 overflow-y-auto space-y-2">
        {dataMessage.map((data, index) => (
          <div key={index}>
            <p className={data.senderId === userId ? "text-end" : "text-start"}>
              <span
                className={`rounded-lg px-4 py-2 text-white ${
                  data.senderId === userId ? "bg-blue-500" : "bg-gray-500"
                }`}
              >
                {data.message}
              </span>
            </p>
          </div>
        ))}
      </Card>
      <div className="flex items-center gap-2 p-2 bg-white border-t rounded-md">
        <Input
          placeholder="Nhập tin nhắn..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSendMessage}>Gửi</Button>
      </div>
    </div>
  );
}
