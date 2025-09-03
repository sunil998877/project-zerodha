import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./sinup.css";
import Signin from "./Signin";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showSignin, setShowSignin] = useState(false);

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

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters long";
    } else if (formData.firstName.trim().length > 50) {
      newErrors.firstName = "First name cannot exceed 50 characters";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters long";
    } else if (formData.lastName.trim().length > 50) {
      newErrors.lastName = "Last name cannot exceed 50 characters";
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    // Date of Birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = "You must be at least 18 years old to open an account";
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...dataToSend } = formData;
      
      const response = await axios.post("http://localhost:5000/signup", dataToSend);
      
      if (response.data.success) {
        // Clear form data
        setSignupSuccess(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          password: "",
          confirmPassword: ""
        });
        
        // Show success message and open dashboard
        const successMessage = "Account created successfully! 🎉\n\nDashboard will open in a new tab.\nIf it doesn't open automatically, click the 'Go to Dashboard' button below.";
        alert(successMessage);
        
        // Open dashboard in new tab after successful signup
        setTimeout(() => {
          window.open("http://localhost:3001/dashboad", "_blank");
        }, 1000);
      }
    } catch (error) {
      let errorMessage = "Signup failed. Please try again.";
      
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
          
          {/* Toggle between Signup and Signin */}
          <div className="form-toggle">
            <button 
              className={`toggle-btn ${!showSignin ? 'active' : ''}`}
              onClick={() => setShowSignin(false)}
            >
              Create Account
            </button>
            <button 
              className={`toggle-btn ${showSignin ? 'active' : ''}`}
              onClick={() => setShowSignin(true)}
            >
              Sign In
            </button>
          </div>
          
          {!showSignin ? (
            <>
              <h2 className="signup-title">Create Your Zerodha Account</h2>
              <p className="signup-subtitle">Join millions of traders and investors</p>
            </>
          ) : (
            <>
              <h2 className="signup-title">Welcome Back to Zerodha</h2>
              <p className="signup-subtitle">Sign in to your trading account</p>
            </>
          )}
          
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
        
        {showSignin ? (
          <Signin onSwitchToSignup={() => setShowSignin(false)} />
        ) : (
          <>
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? "error" : ""}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? "error" : ""}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>

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
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "error" : ""}
                  placeholder="Enter 10-digit phone number"
                  maxLength="10"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth *</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={errors.dateOfBirth ? "error" : ""}
                />
                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
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
                  placeholder="Create a strong password"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
                <div className="password-requirements">
                  <small>Password must be at least 8 characters with uppercase, lowercase, and number</small>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error" : ""}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span className="checkmark"></span>
                  I agree to the <a href="/terms" target="_blank">Terms & Conditions</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
                </label>
              </div>

              <button 
                type="submit" 
                className="signup-btn" 
                disabled={isLoading || backendStatus !== "connected"}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
                {backendStatus !== "connected" && " (Backend Required)"}
              </button>
            </form>

            {signupSuccess && (
              <div className="success-section">
                <div className="success-icon">🎉</div>
                <h3>Account Created Successfully!</h3>
                <p>Your Zerodha account has been created. You can now access the dashboard.</p>
                                 <button 
                   className="dashboard-btn success"
                   onClick={() => window.open("http://localhost:3000", "_blank")}
                 >
                   🚀 Open Dashboard
                 </button>
                <button 
                  className="reset-btn"
                  onClick={() => setSignupSuccess(false)}
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
                  Create Another Account
                </button>
              </div>
            )}

                

            <div className="signup-footer">
              <p>Already have an account? <a href="#" onClick={() => setShowSignin(true)}>Sign In Here</a></p>
              
              {backendStatus === "disconnected" && (
                <div className="backend-help">
                  <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '10px' }}>
                    💡 To fix: Start your backend server with <code>npm start</code> in the backend folder
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
