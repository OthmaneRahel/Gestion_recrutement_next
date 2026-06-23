"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiSave,
  FiArrowLeft,
  FiUpload,
  FiFileText,
  FiDownload,
  FiCheck,
  FiX
} from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import API from "@/services/api";

export default function TalentProfilePage() {
  const { isLoading: authLoading, user: authUser } = useAuth("talent");
  
  // Loading & Saving States
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile fields state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Avatar states
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CV states
  const [currentCvUrl, setCurrentCvUrl] = useState<string | null>(null);
  const [cvName, setCvName] = useState<string | null>(null);
  const [selectedCv, setSelectedCv] = useState<File | null>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  // Password change states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fetch detailed profile on load
  useEffect(() => {
    if (authLoading || !authUser) return;

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await API.get("/talent/profile/");
        const data = res.data;
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setEmail(data.email || "");
        setPhone(data.numero_telephone || "");
        setCurrentImage(data.image || null);
        setCurrentCvUrl(data.cv || null);
        setCvName(data.cv_name || null);
      } catch (err) {
        console.error("Error fetching candidate profile:", err);
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
  }, [authLoading, authUser]);

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

  const handleCvClick = () => {
    cvInputRef.current?.click();
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        Swal.fire({
          icon: "warning",
          title: "Invalid format",
          text: "Please select a PDF file only.",
          confirmButtonColor: "#4f46e5"
        });
        return;
      }
      setSelectedCv(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Required fields",
        text: "First name and last name are required.",
        confirmButtonColor: "#4f46e5"
      });
      return;
    }

    if (password && password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "New passwords do not match.",
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

      if (password) {
        formData.append("password", password);
      }

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      if (selectedCv) {
        formData.append("cv", selectedCv);
      }

      const res = await API.put("/talent/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const updatedUser = res.data;

      // Update local storage user key so Navbar updates immediately
      const userStored = {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name
      };
      localStorage.setItem("user", JSON.stringify(userStored));

      // Clean/Update local states
      setPassword("");
      setConfirmPassword("");
      setSelectedFile(null);
      setPreviewUrl(null);
      setSelectedCv(null);
      setCurrentImage(updatedUser.image);
      setCurrentCvUrl(updatedUser.cv);
      setCvName(updatedUser.cv_name);

      Swal.fire({
        icon: "success",
        title: "Profile updated",
        text: "Your profile information has been saved successfully.",
        confirmButtonColor: "#4f46e5"
      }).then(() => {
        window.location.reload();
      });

    } catch (err: any) {
      console.error("Error updating candidate profile:", err);
      const errMsg = err.response?.data?.detail || "An error occurred while saving updates.";
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

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FiUser className="h-6 w-6 text-primary/50" />
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500 font-medium animate-pulse">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/20 via-white to-purple-50/20 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Back to Dashboard Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <Link href="/user">
          <motion.span
            whileHover={{ x: -4 }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors cursor-pointer"
          >
            <FiArrowLeft className="text-base" />
            Back to dashboard
          </motion.span>
        </Link>
        <div className="mt-4">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple">
            My Candidate Profile
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your personal information, avatar, CV, and password.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & CV Card */}
        <div className="space-y-8 lg:col-span-1">
          
          {/* Avatar Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl shadow-gray-100/30 flex flex-col items-center">
            <h2 className="text-lg font-bold text-gray-800 mb-4 w-full text-left">Profile Picture</h2>
            
            <div className="relative group cursor-pointer mt-2" onClick={handleImageClick}>
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-purple/10 flex items-center justify-center border-2 border-dashed border-gray-300 group-hover:border-primary transition-all duration-300 overflow-hidden relative shadow-inner">
                {previewUrl || currentImage ? (
                  <img
                    src={previewUrl || currentImage || ""}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-primary">{initials}</span>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white">
                  <FiUpload className="text-2xl mb-1" />
                  <span className="text-xs font-semibold">Change</span>
                </div>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={handleImageClick}
              className="mt-5 px-4 py-2 text-sm font-semibold text-primary hover:text-primary-dark bg-primary/5 hover:bg-primary/10 rounded-xl transition-all duration-200"
            >
              Select an image
            </button>
            <p className="text-[11px] text-gray-400 mt-2 text-center">
              JPG, PNG or GIF files. Max size 2MB.
            </p>
          </div>

          {/* CV Section Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl shadow-gray-100/30">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Your CV</h2>
            
            {/* Hidden Input */}
            <input
              type="file"
              ref={cvInputRef}
              onChange={handleCvChange}
              accept="application/pdf"
              className="hidden"
            />

            {/* Selected CV file state */}
            {selectedCv ? (
              <div className="border-2 border-primary/30 bg-primary/5 rounded-2xl p-4 flex flex-col items-center text-center">
                <FiFileText className="text-4xl text-primary mb-2 animate-bounce" />
                <p className="text-sm font-semibold text-gray-800 truncate max-w-full">
                  {selectedCv.name}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {(selectedCv.size / (1024 * 1024)).toFixed(2)} MB - Ready to be saved
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCv(null)}
                  className="mt-3 flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-semibold"
                >
                  <FiX className="text-sm" /> Cancel
                </button>
              </div>
            ) : currentCvUrl ? (
              <div className="border border-green/30 bg-green/5 rounded-2xl p-4 flex flex-col items-center text-center">
                <FiFileText className="text-4xl text-green mb-2" />
                <p className="text-sm font-semibold text-gray-800 truncate max-w-full">
                  {cvName || "My_CV.pdf"}
                </p>
                <p className="text-[11px] text-green font-medium mt-1 flex items-center gap-1">
                  <FiCheck className="text-sm" /> Current CV online
                </p>
                
                <div className="mt-4 flex gap-2 w-full">
                  <a
                    href={currentCvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-green-700 bg-green/10 hover:bg-green/20 rounded-xl transition-all duration-200"
                  >
                    <FiDownload /> View / Download
                  </a>
                  <button
                    type="button"
                    onClick={handleCvClick}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                  >
                    Replace
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={handleCvClick}
                className="border-2 border-dashed border-gray-200 hover:border-primary/50 bg-gray-50/50 hover:bg-primary/5 rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300 group"
              >
                <FiUpload className="text-3xl text-gray-400 group-hover:text-primary transition-colors mb-2" />
                <p className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors">
                  Upload my CV
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PDF files only
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Profile details form & change password */}
        <div className="space-y-8 lg:col-span-2">
          
          {/* Personal Details Form */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-100/30">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FiUser className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Personal Information</h2>
                <p className="text-xs text-gray-400">Edit your contact details and identity information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-gray-800 bg-white"
                  placeholder="Your first name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-gray-800 bg-white"
                  placeholder="Your last name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FiMail />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-gray-800 bg-white"
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FiPhone />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-gray-800 bg-white"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-100/30">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple/10 flex items-center justify-center text-purple">
                <FiLock className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Security &amp; Password</h2>
                <p className="text-xs text-gray-400">Leave blank if you do not want to change your password</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-gray-800 bg-white"
                  placeholder="Min. 8 characters"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm text-gray-800 bg-white"
                  placeholder="Repeat the password"
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-purple text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200/50 hover:brightness-105 transition-all duration-200 disabled:opacity-50 text-sm cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving changes...
                </>
              ) : (
                <>
                  <FiSave className="text-base" />
                  Save changes
                </>
              )}
            </motion.button>
          </div>

        </div>

      </form>
    </div>
  );
}
