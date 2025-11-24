import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/common/Header.jsx";
import Footer from "./Components/common/Footer.jsx";
import Body from "./Components/common/Body.jsx";

import LoginPage from "./auth/Login.jsx";
import SignupPage from "./auth/Signup.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import { Toaster } from "@/components/ui/toaster.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  const [activeTab, setActiveTab] = useState("TA Dashboard");

  return (
    <>
      <Toaster />
      <Routes>
        {/* Public Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* Protected Pages */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {/*Layout wrapper: full height + column */}
              <div className="min-h-screen flex flex-col ">
                <Header activeTab={activeTab} setActiveTab={setActiveTab} />
                {/* main content grows and pushes footer down */}
                <main>
                  <Body activeTab={activeTab} />
                </main>
                <Footer />
              </div>

              {/* <Toaster /> */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;

// import { useState } from "react";
// import { Routes, Route } from "react-router-dom";

// import AppLayout from "./layouts/AppLayout";
// import LoginPage from "./auth/Login";
// import SignupPage from "./auth/Signup";
// import ProtectedRoute from "./auth/ProtectedRoute";

// import Body from "./Components/Body";
// import { Toaster } from "@/components/ui/toaster";

// function App() {
//   const [activeTab, setActiveTab] = useState("TA Dashboard");

//   return (
//     <>
//       <Routes>

//         {/* PUBLIC (No Header, No Footer) */}
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />

//         {/* PROTECTED (With Header + Footer) */}
//         <Route
//           path="/"
//           element={
//             <ProtectedRoute>
//               <AppLayout>
//                 <Toaster />
//               </AppLayout>
//             </ProtectedRoute>
//           }
//         >
//           <Route
//             index
//             element={<Body activeTab={activeTab} setActiveTab={setActiveTab} />}
//           />
//         </Route>

//       </Routes>
//     </>
//   );
// }

// export default App;
