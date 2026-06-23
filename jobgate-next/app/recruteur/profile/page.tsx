"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import {
  FiSearch, FiBell, FiMail, FiHome, FiCalendar, FiUsers, FiBarChart2, FiAlignJustify,
  FiPlus, FiMenu, FiEye, FiX, FiClock, FiUser, FiMapPin, FiInfo, FiChevronRight,
  FiTrash, FiRotateCcw, FiHash, FiLogOut, FiStar, FiTrendingUp, FiActivity,
  FiUpload, FiLock, FiPhone, FiBriefcase, FiSave, FiArrowLeft
} from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import API from "@/services/api";
import type { User } from "@/types";

export default function ProfilePage() {
  const { logout } = useAuth("recruteur");
  const [showSidebar, setShowSidebar] = useState(false);
  const [token, setToken] = useState<string>("");
  
  // Local state for profile form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Password change state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token-login") ?? "";
    setToken(t);
    const stored = localStorage.getItem("user");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  // Fetch detailed profile on load
  useEffect(() => {
    if (!token) return;
    
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await API.get("/recruteur/profile/");
        const data = res.data;
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setEmail(data.email || "");
        setPhone(data.numero_telephone || "");
        setCompany(data.entreprise || "");
        setCurrentImage(data.image || null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Unable to load profile data.",
          confirmButtonColor: "#4f46e5"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "The new passwords do not match.",
        confirmButtonColor: "#4f46e5"
      });
      return;
    }

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("numero_telephone", phone);
      formData.append("entreprise", company);
      
      if (password) {
        formData.append("password", password);
      }
      
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await API.put("/recruteur/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const updatedUser = res.data;
      
      // Update local storage user key
      const userStored = {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        entreprise: updatedUser.entreprise
      };
      localStorage.setItem("user", JSON.stringify(userStored));
      setCurrentUser(userStored);

      // Clean password fields
      setPassword("");
      setConfirmPassword("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setCurrentImage(updatedUser.image);

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile information has been successfully saved.",
        confirmButtonColor: "#4f46e5"
      });
    } catch (err: any) {
      console.error("Error updating profile:", err);
      const errMsg = err.response?.data?.detail || "An error occurred during the update.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errMsg,
        confirmButtonColor: "#4f46e5"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const userInitials = currentUser
    ? `${currentUser.first_name?.[0] ?? ""}${currentUser.last_name?.[0] ?? ""}`.toUpperCase()
    : "J";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30 font-sans">
      
      {/* Sidebar */}
      <aside
        className={`w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex-shrink-0 fixed lg:sticky top-0 h-screen z-20 transition-all duration-300 transform flex flex-col ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 shadow-xl shadow-indigo-100/30`}
      >
        <div className="px-6 pt-7 pb-5">
          <img src="/logoJG.png" alt="Logo" className="h-20 w-auto" />
        </div>

        <nav className="flex-1 px-3 overflow-y-auto">
          <p className="px-4 text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-2">
            Menu
          </p>
          <ul className="space-y-1">
            <Link href="/recruteur">
              <motion.li
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl cursor-pointer transition-all duration-150"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-500 group-hover:from-indigo-100 group-hover:to-purple-100 group-hover:text-indigo-600 transition-all duration-150 shadow-sm">
                  <FiHome className="text-base" />
                </span>
                <span className="text-sm font-medium">Home</span>
              </motion.li>
            </Link>

            <Link href="/recruteur#forums">
              <motion.li
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl cursor-pointer transition-all duration-150"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-500 group-hover:from-indigo-100 group-hover:to-purple-100 group-hover:text-indigo-600 transition-all duration-150 shadow-sm">
                  <FiCalendar className="text-base" />
                </span>
                <span className="text-sm font-medium">Forums</span>
              </motion.li>
            </Link>
            
            <Link href="/statistics">
              <motion.li
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-150"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-500 group-hover:from-indigo-100 group-hover:to-purple-100 group-hover:text-indigo-600 transition-all duration-150 shadow-sm">
                  <FiBarChart2 className="text-base" />
                </span>
                <span className="text-sm font-medium">Statistics</span>
              </motion.li>
            </Link>

            <Link href="/recruteur/archive">
              <motion.li
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-indigo-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-150"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-500 group-hover:from-indigo-100 group-hover:to-purple-100 group-hover:text-indigo-600 transition-all duration-150 shadow-sm">
                  <FiTrash className="text-base" />
                </span>
                <span className="text-sm font-medium">Archive</span>
              </motion.li>
            </Link>

            <Link href="/recruteur/profile">
              <motion.li
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3 px-4 py-2.5 text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl transition-all duration-150"
              >
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 transition-all duration-150 shadow-sm">
                  <FiUser className="text-base" />
                </span>
                <span className="text-sm font-semibold">My Profile</span>
              </motion.li>
            </Link>
          </ul>
        </nav>

        <div className="px-3 pb-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-150"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 text-red-500 shadow-sm">
              <FiLogOut className="text-base" />
            </span>
            Logout
          </motion.button>
        </div>

        {/* User profile */}
        <div className="px-3 pb-5 pt-3 border-t border-gray-200/50">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-lg shadow-indigo-200 overflow-hidden">
              {previewUrl || currentImage ? (
                <img src={previewUrl || currentImage || ""} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                userInitials
              )}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-xs text-gray-800 break-words whitespace-normal leading-tight">{currentUser?.email}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Recruiter
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 transition-all duration-300 lg:ml-0 overflow-y-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between mb-8 gap-4 items-start">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <FiAlignJustify className="text-xl" />
            </button>
            <Link
              href="/recruteur"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 rounded-xl transition-all hover:text-indigo-600 hover:bg-indigo-50/50 group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Profile
            </h2>
            <p className="text-gray-500">Manage your account details and credentials.</p>
          </motion.div>
          
          <div className="w-10 h-10 hidden md:block" />
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            <p className="text-gray-500 mt-4 font-medium text-sm">Loading your profile...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Profile Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-indigo-100/30 border border-gray-100 p-6 md:p-8">
                
                {/* Image Section */}
                <div className="flex flex-col items-center pb-8 border-b border-gray-100">
                  <div 
                    onClick={handleImageClick}
                    className="relative w-28 h-28 rounded-full shadow-lg shadow-indigo-200/50 cursor-pointer overflow-hidden group border-4 border-white bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center"
                  >
                    {previewUrl || currentImage ? (
                      <img 
                        src={previewUrl || currentImage || ""} 
                        alt="Avatar Preview" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-indigo-500">{userInitials}</span>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FiUpload className="text-white text-xl" />
                    </div>
                  </div>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                  
                  <h3 className="text-lg font-bold text-gray-800 mt-4">
                    {firstName} {lastName}
                  </h3>
                  <p className="text-xs text-indigo-500 font-medium">{company || "Company not specified"}</p>
                  
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="mt-3 px-4 py-1.5 text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100/80 rounded-full font-semibold transition-all shadow-sm"
                  >
                    Change image
                  </button>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                  {/* First Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiUser className="text-sm" />
                      </div>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-gray-50/50 focus:bg-white border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:shadow-md rounded-2xl transition-all duration-200 text-sm text-gray-800"
                        placeholder="e.g. John"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiUser className="text-sm" />
                      </div>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-gray-50/50 focus:bg-white border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:shadow-md rounded-2xl transition-all duration-200 text-sm text-gray-800"
                        placeholder="e.g. Smith"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiMail className="text-sm" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-gray-50/50 focus:bg-white border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:shadow-md rounded-2xl transition-all duration-200 text-sm text-gray-800"
                        placeholder="e.g. john.smith@company.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiPhone className="text-sm" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-gray-50/50 focus:bg-white border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:shadow-md rounded-2xl transition-all duration-200 text-sm text-gray-800"
                        placeholder="e.g. +1 555 123 4567"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Company Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiBriefcase className="text-sm" />
                      </div>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-gray-50/50 focus:bg-white border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:shadow-md rounded-2xl transition-all duration-200 text-sm text-gray-800"
                        placeholder="e.g. JobGate Tech"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Change Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-indigo-100/30 border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                    <FiLock className="text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Change Password</h3>
                    <p className="text-xs text-gray-500">Leave these fields blank if you do not want to change your password.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiLock className="text-sm" />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-gray-50/50 focus:bg-white border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:shadow-md rounded-2xl transition-all duration-200 text-sm text-gray-800"
                        placeholder="••••••••"
                        minLength={6}
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FiLock className="text-sm" />
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-gray-50/50 focus:bg-white border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:shadow-md rounded-2xl transition-all duration-200 text-sm text-gray-800"
                        placeholder="••••••••"
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-2">
                <Link
                  href="/recruteur"
                  className="px-6 py-3 border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 font-medium transition-all text-sm shadow-sm"
                >
                  Cancel
                </Link>
                
                <motion.button
                  type="submit"
                  disabled={isSaving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-indigo-200 transition-all text-sm cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="text-base" />
                      Save changes
                    </>
                  )}
                </motion.button>
              </div>

            </form>
          </motion.div>
        )}
      </main>
    </div>
  );
}
