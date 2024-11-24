import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
function Logout() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const handleLogout = () => {
    setAuth({});
    navigate("/login");
  };
  return (
    <button
      className="px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors font-jaro"
      style={{ fontFamily: "Jaro" }}
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}

export default Logout;
