import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-10">
      <div className="bg-white/80 backdrop-blur-lg w-full max-w-xl rounded-3xl shadow-xl p-10 relative border border-gray-200">
        
        {/* Profile Image */}
        <div className="flex justify-center -mt-20">
          <div className="h-32 w-32 rounded-full bg-white shadow-md border overflow-hidden flex items-center justify-center">
            {user?.profile?.photo ? (
              <img src={user.profile.photo} className="h-full w-full object-cover" />
            ) : (
              <span className="text-gray-500">No Image</span>
            )}
          </div>
        </div>

        {/* Name + Email */}
        <div className="text-center mt-6">
          <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-lg font-medium text-gray-700 mt-2">
            {user?.designation || "Designation not set"}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mt-10">
          <div className="bg-gray-50 p-4 rounded-xl border text-center shadow-sm">
            <h3 className="text-xs uppercase text-gray-500">Employee ID</h3>
            <p className="text-lg font-semibold text-gray-800 mt-1">{user?.employeeId}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border text-center shadow-sm">
            <h3 className="text-xs uppercase text-gray-500">Phone</h3>
            <p className="text-lg font-semibold text-gray-800 mt-1">{user?.phone}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button className="px-5 py-2 bg-black text-white rounded-xl shadow hover:bg-gray-800 transition">
            Edit Profile
          </button>
          <button className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl shadow hover:bg-gray-300 transition">
            Change Photo
          </button>
        </div>
      </div>
    </div>
  );
}
