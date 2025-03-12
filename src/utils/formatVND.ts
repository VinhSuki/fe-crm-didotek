const formatVND = (amount: number | string): string => {
  const number = Number(amount);
  if (isNaN(number)) return "0";

  return new Intl.NumberFormat("vi-VN").format(number); // Không dùng style: "currency"
};

export default formatVND;
