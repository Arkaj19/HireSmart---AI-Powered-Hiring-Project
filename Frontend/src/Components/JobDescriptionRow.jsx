// import { TableCell, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { FileText } from "lucide-react";

// function JobDescriptionRow({ jd }) {
//   const handleViewJD = () => {
//   if (jd.jd_url.endsWith(".pdf")) {
//     window.open(jd.jd_url, "_blank");
//   } else if (jd.jd_url.endsWith(".docx")) {
//     window.open(
//       `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(jd.jd_url)}`,
//       "_blank"
//     );
//   } else {
//     alert("Unsupported file format.");
//   }
// };


//   return (
//     <TableRow className="hover:bg-gray-50">
//       <TableCell className="px-6 py-4 text-sm text-gray-900">
//         {jd.position_id}
//       </TableCell>

//       <TableCell className="px-6 py-4 text-sm text-gray-900">
//         {jd.title}
//       </TableCell>

//       <TableCell className="px-6 py-4 text-sm text-blue-600">
//         <Button
//           variant="ghost"
//           className="h-auto p-0 text-gray-700 hover:text-blue-600 hover:bg-transparent font-normal cursor-pointer"
//           onClick={handleViewJD}
//         >
//           <FileText className="w-4 h-4 mr-2" />
//           View
//         </Button>
//       </TableCell>
//       <TableCell className="px-6 py-4 text-sm">
//         {jd.status || "Active"}
//       </TableCell>
//     </TableRow>
//   );
// }

// export default JobDescriptionRow;

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";

function JobDescriptionRow({ jd }) {
  const handleViewJD = () => {
    if (jd.jd_url.endsWith(".pdf")) {
      window.open(jd.jd_url, "_blank");
    } else if (jd.jd_url.endsWith(".docx")) {
      window.open(
        `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(jd.jd_url)}`,
        "_blank"
      );
    } else {
      alert("Unsupported file format.");
    }
  };

  return (
    <TableRow className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-indigo-50/30 transition-all duration-200 group">
      <TableCell className="px-8 py-5">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold text-sm">
          {jd.position_id}
        </span>
      </TableCell>

      <TableCell className="px-8 py-5">
        <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {jd.title}
        </span>
      </TableCell>

      <TableCell className="px-8 py-5">
        <Button
          variant="ghost"
          className="h-auto p-0 text-gray-600 hover:text-blue-600 hover:bg-transparent font-medium group/btn transition-all"
          onClick={handleViewJD}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            <FileText className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            <span>View</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          </div>
        </Button>
      </TableCell>

      <TableCell className="px-8 py-5">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
          {jd.status || "Active"}
        </span>
      </TableCell>
    </TableRow>
  );
}

export default JobDescriptionRow;
