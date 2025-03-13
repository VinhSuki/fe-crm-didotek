import { Input } from "@/components/ui/input";

interface NumericInputProps {
  value: string | number;
  onChange: (value: number | "") => void;
  min?: number;
  max?: number;
  readOnly?: boolean;
  disabled?: boolean;
}

export default function NumericInput({
  value,
  onChange,
  min,
  max,
  readOnly = false,
  disabled = false,
}: NumericInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly || disabled) return; // Không cho phép thay đổi nếu readOnly hoặc disabled
  
    let rawValue = e.target.value.replace(/\D/g, ""); // Chỉ giữ lại số
    const numericValue = Number(rawValue);
  
    if (!isNaN(numericValue)) {
      if (typeof min === "number" && numericValue < min) {
        rawValue = String(min);
      }
      if (typeof max === "number" && numericValue > max) {
        rawValue = String(max);
      }
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
      readOnly={readOnly}
      disabled={disabled}
      className={`${(readOnly || disabled) ? "bg-zinc-100 cursor-default" : ""}`}
    />
  );
}
