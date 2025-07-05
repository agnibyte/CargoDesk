import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { loginValidation } from "@/utilities/validations/auth";

export default function LoginWrapper() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [formData, setFormData] = useState({
    email_id: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [section, setSection] = useState("login"); // for future register toggle
  const [validation, setValidation] = useState({});

  useEffect(() => {
    const temp = {
      email_id: register("email_id", loginValidation.email_id),
      password: register("password", loginValidation.password),
    };

    setValidation(temp);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setValue(name, newValue, { shouldValidate: true });
  };

  const onSubmit = async () => {
    setLoading(true);
    setApiError("");

    try {
      const response = await axios.post("/api/login", formData);
      console.log("Login success:", response.data);
      // handle auth token or redirect
    } catch (err) {
      setApiError("Invalid email_id or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <div className="background-image"></div>

      <div className="max-w-sm w-full bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {section == "login" ? "Login" : "Register"}
        </h2>

        {section == "login" ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Email */}
            <div className="relative border-b-2 border-white/30">
              <input
                {...validation.email_id}
                type="text"
                name="email_id"
                id="email_id"
                value={formData.email_id}
                onChange={handleChange}
                placeholder=" "
                // required
                autoComplete="email_id"
                className="w-full bg-transparent outline-none text-white placeholder-transparent peer h-10"
                // {...register("email_id", { required: "Email is required" })}
              />
              <label className="absolute left-0 top-2 text-white/70 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-focus:top-[-20px] peer-focus:text-sm peer-focus:text-white peer-valid:top-[-20px] peer-valid:text-sm peer-valid:text-white">
                Email
              </label>
              {errors.email_id && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email_id.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative border-b-2 border-white/30">
              <input
                {...validation.password}
                id="password"
                name="password"
                type="text"
                placeholder="Password"
                // required
                className="w-full bg-transparent outline-none text-white placeholder-transparent peer h-10"
                autoComplete="false"
                {...register("password", { required: "Password is required" })}
                value={formData.password}
                onChange={handleChange}
              />
              <label className="absolute left-0 top-2 text-white/70 text-sm transition-all peer-placeholder-shown:top-2.5  peer-placeholder-shown:text-base  peer-placeholder-shown:text-white/50  peer-focus:top-[-20px]  peer-focus:text-sm  peer-focus:text-white  peer-valid:top-[-20px]  peer-valid:text-sm  peer-valid:text-white">
                Password
              </label>
              {errors.email_id && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot */}
            <div className="flex items-center justify-between text-sm text-white/80">
              {/* <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="accent-white"
              />
              <span>Remember me</span>
            </label> */}
              <a
                href="#"
                className="hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* API Error */}
            {apiError && (
              <p className="text-red-400 text-center text-sm">{apiError}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-2 rounded hover:bg-opacity-80 transition cursor-pointer"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            {/* Register Link */}
            <p className="text-center text-white/80 text-sm mt-6 cursor-default">
              Don&apos;t have an account?{" "}
              <button
                className="underline hover:text-white cursor-pointer"
                onClick={() => setSection("register")}
              >
                Register
              </button>
            </p>
          </form>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-4 cursor-default">
              Please contact Administrator.
            </h3>

            <button
              className="w-full bg-white text-black font-semibold py-2 rounded hover:bg-opacity-80 transition"
              onClick={() => setSection("login")}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
