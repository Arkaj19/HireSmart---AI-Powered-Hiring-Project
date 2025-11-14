import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function Login() {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", employeeId: "", password: "" });
  const [error, setError] = useState(null);

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
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <Card className="w-full max-w-md p-2">
        <CardHeader>
          <CardTitle className="text-center text-xl">Sign In</CardTitle>
        </CardHeader>

        <CardContent>
          {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

          <form className="space-y-4" onSubmit={submit}>
            <div>
              <Label>Email</Label>
              <Input name="email" value={form.email} onChange={change} />
            </div>

            <div>
              <Label>Employee ID</Label>
              <Input name="employeeId" value={form.employeeId} onChange={change} />
            </div>

            <div>
              <Label>Password</Label>
              <Input name="password" type="password" value={form.password} onChange={change} />
            </div>

            <Button disabled={loading} className="w-full">
            {loading ? <Spinner className="mr-2" /> : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center text-sm">
          Don’t have an account? <Link className="text-blue-600 ml-1" to="/signup">Create one</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
