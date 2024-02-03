import { Expert } from '@/model/expert'
import { NextResponse } from 'next/server'
import connectDB from '@/utils/db'

export async function POST(req) {
  await connectDB()
  try {
    const { expertId, newSkills } = await req.json()

    const expert = await Expert.findById(expertId)
    console.log(expert)

    if (!expert) {
      return NextResponse.json({
        success: false,
        message: 'expert not found',
      })
    }
    console.log(newSkills)

    expert.Skills.push(...newSkills)
    console.log(expert)

    await expert.save()

    return NextResponse.json({
      success: true,
      message: 'skills add to expert array',
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'something wents wrong',
    })
  }
}
