// import { Send, XCircle, FileText, AlertTriangle, Info } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { TableCell, TableRow } from "@/components/ui/table";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { toast } from "@/components/ui/use-toast";
// import { useState } from "react";

// export default function CandidateRow({
//   candidate,
//   setCandidates,
//   updateTestStatus,
// }) {
//   const [isSending, setIsSending] = useState(false);

//   // ------------------ Action Button ------------------ //
//   const getActionButton = () => {
//     // If test result already available
//     if (candidate.test_status === "Passed Test") {
//       return (
//         <Button
//           className="bg-[#d1fae5] text-[#065f46] font-semibold border border-[#6ee7b7]"
//           disabled
//         >
//           Test Passed
//         </Button>
//       );
//     }

//     if (candidate.test_status === "Failed Test") {
//       return (
//         <Button
//           className="bg-[#fee2e2] text-[#991b1b] font-semibold border border-[#fca5a5]"
//           disabled
//         >
//           Test Failed
//         </Button>
//       );
//     }

//     // After sending email but before test submission
//     if (candidate.testSent) {
//       return (
//         <Button
//           className="bg-[#caf0f8] text-[#0077b6] font-semibold cursor-not-allowed border border-[#90e0ef]"
//           disabled
//         >
//           <Send className="w-4 h-4 mr-2 text-[#0077b6]" />
//           Test Sent
//         </Button>
//       );
//     }

//     // Rejection already sent
//     if (candidate.rejectionSent) {
//       return (
//         <Button
//           className="bg-[#fde8e8] text-[#b91c1c] font-semibold border border-[#fca5a5] cursor-not-allowed"
//           disabled
//         >
//           <XCircle className="w-4 h-4 mr-2 text-[#b91c1c]" />
//           Rejection Sent
//         </Button>
//       );
//     }

//     // Show Shortlist Button
//     if (candidate.status === "Shortlisted") {
//       return (
//         <Button
//           className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
//           onClick={() => handleSendShortlist(candidate)}
//           disabled={isSending}
//         >
//           <Send className="w-4 h-4 mr-2" />
//           {isSending ? "Sending..." : "Send Test"}
//         </Button>
//       );
//     }

//     return null;
//   };

//   // ------------------ Status Badge ------------------ //
//   const getStatusBadge = () => {
//     if (candidate.status === "Shortlisted") {
//       return (
//         <Badge className="bg-green-100 text-green-800 font-semibold">
//           Shortlisted
//         </Badge>
//       );
//     }
//     if (candidate.status === "Rejected") {
//       return (
//         <Badge className="bg-red-100 text-red-800 font-semibold">
//           Rejected
//         </Badge>
//       );
//     }

//     return (
//       <Badge className="bg-gray-200 text-gray-800 font-semibold">
//         {candidate.status}
//       </Badge>
//     );
//   };

//   // ------------------ Button Handlers ------------------ //
//   const handleViewResumes = () => {
//     if (candidate.resumeUrl) window.open(candidate.resumeUrl, "_blank");
//   };

//   const handleSendShortlist = async (candidate) => {
//     if (isSending) return;
//     setIsSending(true);

//     try {
//       const response = await fetch(
//         "https://hiresmart-ai-powered-hiring-project.onrender.com/send-shortlist-email",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email: candidate.email,
//             name: candidate.name,
//             position: candidate.position,
//             candidate_id: candidate.id,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         toast({
//           title: "Error",
//           description: data.detail || "Failed to send shortlist email.",
//           variant: "destructive",
//         });
//         return;
//       }

//       toast({
//         title: "Shortlist Email Sent",
//         description: `A shortlist email was successfully sent to ${candidate.name}.`,
//       });

//       setCandidates((prev) =>
//         prev.map((c) => (c.id === candidate.id ? { ...c, testSent: true } : c))
//       );
//     } catch (error) {
//       toast({
//         title: "Server Error",
//         description: "Something went wrong while sending the email.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSending(false);
//     }
//   };

//   return (
//     <TableRow className="hover:bg-gray-50">
//       <TableCell className="px-6 py-5">{candidate.name}</TableCell>
//       <TableCell className="px-6 py-5">{candidate.email}</TableCell>
//       <TableCell className="px-6 py-5">{candidate.position}</TableCell>
//       <TableCell className="px-6 py-5">{candidate.experience}</TableCell>
//       <TableCell className="px-6 py-5">{candidate.appliedDate}</TableCell>

//       <TableCell className="px-6 py-5">
//         <div className="flex items-center gap-2">{getStatusBadge()}</div>
//       </TableCell>

//       <TableCell className="px-6 py-5">
//         <Button
//           variant="ghost"
//           onClick={handleViewResumes}
//           className="text-gray-700"
//         >
//           <FileText className="w-4 h-4 mr-2" />
//           View
//         </Button>
//       </TableCell>

//       <TableCell className="px-6 py-5">{getActionButton()}</TableCell>
//     </TableRow>
//   );
// }
import { Send, XCircle, FileText, AlertTriangle, Info, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function CandidateRow({
  candidate,
  setCandidates,
  updateTestStatus,
}) {
  const [isSending, setIsSending] = useState(false);
  const [isSchedulingL1, setIsSchedulingL1] = useState(false);

  // ------------------ Action Button (Test) ------------------ //
  const getActionButton = () => {
    // If test result already available
    if (candidate.test_status === "Passed Test") {
      return (
        <Button
          className="bg-[#d1fae5] text-[#065f46] font-semibold border border-[#6ee7b7]"
          disabled
        >
          Test Passed
        </Button>
      );
    }

    if (candidate.test_status === "Failed Test") {
      return (
        <Button
          className="bg-[#fee2e2] text-[#991b1b] font-semibold border border-[#fca5a5]"
          disabled
        >
          Test Failed
        </Button>
      );
    }

    // After sending email but before test submission
    if (candidate.testSent) {
      return (
        <Button
          className="bg-[#caf0f8] text-[#0077b6] font-semibold cursor-not-allowed border border-[#90e0ef]"
          disabled
        >
          <Send className="w-4 h-4 mr-2 text-[#0077b6]" />
          Test Sent
        </Button>
      );
    }

    // Rejection already sent
    if (candidate.rejectionSent) {
      return (
        <Button
          className="bg-[#fde8e8] text-[#b91c1c] font-semibold border border-[#fca5a5] cursor-not-allowed"
          disabled
        >
          <XCircle className="w-4 h-4 mr-2 text-[#b91c1c]" />
          Rejection Sent
        </Button>
      );
    }

    // Show Shortlist Button
    if (candidate.status === "Shortlisted") {
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
    }

    return null;
  };

  // ------------------ L1 Interview Column ------------------ //
  const handleScheduleL1 = async () => {
    // Guard conditions
    if (
      isSchedulingL1 ||
      candidate.l1InterviewScheduled ||
      candidate.test_status !== "Passed Test"
    ) {
      return;
    }

    setIsSchedulingL1(true);

    try {
      // 🔹 For now: just update UI state.
      // Later you can plug in an API like:
      // await fetch("/schedule-l1", { method: "POST", body: JSON.stringify({ candidate_id: candidate.id }) });

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidate.id
            ? { ...c, l1InterviewScheduled: true }
            : c
        )
      );

      toast({
        title: "L1 Interview Scheduled",
        description: `L1 interview has been marked as scheduled for ${candidate.name}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while scheduling the L1 interview.",
        variant: "destructive",
      });
    } finally {
      setIsSchedulingL1(false);
    }
  };

  const getL1InterviewCell = () => {
    // Already scheduled
    if (candidate.l1InterviewScheduled) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          L1 Scheduled
        </Badge>
      );
    }

    // Test not passed yet → show disabled state
    if (candidate.test_status !== "Passed Test") {
      return (
        <Button
          variant="outline"
          size="sm"
          disabled
          className="cursor-not-allowed text-gray-500 border-dashed"
        >
          L1 Not Eligible
        </Button>
      );
    }

    // Test passed → allow scheduling
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleScheduleL1}
        disabled={isSchedulingL1}
      >
        <Calendar className="w-4 h-4 mr-2" />
        {isSchedulingL1 ? "Scheduling..." : "Schedule L1"}
      </Button>
    );
  };

  // ------------------ Status Badge ------------------ //
  const getStatusBadge = () => {
    if (candidate.status === "Shortlisted") {
      return (
        <Badge className="bg-green-100 text-green-800 font-semibold">
          Shortlisted
        </Badge>
      );
    }
    if (candidate.status === "Rejected") {
      return (
        <Badge className="bg-red-100 text-red-800 font-semibold">
          Rejected
        </Badge>
      );
    }

    return (
      <Badge className="bg-gray-200 text-gray-800 font-semibold">
        {candidate.status}
      </Badge>
    );
  };

  // ------------------ Button Handlers ------------------ //
  const handleViewResumes = () => {
    if (candidate.resumeUrl) window.open(candidate.resumeUrl, "_blank");
  };

  const handleSendShortlist = async (candidate) => {
    if (isSending) return;
    setIsSending(true);

    try {
      const response = await fetch(
        "https://hiresmart-ai-powered-hiring-project.onrender.com/send-shortlist-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: candidate.email,
            name: candidate.name,
            position: candidate.position,
            candidate_id: candidate.id,
          }),
        }
      );

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
        prev.map((c) => (c.id === candidate.id ? { ...c, testSent: true } : c))
      );
    } catch (error) {
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
    <TableRow className="hover:bg-gray-50">
      <TableCell className="px-6 py-5">{candidate.name}</TableCell>
      <TableCell className="px-6 py-5">{candidate.email}</TableCell>
      <TableCell className="px-6 py-5">{candidate.position}</TableCell>
      <TableCell className="px-6 py-5">{candidate.experience}</TableCell>
      <TableCell className="px-6 py-5">{candidate.appliedDate}</TableCell>

      <TableCell className="px-6 py-5">
        <div className="flex items-center gap-2">{getStatusBadge()}</div>
      </TableCell>

      <TableCell className="px-6 py-5">
        <Button
          variant="ghost"
          onClick={handleViewResumes}
          className="text-gray-700"
        >
          <FileText className="w-4 h-4 mr-2" />
          View
        </Button>
      </TableCell>

      {/* Test-related action button */}
      <TableCell className="px-6 py-5">{getActionButton()}</TableCell>

      {/* NEW: L1 Interview column */}
      <TableCell className="px-6 py-5">{getL1InterviewCell()}</TableCell>
    </TableRow>
  );
}

