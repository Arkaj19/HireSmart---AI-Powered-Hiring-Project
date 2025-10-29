import JobDescriptionRow from "./JobDescriptionRow";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
function JobDescriptionTable(){
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
          {/* {.map((candidate) => (
            <JobDescriptionRow/>
          ))} */}
        </TableBody>
      </Table>
    )
}
export default JobDescriptionTable;