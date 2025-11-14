// import {useState} from "react"
// import Header from "./Components/Header.jsx";
// import Body from "./Components/Body.jsx";
// import Footer from "./Components/Footer.jsx";
// import { Toaster } from "@/components/ui/toaster";

// function App(){
//   const [activeTab,setActiveTab]=useState("TA Dashboard")
//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <Header activeTab={activeTab} setActiveTab={setActiveTab}/>
//       <div className="grow">
//         <Body activeTab={activeTab} />
//       </div>
//       <Footer />
//       <Toaster />
//     </div>
//   )
// }

// export default App;
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header.jsx";
import Footer from "./Components/Footer.jsx";
import Body from "./Components/Body.jsx";

import LoginPage from "./auth/Login.jsx";
import SignupPage from "./auth/Signup.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const [activeTab, setActiveTab] = useState("TA Dashboard");

  return (
    <>
      <Routes>
        {/* Public Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Pages */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Header activeTab={activeTab} setActiveTab={setActiveTab} />
              <Body activeTab={activeTab} />
              <Footer />
              <Toaster />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
