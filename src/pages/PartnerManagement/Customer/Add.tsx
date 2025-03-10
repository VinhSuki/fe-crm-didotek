/* eslint-disable @typescript-eslint/no-explicit-any */
import customerApi from "@/apis/modules/customer.api";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccessAlert } from "@/utils/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const customerSchema = z.object({
  ho_ten: z.string().min(1, "Vui lòng nhập họ và tên"),
  dien_thoai: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(
      new RegExp("^(03|05|07|08|09|01[2|6|8|9])\\d{8}$"),
      "Số điện thoại không hợp lệ"
    ),
  dia_chi: z.string().min(1, "Vui lòng nhập họ và tên"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function Add({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const handleResetForm = () => {
    form.reset();
    setOpen(false);
  };
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema), // Truyền productTypes vào schema
    defaultValues: {
      dia_chi: "",
      ho_ten: "",
      dien_thoai: "",
    },
  });

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      await customerApi.add(data);
      handleResetForm();
      onAdded();
      showSuccessAlert("Thêm dữ liệu thành công!");
    } catch (error: any) {
      form.setError("ho_ten", {
        type: "manual",
        message: error.message,
      });
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
          <DialogTitle className="border-b pb-4">Thêm khách hàng</DialogTitle>
        </DialogHeader>
        <>
          <Form {...form}>
            <form
              noValidate={true}
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4 max-h-[500px] overflow-y-auto"
            >
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="ho_ten" className="text-zinc-500">
                  Họ và tên
                </Label>
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="ho_ten"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} autoComplete="off" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="dien_thoai" className="text-zinc-500">
                  Điện thoại
                </Label>
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="dien_thoai"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} autoComplete="off" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="dia_chi" className="text-zinc-500">
                  Địa chỉ
                </Label>
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="dia_chi"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} autoComplete="off" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter className="space-x-2">
                <Button
                  type="button"
                  className="bg-black/80 hover:bg-black"
                  onClick={handleResetForm}
                >
                  Đóng
                </Button>
                <Button type="submit">Lưu</Button>
              </DialogFooter>
            </form>
          </Form>
        </>
      </DialogContent>
    </Dialog>
  );
}
