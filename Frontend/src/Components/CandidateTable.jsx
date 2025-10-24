import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CandidateRow from "./CandidateRow";

export default function CandidateTable({ candidates }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50">
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Email
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Position
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Experience
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Applied Date
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Resume
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {candidates.map((candidate) => (
            <CandidateRow key={candidate.id} candidate={candidate} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}