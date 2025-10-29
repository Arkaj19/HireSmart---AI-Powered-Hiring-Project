import { Send, XCircle, FileText, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { toast } from "@/components/ui/use-toast";
import { useState } from 'react';

export default function CandidateRow({ candidate, setCandidates }) {
  const [isSending, setIsSending] = useState(false);
  const getActionButton = (status, rejectionSent) => {
    if (candidate.testSent) {
      return (
        <Button className="bg-[#caf0f8] text-[#0077b6] font-semibold cursor-not-allowed border border-[#90e0ef]" disabled>
          <Send className="w-4 h-4 mr-2 text-[#0077b6]" />
          Test Sent
        </Button>
      );
    }
    if(rejectionSent){
      return(
        <Button className="bg-[#fde8e8] text-[#b91c1c] font-semibold border border-[#fca5a5] cursor-not-allowed" disabled>
          <XCircle className="w-4 h-4 mr-2 text-[#b91c1c]" />
          Rejection Sent
        </Button>
      )
    }

  if (status === 'Shortlisted') {
    return (
      <Button 
        className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
        onClick={() => handleSendShortlist(candidate)}
        disabled={isSending}
      >
        <Send className="w-4 h-4 mr-2" />
        {isSending ? "Sending..." : "Send Test"}
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
      <Button className="bg-blue-300 hover:bg-blue-400 text-white cursor-pointer" disabled>
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
  console.log("🔵 Starting handleSendRejection");
  
  try {
    console.log("📤 Sending fetch request...");
    
    const response = await fetch("http://localhost:8000/send-rejection-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: candidate.email,
        name: candidate.name,
        position: candidate.position,
        candidate_id: candidate.id,
      }),
    });

    console.log("📥 Response received:", response.status, response.ok);
    console.log("📥 Response headers:", response.headers);

    const data = await response.json();
    console.log("📦 Data parsed:", data);

    if (!response.ok) {
      console.log("❌ Response not OK, showing error toast");
      toast({
        title: "Error",
        description: data.detail || "Failed to send rejection email.",
        variant: "destructive",
      });
      return;
    }

    console.log("✅ Success! Showing success toast");
    toast({
      title: "Rejection Email Sent",
      description: `An email was successfully sent to ${candidate.name}.`,
      variant: "success"
    });

    console.log("🔄 Updating candidates state");
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidate.id ? { ...c, rejectionSent: true } : c
      )
    );
    
    console.log("✅ handleSendRejection completed successfully");
    
  } catch (error) {
    console.error("💥 CAUGHT ERROR:", error);
    console.error("💥 Error type:", error.constructor.name);
    console.error("💥 Error message:", error.message);
    console.error("💥 Error stack:", error.stack);
    
    toast({
      title: "Server Error",
      description: "Something went wrong while sending the email.",
      variant: "destructive",
    });
  }
};

const handleSendShortlist = async (candidate) => {
  if (isSending) return;
  
  setIsSending(true);
  
  try {
    const response = await fetch("http://localhost:8000/send-shortlist-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: candidate.email,
        name: candidate.name,
        position: candidate.position,
        candidate_id: candidate.id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast({
        title: "Error",
        description: data.detail || "Failed to send shortlist email.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Shortlist Email Sent",
      description: `A shortlist email was successfully sent to ${candidate.name}.`,
    });

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidate.id ? { ...c, testSent: true } : c
      )
    );
    
  } catch (error) {
    console.error("Error:", error);
    toast({
      title: "Server Error",
      description: "Something went wrong while sending the email.",
      variant: "destructive",
    });
  } finally {
    setIsSending(false);
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
        {getActionButton(candidate.status, candidate.rejectionSent)}
      </TableCell>
    </TableRow>
  );
}