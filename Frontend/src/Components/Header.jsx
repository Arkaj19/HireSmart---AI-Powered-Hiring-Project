function Header({activeTab,setActiveTab}) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Hiring Automation Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage Candidates, Review Resumes, and Automate your Hiring Process</p>
          <div className="flex space-x-6 mt-4 border-b border-gray-200">
            {["candidates", "job descriptions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-medium ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <img src="gyansys-logo-black.png" alt="logo" className="w-60 h-auto" />
      </div>
    </div>
  );
}

export default Header;