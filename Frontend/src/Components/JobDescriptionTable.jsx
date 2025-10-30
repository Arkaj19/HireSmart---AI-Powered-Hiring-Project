import JobDescriptionRow from "./JobDescriptionRow";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useJD_Data from "../hooks/useJD_Data"

function JobDescriptionTable(){
  const jds=useJD_Data();
    return (
        <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50">
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Position Id
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Job Title
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              JD
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {jds.length>0? (
            jds.map((jd) => (
            <JobDescriptionRow key={jd.id} jd={jd} /> 
          ))
        ):(
            <TableRow>
            <td colSpan="4" className="text-center py-4 text-gray-500">
              No job descriptions found.
            </td>
          </TableRow>
          )
          }
        </TableBody>
      </Table>
    )
}
export default JobDescriptionTable;