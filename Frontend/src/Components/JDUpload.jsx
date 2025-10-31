// import { useState } from "react";
// import { toast } from "@/components/ui/use-toast";

// function JDUpload({ onUpload }) {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [preview, setPreview] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);

//   // --- Drag & Drop Handlers ---
//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const file = e.dataTransfer.files[0];
//     if (file) setSelectedFile(file);
//   };

//   // --- File Select (Fallback) ---
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) setSelectedFile(file);
//   };

//   // --- Upload Logic ---
//   const handleUpload = async () => {
//     if (!selectedFile) {
//       toast({
//         title: "No File Selected",
//         description: "Please select or drop a JD file first.",
//         variant: "destructive", // red style
//       });
//       return;
//     }

//     setIsUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("file", selectedFile);

//       // Example backend endpoint
//       const res = await fetch("http://127.0.0.1:8000/uploadjd", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Upload failed");
//       const data = await res.json();
//       console.log("Uploaded JD data:", data);
//       setPreview(data.parsed_jd);
//       onUpload && onUpload(data);
//       toast({
//         title: "Upload Successful",
//         description: `JD for "${data.parsed_jd?.job_title}" uploaded successfully!`,
//         variant: "success",
//       })
//     } catch (err) {
//       console.error(err);
//       toast({
//       title: "Upload Failed",
//       description: "There was an error uploading the JD.",
//       variant: "destructive",
//       });
//       alert("Error uploading JD!");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="bg-white shadow rounded-xl p-6 w-full max-w-2xl mx-auto mt-8">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">
//         Upload Job Description
//       </h2>

//       {/* Drag & Drop Zone */}
//       <div
//         className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
//           isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
//         }`}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//         onClick={() => document.getElementById("fileInput").click()}
//       >
//         <input
//           id="fileInput"
//           type="file"
//           accept=".pdf,.docx,.json,.txt"
//           onChange={handleFileChange}
//           className="hidden"
//         />
//         {selectedFile ? (
//           <p className="text-gray-700">
//             Selected file: <span className="font-medium">{selectedFile.name}</span>
//           </p>
//         ) : (
//           <p className="text-gray-500">
//             Drag & drop a JD file here, or <span className="text-blue-600">click to browse</span>
//           </p>
//         )}
//       </div>

//       {/* Upload Button */}
//       <div className="mt-4 flex justify-center">
//         <button
//           onClick={handleUpload}
//           disabled={isUploading}
//           className={`px-4 py-2 rounded-lg text-white ${
//             isUploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {isUploading ? "Uploading..." : "Upload"}
//         </button>
//       </div>

//       {/* Preview */}
//       {preview && (
//         <div className="mt-6 border-t pt-4 text-left">
//           <h3 className="text-lg font-semibold text-gray-700 mb-2">
//             Parsed JD Preview
//           </h3>
//           {/* <p><strong>Title:</strong> {preview.title}</p>
//           <p><strong>Skills:</strong> {preview.skills?.join(", ")}</p>
//           <p><strong>Experience:</strong> {preview.min_experience_months} months</p> */}
//           <p><strong>Title:</strong> {preview.job_title}</p>
//           <p><strong>Skills:</strong> {preview.technical_skills?.map(skill => skill.skill_name).join(", ")}</p>
//           <p><strong>Experience:</strong> {preview.total_experience_years} years</p>
//           <p className="text-gray-700 mt-2">{preview.description}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default JDUpload;

// Code with updated graphics
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";

function JDUpload({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
        description: "Please select or drop a JD file first.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("http://127.0.0.1:8000/uploadjd", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      console.log("Uploaded JD data:", data);
      setPreview(data.parsed_jd);
      onUpload && onUpload(data);
      toast({
        title: "Upload Successful",
        description: `JD for "${data.parsed_jd?.job_title}" uploaded successfully!`,
        variant: "success",
      });
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
    <div className="relative">
      {/* Gradient Background Card */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Upload Job Description
            </h2>
          </div>

          {/* Modern Drag & Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
              isDragging
                ? "border-blue-500 bg-blue-50/50 scale-[1.02]"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            
            <input
              id="fileInput"
              type="file"
              accept=".pdf,.docx,.json,.txt"
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
                      Drag & drop your JD file here
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
                      DOCX
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modern Upload Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`relative px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:scale-105 active:scale-95"
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
                  Upload Job Description
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Modern Preview Section */}
        {preview && (
          <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Parsed Successfully
              </h3>
            </div>
            <div className="space-y-3 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-sm font-semibold text-gray-600 min-w-[100px]">
                  Job Title:
                </span>
                <span className="text-sm text-gray-900 font-medium">
                  {preview.job_title}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm font-semibold text-gray-600 min-w-[100px]">
                  Skills:
                </span>
                <div className="flex flex-wrap gap-2">
                  {preview.technical_skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
                    >
                      {skill.skill_name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm font-semibold text-gray-600 min-w-[100px]">
                  Experience:
                </span>
                <span className="text-sm text-gray-900">
                  {preview.total_experience_years} years
                </span>
              </div>
              {preview.description && (
                <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                  <span className="text-sm font-semibold text-gray-600 min-w-[100px]">
                    Description:
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {preview.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JDUpload;
