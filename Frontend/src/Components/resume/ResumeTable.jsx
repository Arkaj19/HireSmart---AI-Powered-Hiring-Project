import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ResumeRow from "./ResumeRow";

export default function ResumeTable({ resumes }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50">
            <TableHead className="px-6 py-3">Name</TableHead>
            <TableHead className="px-6 py-3">Email</TableHead>
            <TableHead className="px-6 py-3">Position</TableHead>
            <TableHead className="px-6 py-3">Experience</TableHead>
            <TableHead className="px-6 py-3">Applied Date</TableHead>
            <TableHead className="px-6 py-3">Selection Status</TableHead>
            <TableHead className="px-6 py-3">Resume</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="bg-white divide-y divide-gray-200">
          {resumes.map((item) => (
            <ResumeRow key={item.id} resume={item} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
