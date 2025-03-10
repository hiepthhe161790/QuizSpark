"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      setLoading(false);
      
      if (response.ok) {
        toast.success("Đăng ký thành công! Đang chuyển hướng...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(data.message || "Đăng ký thất bại. Hãy thử lại!");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-700 to-green-500">
      <Toaster position="top-right" />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full py-2 text-white bg-green-700 rounded-lg hover:bg-green-800 transition font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
        <p className="mt-4 text-gray-600 text-sm">
          Đã có tài khoản? <a href="/login" className="text-green-500 hover:underline">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
}