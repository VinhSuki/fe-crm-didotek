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

function AppRouter() {
  const routes = [
    {
      path: "/",
      element: (
        // <PrivateRoute>
        <DefaultLayout />
        // </PrivateRoute>
        // <DefaultLayout />
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
          element: (
            <>
              <PageTitle title="sản phẩm" />
              <MainContent title="sản phẩm">
                <Product />
              </MainContent>
            </>
          ),
          children: [
            {
              path: "add",
              element: (
                <>
                  <PageTitle title="Thêm sản phẩm" />
                  <MainContent title="Thêm sản phẩm">
                    <Product />
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
              <PageTitle title="loại sản phẩm" />
              <MainContent title="loại sản phẩm">
                <ProductType />
              </MainContent>
            </>
          ),
        },
        {
          path: "/don-vi-tinh",
          element: (
            <>
              <PageTitle title="Đơn vị tính" />
              <MainContent title="Đơn vị tính">
                <Unit />
              </MainContent>
            </>
          ),
        },
        {
          path: "/loai-giam-gia",
          element: (
            <>
              <PageTitle title="Loại giảm giá" />
              <MainContent title="Loại giảm giá">
                <DiscountType />
              </MainContent>
            </>
          ),
        },
        {
          path: "/thoi-gian-bao-hanh",
          element: (
            <>
              <PageTitle title="Thời gian bảo hành" />
              <MainContent title="Thời gian bảo hành">
                <WarrantyTime />
              </MainContent>
            </>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: (
        <>
          <PageTitle title="Login" />
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
