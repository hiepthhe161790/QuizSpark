import { connectToDB } from "@/libs/mongoDB";
import User from "@/app/models/UserSchema";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectToDB();
  try {
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    if (user.password !== password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    user.isLogged = true;
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return NextResponse.json({ message: "Login successful", token, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}