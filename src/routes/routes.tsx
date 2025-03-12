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

function AppRouter() {
  const routes = [
    {
      path: "/",
      element: (
        <PrivateRoute>
          <DefaultLayout />
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
                <ProductType />
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
                <Unit />
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
                <DiscountType />
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
                <WarrantyTime />
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
                <Employee />
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
                <Warehouse />
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
                <Customer />
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
                    <Distributor />
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
                    <AddDistributor />
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
                    <EditDistributor />
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
                    <ImportWarehouse />
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
                    title="Nhập kho"
                  >
                    <AddImportWarehouse />
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
  ];

  return useRoutes(routes);
}

export default AppRouter;
