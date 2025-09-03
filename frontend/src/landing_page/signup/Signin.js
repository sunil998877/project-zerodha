import React, { useState } from "react";
import axios from "axios";
import "./sinup.css";

const Signin = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [signinSuccess, setSigninSuccess] = useState(false);

  // Check backend connection on component mount
  React.useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await axios.get("http://localhost:5000/");
      if (response.data.message) {
        setBackendStatus("connected");
      }
    } catch (error) {
      setBackendStatus("disconnected");
      console.error("Backend connection failed:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post("http://localhost:5000/signin", formData);
      
      if (response.data.success) {
        setSigninSuccess(true);
        setFormData({
          email: "",
          password: ""
        });
        
        // Show success message and open dashboard
        const successMessage = "Login successful! 🎉\n\nDashboard will open in a new tab.\nIf it doesn't open automatically, click the 'Open Dashboard' button below.";
        alert(successMessage);
        
        // Open dashboard in new tab after successful signin
        setTimeout(() => {
          window.open("http://localhost:3001/dashboard", "_blank");
        }, 1000);
      }
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = "Network error. Please check if the backend server is running.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-header">
          <img src="/logo.svg" alt="Zerodha Logo" className="logo" />
          <h2 className="signup-title">Welcome Back to Zerodha</h2>
          <p className="signup-subtitle">Sign in to your trading account</p>
          
          {/* Backend Status Indicator */}
          <div className={`backend-status ${backendStatus}`}>
            {backendStatus === "checking" && "🔄 Checking connection..."}
            {backendStatus === "connected" && "✅ Backend connected"}
            {backendStatus === "disconnected" && (
              <div>
                ❌ Backend disconnected
                <button 
                  className="retry-btn" 
                  onClick={checkBackendConnection}
                  style={{ marginLeft: '10px', padding: '4px 8px', fontSize: '10px' }}
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder="Enter your email address"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
          </div>

          <button 
            type="submit" 
            className="signup-btn" 
            disabled={isLoading || backendStatus !== "connected"}
          >
            {isLoading ? "Signing In..." : "Sign In"}
            {backendStatus !== "connected" && " (Backend Required)"}
          </button>
        </form>

        {signinSuccess && (
          <div className="success-section">
            <div className="success-icon">🎉</div>
            <h3>Login Successful!</h3>
            <p>Welcome back! You can now access your dashboard.</p>
                         <button 
               className="dashboard-btn success"
               onClick={() => window.open("http://localhost:3001/dashboard", "_blank")}
             >
               🚀 Open Dashboard
             </button>
            <button 
              className="reset-btn"
              onClick={() => setSigninSuccess(false)}
              style={{ 
                marginLeft: '15px', 
                padding: '12px 20px', 
                background: '#6b7280', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Sign In Again
            </button>
          </div>
        )}

                 <div className="dashboard-access">
           <button 
             type="button" 
             className="dashboard-btn"
             onClick={() => window.open("http://localhost:3001/dashboard", "_blank")}
             >
             Go to Dashboard
           </button>
         </div>

        <div className="signup-footer">
          <p>Don't have an account? <a href="#" onClick={onSwitchToSignup}>Create Account</a></p>
          <p><a href="/forgot-password" target="_blank" rel="noopener noreferrer">Forgot Password?</a></p>
          
          {backendStatus === "disconnected" && (
            <div className="backend-help">
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '10px' }}>
                💡 To fix: Start your backend server with <code>npm start</code> in the backend folder
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signin;
