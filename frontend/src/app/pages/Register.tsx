import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select } from "../components/ui/select";
import { useEvaluation } from "../context/EvaluationContext";
import { Camera, CheckCircle } from "lucide-react";
import { toast } from "sonner";

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
    "English",
    "History",
    "Geography",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
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

    if (!faceData) {
      toast.error("Please capture your face for registration");
      return;
    }

    setTeacher({
      ...formData,
      faceData,
    });

    toast.success("Registration successful!");
    navigate("/login");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Teacher Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="Enter first name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="teacherId">Teacher ID</Label>
            <Input
              id="teacherId"
              name="teacherId"
              value={formData.teacherId}
              onChange={handleInputChange}
              required
              placeholder="Enter teacher ID"
            />
          </div>

          <div>
            <Label htmlFor="stream">Stream</Label>
            <select
              id="stream"
              name="stream"
              value={formData.stream}
              onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Stream</option>
              {streams.map((stream) => (
                <option key={stream} value={stream}>
                  {stream}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <Label htmlFor="email">Email ID</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter email address"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Create a password"
            />
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <Label className="mb-3 block">Face Recognition</Label>
            {!faceData ? (
              <div className="space-y-4">
                {isCameraActive ? (
                  <div className="space-y-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      className="w-full max-w-md mx-auto rounded-lg border"
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
                    Start Camera
                  </Button>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            ) : (
              <div className="text-center space-y-4">
                <img
                  src={faceData}
                  alt="Captured face"
                  className="w-48 h-48 object-cover mx-auto rounded-lg border"
                />
                <div className="flex items-center justify-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Face captured successfully
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
            Submit Registration
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
};
