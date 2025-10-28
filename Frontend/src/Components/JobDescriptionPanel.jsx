import JDUpload from "./JDUpload";
import JobDescriptionTable from "./JobDescriptionTable";
function JobDescriptionPanel() {
  return (
    <div className="p-2">
      <JDUpload />
      <div className="mt-10">   {/* add margin-top here */}
        <JobDescriptionTable />
      </div>
    </div>
  );
}
export default JobDescriptionPanel