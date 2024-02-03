import { Expert } from '@/model/expert'
import { NextResponse } from 'next/server'
import connectDB from '@/utils/db'

export async function DELETE(req) {
  await connectDB()
  try {
    const { expertId, skillsToDelete } = await req.json()

    const expert = await Expert.findById(expertId)
    // console.log(expert)

    if (!expert) {
      return NextResponse.json({
        success: false,
        message: 'expert not found',
      })
    }
    expert.Skills = expert.Skills.filter(
      (skill) => !skillsToDelete.includes(skill)
    )

    console.log(expert)

    await expert.save()

    return NextResponse.json({
      success: true,
      message: 'skills DELETE successful',
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'something wents wrong',
    })
  }
}
