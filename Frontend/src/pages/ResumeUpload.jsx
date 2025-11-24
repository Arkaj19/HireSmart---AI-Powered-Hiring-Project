import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";
import CandidatePanel from "./CandidatePanel";
import { useCandidateData } from "@/hooks/useCandidateData"; 
import ResumeTable from "@/Components/resume/ResumeTable";

function ResumeUpload({ onUpload }) {

  const { candidates, setCandidates } = useCandidateData();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [positions, setPositions] = useState([]);
  const [selectedPositionId, setSelectedPositionId] = useState("");

  // --- Fetch Positions (by JD / job_title) ---
 useEffect(() => {
  const fetchPositions = async () => {
    try {
      const res = await fetch("https://hiresmart-ai-powered-hiring-project.onrender.com/jds");
      const data = await res.json();

      setPositions(data);
    } catch (err) {
      console.error("Error fetching positions:", err);
      toast({
        title: "Failed to load positions",
        description: "Could not fetch positions from server.",
        variant: "destructive",
      });
    }
  };

  fetchPositions();
}, []);



  // --- Drag & Drop Handlers ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  // --- File Select (Fallback) ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  // --- Upload Logic ---
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select or drop a resume file first.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPositionId) {
      toast({
        title: "No Position Selected",
        description: "Please select a position for this resume.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      // 👇 backend expects position_id (integer)
      formData.append("position_id", selectedPositionId);

      const res = await fetch("https://hiresmart-ai-powered-hiring-project.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      console.log("Uploaded Resume data:", data);
      setCandidates(prev => [...prev, data]);  
      setPreview(data); // adjust if backend returns a specific field
      // onUpload && onUpload(data);

      toast({
        title: "Upload Successful",
        description: "Resume uploaded and linked to the selected position.",
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the resume.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      {/* Gradient Background Card */}
      <div className="bg-linear-to-br from-blue-50 via-white to-indigo-50 rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Upload Resume
            </h2>
          </div>

          {/* Drag & Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
              isDragging
                ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("resumeFileInput").click()}
          >
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

            <input
              id="resumeFileInput"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="relative z-10">
              {selectedFile ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-green-100 rounded-full">
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Selected file:</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedFile.name}
                    </p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-blue-100 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-base text-gray-700 font-medium mb-2">
                      Drag & drop resume file here
                    </p>
                    <p className="text-sm text-gray-500">
                      or{" "}
                      <span className="text-blue-600 font-medium hover:text-blue-700">
                        click to browse
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-600 border border-gray-200">
                      PDF
                    </span>
                    
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Position dropdown */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
           <select
                value={selectedPositionId}
                onChange={(e) => setSelectedPositionId(e.target.value)}
                >
                <option value="">Select position</option>
                {positions.map((p) => (
                    <option key={p.position_id} value={p.position_id}>
                    {p.title}
                    </option>
                ))}
            </select>

          </div>

          {/* Upload Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`relative px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:scale-105 active:scale-95"
              }`}
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Resume
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Preview Section (optional) */}
        {preview && (
          <div className="border-t border-gray-200 bg-linear-to-br from-gray-50 to-white p-8">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Uploaded Successfully
              </h3>
            </div>
            {/* Add whatever fields from `preview` you want to show here */}
          </div>
        )}
      </div>

      {/* ADD THIS SECTION BELOW */}
      <div className="mt-10">
        <ResumeTable resumes={candidates} />
      </div>
    </div>
  );
}

export default ResumeUpload;

