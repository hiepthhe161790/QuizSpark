import { connectToDB } from "@/libs/mongoDB";
import User from "@/app/models/UserSchema";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function PUT(request) {
  await connectToDB();
  try {
    const { experience, isLogged } = await request.json();
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.experience = experience !== undefined ? experience : user.experience;
    user.isLogged = isLogged !== undefined ? isLogged : user.isLogged;
    await user.save();

    return NextResponse.json({ message: "User updated successfully", user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  await connectToDB();
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}