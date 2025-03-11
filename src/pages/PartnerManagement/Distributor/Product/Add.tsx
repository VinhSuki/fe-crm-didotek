import SelectSearch from "@/components/common/SelectSearch";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form
} from "@/components/ui/form";
import { IProduct } from "@/models/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Schema
const classifySchema = z.object({
  id: z.union([z.string(), z.number()]),
});

// Kiểu dữ liệu
type ProductFormValues = z.infer<typeof classifySchema>;

export default function Add({
  onAdded,
  products
}: {
  onAdded: (data: ProductFormValues) => void;
  products:IProduct[]
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(classifySchema),
  });

  const handleResetForm = () => {
    form.reset();
    setOpen(false);
  };

  const onSubmit = (data: ProductFormValues) => {
    onAdded(data); // Gửi dữ liệu lên component cha
    handleResetForm();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            className="bg-primary hover:bg-secondary text-white"
          >
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="border-b pb-4">Thêm sản phẩm</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <div className="grid gap-4">
              <SelectSearch form={form} name="id" label="Sản phẩm" options={products} placeholder="Chọn sản phẩm"/>
            </div>
            <DialogFooter className="space-x-2">
              <Button
                type="button"
                className="bg-black/80 hover:bg-black"
                onClick={handleResetForm}
              >
                Đóng
              </Button>
              <Button type="button" onClick={form.handleSubmit(onSubmit)}>
                Thêm
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
