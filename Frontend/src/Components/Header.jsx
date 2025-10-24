function Header() {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Hiring Automation Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage Candidates, Review Resumes, and Automate your Hiring Process</p>
        </div>
        <img src="gyansys-logo-black.png" alt="logo" className="w-60 h-auto" />
      </div>
    </div>
  );
}

export default Header;