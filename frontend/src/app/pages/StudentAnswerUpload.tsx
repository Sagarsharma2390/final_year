import { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useEvaluation } from "../context/EvaluationContext";
import { Upload, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const StudentAnswerUpload = () => {
  const navigate = useNavigate();
  const { subjectSettings, addResult, isAuthenticated } = useEvaluation();

  const [studentName, setStudentName] = useState("");
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setAnswerFile(file);
      toast.success("Answer script selected");
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const simulateAIEvaluation = (): Promise<{
    sectionA: number;
    sectionB: number;
    sectionC: number;
    sectionD: number;
  }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!subjectSettings) {
          resolve({ sectionA: 0, sectionB: 0, sectionC: 0, sectionD: 0 });
          return;
        }

        const sectionA =
          Math.floor(
            Math.random() *
              (subjectSettings.sectionA.questionsToAttend *
                subjectSettings.sectionA.marksPerQuestion)
          ) + subjectSettings.sectionA.minimumMarks;

        const sectionB =
          Math.floor(
            Math.random() *
              (subjectSettings.sectionB.questionsToAttend *
                subjectSettings.sectionB.marksPerQuestion)
          ) + subjectSettings.sectionB.minimumMarks;

        const sectionC =
          Math.floor(
            Math.random() *
              (subjectSettings.sectionC.questionsToAttend *
                subjectSettings.sectionC.marksPerQuestion)
          ) + subjectSettings.sectionC.minimumMarks;

        const sectionD =
          Math.floor(
            Math.random() *
              (subjectSettings.sectionD.questionsToAttend *
                subjectSettings.sectionD.marksPerQuestion)
          ) + subjectSettings.sectionD.minimumMarks;

        resolve({ sectionA, sectionB, sectionC, sectionD });
      }, 3000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to upload answer scripts");
      return;
    }

    if (!subjectSettings) {
      toast.error("Please configure subject settings first");
      navigate("/upload-template");
      return;
    }

    if (!studentName.trim()) {
      toast.error("Please enter student name");
      return;
    }

    if (!answerFile) {
      toast.error("Please upload student answer script");
      return;
    }

    setIsEvaluating(true);
    toast.info("AI is evaluating the answer script...");

    try {
      const sectionScores = await simulateAIEvaluation();

      const totalMarks =
        subjectSettings.sectionA.questionsToAttend *
          subjectSettings.sectionA.marksPerQuestion +
        subjectSettings.sectionB.questionsToAttend *
          subjectSettings.sectionB.marksPerQuestion +
        subjectSettings.sectionC.questionsToAttend *
          subjectSettings.sectionC.marksPerQuestion +
        subjectSettings.sectionD.questionsToAttend *
          subjectSettings.sectionD.marksPerQuestion;

      const scoredMarks =
        sectionScores.sectionA +
        sectionScores.sectionB +
        sectionScores.sectionC +
        sectionScores.sectionD;

      const result = {
        id: Date.now().toString(),
        studentName: studentName.trim(),
        subject: subjectSettings.subject,
        totalMarks,
        scoredMarks,
        sectionScores,
        evaluatedAt: new Date().toISOString(),
      };

      addResult(result);

      toast.success("Evaluation completed successfully!");
      setStudentName("");
      setAnswerFile(null);

      setTimeout(() => {
        navigate("/results");
      }, 1000);
    } catch (error) {
      toast.error("Evaluation failed. Please try again.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Upload Student Answer Scripts
          </h1>
          <p className="text-gray-600 mt-2">
            Upload student answers for AI-powered evaluation
          </p>
        </div>
        <FileText className="w-8 h-8 text-blue-600" />
      </div>

      {!subjectSettings && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Notice:</strong> Please configure subject settings in the "Upload Template" page before uploading student answers.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => navigate("/upload-template")}
          >
            Go to Template Upload
          </Button>
        </div>
      )}

      {subjectSettings && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">
            Active Subject Configuration
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>Subject:</strong> {subjectSettings.subject}
            </div>
            <div>
              <strong>Total Marks:</strong>{" "}
              {subjectSettings.sectionA.questionsToAttend *
                subjectSettings.sectionA.marksPerQuestion +
                subjectSettings.sectionB.questionsToAttend *
                  subjectSettings.sectionB.marksPerQuestion +
                subjectSettings.sectionC.questionsToAttend *
                  subjectSettings.sectionC.marksPerQuestion +
                subjectSettings.sectionD.questionsToAttend *
                  subjectSettings.sectionD.marksPerQuestion}
            </div>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Student Information
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                placeholder="Enter student full name"
                disabled={isEvaluating}
              />
            </div>

            <div>
              <Label htmlFor="answerScript">
                Upload Student Answer Script (PDF)
              </Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <input
                  id="answerScript"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isEvaluating}
                />
                <label
                  htmlFor="answerScript"
                  className={`${
                    isEvaluating
                      ? "cursor-not-allowed text-gray-400"
                      : "cursor-pointer text-blue-600 hover:text-blue-700"
                  } font-medium text-lg`}
                >
                  Click to upload answer script
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  PDF format only, maximum 10MB
                </p>
                {answerFile && (
                  <div className="mt-4 bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Selected: {answerFile.name}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Size: {(answerFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Button
          type="submit"
          className="w-full"
          disabled={isEvaluating || !subjectSettings}
        >
          {isEvaluating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Evaluating with AI...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Submit for Evaluation
            </>
          )}
        </Button>
      </form>

      {isEvaluating && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="text-center space-y-3">
            <Loader2 className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
            <h3 className="font-semibold text-gray-900">
              AI Evaluation in Progress
            </h3>
            <p className="text-sm text-gray-600">
              Our AI is analyzing the answer script, evaluating responses across
              all sections, and calculating scores...
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
