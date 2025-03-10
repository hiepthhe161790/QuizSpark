import { connectToDB } from "@/libs/mongoDB";
import User from "@/app/models/UserSchema";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/libs/mailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectToDB();
  try {
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Tạo token reset mật khẩu
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 giờ
    await user.save();

    // Gửi email cho người dùng
    await sendResetPasswordEmail(email, token);

    return NextResponse.json({ message: "Password reset email sent" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
