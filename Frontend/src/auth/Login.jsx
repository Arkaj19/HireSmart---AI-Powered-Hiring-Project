import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

// import Header from "@/Components/Header";
import Footer from "@/Components/common/Footer";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { Mail, Hash, Lock, LogIn, Sparkles, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", employeeId: "", password: "" });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(form);
    if (!res.success) setError(res.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-neutral-200 flex flex-col">
      {/* <Header /> */}

      {/* ⭐ TOP LOGO SECTION ⭐ */}
      <div className="w-full flex justify-center mt-10 mb-4">
        <img 
          src="/gyansys-logo-black.png" 
          alt="Company Logo" 
          className="h-16 object-contain opacity-90"
        />
      </div>

      <div className="flex justify-center items-center flex-1 px-4">
        <Card className="w-full max-w-md bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
          
          {/* Decorative top border */}
          <div className="h-1.5 bg-gradient-to-r from-black via-neutral-700 to-black"></div>
          
          {/* Top Badge */}
          <div className="flex justify-center mt-8 mb-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-100 border border-neutral-200 text-neutral-900 rounded-full text-sm font-medium shadow-sm">
              <Sparkles className="h-4 w-4" />
              Welcome Back
            </div>
          </div>

          {/* Page Title */}
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold text-black">
              Sign In
            </CardTitle>
            {/* <p className="text-neutral-600 text-sm mt-2">
              Access your dashboard and continue your journey
            </p> */}
          </CardHeader>

          {/* FORM */}
          <CardContent className="px-8 pb-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 text-center font-medium">{error}</p>
              </div>
            )}

            <form className="space-y-5 mt-6" onSubmit={submit}>
              
              {/* EMAIL */}
              <div className="space-y-2">
                <Label className="text-neutral-900 font-semibold text-sm flex items-center gap-2">
                  <div className="p-1 bg-neutral-100 rounded">
                    <Mail className="h-3.5 w-3.5 text-black" />
                  </div>
                  Email Address
                </Label>
                <Input
                  name="email"
                  value={form.email}
                  onChange={change}
                  placeholder="Enter the Email"
                  className="h-12 border-neutral-300 focus:border-black focus:ring-black bg-white rounded-lg transition-all duration-200 hover:border-neutral-400"
                />
              </div>

              {/* EMPLOYEE ID */}
              <div className="space-y-2">
                <Label className="text-neutral-900 font-semibold text-sm flex items-center gap-2">
                  <div className="p-1 bg-neutral-100 rounded">
                    <Hash className="h-3.5 w-3.5 text-black" />
                  </div>
                  Employee ID
                </Label>
                <Input
                  name="employeeId"
                  value={form.employeeId}
                  onChange={change}
                  placeholder="Enter Employee ID"
                  className="h-12 border-neutral-300 focus:border-black focus:ring-black bg-white rounded-lg transition-all duration-200 hover:border-neutral-400"
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label className="text-neutral-900 font-semibold text-sm flex items-center gap-2">
                  <div className="p-1 bg-neutral-100 rounded">
                    <Lock className="h-3.5 w-3.5 text-black" />
                  </div>
                  Password
                </Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={change}
                    placeholder="Enter Password"
                    className="h-12 border-neutral-300 focus:border-black focus:ring-black bg-white rounded-lg transition-all duration-200 hover:border-neutral-400 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded transition-all"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                disabled={loading}
                className="w-full h-12 bg-black hover:bg-neutral-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 mt-6"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </span>
                )}
              </Button>

            </form>
          </CardContent>

          {/* FOOTER */}
          <CardFooter className="flex justify-center text-sm pb-8 pt-4 border-t border-neutral-100">
            <span className="text-neutral-600">
              Don't have an account?
              <Link className="font-semibold text-black ml-1 hover:opacity-70 hover:underline transition-opacity" to="/signup">
                Create one
              </Link>
            </span>
          </CardFooter>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
