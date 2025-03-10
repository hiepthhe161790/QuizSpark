import mongoose, { Schema } from 'mongoose';

const userQuizSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quiz: {
    type: Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
  answers: [
    {
      questionId: {
        type: String,
        required: true,
      },
      selectedAnswer: {
        type: Number,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

const UserQuiz = mongoose.models.UserQuiz || mongoose.model('UserQuiz', userQuizSchema);

export default UserQuiz;