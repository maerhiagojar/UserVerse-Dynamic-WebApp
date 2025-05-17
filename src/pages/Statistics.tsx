
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import DataVisualizations from "@/components/DataVisualizations";

const Statistics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is admin, otherwise redirect
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (!user.isAdmin) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (!user || !user.isAdmin) return null;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Platform statistics and data visualizations</p>
          </header>
          
          <DataVisualizations />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
