import { useState } from "react";
import { useCandidateData } from "../hooks/useCandidateData";
import CandidateTable from "@/Components/candidate/CandidateTable";
import CandidateSearch from "@/Components/candidate/CandidateSearch";
import CardStatus from "@/Components/candidate/CardStatus";

export default function CandidatePanel({ filterType = "all", showStatusCards = false }) {

    const { candidates, setCandidates } = useCandidateData();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Base filter applied by page
    let baseFiltered = candidates;

    if (filterType === "shortlisted") {
        baseFiltered = candidates.filter(c => c.status === "Shortlisted");
    }

    // Additional Search + Dropdown Filter
    const filteredCandidates = baseFiltered.filter((c) => {
        const matchStatus = statusFilter === "" || 
            c.status?.toLowerCase() === statusFilter.toLowerCase();

        const matchSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchSearch && matchStatus;
    });

    const total = baseFiltered.length;
    const shortlisted = baseFiltered.filter(c => c.status === "Shortlisted").length;
    const rejected = baseFiltered.filter(c => c.status === "Rejected").length;

    return (
        <div className="px-8 pb-6">

            {/** 🔥 Only show cards when allowed */}
            {showStatusCards && (
                <CardStatus total={total} shortlisted={shortlisted} rejected={rejected} />
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">All Candidates</h2>
                </div>

                <CandidateSearch
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />

                <CandidateTable 
                    candidates={filteredCandidates} 
                    setCandidates={setCandidates} 
                />
            </div>
        </div>
    );
}
