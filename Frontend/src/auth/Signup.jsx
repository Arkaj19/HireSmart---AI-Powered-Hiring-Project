import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
// import Header from "@/Components/Header";
import Footer from "@/Components/common/Footer";
import { User, Briefcase, Mail, Hash, Phone, Lock, Image, UserPlus, Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    designation: "",
    email: "",
    employeeId: "",
    password: "",
    phone: "",
    file: null,
  });

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const fileChange = (e) => setForm({ ...form, file: e.target.files?.[0] || null });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData();
    for (const key in form) {
      if (form[key]) fd.append(key, form[key]);
    }

    const res = await register(fd);
    if (res.success) navigate("/login");
    else setError(res.message);

    setLoading(false);
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

      <div className="flex justify-center items-center flex-1 px-4 py-8">
        <Card className="w-full max-w-2xl bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
          
          {/* Decorative top border */}
          <div className="h-1.5 bg-gradient-to-r from-black via-neutral-700 to-black"></div>
          
          {/* Top Badge */}
          <div className="flex justify-center mt-8 mb-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-100 border border-neutral-200 text-neutral-900 rounded-full text-sm font-medium shadow-sm">
              <UserPlus className="h-4 w-4" />
              Get Started
            </div>
          </div>

          {/* Page Title */}
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold text-black">
              Create Account
            </CardTitle>
          </CardHeader>

          {/* FORM */}
          <CardContent className="px-8 pb-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 text-center font-medium">{error}</p>
              </div>
            )}

            <form className="space-y-5 mt-6" onSubmit={submit}>
              
              {/* NAME & DESIGNATION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-neutral-900 font-semibold text-sm flex items-center gap-2">
                    <div className="p-1 bg-neutral-100 rounded">
                      <User className="h-3.5 w-3.5 text-black" />
                    </div>
                    Full Name
                  </Label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={change}
                    placeholder="Enter your name"
                    className="h-12 border-neutral-300 focus:border-black focus:ring-black bg-white rounded-lg transition-all duration-200 hover:border-neutral-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-neutral-900 font-semibold text-sm flex items-center gap-2">
                    <div className="p-1 bg-neutral-100 rounded">
                      <Briefcase className="h-3.5 w-3.5 text-black" />
                    </div>
                    Designation
                  </Label>
                  <Input
                    name="designation"
                    value={form.designation}
                    onChange={change}
                    placeholder="Your role"
                    className="h-12 border-neutral-300 focus:border-black focus:ring-black bg-white rounded-lg transition-all duration-200 hover:border-neutral-400"
                  />
                </div>
              </div>

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
                  placeholder="Enter your email"
                  className="h-12 border-neutral-300 focus:border-black focus:ring-black bg-white rounded-lg transition-all duration-200 hover:border-neutral-400"
                />
              </div>

              {/* EMPLOYEE ID & PHONE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    placeholder="Your ID"
                    className="h-12 border-neutral-300 focus:border-black focus:ring-black bg-white rounded-lg transition-all duration-200 hover:border-neutral-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-neutral-900 font-semibold text-sm flex items-center gap-2">
                    <div className="p-1 bg-neutral-100 rounded">
                      <Phone className="h-3.5 w-3.5 text-black" />
                    </div>
                    Phone
                  </Label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={change}
                    placeholder="Your number"
                    className="h-12 border-neutral-300 focus:border-black focus:ring-black bg-white rounded-lg transition-all duration-200 hover:border-neutral-400"
                  />
                </div>
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
                    placeholder="Create a password"
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

              {/* PROFILE PICTURE */}
              <div className="space-y-2">
                <Label className="text-neutral-900 font-semibold text-sm flex items-center gap-2">
                  <div className="p-1 bg-neutral-100 rounded">
                    <Image className="h-3.5 w-3.5 text-black" />
                  </div>
                  Profile Picture
                  <span className="text-neutral-400 text-xs font-normal">(optional)</span>
                </Label>
                <Input
                  type="file"
                  onChange={fileChange}
                  accept="image/*"
                  className="h-12 border-neutral-300 focus:border-black focus:ring-black bg-white rounded-lg transition-all duration-200 hover:border-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-black hover:file:bg-neutral-200 cursor-pointer"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                disabled={loading}
                className="w-full h-12 bg-black hover:bg-neutral-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 mt-6"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </span>
                )}
              </Button>

            </form>
          </CardContent>

          {/* FOOTER */}
          <CardFooter className="flex justify-center text-sm pb-8 pt-4 border-t border-neutral-100">
            <span className="text-neutral-600">
              Already have an account?
              <Link className="font-semibold text-black ml-1 hover:opacity-70 hover:underline transition-opacity" to="/login">
                Sign in
              </Link>
            </span>
          </CardFooter>
        </Card>
      </div>

      <Footer />
    </div>
  );
}