import { RouterProvider } from "react-router";
import { router } from "./routes";
import { EvaluationProvider } from "./context/EvaluationContext";

export default function App() {
  return (
    <EvaluationProvider>
      <RouterProvider router={router} />
    </EvaluationProvider>
  );
}