import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { useEvaluation } from "../context/EvaluationContext";
import { BarChart3, FileCheck, Upload, TrendingUp } from "lucide-react";

// 🔥 API CALL
const BASE = "http://localhost:8000";

export const Dashboard = () => {
  const { results, subjectSettings, isAuthenticated, addResult } = useEvaluation();

  const [loading, setLoading] = useState(false);

  // 🔥 FETCH RESULTS FROM BACKEND
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${BASE}/results`);
        const data = await res.json();

        // OPTIONAL: sync backend → frontend context
        if (data.results) {
          data.results.forEach((r: any) => addResult(r));
        }
      } catch (err) {
        console.error("Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

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
      value:
        results.length > 0
          ? `${(
              results.reduce(
                (acc, r) => acc + (r.scoredMarks / r.totalMarks) * 100,
                0
              ) / results.length
            ).toFixed(1)}%`
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
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to the AI-based Smart Evaluation System
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-blue-600 text-sm">Loading results from backend...</p>
      )}

      {/* STATS */}
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

      {/* ABOUT SECTION */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          About the Evaluation System
        </h2>

        <div className="space-y-4 text-gray-700">
          <p>
            The AI-based Smart Evaluation System automates the assessment process
            using AI. Upload PDFs, configure marking schemes, and get instant results.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Key Features
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Automated evaluation</li>
                <li>• Face authentication</li>
                <li>• Section-wise marking</li>
                <li>• PDF upload</li>
                <li>• Instant results</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                Evaluation Process
              </h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>1. Register & Login</li>
                <li>2. Configure subject</li>
                <li>3. Upload answers</li>
                <li>4. AI evaluates</li>
                <li>5. View results</li>
              </ul>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-4">
              <p className="text-yellow-800 text-sm">
                Please login to access full features.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* RECENT RESULTS */}
      {results.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Evaluations
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold">
                    Student Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">
                    Subject
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">
                    Score
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {results.slice(0, 5).map((result) => (
                  <tr key={result.id} className="border-b">
                    <td className="py-3 px-4">{result.studentName}</td>
                    <td className="py-3 px-4">{result.subject}</td>
                    <td className="py-3 px-4">
                      {result.scoredMarks} / {result.totalMarks}
                    </td>
                    <td className="py-3 px-4">
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