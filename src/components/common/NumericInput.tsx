import { Input } from "@/components/ui/input";

interface NumericInputProps {
  value: string | number;
  onChange: (value: number | "") => void;
  min?: number;
  max?: number;
}

export default function NumericInput({
  value,
  onChange,
  min,
  max,
}: NumericInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\D/g, ""); // Chỉ giữ lại số
    console.log(min);
    if (typeof min === "number" && !isNaN(min) && typeof max === "number" && !isNaN(max) ) {
      console.log("chay vao");
      if (Number(e.target.value) < min) rawValue = String(min);
      if (Number(e.target.value) > max) rawValue = String(max);
    }
    onChange(rawValue ? Number(rawValue) : ""); // Cập nhật giá trị số
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[\d\b]/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault(); // Chặn nhập ký tự không hợp lệ
    }
  };

  return (
    <Input
      min={min}
      max={max}
      type="text"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}
