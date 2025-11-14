import CandidatePanel from "./CandidatePanel";
import JobDescriptionPanel from "./JobDescriptionPanel";

function Body({ activeTab }) {
  return (
    <div className="p-8">
      {activeTab === "TA Dashboard" && <CandidatePanel />}
      {activeTab === "JD Upload" && <JobDescriptionPanel/>}
    </div>
  );
}

export default Body;