import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useEvaluation } from "../context/EvaluationContext";
import { Upload, Settings, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const AnswerScriptUpload = () => {
  const { subjectSettings, setSubjectSettings, isAuthenticated } = useEvaluation();

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "English",
    "History",
    "Geography",
  ];

  const [selectedSubject, setSelectedSubject] = useState(
    subjectSettings?.subject || ""
  );
  const [templateFile, setTemplateFile] = useState<File | null>(null);

  const [sections, setSections] = useState({
    sectionA: {
      marksPerQuestion: subjectSettings?.sectionA.marksPerQuestion || 2,
      minimumMarks: subjectSettings?.sectionA.minimumMarks || 0,
      questionsToAttend: subjectSettings?.sectionA.questionsToAttend || 0,
    },
    sectionB: {
      marksPerQuestion: subjectSettings?.sectionB.marksPerQuestion || 6,
      minimumMarks: subjectSettings?.sectionB.minimumMarks || 0,
      questionsToAttend: subjectSettings?.sectionB.questionsToAttend || 0,
    },
    sectionC: {
      marksPerQuestion: subjectSettings?.sectionC.marksPerQuestion || 8,
      minimumMarks: subjectSettings?.sectionC.minimumMarks || 0,
      questionsToAttend: subjectSettings?.sectionC.questionsToAttend || 0,
    },
    sectionD: {
      marksPerQuestion: subjectSettings?.sectionD.marksPerQuestion || 10,
      minimumMarks: subjectSettings?.sectionD.minimumMarks || 0,
      questionsToAttend: subjectSettings?.sectionD.questionsToAttend || 0,
    },
  });

  useEffect(() => {
    if (subjectSettings) {
      setSelectedSubject(subjectSettings.subject);
    }
  }, []);

  const handleSectionChange = (
    section: keyof typeof sections,
    field: string,
    value: number
  ) => {
    setSections({
      ...sections,
      [section]: {
        ...sections[section],
        [field]: value,
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setTemplateFile(file);
      toast.success("Template file selected");
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to configure evaluation settings");
      return;
    }

    if (!selectedSubject) {
      toast.error("Please select a subject");
      return;
    }

    if (!templateFile) {
      toast.error("Please upload an answer template PDF");
      return;
    }

    setSubjectSettings({
      subject: selectedSubject,
      ...sections,
    });

    toast.success("Evaluation settings saved successfully!");
  };

  const handleReset = () => {
    setSections({
      sectionA: { marksPerQuestion: 2, minimumMarks: 0, questionsToAttend: 0 },
      sectionB: { marksPerQuestion: 6, minimumMarks: 0, questionsToAttend: 0 },
      sectionC: { marksPerQuestion: 8, minimumMarks: 0, questionsToAttend: 0 },
      sectionD: { marksPerQuestion: 10, minimumMarks: 0, questionsToAttend: 0 },
    });
    setTemplateFile(null);
    toast.info("Form reset");
  };

  const renderSectionConfig = (
    sectionKey: keyof typeof sections,
    sectionName: string
  ) => {
    const section = sections[sectionKey];
    return (
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
        <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
            {sectionName}
          </span>
          Section {sectionName} - {section.marksPerQuestion} Marks Questions
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${sectionKey}-min`}>Minimum Marks</Label>
            <Input
              id={`${sectionKey}-min`}
              type="number"
              min="0"
              value={section.minimumMarks}
              onChange={(e) =>
                handleSectionChange(
                  sectionKey,
                  "minimumMarks",
                  parseInt(e.target.value) || 0
                )
              }
              placeholder="Enter minimum marks"
            />
          </div>
          <div>
            <Label htmlFor={`${sectionKey}-questions`}>
              Questions to Attend
            </Label>
            <Input
              id={`${sectionKey}-questions`}
              type="number"
              min="0"
              value={section.questionsToAttend}
              onChange={(e) =>
                handleSectionChange(
                  sectionKey,
                  "questionsToAttend",
                  parseInt(e.target.value) || 0
                )
              }
              placeholder="Number of questions"
            />
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Answer Script Template Upload
          </h1>
          <p className="text-gray-600 mt-2">
            Configure evaluation settings and upload answer template
          </p>
        </div>
        <Settings className="w-8 h-8 text-blue-600" />
      </div>

      {subjectSettings && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <p className="text-green-800 text-sm">
            <strong>Active Configuration:</strong> {subjectSettings.subject} - Settings will persist until changed
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Subject Selection
          </h2>
          <div>
            <Label htmlFor="subject">Select Subject</Label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a subject</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <Label htmlFor="template">Upload Answer Template (PDF)</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <input
                id="template"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="template"
                className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
              >
                Click to upload
              </label>
              <p className="text-sm text-gray-500 mt-1">PDF files only</p>
              {templateFile && (
                <p className="text-sm text-green-600 mt-2 font-medium">
                  Selected: {templateFile.name}
                </p>
              )}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Section Configuration
          </h2>
          {renderSectionConfig("sectionA", "A")}
          {renderSectionConfig("sectionB", "B")}
          {renderSectionConfig("sectionC", "C")}
          {renderSectionConfig("sectionD", "D")}
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            Submit Configuration
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex items-center"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};
