import { Search } from "lucide-react";
import CandidateFilter from "./CandidateFilter";

export default function CandidateSearch({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }) {
    return (
        <div className="px-6 py-5 border-b border-gray-200  from-gray-50 to-white">
            <div className="flex flex-row justify-between items-center gap-4">
                {/* Search bar with icon */}
                <div className="relative w-9/12">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchTerm}
                        placeholder="Search candidates by name..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-lg pl-11 pr-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                    />
                </div>

                <CandidateFilter 
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />
            </div>
        </div>
    )
}