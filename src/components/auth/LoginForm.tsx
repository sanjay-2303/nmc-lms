
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      
      // This is a demo - in a real app, you would validate credentials against a backend
      if (formData.username && formData.password) {
        onRoleSelect(formData.role);
        toast.success("Login successful!");
        
        // Redirect based on role
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username / Student ID
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          className="lms-input"
          value={formData.username}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="lms-input"
          value={formData.password}
          onChange={handleChange}
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
