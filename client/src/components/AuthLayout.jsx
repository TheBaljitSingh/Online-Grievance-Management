import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex ">
      {/* Left Side (Green Background) */}
      <div className="w-1/3 bg-green-500 text-white flex flex-col justify-center items-center p-8">
        <h1 className="text-2xl font-bold">Grievance Portal</h1>
        <p className="mt-4 text-center">
          Welcome to the Grievance Management System. Simplifying grievance submission and tracking.
        </p>
      </div>

      {/* Right Side (Main Content) */}
      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <main className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
