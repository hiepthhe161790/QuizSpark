"use client";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Dialog } from "@headlessui/react";
import Sidebar from "@/app/Components/Admin/Sidebar";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`);
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
        } else {
          toast.error("Failed to fetch users");
        }
      } catch (error) {
        toast.error("Error fetching users");
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
        method: editingUser ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser ? { ...form, id: editingUser._id } : form),
      });
      const data = await response.json();
      if (response.ok) {
        if (editingUser) {
          setUsers(users.map((user) => (user._id === editingUser._id ? data.user : user)));
          toast.success("User updated successfully");
        } else {
          setUsers([...users, data.user]);
          toast.success("User created successfully");
        }
        setForm({ name: "", email: "", password: "", role: "user" });
        setEditingUser(null);
        setIsModalOpen(false);
      } else {
        toast.error(data.message || "Failed to save user");
      }
    } catch (error) {
      toast.error("Error saving user");
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email,password: user.password, role: user?.role || "guest" });
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  return (
    <div className="flex">
           <Sidebar /> 
    <div className="container mx-auto p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">User Management</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-5 py-2 rounded-lg mb-6 hover:bg-blue-600 transition"
      >
        + Add User
      </button>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user?.role || "Guest"}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-yellow-600 transition"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">{editingUser ? "Edit User" : "Create User"}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              required={!editingUser}
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
              {editingUser ? "Update User" : "Create User"}
            </button>
          </form>
          <button onClick={() => setIsModalOpen(false)} className="mt-3 text-gray-600">
            Cancel
          </button>
        </div>
      </Dialog>
    </div>
    </div>
  );
}
