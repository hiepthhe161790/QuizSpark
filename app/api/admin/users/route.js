import { connectToDB } from "@/libs/mongoDB";
import User from "@/app/models/UserSchema";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  try {
    const users = await User.find({});
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await connectToDB();
  try {
    const { name, email, password } = await request.json();
    const isLogged = false;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const newUser = await User.create({ name, email, password, isLogged });
    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  await connectToDB();
  try {
    const { id, name, email, password, role } = await request.json();
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password, role },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully', user: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await connectToDB();
  try {
    const { id } = params;
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}