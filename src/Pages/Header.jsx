import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import Logout from "../Components/common/Logout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
function Header() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const handleLogout = () => {

    setAuth({});
    navigate("/login");
  };
  return (
    <header className="flex justify-between items-center mb-12">
      <img src={logo} className="h-7" alt="Logo" />
      <div>
        <button
          className="px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors"
          style={{ fontFamily: "Jaro" }}
          onClick={handleLogout}
        >
          Login
        </button>
        <Logout />
      </div>
    </header>
  );
}

export default Header;
