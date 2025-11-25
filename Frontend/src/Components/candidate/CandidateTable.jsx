import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CandidateRow from "./CandidateRow";

export default function CandidateTable({ candidates, setCandidates }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Selection Status</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Action Status</TableHead>
            <TableHead>L1 Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <CandidateRow
              key={candidate.id}
              candidate={candidate}
              setCandidates={setCandidates}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
