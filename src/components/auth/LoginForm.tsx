
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LoginFormProps {
  onRoleSelect: (role: string) => void;
}

const LoginForm = ({ onRoleSelect }: LoginFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "student",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      
      if (formData.username && formData.password) {
        onRoleSelect(formData.role);
        toast.success("Login successful!");
        
        if (formData.role === "admin") {
          navigate("/admin");
        } else if (formData.role === "instructor") {
          navigate("/instructor");
        } else {
          navigate("/student");
        }
      } else {
        toast.error("Please enter both username and password");
      }
    }, 1000);
  };

  const getUsernameLabel = () => {
    if (formData.role === "student") return "Roll No.";
    if (formData.role === "instructor") return "Staff ID";
    return "Username";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          {getUsernameLabel()}
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          className="lms-input"
          value={formData.username}
          onChange={handleChange}
          placeholder={formData.role === "student" ? "Enter your Roll No." : formData.role === "instructor" ? "Enter your Staff ID" : "Enter your username"}
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Link to="#" className="text-sm text-lms-blue hover:underline" onClick={() => toast.info("Forgot password functionality requires backend setup.")}>
            Forgot Password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="lms-input"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
      </div>
      
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Login As
        </label>
        <select
          id="role"
          name="role"
          className="lms-input"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Administrator</option>
        </select>
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full bg-lms-blue text-white hover:bg-lms-darkBlue"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
