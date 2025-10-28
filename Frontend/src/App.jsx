import CandidatePanel from "./Components/CandidatePanel.jsx";
import CardStatus from "./Components/CardStatus.jsx"
import Header from "./Components/Header.jsx";
import Footer from "./Components/Footer.jsx";
import { Toaster } from "@/components/ui/toaster";

function App(){
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-grow">
        <CandidatePanel />
      </div>
      <Footer />
      <Toaster />
    </div>
  )
}

export default App;