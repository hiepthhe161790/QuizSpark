'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import useGlobalContextProvider from '../ContextApi';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from "react-hot-toast";

function Navbar() {
  const { userObject } = useGlobalContextProvider();
  const { user, setUser } = userObject;
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    } else {
      setIsUserLoading(false);
    }
  }, []);

  async function fetchUser(token) {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsUserLoading(false);
    }
  }

  async function handleLogout() {
    setIsLoading(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        localStorage.removeItem('token');
        setUser(null);
        toast.success("Đăng xuất thành công!");
        setTimeout(() => router.push('/'), 1500);
      } else {
        const data = await response.json();
        toast.error(data.message || "Đăng xuất thất bại!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng xuất!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <nav className="poppins mx-auto max-w-screen-xl p-4 sm:px-8 sm:py-5 lg:px-10">
      <div className="sm:flex sm:items-center sm:justify-between">
        
        {/* Logo */}
        <div className="text-center sm:text-left">
          <a className="flex gap-1 items-center">
            <Image
              src="/quizSpark_icon.png"
              alt="QuizSpark Logo"
              width={60}
              height={60}
            />
            <h2 className="text-2xl font-bold flex gap-2">
              Quiz <span className="text-green-700">Spark</span>
            </h2>
          </a>
        </div>

        {/* Chỉ hiển thị khi đã load xong user */}
        {!isUserLoading && (
          <div className="relative mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center ml-12">
            {user && user.isLogged && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
                >
                  <Image
                    src={user.avatar || "/default-avatar-Photoroom.png"} 
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  {user.name}{user.role === 'admin' && <span className="text-xs text-yellow-500">(Admin)</span>}{showDropdown ? ' ▲' : ' ▼'}
                </button>

                {/* Dropdown menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    {user.role === 'admin' && (
                      <a
                        href="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                       Quản lý tài khoản
                      </a>
                    )}
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Hồ sơ cá nhân
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}

            {!user?.isLogged && (
              <button
                className="bg-green-700 px-7 py-3 text-sm font-medium text-white rounded-lg hover:bg-green-800 transition"
                onClick={() => router.push('/login')}
              >
                Đăng nhập
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
