import jwt from 'jsonwebtoken';
import User from '@/app/models/UserSchema';
import { connectToDB } from '@/libs/mongoDB';
import { NextResponse } from 'next/server';

const SECRET_KEY = 'your_secret_key';

export async function POST(request) {
  await connectToDB();

  try {
    const { name, email, password } = await request.json();
    const role = 'user'; // Set default value for role
    const isLogged = false; // Set default value for isLogged
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Tạo người dùng mới mà không mã hóa mật khẩu
    const newUser = await User.create({ name, email, password, isLogged, role });

    const token = jwt.sign({ id: newUser._id }, SECRET_KEY, { expiresIn: '1d' });

    return NextResponse.json({ message: 'User registered successfully', token, user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}