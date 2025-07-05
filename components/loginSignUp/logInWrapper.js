import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function LoginWrapper() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");

    try {
      const response = await axios.post("/api/login", data);
      console.log("Login success:", response.data);
      // redirect or set auth token here
    } catch (err) {
      setApiError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 ">
      <div class="background-image"></div>

      <div className="max-w-sm w-full bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Email */}
          <div className="relative border-b-2 border-white/30">
            <input
              type="email"
              placeholder=" "
              required
              className="w-full bg-transparent outline-none text-white placeholder-transparent peer h-10"
              autoComplete="false"
              {...register("email", { required: "Email is required" })}
            />
            <label
              className="absolute left-0 top-2 text-white/70 text-sm transition-all
    peer-placeholder-shown:top-2.5 
    peer-placeholder-shown:text-base 
    peer-placeholder-shown:text-white/50 
    peer-focus:top-[-20px] 
    peer-focus:text-sm 
    peer-focus:text-white 
    peer-valid:top-[-20px] 
    peer-valid:text-sm 
    peer-valid:text-white"
    placeholder="Email"
            >
              Email
            </label>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative border-b-2 border-white/30">
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent outline-none text-white placeholder-transparent peer h-10"
              {...register("password", { required: "Password is required" })}
            />
            <label className="absolute left-0 top-2 text-white/70 text-sm transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-focus:top-[-20px] peer-focus:text-sm peer-focus:text-white peer-valid:top-[-20px] ">
              Password
            </label>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot */}
          <div className="flex items-center justify-between text-sm text-white/80">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="accent-white"
              />
              <span>Remember me</span>
            </label>
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
            className="w-full bg-white text-black font-semibold py-2 rounded hover:bg-opacity-80 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          {/* Register */}
          <p className="text-center text-white/80 text-sm mt-6">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="underline hover:text-white"
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
