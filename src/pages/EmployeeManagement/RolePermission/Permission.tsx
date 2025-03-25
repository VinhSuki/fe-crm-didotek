/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import rolePermissionApi from "@/apis/modules/rolePermission.api";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IActive, IRolePermission } from "@/models/interfaces";
import { showErrorAlert, showSuccessAlert } from "@/utils/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronDown, CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Permission = () => {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const roleId = params.roleId;
  const [rolePermission, setRolePermission] = useState<IRolePermission[]>([]);
  const [listActive, setListActive] = useState<IActive[]>([]);
  console.log(listActive);
  const handleCheckboxChange = (data: IActive) => {
    setListActive((prev) => {
      const index = prev.findIndex((p) => Number(p.ID) === Number(data.ID));
      if (index !== -1) {
        return prev.map((p) =>
          Number(p.ID) === Number(data.ID) ? { ...p, active: data.active } : p
        );
      } else {
        // Nếu chưa tồn tại, thêm mới vào danh sách
        return [...prev, { ...data }];
      }
    });
  };
  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      try {
        console.log(roleId);
        const res = await rolePermissionApi.listPermission(roleId ?? 1);
        const data = res.data?.data;
        if (data) {
          setRolePermission(data);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (roleId) fetchApi();
  }, [roleId]);
  // console.log(product);
  const handleSubmit = async () => {
    try {
      await rolePermissionApi.modifyPermission({
        chuc_vu_id: Number(roleId),
        quyen: listActive.map((v) => ({
          ...v,
          active: v.active ? 1 : 0,
        })),
      });
      showSuccessAlert("Thêm dữ liệu thành công!");
    } catch (error: any) {
      showErrorAlert(error.message);
    }
  };
  return (
    <>
      <div>
        <div className="grid grid-cols-4 gap-4">
          {rolePermission.length > 0 &&
            rolePermission.map((p, index) => (
              <Collapsible defaultOpen={true} key={index}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between text-primary p-4 bg-white border w-full rounded-t-md">
                    <div className="flex gap-2">
                      <CircleAlert />
                      <span className="font-bold">{p.hien_thi_menu}</span>
                    </div>
                    <ChevronDown />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="w-full">
                  <div className="p-4 bg-white border w-full space-y-4 rounded-b-md">
                    {p.quyen.length > 0 &&
                      p.quyen.map((v) => (
                        <div key={v.ID} className="space-x-2 flex items-center">
                          <Checkbox
                            defaultChecked={!!v.trang_thai}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange({
                                ID: v.ID,
                                active: Boolean(checked),
                              })
                            }
                          />
                          <Label className="text-sm">{v.ten}</Label>
                        </div>
                      ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
        </div>
        <div className="fixed bottom-5 right-5 space-x-2 z-50">
          <Link to={"/chuc-vu"}>
            <Button type="button" className="bg-black/80 hover:bg-black">
              Đóng
            </Button>
          </Link>

          <Button type="button" onClick={handleSubmit}>
            Lưu
          </Button>
        </div>
      </div>
      {loading && <Loader />}
    </>
  );
};

export default Permission;
