import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Info, AlertTriangle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function ResumeRow({ resume }) {

  const handleView = () => {
    if (resume.resumeUrl) {
      window.open(resume.resumeUrl, "_blank");
    } else {
      alert("Resume not found");
    }
  };

  // status badge colors
  const getStatusBadge = (status) => {
    if (status === "Shortlisted") {
      return (
        <Badge className="bg-green-100 hover:bg-green-100 text-green-800 font-semibold">
          {status}
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 hover:bg-red-100 text-red-800 font-semibold">
        {status}
      </Badge>
    );
  };

  const isRejected = resume.status === "Rejected";
  const accentColor = isRejected ? "border-red-500" : "border-gray-300";
  const HeaderIcon = isRejected ? AlertTriangle : Info;

  return (
    <TableRow className="hover:bg-gray-50 transition-colors">

      <TableCell className="px-6 py-5">{resume.name}</TableCell>
      <TableCell className="px-6 py-5">{resume.email}</TableCell>
      <TableCell className="px-6 py-5">{resume.position}</TableCell>
      <TableCell className="px-6 py-5">{resume.experience}</TableCell>
      <TableCell className="px-6 py-5">{resume.appliedDate}</TableCell>

      {/* Status + Popover */}
      <TableCell className="px-6 py-5">
        <div className="flex items-center gap-2">
          {getStatusBadge(resume.status)}

          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-auto w-auto p-0 text-gray-500 hover:text-gray-800 hover:bg-transparent cursor-pointer"
              >
                <Info className="w-4 h-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent 
              className={`w-80 p-0 border-t-4 ${accentColor} shadow-lg rounded-md`}
              align="start"
            >
              <div className="p-4">

                <div className="flex items-center gap-2 mb-3">
                  <HeaderIcon className={`w-5 h-5 ${isRejected ? 'text-red-500' : 'text-blue-500'} shrink-0`} />
                  <h4 className="text-base font-semibold text-gray-900">
                    {isRejected ? "Rejection Reason" : "Status Details"}
                  </h4>
                </div>

                <div className="text-sm text-gray-700 leading-relaxed max-h-48 overflow-y-auto pr-2">
                  {resume.reason 
                    ? resume.reason 
                    : "No reason or detailed feedback provided."}
                </div>

              </div>
            </PopoverContent>
          </Popover>
        </div>
      </TableCell>

      {/* Resume View Button */}
      <TableCell className="px-6 py-5">
        <Button
          variant="ghost"
          className="h-auto p-0 text-gray-700 hover:text-blue-600 hover:bg-transparent font-normal cursor-pointer"
          onClick={handleView}
          disabled={!resume.resumeUrl}
        >
          <FileText className="w-4 h-4 mr-2" />
          View
        </Button>
      </TableCell>

    </TableRow>
  );
}
