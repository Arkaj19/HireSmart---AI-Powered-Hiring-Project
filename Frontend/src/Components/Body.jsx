import CandidatePanel from "./CandidatePanel";
import JobDescriptionPanel from "./JobDescriptionPanel";

function Body({ activeTab }) {
  return (
    <div className="p-8">
      {activeTab === "candidates" && <CandidatePanel />}
      {activeTab === "job descriptions" && <JobDescriptionPanel/>}
    </div>
  );
}

export default Body;
