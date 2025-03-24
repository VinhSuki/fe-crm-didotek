/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  showErrorAlert,
  showLoadingAlert,
  showSuccessAlert,
} from "@/utils/alert";
import clsx from "clsx";
import { LockIcon, LockOpenIcon } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

interface ConfirmLockButtonProps {
  isLocked: boolean;
  title?: string;
  description?: string;
  onConfirm: (id: string | number,isLocked:boolean) => Promise<void>; // Hàm này phải là async
  className?: string;
  id: string | number;
}

export default function ConfirmLockButton({
  isLocked,
  title = "Bạn có chắc chắn muốn cập nhật khóa?",
  description = "Hành động này không thể hoàn tác!",
  className,
  onConfirm,
  id,
}: ConfirmLockButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClock = async () => {
    const result = await Swal.fire({
      title,
      text: description,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
      didOpen: () => {
        // Không thay đổi aria-hidden, để shadcn tự xử lý
      },
      willClose: () => {
        // Không thay đổi aria-hidden
      },
    });

    if (result.isConfirmed) {
      setLoading(true);
      showLoadingAlert();

      try {
        await onConfirm(id,!isLocked); // Gọi API
        showSuccessAlert("Cập nhật dữ liệu thành công!");
      } catch (error: any) {
        console.log(error);
        showErrorAlert(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Button
      type="button"
      className={clsx(isLocked ? "bg-red-700 hover:bg-red-800" : "bg-blue-700 hover:bg-blue-800", className)}
      onClick={handleClock}
      disabled={loading}
    >
      {isLocked ? <LockIcon /> : <LockOpenIcon />}
    </Button>
  );
}
