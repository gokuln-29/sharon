import { redirect } from "next/navigation";
import { Activity } from "lucide-react";
import { auth } from "@/auth";
import LoginForm from "./login-form";

export const metadata = { title: "Login — Sharon Physiotherapy" };

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 mb-4 shadow-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Sharon Physiotherapy</h1>
          <p className="text-sm text-slate-500 mt-1">OP Register Management System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-1">Sign in</h2>
          <p className="text-sm text-slate-500 mb-6">Enter your admin credentials</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
