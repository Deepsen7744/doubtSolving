import mongoose from 'mongoose'

const questionsSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  option1: {
    type: String,
  },
  option2: {
    type: String,
  },
  option3: {
    type: String,
  },
  option4: {
    type: String,
  },
  correctAnswer: {
    type: String,
  },
  tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tags',
    required: true,
  },
})

export const Question =
  mongoose.models.Question || mongoose.model('Question', questionsSchema)
