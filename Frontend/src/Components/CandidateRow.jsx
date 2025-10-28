import { Send, XCircle, FileText, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from "@/components/ui/use-toast";

export default function CandidateRow({ candidate }) {
  const getActionButton = (status) => {
    if (status === 'Shortlisted') {
      return (
        <Button className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">
          <Send className="w-4 h-4 mr-2" />
          Send Test
        </Button>
      );
    } else if (status === 'Rejected') {
      return (
        <Button className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
        onClick = {() => handleSendRejection(candidate)}>
          <XCircle className="w-4 h-4 mr-2" />
          Send Rejection
        </Button>
      );
    }
    // For "Sent" status
    return (
      <Button className="bg-blue-300 hover:bg-blue-400 text-white cursor-not-allowed cursor-pointer" disabled>
        <Send className="w-4 h-4 mr-2" />
        Sent
      </Button>
    );
  };

  const getStatusBadge = (status) => {
    if (status === 'Shortlisted') {
      return (
        <Badge className="bg-green-100 hover:bg-green-100 text-green-800 font-semibold">
          {status}
        </Badge>
      );
    }
    return(
        <Badge className="bg-red-100 hover:bg-red-100 text-red-800 font-semibold">
          {status}
        </Badge>
      );
    };

    const handleViewResumes = () => {
    if(candidate.resumeUrl){
      window.open(candidate.resumeUrl, '_blank')
    }
    else{
      alert('Resume Not Found')
    }
  }

  // Determine popover style based on status (e.g., a rejected candidate)
  const isRejected = candidate.status === 'Rejected';
  const accentColor = isRejected ? 'border-red-500' : 'border-gray-300';
  const HeaderIcon = isRejected ? AlertTriangle : Info;

  const handleSendRejection = async (candidate) => {
  try {
    const response = await fetch("http://localhost:8000/send-rejection-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: candidate.email,
        name: candidate.name,
        position: candidate.position,
      }),
    });

    if (response.ok) {
      toast({
        title: "Rejection Email Sent",
        description: `An email was successfully sent to ${candidate.name}.`,
        variant: "success",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to send rejection email.",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Server Error",
      description: "Something went wrong while sending the email.",
      variant: "destructive",
    });
  }
};


  return (
    <TableRow className="hover:bg-gray-50 transition-colors">
      {/* Name */}
      <TableCell className="px-6 py-5 whitespace-nowrap align-middle">
        <div className="text-sm font-medium text-gray-900">
          {candidate.name}
        </div>
      </TableCell>

      {/* Email */}
      <TableCell className="px-6 py-5 whitespace-nowrap align-middle">
        <div className="text-sm text-gray-600">
          {candidate.email}
        </div>
      </TableCell>

      {/* Position */}
      <TableCell className="px-6 py-5 whitespace-nowrap align-middle">
        <div className="text-sm text-gray-900">
          {candidate.position}
        </div>
      </TableCell>

      {/* Experience */}
      <TableCell className="px-6 py-5 whitespace-nowrap align-middle">
        <div className="text-sm text-gray-900">
          {candidate.experience}
        </div>
      </TableCell>

      {/* Applied Date */}
      <TableCell className="px-6 py-5 whitespace-nowrap align-middle">
        <div className="text-sm text-gray-900">
          {candidate.appliedDate}
        </div>
      </TableCell>

      {/* Status */}
      <TableCell className="px-6 py-5 whitespace-nowrap align-middle">
        <div className='flex items-center gap-2'>
        {getStatusBadge(candidate.status)}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className='h-auto w-auto p-0 text-gray-500 hover:text-gray-800 hover:bg-transparent cursor-pointer'>
              <Info className='w-4 h-4'/>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className={`w-80 p-0 border-t-4 ${accentColor} shadow-lg rounded-md`} 
            align="start" // Align to start for better visibility
          >
            <div className='p-4'>
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <HeaderIcon className={`w-5 h-5 ${isRejected ? 'text-red-500' : 'text-blue-500'} shrink-0`} />
                <h4 className="text-base font-semibold text-gray-900">
                  {isRejected ? "Rejection Reason" : "Status Details"}
                </h4>
              </div>

              {/* Body */}
              <div className="text-sm text-gray-700 leading-relaxed max-h-48 overflow-y-auto pr-2">
                {candidate.reason ? candidate.reason : "No reason or detailed feedback has been provided for this status."}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        </div>
      </TableCell>

      {/* Resume */}
      <TableCell className="px-6 py-5 whitespace-nowrap align-middle">
        <Button 
          variant="ghost" 
          className="h-auto p-0 text-gray-700 hover:text-blue-600 hover:bg-transparent font-normal cursor-pointer"
          onClick={handleViewResumes}
          disabled={!candidate.resumeUrl}
        >
          <FileText className="w-4 h-4 mr-2" />
          View
        </Button>
      </TableCell>

      {/* Actions */}
      <TableCell className="px-6 py-5 whitespace-nowrap align-middle">
        {getActionButton(candidate.status)}
      </TableCell>
    </TableRow>
  );
}