import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { showErrorAlert, showLoadingAlert, showSuccessAlert } from "@/utils/alert";

interface ConfirmDeleteButtonProps {
  title?: string;
  description?: string;
  onConfirm: () => Promise<void>; // Hàm này phải là async
  className?: string;
}

export default function ConfirmDeleteButton({
  title = "Bạn có chắc chắn muốn xóa?",
  description = "Hành động này không thể hoàn tác!",
  onConfirm,
  className,
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
    });

    if (result.isConfirmed) {
      setLoading(true);
      showLoadingAlert();

      try {
        await onConfirm(); // Gọi API
        showSuccessAlert("Xóa dữ liệu thành công!");
      } catch (error) {
        showErrorAlert("Đã có lỗi xảy ra. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Button
      className="bg-red-700 hover:bg-red-800"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 />
    </Button>
  );
}
