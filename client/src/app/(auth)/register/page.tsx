import RegisterForm from "@/app/(auth)/register/register-form";
import React from "react";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-2">Register Form</h1>
      <div className="w-full max-w-md p-8 rounded-lg shadow-md">
        <RegisterForm />
      </div>
    </div>
  );
}
