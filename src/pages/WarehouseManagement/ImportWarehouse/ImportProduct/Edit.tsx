/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectGroupSearch from "@/components/common/SelectGroupSearch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { IGroupProduct } from "@/models/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const productSchema = z.object({
  san_pham: z.string(),
});

type productFormValues = z.infer<typeof productSchema>;

export default function Add({
  onAdded,
  listGroupProduct,
}: {
  onAdded: (data: string) => void;
  listGroupProduct: IGroupProduct[]
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<productFormValues>({
    resolver: zodResolver(productSchema), // Truyền warehouses vào schema
  });
  const handleResetForm = () => {
    form.reset();
    setOpen(false);
  };

  const onSubmit = async (data: productFormValues) => {
    try {
        // console.log(data.san_pham);
      onAdded(data.san_pham);
      handleResetForm();
    } catch (error: any) {
      //   setError("ten", { type: "manual", message: error.message });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-secondary text-white">
          <Plus />
          <span>Thêm mới</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="border-b pb-4">Thêm kho</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <div className="grid gap-4">
            <SelectGroupSearch
              form={form}
              name="san_pham"
              label="Chọn sản phẩm"
              options={listGroupProduct}
            />
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
              Lưu
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
