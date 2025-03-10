"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { Toaster, toast } from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) setUser(data.user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await fetch("/api/admin/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName, id: user._id}),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success(data.message);
      setUser(data.user);
      setShowNameModal(false);
    } else {
      toast.error(data.message || "Cập nhật tên thất bại. Hãy thử lại!");
    }
  };

  const handleChangePassword = async () => {
    if ( !passwords.newPassword || !passwords.confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải chứa ít nhất 6 ký tự!");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await fetch("/api/admin/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({id: user._id, password: passwords.newPassword}),
    });

    const data = await response.json();
    if (response.ok) {
      toast.success("Đổi mật khẩu thành công!");
      setShowPasswordModal(false);
    } else {
      toast.error(data.message || "Đổi mật khẩu thất bại. Hãy thử lại!");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Đang tải...</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-green-700 px-4">
      <Toaster position="top-right" />
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Thông tin cá nhân</h2>
        {user ? (
          <>
            <div className="flex flex-col items-center mb-4">
              <Image
                src={user.avatar || "/default-avatar-Photoroom.png"}
                alt="Avatar"
                width={100}
                height={100}
                className="rounded-full border-4 border-green-500 shadow-lg"
              />
              <h3 className="mt-3 text-xl font-semibold text-gray-700">{user.name}</h3>
              <span className="flex items-center gap-2 text-lg font-medium">
                <FontAwesomeIcon icon={faCircle} className={user?.isLogged ? "text-green-500" : "text-gray-400"} />
                {user?.isLogged ? "Online" : "Offline"}
              </span>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="text-left space-y-2">
              <p className="text-gray-700 text-lg"><strong>Kinh nghiệm:</strong> {user.experience} XP</p>
            </div>

            <button
              onClick={() => setShowNameModal(true)}
              className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition font-semibold mt-5"
            >
              Cập nhật tên
            </button>

            <button
              onClick={() => router.push('/profile/history')}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold mt-3"
            >
              Xem lịch sử bài làm
            </button>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition font-semibold mt-3"
            >
              Đổi mật khẩu
            </button>
          </>
        ) : (
          <p className="text-gray-700 text-lg">Không tìm thấy thông tin người dùng.</p>
        )}
      </div>

      {showNameModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Cập nhật tên</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="newName"
                placeholder="Tên mới"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                onChange={(e) => setNewName(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={handleUpdate}
                className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition font-semibold"
              >
                Cập nhật tên
              </button>
              <button
                type="button"
                onClick={() => setShowNameModal(false)}
                className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition font-semibold mt-3"
              >
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Đổi mật khẩu</h2>
            <form className="space-y-4">
              <input
                type="password"
                name="newPassword"
                placeholder="Mật khẩu mới"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu mới"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={handleChangePassword}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold"
              >
                Đổi mật khẩu
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition font-semibold mt-3"
              >
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}