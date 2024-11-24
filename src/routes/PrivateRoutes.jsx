import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Header from "../Pages/Header";

const PrivateRoutes = ({ isAdmin = false }) => {
  const { auth } = useAuth();

  if (!auth) {
    // Redirect to login if the user is not authenticated

    return (
      <>
        <div className="bg-[#F5F3FF] min-h-screen">
          <div className="container mx-auto py-3">
            <Navigate to="/login" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header only for user routes */}
      <div className="bg-[#F5F3FF] min-h-screen">
        <div className="container mx-auto py-3">{!isAdmin && <Header />}</div>
        <Outlet />
      </div>
    </>
  );
};

export default PrivateRoutes;
