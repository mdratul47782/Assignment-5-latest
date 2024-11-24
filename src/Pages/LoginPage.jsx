import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg";
import Saly from "../assets/Saly-1.png";
import Field from "../Components/common/Field";
import { useAuth } from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";

export default function LoginPage() {
  const api = useAxios();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/registration");
  };

  const onSubmit = async (formData) => {
    try {
      console.log("Form Data Submitted:", formData);

      const response = await api.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      if (response.status === 200) {
        const { tokens, user } = response.data.data;

        if (tokens) {
          console.log("Login Successful:", { tokens, user });

          setAuth({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          });

          if (formData.admin) {
            console.log("Navigating to Dashboard (Admin Login)...");
            navigate("/Dashboard");
          } else {
            console.log("Navigating to Home...");
            navigate("/");
          }
        }
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response?.data?.message) {
        setError("root.serverError", {
          type: "serverError",
          message: error.response.data.message,
        });
      } else {
        setError("root.random", {
          type: "random",
          message: `User with email ${formData.email} is not found.`,
        });
      }
    }
  };

  return (
    <div className="bg-white text-gray-800 overflow-hidden min-h-screen flex">
      {/* Left side */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12 relative">
        <div className="text-white">
          <img src={Saly} alt="Illustration" className="mx-auto" />
          <h2 className="text-3xl font-bold mb-4">Sign in Now</h2>
          <p className="text-xl mb-4">Boost Your Learning Capabilities</p>
          <p className="mb-8">
            Logging in unlocks your personal progress tracker, letting you
            evaluate your performance and see how you stack up against others.
            Whether you're preparing for exams, improving your knowledge, or
            simply having fun, there's no better way to sharpen your mind.
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-8 flex gap-2 items-center">
            <span>Welcome to</span>
            <img src={Logo} className="h-7" alt="Logo" />
          </h2>
          <h1 className="text-5xl font-bold mb-8">Sign in</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <Field
              label="Enter your email"
              htmlFor="email"
              error={errors.email}
            >
              <input
                type="text"
                id="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300"
                placeholder="Email or email address"
                {...register("email", { required: "Email is required" })}
              />
            </Field>
            <p className="text-red-500">{errors?.root?.random?.message}</p>
            <p className="text-red-500">{errors?.root?.serverError?.message}</p>

            {/* Password Field */}
            <Field
              label="Enter your Password"
              htmlFor="password"
              error={errors.password}
            >
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300"
                placeholder="Password"
                {...register("password", { required: "Password is required" })}
              />
            </Field>

            {/* Admin Checkbox */}
            <div className="mb-6 flex gap-2 items-center">
              <input
                type="checkbox"
                id="admin"
                className="px-4 py-3 rounded-lg border border-gray-300"
                {...register("admin")}
              />
              <label htmlFor="admin" className="block">
                Login as Admin
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg mb-4"
            >
              Sign in
            </button>
          </form>

          <div className="text-center">
            <a href="#" className="text-primary">
              Forgot Password
            </a>
          </div>

          <div className="mt-8 text-center">
            <p>
              No Account?{" "}
              <a href="#" className="text-primary"
              onClick={handleNavigate}>
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
