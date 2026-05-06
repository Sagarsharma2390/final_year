import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useEvaluation } from "../context/EvaluationContext";
import { Camera, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const BASE = "http://localhost:8000";

export const Register = () => {
  const navigate = useNavigate();
  const { setTeacher } = useEvaluation();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    teacherId: "",
    stream: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  const [faceData, setFaceData] = useState<string>("");
  const [isCameraActive, setIsCameraActive] = useState(false);

  const streams = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
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

  // 📷 CAPTURE IMAGE
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

  // 🔥 REGISTER WITH BACKEND
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!faceData) {
      toast.error("Capture face first");
      return;
    }

    try {
      const res = await fetch(`${BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          face: faceData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setTeacher({ ...formData, faceData });
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Backend connection error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <h1 className="text-2xl font-bold mb-6">Teacher Registration</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NAME */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input name="firstName" placeholder="First Name" onChange={handleInputChange} required />
            <Input name="lastName" placeholder="Last Name" onChange={handleInputChange} required />
          </div>

          <Input name="teacherId" placeholder="Teacher ID" onChange={handleInputChange} required />

          {/* STREAM */}
          <select
            name="stream"
            onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Stream</option>
            {streams.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <Input name="phoneNumber" placeholder="Phone Number" onChange={handleInputChange} required />
          <Input name="email" type="email" placeholder="Email" onChange={handleInputChange} required />
          <Input name="password" type="password" placeholder="Password" onChange={handleInputChange} required />

          {/* FACE CAPTURE */}
          <div className="border p-4 rounded">
            <Label>Face Capture</Label>

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
                <img src={faceData} className="w-40 mx-auto" />
                <CheckCircle className="text-green-600 mx-auto" />
                <Button onClick={() => setFaceData("")}>Recapture</Button>
              </>
            )}
          </div>

          <Button type="submit" className="w-full">
            Register
          </Button>

          <p className="text-center text-sm">
            Already have account? <Link to="/login">Login</Link>
          </p>
        </form>
      </Card>
    </div>
  );
};