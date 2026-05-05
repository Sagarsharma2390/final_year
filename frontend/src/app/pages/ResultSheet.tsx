import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useEvaluation } from "../context/EvaluationContext";
import { Download, Search, BarChart3, FileText } from "lucide-react";
import { toast } from "sonner";

export const ResultSheet = () => {
  const { results, teacher } = useEvaluation();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResults = results.filter(
    (result) =>
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDF = (resultId: string) => {
    const result = results.find((r) => r.id === resultId);
    if (!result) return;

    const percentage = ((result.scoredMarks / result.totalMarks) * 100).toFixed(2);

    const pdfContent = `
AI SMART EVALUATION SYSTEM
RESULT SHEET
${"=".repeat(60)}

Student Name: ${result.studentName}
Subject: ${result.subject}
Evaluation Date: ${new Date(result.evaluatedAt).toLocaleDateString()}

${"=".repeat(60)}
SECTION-WISE BREAKDOWN
${"=".repeat(60)}

Section A (2 Marks): ${result.sectionScores.sectionA} marks
Section B (6 Marks): ${result.sectionScores.sectionB} marks
Section C (8 Marks): ${result.sectionScores.sectionC} marks
Section D (10 Marks): ${result.sectionScores.sectionD} marks

${"=".repeat(60)}
TOTAL SCORE
${"=".repeat(60)}

Marks Obtained: ${result.scoredMarks} / ${result.totalMarks}
Percentage: ${percentage}%

${"=".repeat(60)}
Evaluated by: ${teacher?.firstName || ""} ${teacher?.lastName || ""}
Teacher ID: ${teacher?.teacherId || "N/A"}

Generated on: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([pdfContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.studentName.replace(/\s+/g, "_")}_${result.subject}_Result.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Result sheet downloaded successfully!");
  };

  const downloadAllResults = () => {
    if (results.length === 0) {
      toast.error("No results available to download");
      return;
    }

    let allResultsContent = `
AI SMART EVALUATION SYSTEM
CONSOLIDATED RESULT SHEET
${"=".repeat(80)}

Total Evaluations: ${results.length}
Generated on: ${new Date().toLocaleString()}

${"=".repeat(80)}

`;

    results.forEach((result, index) => {
      const percentage = ((result.scoredMarks / result.totalMarks) * 100).toFixed(2);
      allResultsContent += `
${index + 1}. ${result.studentName}
   Subject: ${result.subject}
   Score: ${result.scoredMarks}/${result.totalMarks} (${percentage}%)
   Section A: ${result.sectionScores.sectionA} | Section B: ${result.sectionScores.sectionB} | Section C: ${result.sectionScores.sectionC} | Section D: ${result.sectionScores.sectionD}
   Date: ${new Date(result.evaluatedAt).toLocaleDateString()}
${"-".repeat(80)}
`;
    });

    const blob = new Blob([allResultsContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `All_Results_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("All results downloaded successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Result Sheet</h1>
          <p className="text-gray-600 mt-2">
            View and download evaluation results
          </p>
        </div>
        <BarChart3 className="w-8 h-8 text-blue-600" />
      </div>

      {results.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Results Available
          </h2>
          <p className="text-gray-500">
            Upload and evaluate student answer scripts to see results here.
          </p>
        </Card>
      ) : (
        <>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by student name or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={downloadAllResults} className="ml-4">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredResults.length} of {results.length} results
            </div>
          </Card>

          <div className="grid gap-4">
            {filteredResults.map((result) => {
              const percentage = (
                (result.scoredMarks / result.totalMarks) *
                100
              ).toFixed(2);
              const gradeColor =
                parseFloat(percentage) >= 75
                  ? "text-green-600 bg-green-50"
                  : parseFloat(percentage) >= 50
                  ? "text-yellow-600 bg-yellow-50"
                  : "text-red-600 bg-red-50";

              return (
                <Card key={result.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {result.studentName}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${gradeColor}`}
                        >
                          {percentage}%
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Subject</p>
                          <p className="font-semibold text-gray-900">
                            {result.subject}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Score</p>
                          <p className="font-semibold text-gray-900">
                            {result.scoredMarks} / {result.totalMarks}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Section-wise Breakdown:
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="bg-white p-2 rounded border">
                            <span className="text-gray-600">Section A:</span>
                            <span className="font-semibold text-gray-900 ml-2">
                              {result.sectionScores.sectionA}
                            </span>
                          </div>
                          <div className="bg-white p-2 rounded border">
                            <span className="text-gray-600">Section B:</span>
                            <span className="font-semibold text-gray-900 ml-2">
                              {result.sectionScores.sectionB}
                            </span>
                          </div>
                          <div className="bg-white p-2 rounded border">
                            <span className="text-gray-600">Section C:</span>
                            <span className="font-semibold text-gray-900 ml-2">
                              {result.sectionScores.sectionC}
                            </span>
                          </div>
                          <div className="bg-white p-2 rounded border">
                            <span className="text-gray-600">Section D:</span>
                            <span className="font-semibold text-gray-900 ml-2">
                              {result.sectionScores.sectionD}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mt-3">
                        Evaluated on:{" "}
                        {new Date(result.evaluatedAt).toLocaleString()}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generatePDF(result.id)}
                      className="ml-4"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
