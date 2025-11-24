// import { Button } from "@/components/ui/button";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { useAuth } from "@/context/AuthContext";
// import { LogOut, User } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// function Header({ activeTab, setActiveTab }) {
//   const navigate = useNavigate();
//   const { logout, loading } = useAuth();

//   const handleLogout = async () => {
//     await logout();
//   };

//   return (
//     <div className="bg-gray-900 px-8 py-4 shadow-md">
//       <div className="flex items-center justify-between">
//         {/* Left Section: Logo + App Info */}
//         <div className="flex flex-col">
//           <img
//             src="gyansys-logo-black.png"
//             alt="logo"
//             className="w-60 h-auto brightness-0 invert mb-2"
//           />
//           <div>
//             <h1 className="text-2xl font-semibold text-white">
//               HireSmart
//             </h1>
//             <p className="text-gray-300 text-sm mt-1">
//               AI Smart Hiring Dashboard
//             </p>
//           </div>
//         </div>

//         {/* Right Section: Tabs + Avatar grouped together */}
//         <div className="flex items-center gap-6">
//           {/* Navigation Tabs */}
//           <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
//             {["Resume Upload", "TA Dashboard", "JD Upload"].map((tab) => (
//               <Button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all ${activeTab === tab
//                     ? "bg-black text-white shadow-md"
//                     : "bg-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-700"
//                   }`}
//               >
//                 {tab}
//               </Button>
//             ))}
//           </div>

//           {/* Avatar / User Menu */}
//           <Popover>
//             <PopoverTrigger asChild>
//               <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400">
//                 <Avatar className="h-10 w-10 cursor-pointer">
//                   <AvatarImage src="/src/assets/icon.png" alt="User Avatar" />
//                   <AvatarFallback className="bg-gray-700 text-white">
//                     U
//                   </AvatarFallback>
//                 </Avatar>
//               </button>
//             </PopoverTrigger>

//             <PopoverContent className="w-48 bg-gray-800 text-white border border-gray-700 p-2">
//               <div className="flex flex-col space-y-1">
//                 <button
//                   onClick={() => navigate("/profile")}
//                   className="flex items-center gap-2 text-left px-3 py-2 hover:bg-gray-700 rounded transition-colors">
//                   <User className="h-4 w-4" />
//                   Profile
//                 </button>
//                 <button
//                   onClick={handleLogout}
//                   disabled={loading}
//                   className="flex items-center gap-2 text-left px-3 py-2 hover:bg-gray-700 rounded transition-colors text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <LogOut className="h-4 w-4" />
//                   {loading ? "Logging out..." : "Logout"}
//                 </button>
//               </div>
//             </PopoverContent>
//           </Popover>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Header;

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Header({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const { logout, loading, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // 🎯 Generate initials
  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // 🎨 Generate consistent color from name
  const getColorFromName = (name = "") => {
    const colors = ["#1E88E5", "#8E24AA", "#D81B60", "#43A047", "#FB8C00", "#6D4C41"];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  const initials = getInitials(user?.name);
  const bgColor = getColorFromName(user?.name);

  return (
    <div className="bg-gray-900 px-8 py-4 shadow-md">
      <div className="flex items-center justify-between">

        {/* Tabs... same as earlier */}
        
        <Popover>
          <PopoverTrigger asChild>
            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400">
              <Avatar className="h-10 w-10 cursor-pointer">
                {user?.profile?.photo ? (
                  <AvatarImage src={user.profile.photo} alt="User Avatar" />
                ) : (
                  <AvatarFallback style={{ backgroundColor: bgColor }} className="text-white font-semibold">
                    {initials || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-48 bg-gray-800 text-white border border-gray-700 p-2">
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 text-left px-3 py-2 hover:bg-gray-700 rounded transition-colors"
              >
                <User className="h-4 w-4" /> Profile
              </button>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="flex items-center gap-2 text-left px-3 py-2 hover:bg-gray-700 rounded transition-colors text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="h-4 w-4" /> {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default Header;