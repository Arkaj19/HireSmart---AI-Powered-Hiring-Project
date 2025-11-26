import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";

function JDUpload({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [department, setDepartment] = useState("");
  const [experienceRange, setExperienceRange] = useState("");
  const [location, setLocation] = useState("");

  const departments = [
    "SAP",
    "Gen Ai",
    "Microsoft"
  ];

  const experienceBands = [
    "0–3 years",
    "3–5 years",
    "5–8 years",
    "8+ years",
  ];

  // --- Drag & Drop ---
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select or drop a JD file first.",
        variant: "destructive",
      });
      return;
    }

    if (!department || !experienceRange) {
      toast({
        title: "Missing Fields",
        description: "Please select Department and Experience Range.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("department", department);
      formData.append("experience_range", experienceRange);
      if (location) formData.append("location", location);

      // ⚠️ adjust URL to match your backend route
      const res = await fetch("https://hiresmart-ai-powered-hiring-project.onrender.com/uploadjd", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      setPreview(data);

      toast({
        title: "JD Uploaded",
        description: "Job description parsed and saved successfully.",
        variant: "success",
      });

      if (onUpload) {
        onUpload();
    }

    } catch (err) {
      console.error(err);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the JD.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-linear-to-br from-blue-50 via-white to-indigo-50 rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Upload Job Description
          </h2>
        </div>

        {/* Drag & Drop */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer group ${
            isDragging
              ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("jdFileInput").click()}
        >
          <input
            id="jdFileInput"
            type="file"
            accept=".pdf,.doc,.docx"
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
                    Drag & drop JD file here
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
                  <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-600 border border-gray-200">
                    DOC / DOCX
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dropdowns */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Practice
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select Practice</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Range
            </label>
            <select
              value={experienceRange}
              onChange={(e) => setExperienceRange(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select range</option>
              {experienceBands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

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
                Upload JD
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Optional Preview */}
      {preview && (
        <div className="border-t border-gray-200 bg-linear-to-br from-gray-50 to-white p-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">
              JD Parsed Successfully
            </h3>
          </div>
          <p className="text-sm text-gray-700">
            {preview.jd?.overall_summary ?? "Summary will appear here."}
          </p>
        </div>
      )}
    </div>
  );
}

export default JDUpload;
