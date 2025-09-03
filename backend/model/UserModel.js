import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minlength: [2, "First name must be at least 2 characters long"],
    maxlength: [50, "First name cannot exceed 50 characters"]
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    minlength: [2, "Last name must be at least 2 characters long"],
    maxlength: [50, "Last name cannot exceed 50 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    trim: true,
    match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"]
  },
  // panNumber: {
  //   type: String,
  //   required: [true, "PAN number is required"],
  //   unique: true,
  //   uppercase: true,
  //   trim: true,
  //   match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter a valid PAN number"]
  // },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of birth is required"],
    validate: {
      validator: function(value) {
        const today = new Date();
        const age = today.getFullYear() - value.getFullYear();
        return age >= 18;
      },
      message: "You must be at least 18 years old to open an account"
    }
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    validate: {
      validator: function(value) {
        // Password must contain at least one uppercase letter, one lowercase letter, and one number
        return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value);
      },
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }
  },
  accountStatus: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'closed'],
    default: 'pending'
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user profile (without password)
userSchema.methods.getProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Index for better query performance (email and phone are already indexed via unique: true)
userSchema.index({ createdAt: -1 });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
