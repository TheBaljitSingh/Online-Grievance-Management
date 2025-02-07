import { Link } from "react-router-dom";

const Unauthorize = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">403 Forbidden</h1>
        <p className="text-gray-600 mb-4">You need to log in to access this page.</p>
        <Link
          to="/login"
          className="bg-green-500 hover:bg-breen-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorize;
