import {useState} from "react"
import Header from "./Components/Header.jsx";
import Body from "./Components/Body.jsx";
import Footer from "./Components/Footer.jsx";

function App(){
  const [activeTab,setActiveTab]=useState("candidates")
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab}/>
      <div className="grow">
        <Body activeTab={activeTab} />
      </div>
      <Footer />
    </div>
  )
}

export default App;