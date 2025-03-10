"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
  
    const data = await response.json();
  
    if (response.ok) {
      localStorage.setItem("token", data.token);
      toast.success("Đăng nhập thành công! Đang chuyển hướng...");
      
  
      setLoading(true); 
      setTimeout(() => router.push("/"), 2000);
    } else {
      setLoading(false);
      toast.error(data.message || "Đăng nhập thất bại. Hãy thử lại!");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-700 to-green-500">
      <Toaster position="top-right" />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={loading} // Ngăn người dùng bấm lại sau khi đăng nhập
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

        </form>
        <p className="mt-4 text-gray-600 text-sm">
          Chưa có tài khoản? <a href="/register" className="text-green-500 hover:underline">Đăng ký</a>
        </p>
      </div>
    </div>
  );
}
