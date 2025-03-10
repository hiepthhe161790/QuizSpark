import { connectToDB } from '@/libs/mongoDB';
import UserQuiz from '@/app/models/UserQuizSchema';
import User from '@/app/models/UserSchema';
import Quiz from '@/app/models/QuizSchema';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await connectToDB();

  try {
    const { userId, quizId, score, answers } = await request.json();

    const user = await User.findById(userId);
    const quiz = await Quiz.findById(quizId);

    if (!user || !quiz) {
      return NextResponse.json({ message: 'User or Quiz not found' }, { status: 404 });
    }

    const userQuiz = new UserQuiz({
      user: userId,
      quiz: quizId,
      score,
      answers,
    });

    await userQuiz.save();

    return NextResponse.json({ message: 'User quiz saved successfully', userQuiz }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}