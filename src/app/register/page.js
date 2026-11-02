
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Register user
  const handleRegister = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const image = formData.image.trim();
    const password = formData.password;

    if (!name || !email || !image || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Password validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error(
        "Password must contain an uppercase letter."
      );
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error(
        "Password must contain a lowercase letter."
      );
      return;
    }

    // Photo URL validation
    try {
      const photoUrl = new URL(image);

      if (!["http:", "https:"].includes(photoUrl.protocol)) {
        toast.error("Please enter a valid photo URL.");
        return;
      }
    } catch {
      toast.error("Please enter a valid photo URL.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Registration successful!");

      router.push("/events");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-16">
      <Toaster position="top-right" richColors />

      <div className="card w-full max-w-lg border border-base-300 bg-base-100 shadow-xl">
        <div className="card-body p-7 md:p-10">

          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">
              Create an Account
            </h1>

            <p className="mt-3 text-base-content/70">
              Join CareConnect and make a difference.
            </p>
          </div>

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block font-medium"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                className="input w-full"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-medium"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                className="input w-full"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            {/* Photo URL */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block font-medium"
              >
                Photo URL
              </label>

              <input
                id="image"
                type="url"
                name="image"
                placeholder="https://example.com/photo.jpg"
                className="input w-full"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-medium"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create a password"
                className="input w-full"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={6}
                required
              />

              <p className="mt-2 text-xs text-base-content/60">
                At least 6 characters with one uppercase
                and one lowercase letter.
              </p>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating Account...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-5 text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </section>
  );
}
