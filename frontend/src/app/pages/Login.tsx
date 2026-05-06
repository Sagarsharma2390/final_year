import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useEvaluation } from "../context/EvaluationContext";
import { Camera, CheckCircle, LogIn } from "lucide-react";
import { toast } from "sonner";

const BASE = "http://localhost:8000";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useEvaluation();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [faceData, setFaceData] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  // 📷 START CAMERA
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch {
      toast.error("Camera access denied");
    }
  };

  // 📷 CAPTURE FACE
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const image = canvas.toDataURL("image/png");

        setFaceData(image);

        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());

        setIsCameraActive(false);
        toast.success("Face captured");
      }
    }
  };

  // 🔥 LOGIN WITH BACKEND
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!faceData) {
      toast.error("Please capture face");
      return;
    }

    try {
      const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          face: faceData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        login(credentials.email, credentials.password); // update context
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Backend connection error");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-8">
        <div className="text-center mb-6">
          <LogIn className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Teacher Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleInputChange}
            required
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleInputChange}
            required
          />

          {/* FACE AUTH */}
          <div className="border p-4 rounded">
            <Label>Face Authentication</Label>

            {!faceData ? (
              <>
                {isCameraActive ? (
                  <>
                    <video ref={videoRef} autoPlay className="w-full" />
                    <Button type="button" onClick={captureImage}>
                      Capture Face
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={startCamera}>
                    Start Camera
                  </Button>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </>
            ) : (
              <>
                <img src={faceData} className="w-32 mx-auto" />
                <CheckCircle className="text-green-600 mx-auto" />
                <Button onClick={() => setFaceData("")}>Recapture</Button>
              </>
            )}
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>

          <p className="text-center text-sm">
            Don't have account? <Link to="/register">Register</Link>
          </p>
        </form>
      </Card>
    </div>
  );
};