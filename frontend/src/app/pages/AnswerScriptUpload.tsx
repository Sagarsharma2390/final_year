import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useEvaluation } from "../context/EvaluationContext";
import { Upload, Settings, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";

// 🔥 IMPORT API
import { uploadAnswer } from "@/services/api";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  }, [subjectSettings]);

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

  // 🔥 UPDATED SUBMIT (BACKEND CONNECTED)
  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);
    toast.info("Uploading template and saving configuration...");

    try {
      // ✅ STEP 1: Upload template PDF
      const uploadRes = await uploadAnswer(templateFile);
      console.log("Template uploaded:", uploadRes.file_path);

      // ✅ STEP 2: Save config (frontend + backend ready)
      const configData = {
        subject: selectedSubject,
        ...sections,
      };

      // Save locally (your context)
      setSubjectSettings(configData);

      // OPTIONAL: send to backend (if you create /subject API)
      /*
      await fetch("http://localhost:8000/subject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configData),
      });
      */

      toast.success("Evaluation settings saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save configuration");
    } finally {
      setIsSubmitting(false);
    }
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
        <h3 className="font-semibold text-lg text-gray-900 mb-4">
          Section {sectionName} - {section.marksPerQuestion} Marks Questions
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Minimum Marks</Label>
            <Input
              type="number"
              value={section.minimumMarks}
              onChange={(e) =>
                handleSectionChange(
                  sectionKey,
                  "minimumMarks",
                  parseInt(e.target.value) || 0
                )
              }
            />
          </div>

          <div>
            <Label>Questions to Attend</Label>
            <Input
              type="number"
              value={section.questionsToAttend}
              onChange={(e) =>
                handleSectionChange(
                  sectionKey,
                  "questionsToAttend",
                  parseInt(e.target.value) || 0
                )
              }
            />
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Answer Script Template Upload</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <Label>Select Subject</Label>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Choose subject</option>
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <div className="mt-4">
            <Label>Upload Template PDF</Label>

            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />

            {templateFile && (
              <p className="text-green-600 mt-2">
                Selected: {templateFile.name}
              </p>
            )}
          </div>
        </Card>

        {renderSectionConfig("sectionA", "A")}
        {renderSectionConfig("sectionB", "B")}
        {renderSectionConfig("sectionC", "C")}
        {renderSectionConfig("sectionD", "D")}

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Submit Configuration"
            )}
          </Button>

          <Button type="button" variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2" />
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};