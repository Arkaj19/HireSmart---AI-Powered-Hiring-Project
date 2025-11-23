import { useState, useMemo } from "react";
import JDUpload from "@/Components/jd/JDUpload";
import JobDescriptionTable from "@/Components/jd/JobDescriptionTable";
import JDFilter from "@/Components/jd/JDFilter";
import useJD_Data from "@/hooks/useJD_Data";

function JobDescriptionPanel() {
  const { jds, refresh } = useJD_Data();

  const [deptFilter, setDeptFilter] = useState("");
  const [expFilter, setExpFilter] = useState("");

  const handleUploadSuccess = () => {
    refresh();
  };

  // unique values for dropdowns
  const departments = useMemo(
    () => Array.from(new Set(jds.map(jd => jd.jd_dept).filter(Boolean))),
    [jds]
  );

  const experienceBands = useMemo(
    () => Array.from(new Set(jds.map(jd => jd.jd_experience_range).filter(Boolean))),
    [jds]
  );

  const filteredJds = useMemo(
    () =>
      jds.filter(jd => {
        const deptMatch = deptFilter ? jd.jd_dept === deptFilter : true;
        const expMatch = expFilter ? jd.jd_experience_range === expFilter : true;
        return deptMatch && expMatch;
      }),
    [jds, deptFilter, expFilter]
  );

  return (
    <div className="p-6 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
      
      <JDUpload onUpload={handleUploadSuccess} />

      <div className="mt-12 space-y-6">
        
        {/* Filters Section */}
        <JDFilter
          departments={departments}
          experienceBands={experienceBands}
          deptFilter={deptFilter}
          expFilter={expFilter}
          setDeptFilter={setDeptFilter}
          setExpFilter={setExpFilter}
        />

        {/* JD Table */}
        <JobDescriptionTable jds={filteredJds} />
      </div>
    </div>
  );
}

export default JobDescriptionPanel;
