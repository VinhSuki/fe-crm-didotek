/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  showErrorAlert,
  showLoadingAlert,
  showSuccessAlert,
} from "@/utils/alert";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

interface ConfirmDeleteButtonProps {
  title?: string;
  description?: string;
  onConfirm: (id: string | number) => Promise<void>; // Hàm này phải là async
  className?: string;
  id: string | number;
}

export default function ConfirmDeleteButton({
  title = "Bạn có chắc chắn muốn xóa?",
  description = "Hành động này không thể hoàn tác!",
  onConfirm,
  className,
  id,
}: ConfirmDeleteButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title,
      text: description,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
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
        await onConfirm(id); // Gọi API
        showSuccessAlert("Xóa dữ liệu thành công!");
      } catch (error : any) {
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
      className={clsx("bg-red-700 hover:bg-red-800", className)}
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 />
    </Button>
  );
}
