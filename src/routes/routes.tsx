import Loader from "@/components/common/Loader";
import PageTitle from "@/components/common/PageTitle";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Login from "@/pages/Login";
import { ComponentType, lazy, ReactNode, Suspense } from "react";
import { useRoutes } from "react-router-dom";
import PublicRoute from "@/components/common/PublicRoute";
import PrivateRoute from "@/components/common/PrivateRoute";

const Loadable = <P extends object>(
  Component: ComponentType<P>
): React.FC<P> => {
  return (props: P): ReactNode => (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );
};

// const InfoPersonal = Loadable(lazy(() => import('@/pages/InfoPersonal')))

function AppRouter() {
  const routes = [
    {
      path: "/",
      element: (
        <PrivateRoute>
          <DefaultLayout />
        </PrivateRoute>
        // <DefaultLayout />
      ),
      children: [
        {
          path: "/",
          index: true,
          element: (
            <>
              <PageTitle title="Dashboard" />
              {/* <Dashboard /> */}
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
