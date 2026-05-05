import { Outlet, Link, useLocation } from "react-router";
import { useEvaluation } from "../context/EvaluationContext";
import { Button } from "./ui/button";
import { Toaster } from "./ui/sonner";
import {
  LayoutDashboard,
  UserPlus,
  LogIn,
  Upload,
  FileText,
  BarChart,
  LogOut
} from "lucide-react";

export const Layout = () => {
  const { isAuthenticated, logout, teacher } = useEvaluation();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/register", label: "Register", icon: UserPlus },
    { path: "/login", label: "Login", icon: LogIn },
    { path: "/upload-template", label: "Upload Template", icon: Upload },
    { path: "/upload-answers", label: "Upload Answers", icon: FileText },
    { path: "/results", label: "Results", icon: BarChart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <nav className="bg-white shadow-sm border-b">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-blue-600">
                AI Smart Evaluation System
              </h1>
              <div className="hidden md:flex space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                        location.pathname === item.path
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated && teacher && (
                <>
                  <span className="text-sm text-gray-600">
                    Welcome, {teacher.firstName} {teacher.lastName}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
