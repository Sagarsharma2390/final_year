import { Card } from "../components/ui/card";
import { useEvaluation } from "../context/EvaluationContext";
import { BarChart3, FileCheck, Upload, TrendingUp } from "lucide-react";

export const Dashboard = () => {
  const { results, subjectSettings, isAuthenticated } = useEvaluation();

  const stats = [
    {
      title: "Total Evaluations",
      value: results.length,
      icon: FileCheck,
      color: "bg-blue-500",
    },
    {
      title: "Subjects Configured",
      value: subjectSettings ? 1 : 0,
      icon: Upload,
      color: "bg-green-500",
    },
    {
      title: "Average Score",
      value: results.length > 0
        ? `${(results.reduce((acc, r) => acc + (r.scoredMarks / r.totalMarks) * 100, 0) / results.length).toFixed(1)}%`
        : "0%",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      title: "Pending Reviews",
      value: 0,
      icon: BarChart3,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to the AI-based Smart Evaluation System
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          About the Evaluation System
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            The AI-based Smart Evaluation System is designed to streamline and
            automate the assessment process for educational institutions. Our
            system leverages advanced AI algorithms to evaluate student answer
            scripts with precision and consistency.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Key Features
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Automated answer script evaluation</li>
                <li>• Face recognition for secure authentication</li>
                <li>• Customizable marking schemes per subject</li>
                <li>• Section-wise evaluation (A, B, C, D)</li>
                <li>• PDF-based answer script uploads</li>
                <li>• Instant result generation and downloads</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                Evaluation Process
              </h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>1. Register and configure your profile</li>
                <li>2. Set up subject-specific marking schemes</li>
                <li>3. Upload student answer scripts (PDF)</li>
                <li>4. AI processes and evaluates submissions</li>
                <li>5. Review and download detailed results</li>
              </ul>
            </div>
          </div>
          {!isAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-4">
              <p className="text-yellow-800 text-sm">
                <strong>Getting Started:</strong> Please register or login to
                access the full evaluation system features.
              </p>
            </div>
          )}
        </div>
      </Card>

      {results.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Evaluations
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Student Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Subject
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Score
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 5).map((result) => (
                  <tr key={result.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {result.studentName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {result.subject}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {result.scoredMarks} / {result.totalMarks}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(result.evaluatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
