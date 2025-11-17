import CandidatePanel from "./CandidatePanel";
import JobDescriptionPanel from "./JobDescriptionPanel";
import ResumeUpload from "./ResumeUpload";

function Body({ activeTab }) {
  return (
    <div className="p-8">
      {activeTab === "TA Dashboard" && <CandidatePanel />}
      {activeTab === "JD Upload" && <JobDescriptionPanel/>}
      {activeTab === "Resume Upload" && <ResumeUpload/>}
    </div>
  );
}

export default Body;