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
              {/*Layout wrapper: full height + column */}
              <div className="min-h-screen flex flex-col ">
                <Header activeTab={activeTab} setActiveTab={setActiveTab} />
                {/* main content grows and pushes footer down */}
                <main>
                  <Body activeTab={activeTab} />
                </main>
                <Footer />
              </div>

              <Toaster />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
