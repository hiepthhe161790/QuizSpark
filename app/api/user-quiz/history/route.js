import { connectToDB } from '@/libs/mongoDB';
import UserQuiz from '@/app/models/UserQuizSchema';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await connectToDB();

  try {
    const userId = request.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const userQuizzes = await UserQuiz.find({ user: userId }).populate('quiz');

    return NextResponse.json({ userQuizzes }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}