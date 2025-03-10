import { connectToDB } from '@/libs/mongoDB';
import UserQuiz from '@/app/models/UserQuizSchema';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  await connectToDB();

  try {
    const { id } = params;
    const userQuiz = await UserQuiz.findById(id).populate('quiz');

    if (!userQuiz) {
      return NextResponse.json({ message: 'UserQuiz not found' }, { status: 404 });
    }

    return NextResponse.json({ userQuiz }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}