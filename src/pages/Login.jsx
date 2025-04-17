"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/components/Provider/auth-provider";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(
        formData.identifier,
        formData.password,
        userType
      );

      if (result.success) {
        switch (userType) {
          case "student":
            navigate("/student/dashboard");
            break;
          case "teacher":
            navigate("/teacher/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/student/dashboard");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid credentials. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginBackdrop relative flex min-h-screen items-center justify-center bg-gray-100">
      <div className="absolute top-2 left-2 p-4 text-white bg-black/60 backdrop-blur-md rounded-3xl shadow-md">
        <h1 className="text-4xl font-bold uppercase">
          <span className="text-[#FF6F61]">Neo</span>Sankalp
        </h1>
        <span className="text-xl font-semibold flex items-center gap-2 mt-2">
          <img
            src="https://img.gothru.org/7590/713210828578875866/overlay/assets/20230707062613.Ir0yij.png?save=optimize"
            alt=""
            className="w-8 h-8 p-1 bg-white rounded-sm"
          />
          Tips Dwarka
        </span>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in to ERP</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userType">Login As</Label>
              <RadioGroup
                defaultValue="student"
                onValueChange={(value) => {
                  setUserType(value);
                  setFormData((prev) => ({ ...prev, identifier: "" }));
                }}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <Label htmlFor="teacher">Teacher</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">Admin</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="identifier">
                {userType === "student" ? "Enrollment Number" : "Email"}
              </Label>
              <Input
                id="identifier"
                type={userType === "student" ? "number" : "email"}
                value={formData.identifier}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    identifier: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <LoadingSpinner className="mr-2" /> : null}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
