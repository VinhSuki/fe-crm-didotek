import Swal from "sweetalert2";

export const showLoadingAlert = async () => {
  Swal.fire({
    title: "Đang xử lý...",
    text: "Vui lòng chờ trong giây lát.",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const showSuccessAlert = async (message: string) => {
  Swal.close(); // Đóng loading trước khi hiển thị alert
  Swal.fire({
    title: "Thành công!",
    text: message,
    icon: "success",
    confirmButtonText: "OK",
  });
};

export const showErrorAlert = async (message: string) => {
  Swal.close(); // Đóng loading trước khi hiển thị alert
  Swal.fire({
    title: "Lỗi!",
    text: message,
    icon: "error",
    confirmButtonText: "OK",
    allowOutsideClick: false, // Không cho phép click bên ngoài
  allowEscapeKey: false, // Không cho phép nhấn ESC thoát
  });
};
