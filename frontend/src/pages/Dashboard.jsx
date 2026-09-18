import React from "react";

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-teal-700">Welcome to the Dashboard!</h1>
        <p className="text-slate-700 mb-6">This is a dummy dashboard page. More awesome features coming soon 🚀</p>
        <button className="bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-teal-800 transition">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Dashboard;