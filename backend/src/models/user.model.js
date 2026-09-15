import mongoose from "mongoose";

/*
  Dummy data example:
  {
    name: "Jane Doe",
    email: "janedoe@example.com",
    password: "$2a$10$1234567890abcdefg", // hashed password example
    profilePhoto: "https://randomuser.me/api/portraits/women/1.jpg",
    educationBackground: "B.Sc. in Computer Science",
    bio: "Eager learner passionate about technology and AI.",
    interests: ["AI", "Web Development", "Machine Learning"],
    role: "learner"
  }
*/

const LearnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    profilePhoto: String,
    educationBackground: String,
    bio: String,
    interests: { type: [String], default: [] },
    role: { type: String, required: true, enum: ["learner", "proffesional", "admin"] },
  },
  { timestamps: true }
);

const Learner = mongoose.model("Learner", LearnerSchema);

export default Learner;