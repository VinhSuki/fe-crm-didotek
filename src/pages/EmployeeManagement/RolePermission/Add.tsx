/* eslint-disable @typescript-eslint/no-explicit-any */
import rolePermissionApi from "@/apis/modules/rolePermission.api";
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

const roleSchema = z.object({
  ten: z.string().min(1, "Vui lòng nhập tên chức vụ"),
});

type RoleFormValues = z.infer<typeof roleSchema>;

export default function Add({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const handleResetForm = () => {
    form.reset({
      ten: "",
    });
    setOpen(false);
  };
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema), // Truyền productTypes vào schema
    defaultValues: {
      ten: "",
    },
  });

  const onSubmit = async (data: RoleFormValues) => {
    try {
      await rolePermissionApi.add(data);
      handleResetForm();
      onAdded();
      showSuccessAlert("Thêm dữ liệu thành công!");
    } catch (error: any) {
      form.setError("ten", {
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
          <DialogTitle className="border-b pb-4">Thêm chức vụ</DialogTitle>
        </DialogHeader>
        <>
          <Form {...form}>
            <form
              noValidate={true}
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4 max-h-[500px] overflow-y-auto"
            >
              {/* Input Ảnh */}
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="ten" className="text-zinc-500">
                  Tên chức vụ
                </Label>
                <div className="col-span-3">
                  <FormField
                    control={form.control}
                    name="ten"
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
