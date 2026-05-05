import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { AnswerScriptUpload } from "./pages/AnswerScriptUpload";
import { StudentAnswerUpload } from "./pages/StudentAnswerUpload";
import { ResultSheet } from "./pages/ResultSheet";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "register", Component: Register },
      { path: "login", Component: Login },
      { path: "upload-template", Component: AnswerScriptUpload },
      { path: "upload-answers", Component: StudentAnswerUpload },
      { path: "results", Component: ResultSheet },
    ],
  },
]);
