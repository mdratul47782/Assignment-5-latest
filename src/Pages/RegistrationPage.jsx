import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import Logo from "../assets/logo.svg"
import logo2 from "../assets/logo-white.svg"
import Saly from "../assets/Saly-1.png"

function RegistrationPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const api = useAxios();
  const handleNavigate = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!fullName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const role = isAdmin ? "admin" : "user";

      const response = await api.post("http://localhost:5000/api/auth/register", {
        full_name: fullName,
        email,
        password,
        role,
      });

      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/login"); // Redirect to login page
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to register. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-gray-800">
      <div className="flex min-h-screen max-h-screen">
        {/* Left Side */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 h-full fixed left-0 top-0">
          <div className="text-white">
          <img src={logo2} className="h-8" alt="Logo" />
            <img
              src={Saly}
              alt="Illustration"
              className="mx-auto max-h-64 max-w-lg"
            />
            <h2 className="text-3xl font-bold mb-1">Sign Up Now</h2>
            <p className="text-xl mb-4 font-medium">
              Boost Your Learning Capabilities
            </p>
            <p className="mb-8 max-w-lg">
              Logging in unlocks your personal progress tracker, letting you
              evaluate your performance and see how you stack up against others.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="fixed right-0 top-0 w-full h-full lg:w-1/2 flex items-start xl:items-center justify-center p-6 lg:p-8 xl:p-12 overflow-y-auto">
          <div className="w-full max-w-lg">
            <h2 className="text-3xl font-bold mb-3 flex gap-2 items-center">
              <span>Welcome to</span>
              <img src={Logo} className="h-7" alt="Logo" />
            </h2>
            <h1 className="text-4xl font-bold mb-6">Sign Up</h1>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="Email address"
                />
              </div>

              {/* Password and Confirm Password */}
              <div className="flex gap-4">
                <div className="mb-6 flex-1">
                  <label htmlFor="password" className="block mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                    placeholder="Password"
                  />
                </div>

                <div className="mb-6 flex-1">
                  <label htmlFor="confirmPassword" className="block mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>

              {/* Register as Admin */}
              <div className="mb-6 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="admin"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="rounded-lg border border-gray-300"
                />
                <label htmlFor="admin">Register as Admin</label>
              </div>

              {/* Error Message */}
              {error && <div className="text-red-500 mb-4">{error}</div>}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-4 text-gray-400">
              <p className="text-center">
                Already have an account?{" "}
                <a href="/login" className="text-primary"
                 onClick={handleNavigate}>
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
