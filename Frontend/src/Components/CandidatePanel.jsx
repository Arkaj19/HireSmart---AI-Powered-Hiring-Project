import CandidateTable from "./CandidateTable";
import { useState, useEffect } from "react";
import CandidateSearch from "./CandidateSearch";
import CardStatus from "./CardStatus";
import {useCandidateData} from "../hooks/useCandidateData"

export default function CandidatePanel() {

    const {candidates}=useCandidateData()

    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("")

    const filteredCandidates = candidates.filter((c) => {
        const matchstatus = statusFilter === "" || c.status?.toLowerCase() === statusFilter.toLowerCase();
        const matchSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchSearch && matchstatus;
    });

    const total = candidates.length;
    const shortlisted = candidates.filter((c) => c.status === "Shortlisted").length;
    const rejected = candidates.filter((c) => c.status === "Rejected").length;

    return (
        <div className="px-8 pb-6">
            <CardStatus total={total} shortlisted={shortlisted} rejected={rejected} />
            {/* Candidates Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {/* Section Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Candidates</h2>
                </div>

                <CandidateSearch searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter} />

                {/* Table */}
                <CandidateTable candidates={filteredCandidates} />
            </div>
        </div>
    );
}