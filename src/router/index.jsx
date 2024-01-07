import { createBrowserRouter,Outlet,Navigate } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Login from "../pages/Login";
import ManageAccounts from "../pages/ManageAccounts";
import DetailUser from "../pages/DetailUser";
import ManageClasses from "../pages/ManageClasses";

const AuthLayout = () => {
  if (!localStorage.getItem('token')) {
    return <Navigate to='/login' />;
  }
  return (
    <div className="w-full flex flex-col items-center">
      <Header />
      <div className="w-full mt-14 flex">
        <SideBar />
        <div className="ml-[260px] flex-1">
        <Outlet />

        </div>
      </div>
    </div>
  );
};
const NoAuthLayout = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <Header />
      <div className="mt-[56px]">
      <Outlet/>
    
      </div>
    </div>
  );
};

const RouterConfig = createBrowserRouter([
  {
    element: <NoAuthLayout />,
    children: [
      {
        element: <Login />,
        path: "/login",
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        element: <ManageAccounts />,
        path: "/",
      },
      {
        element: <DetailUser />,
        path: "/detail-user/:id",
      },

      {
        element: <ManageClasses/>,
        path: "/manage-classes",
      }
    ],
  },
]);

export default RouterConfig;
