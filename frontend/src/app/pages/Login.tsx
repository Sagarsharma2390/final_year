import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useEvaluation } from "../context/EvaluationContext";
import { Camera, CheckCircle, LogIn } from "lucide-react";
import { toast } from "sonner";

export const Login = () => {
  const navigate = useNavigate();
  const { login, teacher } = useEvaluation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [faceData, setFaceData] = useState<string>("");
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      toast.error("Unable to access camera. Please check permissions.");
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/png");
        setFaceData(imageData);
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach((track) => track.stop());
        setIsCameraActive(false);
        toast.success("Face captured successfully!");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!teacher) {
      toast.error("No account found. Please register first.");
      return;
    }

    if (!faceData) {
      toast.error("Please capture your face for authentication");
      return;
    }

    const isAuthenticated = login(credentials.email, credentials.password);

    if (isAuthenticated) {
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-8">
        <div className="text-center mb-6">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Login</h1>
          <p className="text-gray-600 mt-2">
            Access the Smart Evaluation System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Username or Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <Label className="mb-3 block">Face Authentication</Label>
            {!faceData ? (
              <div className="space-y-4">
                {isCameraActive ? (
                  <div className="space-y-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      className="w-full rounded-lg border"
                    />
                    <Button
                      type="button"
                      onClick={captureImage}
                      className="w-full"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Capture Face
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    onClick={startCamera}
                    variant="outline"
                    className="w-full"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Face Capture Button
                  </Button>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            ) : (
              <div className="text-center space-y-4">
                <img
                  src={faceData}
                  alt="Captured face"
                  className="w-32 h-32 object-cover mx-auto rounded-lg border"
                />
                <div className="flex items-center justify-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Face captured
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFaceData("")}
                >
                  Recapture
                </Button>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Submit
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Register
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
};
