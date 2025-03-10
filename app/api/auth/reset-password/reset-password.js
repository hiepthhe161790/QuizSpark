import { connectToDB } from "@/libs/mongoDB";
import User from "@/app/models/UserSchema";
import crypto from "crypto";

import { NextResponse } from "next/server";
import { sendResetPasswordEmail } from "@/libs/mailer";


export async function POST(request) {
  await connectToDB();
  try {
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    await sendResetPasswordEmail(email, token);

    return NextResponse.json({ message: "Password reset email sent" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
