// import CandidatePanel from "../../pages/CandidatePanel";
// import JobDescriptionPanel from "../../pages/JobDescriptionPanel";
// import ResumeUpload from "../../pages/ResumeUpload";

// function Body({ activeTab }) {
//   return (
//     <div className="p-8">
//       {activeTab === "TA Dashboard" && <CandidatePanel />}
//       {activeTab === "JD Upload" && <JobDescriptionPanel/>}
//       {activeTab === "Resume Upload" && <ResumeUpload/>}
//     </div>
//   );
// }

// export default Body;

import CandidatePanel from "../../pages/CandidatePanel";
import JobDescriptionPanel from "../../pages/JobDescriptionPanel";
import ResumeUpload from "../../pages/ResumeUpload";

function Body({ activeTab }) {
  return (
    <div className="p-8">
      
      {/* TA Dashboard → Show only shortlisted + show status cards */}
      {activeTab === "TA Dashboard" && (
        <CandidatePanel 
          filterType="shortlisted" 
          showStatusCards={false} 
        />
      )}

      {/* JD Upload */}
      {activeTab === "JD Upload" && (
        <JobDescriptionPanel />
      )}

      {/* Resume Upload → Show all candidates + hide status cards */}
      {activeTab === "Resume Upload" && (
        <ResumeUpload />
      )}

    </div>
  );
}

export default Body;
