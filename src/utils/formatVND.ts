const formatVND = (amount: number | string): string => {
  const number = Number(String(amount).replace(/\./g, "")); // Xóa dấu chấm
  if (isNaN(number)) return "0";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(number)
    .replace(/\s?₫/g, ""); // Loại bỏ chữ "₫"
};

export default formatVND;
