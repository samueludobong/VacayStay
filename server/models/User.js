import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    _id: { type: String, required: true }, // Clerk ID
    username: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, default: "" }, // optional
    role: { type: String, enum: ["user", "hotelOwner"], default: "user" },
    recentSearchedCities: { type: [String], default: [] }, // not required
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
