const formatVND = (amount: number | string): string => {
    const number = Number(amount);
    if (isNaN(number)) return "0 ₫";
  
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };
export default formatVND
