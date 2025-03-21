/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import roleApi from "@/apis/modules/rolePermission.api";
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
import { IRole } from "@/models/interfaces";
import { showSuccessAlert } from "@/utils/alert";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const roleSchema = z.object({
  id: z.union([z.string(), z.number()]),
  ten: z.string().min(1, "Vui lòng nhập tên chức vụ"),
});

type RoleFormValues = z.infer<typeof roleSchema>;

export default function Edit({
  onEdited,
  role,
}: {
  onEdited: () => void;
  role: IRole;
}) {
  const [open, setOpen] = useState(false);
  const resetForm = (data?: RoleFormValues) => {
    if (data) {
      form.reset({
        id: data.id,
        ten: data.ten,
      });
    } else {
      form.reset({
        id: role.ID,
        ten: role.ten,
      });
    }
  };
  useEffect(() => {
    resetForm();
  }, [role]);
  const handleResetForm = (data?: RoleFormValues) => {
    setOpen(false); // ✅ Đóng form sau khi API gọi thành công
    if (data) resetForm(data);
    else resetForm();
  };
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema), // Truyền productTypes vào schema
    defaultValues: {
      id: role.ID,
      ten: role.ten,
    },
  });

  const onSubmit = async (data: RoleFormValues) => {
    const convertData = {
      ...data,
      id: Number(data.id),
    };

    try {
      await roleApi.edit(convertData);
      handleResetForm();
      onEdited();
      showSuccessAlert("Sửa dữ liệu thành công!");
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
        <Button className="bg-zinc-700 hover:bg-zinc-800">
          <SquarePen />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="border-b pb-4">
            Cập nhật chức vụ
          </DialogTitle>
        </DialogHeader>
        <>
          <Form {...form}>
            <form
              noValidate={true}
              onSubmit={form.handleSubmit(onSubmit, (error) =>
                console.log(error)
              )}
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
                  onClick={() => handleResetForm()}
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
