import JDUpload from "./JDUpload";
import JobDescriptionTable from "./JobDescriptionTable";
import useJD_Data from "@/hooks/useJD_Data";

function JobDescriptionPanel() {
  const { jds, refresh } = useJD_Data();

  const handleUploadSuccess = () => {
    refresh(); // re-fetch after successful upload
  };
  return (
    <div className="p-2">
      <JDUpload onUpload={handleUploadSuccess}/>
      <div className="mt-10">   {/* add margin-top here */}
        <JobDescriptionTable jds={jds}/>
      </div>
    </div>
  );
}
export default JobDescriptionPanel