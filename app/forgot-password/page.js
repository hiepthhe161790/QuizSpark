"use client";
import { Toaster, toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast("Hiện tại quên mật khẩu đang trong quá trình phát triển.\nVui lòng liên hệ admin hoặc giảng viên để cấp lại mật khẩu.", {
      duration: 5000,
      position: "top-right",
      style: {
        background: "#ffcc00",
        color: "#000",
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-700 to-green-500">
      <Toaster />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quên mật khẩu</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Nhập email của bạn"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <button
            type="submit"
            className="w-full py-2 text-white bg-green-700 rounded-lg hover:bg-green-800 transition font-semibold"
          >
            Gửi yêu cầu
          </button>
        </form>
      </div>
    </div>
  );
}
