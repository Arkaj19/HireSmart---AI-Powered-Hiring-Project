import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

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
    <TableRow className="hover:bg-gray-50">
      <TableCell className="px-6 py-4 text-sm text-gray-900">
        {jd.position_id}
      </TableCell>

      <TableCell className="px-6 py-4 text-sm text-gray-900">
        {jd.title}
      </TableCell>

      <TableCell className="px-6 py-4 text-sm text-blue-600">
        <Button
          variant="ghost"
          className="h-auto p-0 text-gray-700 hover:text-blue-600 hover:bg-transparent font-normal cursor-pointer"
          onClick={handleViewJD}
        >
          <FileText className="w-4 h-4 mr-2" />
          View
        </Button>
      </TableCell>
      <TableCell className="px-6 py-4 text-sm">
        {jd.status || "Active"}
      </TableCell>
    </TableRow>
  );
}

export default JobDescriptionRow;
