import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <Card className="w-full max-w-lg p-2">
        <CardHeader>
          <CardTitle className="text-center">Create Account</CardTitle>
        </CardHeader>

        <CardContent>
          {error && <p className="text-red-600 mb-2">{error}</p>}

          <form className="space-y-4" onSubmit={submit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input name="name" value={form.name} onChange={change} />
              </div>
              <div>
                <Label>Designation</Label>
                <Input name="designation" value={form.designation} onChange={change} />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input name="email" value={form.email} onChange={change} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employee ID</Label>
                <Input name="employeeId" value={form.employeeId} onChange={change} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input name="phone" value={form.phone} onChange={change} />
              </div>
            </div>

            <div>
              <Label>Password</Label>
              <Input name="password" type="password" value={form.password} onChange={change} />
            </div>

            <div>
              <Label>Profile Picture (optional)</Label>
              <Input type="file" onChange={fileChange} />
            </div>

            <Button disabled={loading} className="w-full">
            {loading ? <Spinner className="mr-2" /> : "Create Account"}
            </Button>

          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          Already have an account? <Link className="text-blue-600 ml-1" to="/login">Sign in</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
