import { Send, XCircle, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export default function CandidateRow({ candidate }) {
  const getActionButton = (status) => {
    if (status === 'Selected') {
      return (
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <Send className="w-4 h-4 mr-2" />
          Send Test
        </Button>
      );
    } else if (status === 'Rejected') {
      return (
        <Button className="bg-red-500 hover:bg-red-600 text-white">
          <XCircle className="w-4 h-4 mr-2" />
          Send Rejection
        </Button>
      );
    }
    // For "Sent" status
    return (
      <Button className="bg-blue-300 hover:bg-blue-400 text-white cursor-not-allowed" disabled>
        <Send className="w-4 h-4 mr-2" />
        Sent
      </Button>
    );
  };

  const getStatusBadge = (status) => {
    if (status === 'Selected') {
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
            <Button variant="ghost" size="icon" className='text-gray-500 hover:text-gray-800 transition'>
              <Info className='w-4 h-4'/>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
             <p className="text-sm font-medium mb-1">Reason:</p>
              <p className="text-sm text-gray-700">
                {candidate.reason ? candidate.reason : "No reason provided."}
              </p>
          </PopoverContent>
        </Popover>
        </div>
      </TableCell>

      {/* Resume */}
      <TableCell className="px-6 py-5 whitespace-nowrap align-middle">
        <Button 
          variant="ghost" 
          className="h-auto p-0 text-gray-700 hover:text-blue-600 hover:bg-transparent font-normal"
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