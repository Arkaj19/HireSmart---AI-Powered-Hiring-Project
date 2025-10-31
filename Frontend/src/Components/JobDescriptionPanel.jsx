import JDUpload from "./JDUpload";
import JobDescriptionTable from "./JobDescriptionTable";
import useJD_Data from "@/hooks/useJD_Data";

function JobDescriptionPanel() {
  const { jds, refresh } = useJD_Data();

  const handleUploadSuccess = () => {
    refresh(); // re-fetch after successful upload
  };
  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <JDUpload onUpload={handleUploadSuccess}/>
      <div className="mt-12">
        <JobDescriptionTable jds={jds}/>
      </div>
    </div>
  );
}
export default JobDescriptionPanel