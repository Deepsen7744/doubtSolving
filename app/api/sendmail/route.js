import { Expert } from '@/model/expert'
import { NextResponse } from 'next/server'
import connectDB from '@/utils/db'
import mailSender from '@/utils/mailsender'

export async function POST(req) {
  await connectDB()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { currentSkill } = await req.json()

    // Find experts with matching skills and active time slots
    const currentTime = Date.now()
    console.log(currentTime)
    const experts = await Expert.find({
      Skills: currentSkill,
      'Time.start': { $lte: currentTime },
      'Time.end': { $gte: currentTime },
    })

    // Iterate through each expert and send email
    for (const expert of experts) {
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: expert.email,
        subject: 'Subject of the email',
        text: `Dear ${expert.firstName}, you have an active time slot for the skill: ${currentSkill}.`,
      }

      // Use your mailSender function to send the email
      await mailSender(mailOptions)
    }

    return NextResponse.json({
      success: true,
      message: 'mail send success',
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      success: false,
      message: 'enternal server error',
    })
  }
}
