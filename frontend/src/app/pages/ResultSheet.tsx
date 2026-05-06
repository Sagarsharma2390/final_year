import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useEvaluation } from "../context/EvaluationContext";
import { Download, Search, BarChart3, FileText } from "lucide-react";
import { toast } from "sonner";

const BASE = "http://localhost:8000";

export const ResultSheet = () => {
  const { results, addResult } = useEvaluation();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH RESULTS FROM BACKEND
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE}/results`);
        const data = await res.json();

        if (data.results) {
          data.results.forEach((r: any) => addResult(r));
        }
      } catch (err) {
        console.error("Error fetching results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const filteredResults = results.filter(
    (result) =>
      result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔥 BACKEND PDF DOWNLOAD
  const downloadResult = async (result: any) => {
    try {
      const res = await fetch(`${BASE}/results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student: result.studentName,
          marks: result.scoredMarks,
          feedback: "AI evaluated",
        }),
      });

      const data = await res.json();

      // open PDF
      window.open(`${BASE}/${data.pdf}`);

      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download PDF");
    }
  };

  // 🔥 DOWNLOAD ALL
  const downloadAllResults = async () => {
    if (results.length === 0) {
      toast.error("No results available");
      return;
    }

    results.forEach((r) => downloadResult(r));
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

      {loading && <p className="text-blue-600">Loading results...</p>}

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
          {/* SEARCH */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button onClick={downloadAllResults}>
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>

            <p className="text-sm text-gray-600">
              Showing {filteredResults.length} results
            </p>
          </Card>

          {/* RESULTS */}
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
                <Card key={result.id} className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        {result.studentName}
                      </h3>

                      <p className="text-gray-600">{result.subject}</p>

                      <p className="mt-2 font-semibold">
                        {result.scoredMarks} / {result.totalMarks}
                      </p>

                      <span
                        className={`px-3 py-1 rounded ${gradeColor}`}
                      >
                        {percentage}%
                      </span>

                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(result.evaluatedAt).toLocaleString()}
                      </p>
                    </div>

                    <Button onClick={() => downloadResult(result)}>
                      <Download className="w-4 h-4 mr-2" />
                      PDF
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