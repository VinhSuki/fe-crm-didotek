import Loader from "@/components/common/Loader";
import PageTitle from "@/components/common/PageTitle";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Login from "@/pages/Login";
import { ComponentType, lazy, ReactNode, Suspense } from "react";
import { useRoutes } from "react-router-dom";
import PublicRoute from "@/components/common/PublicRoute";
import PrivateRoute from "@/components/common/PrivateRoute";
import Home from "@/pages/Home";
import { MainContent } from "@/components/layout/Partials/MainContent";
import { useAuthContext } from "@/context/AuthContext";
import Page403 from "@/pages/403";
import WarehouseProvider from "@/context/WarehouseContext";

const Loadable = <P extends object>(
  Component: ComponentType<P>
): React.FC<P> => {
  return (props: P): ReactNode => (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );
};

const Product = Loadable(
  lazy(() => import("@/pages/ProductManagement/Product"))
);
const AddProduct = Loadable(
  lazy(() => import("@/pages/ProductManagement/Product/Add"))
);
const EditProduct = Loadable(
  lazy(() => import("@/pages/ProductManagement/Product/Edit"))
);
const ProductType = Loadable(
  lazy(() => import("@/pages/ProductManagement/ProductType"))
);
const Unit = Loadable(lazy(() => import("@/pages/ProductManagement/Unit")));
const DiscountType = Loadable(
  lazy(() => import("@/pages/ProductManagement/DiscountType"))
);
const WarrantyTime = Loadable(
  lazy(() => import("@/pages/ProductManagement/WarrantyTime"))
);
const Employee = Loadable(
  lazy(() => import("@/pages/EmployeeManagement/Employee"))
);
const Warehouse = Loadable(
  lazy(() => import("@/pages/WarehouseManagement/Warehouse"))
);
const Customer = Loadable(
  lazy(() => import("@/pages/PartnerManagement/Customer"))
);
const Distributor = Loadable(
  lazy(() => import("@/pages/PartnerManagement/Distributor"))
);
const AddDistributor = Loadable(
  lazy(() => import("@/pages/PartnerManagement/Distributor/Add"))
);
const EditDistributor = Loadable(
  lazy(() => import("@/pages/PartnerManagement/Distributor/Edit"))
);

const ImportWarehouse = Loadable(
  lazy(() => import("@/pages/WarehouseManagement/ImportWarehouse"))
);
const AddImportWarehouse = Loadable(
  lazy(() => import("@/pages/WarehouseManagement/ImportWarehouse/Add"))
);
const EditImportWarehouse = Loadable(
  lazy(() => import("@/pages/WarehouseManagement/ImportWarehouse/Edit"))
);

const ExportWarehouse = Loadable(
  lazy(() => import("@/pages/WarehouseManagement/ExportWarehouse"))
);
const AddExportWarehouse = Loadable(
  lazy(() => import("@/pages/WarehouseManagement/ExportWarehouse/Add"))
);
const EditExportWarehouse = Loadable(
  lazy(() => import("@/pages/WarehouseManagement/ExportWarehouse/Edit"))
);

const Role = Loadable(
  lazy(() => import("@/pages/EmployeeManagement/RolePermission"))
);

const Permission = Loadable(
  lazy(() => import("@/pages/EmployeeManagement/RolePermission/Permission"))
);

const Chat = Loadable(lazy(() => import("@/pages/Chat")));

function AppRouter() {
  const authMethod = useAuthContext();
  const routes = [
    {
      path: "/",
      element: (
        <PrivateRoute>
          <WarehouseProvider>
            <DefaultLayout />
          </WarehouseProvider>
        </PrivateRoute>
      ),
      children: [
        {
          path: "/",
          index: true,
          element: (
            <>
              <PageTitle title="Home" />
              <MainContent title="trang chủ">
                <Home />
              </MainContent>
            </>
          ),
        },
        {
          path: "/san-pham",
          children: [
            {
              path: "",
              element: (
                <>
                  <PageTitle title="Danh sách sản phẩm" />
                  <MainContent title="Quản lý sản phẩm">
                    <Product />
                  </MainContent>
                </>
              ),
            },
            {
              path: "them-moi",
              element: (
                <>
                  <PageTitle title="Thêm sản phẩm" />
                  <MainContent
                    title="Thêm sản phẩm"
                    breadcrumb={{
                      parent: { title: "Sản phẩm", url: "/san-pham" },
                      current: "Thêm mới",
                    }}
                  >
                    <AddProduct />
                  </MainContent>
                </>
              ),
            },
            {
              path: "cap-nhat/:productId",
              element: (
                <>
                  <PageTitle title="Cập nhật sản phẩm" />
                  <MainContent
                    title="Cập nhật sản phẩm"
                    breadcrumb={{
                      parent: { title: "Sản phẩm", url: "/san-pham" },
                      current: "Cập nhật",
                    }}
                  >
                    <EditProduct />
                  </MainContent>
                </>
              ),
            },
          ],
        },
        {
          path: "/loai-san-pham",
          element: (
            <>
              <PageTitle title="Danh sách loại sản phẩm" />
              <MainContent title="Quản lý loại sản phẩm">
                {authMethod?.checkPermission("view-loai-san-pham") ? (
                  <ProductType />
                ) : (
                  <Page403 />
                )}
              </MainContent>
            </>
          ),
        },
        {
          path: "/don-vi-tinh",
          element: (
            <>
              <PageTitle title="Danh sách đơn vị tính" />
              <MainContent title="Quản lý đơn vị tính">
                {authMethod?.checkPermission("view-don-vi-tinh") ? (
                  <Unit />
                ) : (
                  <Page403 />
                )}
              </MainContent>
            </>
          ),
        },
        {
          path: "/loai-giam-gia",
          element: (
            <>
              <PageTitle title="Danh sách loại giảm giá" />
              <MainContent title="Quản lý Loại giảm giá">
                {authMethod?.checkPermission("view-loai-giam-gia") ? (
                  <DiscountType />
                ) : (
                  <Page403 />
                )}
              </MainContent>
            </>
          ),
        },
        {
          path: "/thoi-gian-bao-hanh",
          element: (
            <>
              <PageTitle title="Danh sách thời gian bảo hành" />
              <MainContent title="Quản lý thời gian bảo hành">
                {authMethod?.checkPermission("view-thoi-gian-bao-hanh") ? (
                  <WarrantyTime />
                ) : (
                  <Page403 />
                )}
              </MainContent>
            </>
          ),
        },
        {
          path: "/nhan-vien",
          element: (
            <>
              <PageTitle title="Danh sách nhân viên" />
              <MainContent title="Quản lý nhân viên">
                {authMethod?.checkPermission("view-nhan-vien") ? (
                  <Employee />
                ) : (
                  <Page403 />
                )}
              </MainContent>
            </>
          ),
        },
        {
          path: "/kho",
          element: (
            <>
              <PageTitle title="Danh sách kho" />
              <MainContent title="Quản lý kho">
                {authMethod?.checkPermission("view-kho") ? (
                  <Warehouse />
                ) : (
                  <Page403 />
                )}
              </MainContent>
            </>
          ),
        },
        {
          path: "/khach-hang",
          element: (
            <>
              <PageTitle title="Danh sách khách hàng" />
              <MainContent title="Quản lý khách hàng">
                {authMethod?.checkPermission("view-khach-hang") ? (
                  <Customer />
                ) : (
                  <Page403 />
                )}
              </MainContent>
            </>
          ),
        },
        {
          path: "/nha-phan-phoi",
          children: [
            {
              path: "",
              element: (
                <>
                  <PageTitle title="Danh sách nhà phân phối" />
                  <MainContent title="Quản lý nhà phân phối">
                    {authMethod?.checkPermission("view-nha-phan-phoi") ? (
                      <Distributor />
                    ) : (
                      <Page403 />
                    )}
                  </MainContent>
                </>
              ),
            },
            {
              path: "them-moi",
              element: (
                <>
                  <PageTitle title="Thêm nhà phân phối" />
                  <MainContent
                    title="Thêm nhà phân phối"
                    breadcrumb={{
                      parent: { title: "Nhà phân phối", url: "/nha-phan-phoi" },
                      current: "Thêm mới",
                    }}
                  >
                    {authMethod?.checkPermission("create-nha-phan-phoi") ? (
                      <AddDistributor />
                    ) : (
                      <Page403 />
                    )}
                  </MainContent>
                </>
              ),
            },
            {
              path: "cap-nhat/:distributorId",
              element: (
                <>
                  <PageTitle title="Cập nhật nhà phân phối" />
                  <MainContent
                    title="Cập nhật nhà phân phối"
                    breadcrumb={{
                      parent: { title: "Nhà phân phối", url: "/nha-phan-phoi" },
                      current: "Cập nhật",
                    }}
                  >
                    {authMethod?.checkPermission("update-nha-phan-phoi") ? (
                      <EditDistributor />
                    ) : (
                      <Page403 />
                    )}
                  </MainContent>
                </>
              ),
            },
          ],
        },
        {
          path: "/nhap-kho",
          children: [
            {
              path: "",
              element: (
                <>
                  <PageTitle title="Danh sách hóa đơn nhập kho" />
                  <MainContent title="Quản lý hóa đơn nhập kho">
                    {authMethod?.checkPermission("view-hoa-don-nhap-kho") ? (
                      <ImportWarehouse />
                    ) : (
                      <Page403 />
                    )}
                  </MainContent>
                </>
              ),
            },
            {
              path: "them-moi",
              element: (
                <>
                  <PageTitle title="Nhập kho" />
                  <MainContent
                    title="Thêm nhập kho"
                    breadcrumb={{
                      parent: { title: "Nhập kho", url: "/nhap-kho" },
                      current: "Thêm mới",
                    }}
                  >
                    {authMethod?.checkPermission("create-hoa-don-nhap-kho") ? (
                      <AddImportWarehouse />
                    ) : (
                      <Page403 />
                    )}
                  </MainContent>
                </>
              ),
            },
            {
              path: "cap-nhat/:importWarehouseId",
              element: (
                <>
                  <PageTitle title="Cập nhật nhập kho" />
                  <MainContent
                    title="Cập nhật nhập kho"
                    breadcrumb={{
                      parent: { title: "Nhập kho", url: "/nhap-kho" },
                      current: "Cập nhật",
                    }}
                  >
                    {authMethod?.checkPermission("update-hoa-don-nhap-kho") ? (
                      <EditImportWarehouse />
                    ) : (
                      <Page403 />
                    )}
                  </MainContent>
                </>
              ),
            },
            // {
            //   path: "cap-nhat/:productId",
            //   element: (
            //     <>
            //       <PageTitle title="Cập nhật sản phẩm" />
            //       <MainContent
            //         title="Cập nhật sản phẩm"
            //         breadcrumb={{
            //           parent: { title: "Sản phẩm", url: "/san-pham" },
            //           current: "Cập nhật",
            //         }}
            //       >
            //         {authMethod?.checkPermission("update-") ? (
            //           <DiscountType />
            //         ) : (
            //           <Page403 />
            //         )}
            //       </MainContent>
            //     </>
            //   ),
            // },
          ],
        },
        {
          path: "/xuat-kho",
          children: [
            {
              path: "",
              element: (
                <>
                  <PageTitle title="Danh sách hóa đơn xuất kho" />
                  <MainContent title="Quản lý hóa đơn xuất kho">
                    {authMethod?.checkPermission("view-hoa-don-xuat-kho") ? (
                      <ExportWarehouse />
                    ) : (
                      <Page403 />
                    )}
                  </MainContent>
                </>
              ),
            },
            {
              path: "them-moi",
              element: (
                <>
                  <PageTitle title="Xuất kho" />
                  <MainContent title="Xuất kho">
                    {authMethod?.checkPermission("create-hoa-don-xuat-kho") ? (
                      <AddExportWarehouse />
                    ) : (
                      <Page403 />
                    )}
                  </MainContent>
                </>
              ),
            },
            {
              path: "cap-nhat/:exportWarehouseId",
              element: (
                <>
                  <PageTitle title="Cập nhật xuất kho" />
                  <MainContent
                    title="Cập nhật xuất kho"
                    breadcrumb={{
                      parent: { title: "Xuất kho", url: "/xuat-kho" },
                      current: "Cập nhật",
                    }}
                  >
                    {authMethod?.checkPermission("update-hoa-don-xuat-kho") ? (
                      <EditExportWarehouse />
                    ) : (
                      <Page403 />
                    )}
                  </MainContent>
                </>
              ),
            },
            // {
            //   path: "cap-nhat/:productId",
            //   element: (
            //     <>
            //       <PageTitle title="Cập nhật sản phẩm" />
            //       <MainContent
            //         title="Cập nhật sản phẩm"
            //         breadcrumb={{
            //           parent: { title: "Sản phẩm", url: "/san-pham" },
            //           current: "Cập nhật",
            //         }}
            //       >
            //         <EditProduct />
            //       </MainContent>
            //     </>
            //   ),
            // },
          ],
        },
        {
          path: "/chuc-vu",
          children: [
            {
              path: "",
              element: (
                <>
                  <PageTitle title="Danh sách chức vụ" />
                  <MainContent
                    title="Danh sách chức vụ"
                    subTitle="Quản lý chức vụ"
                  >
                    {authMethod?.checkPermission("view-chuc-vu") ? (
                      <Role />
                    ) : (
                      <Page403 />
                    )}
                  </MainContent>
                </>
              ),
            },
            {
              path: ":roleId/quyen-han",
              element: (
                <>
                  <PageTitle title="Quản lý quyền hạn" />
                  <MainContent
                    title="Chức vụ và quyền hạn"
                    subTitle="Quản lý quyền hạn"
                  >
                    <Permission />
                  </MainContent>
                </>
              ),
            },
          ],
        },
        {
          path: "/chat/:userId",
          children: [
            {
              path: "",
              element: (
                <>
                  <PageTitle title="Danh sách chat" />
                  <MainContent
                    title="Chat Room"
                  >
                    <Chat />
                  </MainContent>
                </>
              ),
            },
            {
              path: ":roleId/quyen-han",
              element: (
                <>
                  <PageTitle title="Quản lý quyền hạn" />
                  <MainContent
                    title="Chức vụ và quyền hạn"
                    subTitle="Quản lý quyền hạn"
                  >
                    <Permission />
                  </MainContent>
                </>
              ),
            },
          ],
        },
      ],
    },
    {
      path: "/dang-nhap",
      element: (
        <>
          <PageTitle title="Đăng nhập" />
          <PublicRoute>
            <Login />
          </PublicRoute>
        </>
      ),
    },
    {
      path: "/403",
      element: (
        <>
          <PageTitle title="Không thể truy cập" />
          <PublicRoute>
            <Page403 />
          </PublicRoute>
        </>
      ),
    },
  ];

  return useRoutes(routes);
}

export default AppRouter;
