// import JobDescriptionRow from "./JobDescriptionRow";
// import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// function JobDescriptionTable( {jds}){
//   // const jds=useJD_Data();
//     return (
//         <Table>
//         <TableHeader>
//           <TableRow className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50">
//             <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//               Position Id
//             </TableHead>
//             <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//               Job Title
//             </TableHead>
//             <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//               JD
//             </TableHead>
//             <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//               Status
//             </TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody className="bg-white divide-y divide-gray-200">
//           {jds && jds.length>0? (
//             jds.map((jd) => (
//             <JobDescriptionRow key={jd.id} jd={jd} /> 
//           ))
//         ):(
//             <TableRow>
//             <td colSpan="4" className="text-center py-4 text-gray-500">
//               No job descriptions found.
//             </td>
//           </TableRow>
//           )
//           }
//         </TableBody>
//       </Table>
//     )
// }
// export default JobDescriptionTable;

import JobDescriptionRow from "./JobDescriptionRow";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Briefcase } from "lucide-react";

function JobDescriptionTable({ jds }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      {/* Modern Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Job Descriptions
          </h3>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white hover:from-gray-50 hover:to-white">
              <TableHead className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Position ID
              </TableHead>
              <TableHead className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Job Title
              </TableHead>
              <TableHead className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Document
              </TableHead>
              <TableHead className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-100">
            {jds && jds.length > 0 ? (
              jds.map((jd) => (
                <JobDescriptionRow key={jd.id} jd={jd} />
              ))
            ) : (
              <TableRow>
                <td colSpan="4" className="px-8 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <Briefcase className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">
                      No job descriptions found
                    </p>
                    <p className="text-sm text-gray-400">
                      Upload a JD to get started
                    </p>
                  </div>
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
export default JobDescriptionTable;