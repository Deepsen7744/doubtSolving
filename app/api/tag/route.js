import { Question } from '@/model/Test'
import { Tags } from '@/model/Tags'
import connectDB from '@/utils/db'
import { NextResponse } from 'next/server'

export async function POST(req) {
  await connectDB()
  try {
    const { subject, questions } = await req.json()
    console.log(questions[0].correctAnswer)

    // Find or create the tag for the subject
    let tag = await Tags.findOne({ name: subject })
    if (!tag) {
      tag = await Tags.create({ name: subject })
    }

    // Create and associate questions with the tag
    const questionIds = []
    for (const qData of questions) {
      const newQuestion = await Question.create({
        ...qData,
        tag: tag._id, // Associate the question with the tag
      })

      tag.questions.push(newQuestion._id)
      questionIds.push(newQuestion._id)
    }

    await tag.save()

    return NextResponse.json({
      success: true,
      message: `Questions created successfully for ${subject}`,
      questions,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      success: false,
      message: 'Something went wrong. Please retry later!',
    })
  }
}
