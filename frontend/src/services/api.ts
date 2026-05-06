const BASE_URL = "http://localhost:8000";

// 🔹 Generic response handler
const handleResponse = async <T>(res: Response): Promise<T> => {
  const text = await res.text();

  try {
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) {
      throw new Error(data?.detail || data?.message || "API Error");
    }
    return data;
  } catch {
    if (!res.ok) {
      throw new Error(text || "API Error");
    }
    return {} as T;
  }
};

// =========================
// 📄 Upload Answer PDF
// =========================
export const uploadAnswer = async (
  file: File
): Promise<{ file_path: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload/answer`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(res);
};

// =========================
// 🤖 Evaluate Answer
// =========================
export const evaluateAnswer = async (
  file_path: string,
  config: any
): Promise<{ marks: number; total?: number; feedback?: string }> => {
  const res = await fetch(`${BASE_URL}/evaluate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file_path, config }),
  });

  return handleResponse(res);
};

// =========================
// 📊 Generate Result PDF
// =========================
export const generateResult = async (data: {
  student: string;
  marks: number;
  feedback?: string;
}): Promise<{ pdf: string }> => {
  const res = await fetch(`${BASE_URL}/results`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};

// =========================
// 📥 Get All Results
// =========================
export const getResults = async (): Promise<{ results: any[] }> => {
  const res = await fetch(`${BASE_URL}/results`);
  return handleResponse(res);
};