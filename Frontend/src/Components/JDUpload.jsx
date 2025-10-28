import { useState } from "react";

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
      alert("Please select or drop a file first!");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("jdFile", selectedFile);

      // Example backend endpoint
      const res = await fetch("http://localhost:5000/upload_jd", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      setPreview(data);
      onUpload && onUpload(data);
    } catch (err) {
      console.error(err);
      alert("Error uploading JD!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Upload Job Description
      </h2>

      {/* Drag & Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput").click()}
      >
        <input
          id="fileInput"
          type="file"
          accept=".pdf,.docx,.json,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
        {selectedFile ? (
          <p className="text-gray-700">
            Selected file: <span className="font-medium">{selectedFile.name}</span>
          </p>
        ) : (
          <p className="text-gray-500">
            Drag & drop a JD file here, or <span className="text-blue-600">click to browse</span>
          </p>
        )}
      </div>

      {/* Upload Button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`px-4 py-2 rounded-lg text-white ${
            isUploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Preview */}
      {preview && (
        <div className="mt-6 border-t pt-4 text-left">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Parsed JD Preview
          </h3>
          <p><strong>Title:</strong> {preview.title}</p>
          <p><strong>Skills:</strong> {preview.skills?.join(", ")}</p>
          <p><strong>Experience:</strong> {preview.min_experience_months} months</p>
          <p className="text-gray-700 mt-2">{preview.description}</p>
        </div>
      )}
    </div>
  );
}

export default JDUpload;
