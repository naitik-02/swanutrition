"use client";
import React, { useState, useEffect } from "react";
import { Home, X } from "lucide-react";
import { useUser } from "@/context/user";
import { useUI } from "@/context/uiContext";
import { useRouter } from "next/navigation";

const LoginModal = () => {
  const { loginOpen, setLoginOpen } = useUI();

  const [step, setStep] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

  const { requestOtp, verifyOtp, btnLoading, userLoading, isAuth, user } =
    useUser();

  const router = useRouter();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetAndClose = () => {
    setLoginOpen(false);
    setStep("mobile");
    setMobile("");
    setOtp("");
    setCountdown(0);
  };

  const handleContinue = async () => {
    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    const otp = await requestOtp(mobile);
    if (otp) {
      setStep("otp");
      alert(`Otp: ${otp}`);
      setCountdown(300);
    }
  };

  const handleLogin = async () => {
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    const res = await verifyOtp(mobile, otp, router);
    if (!res?.success) {
      setOtp("");
    } else {
      resetAndClose();
    }
  };

  const handleBack = () => {
    setStep("mobile");
    setOtp("");
    setCountdown(0);
  };

  useEffect(() => {
    if (user && isAuth) {
      resetAndClose();
    }
  }, [user, isAuth]);

  if (!loginOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div onClick={resetAndClose} className="absolute inset-0 bg-black/50" />

      <button
        onClick={resetAndClose}
        className="fixed top-4 right-4 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition z-50"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>

      <div className="relative w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm p-6 z-10">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Login</h1>
          <p className="text-sm text-gray-500">
            {step === "mobile"
              ? "Enter your mobile number to continue"
              : "Enter the OTP sent to your number"}
          </p>
        </div>

        {/* Form */}
        {step === "mobile" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                maxLength="10"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                placeholder="10-digit mobile number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleContinue}
              disabled={mobile.length !== 10 || btnLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white text-sm font-medium py-2.5 rounded-md transition"
            >
              {btnLoading ? "Sending OTP..." : "Continue"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleBack}
              className="text-sm text-gray-600 hover:text-gray-800 mb-2"
            >
              ← Back
            </button>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OTP
              </label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit OTP"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg tracking-widest font-semibold focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  {countdown > 0
                    ? `Code expires in ${formatTime(countdown)}`
                    : "Code expired"}
                </p>
                <button
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium disabled:text-gray-400"
                  onClick={handleContinue}
                  disabled={btnLoading || countdown > 0}
                >
                  Resend OTP
                </button>
              </div>
            </div>
            <button
              onClick={handleLogin}
              disabled={otp.length !== 6 || btnLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white text-sm font-medium py-2.5 rounded-md transition"
            >
              {btnLoading ? "Verifying..." : "Verify & Login"}
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-6">
          By continuing, you agree to our{" "}
          <a href="#" className="text-orange-600 hover:underline">
            Terms
          </a>{" "}
          &{" "}
          <a href="#" className="text-orange-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
