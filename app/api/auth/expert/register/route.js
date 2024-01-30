import { Expert } from '@/model/expert'
import { NextResponse } from 'next/server'
import connectDB from '@/utils/db'
import { OTP } from '@/model/otp'
import { hash } from 'bcryptjs'

export async function POST(req) {
  console.log('error is coming ...')
  await connectDB()
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      otp,
      skills,
    } = await req.json()

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp ||
      !skills
    ) {
      return NextResponse.json({
        success: false,
        message: 'All fields are required',
      })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: 'Password and ConfirmPassword values do not match',
      })
    }

    const ifExist = await Expert.findOne({ email })
    if (ifExist) {
      return NextResponse.json({
        success: false,
        message: 'Expert Already Exists',
      })
    }

    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
    if (response.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'OTP not found',
      })
    } else if (otp !== response[0].otp) {
      return NextResponse.json({
        success: false,
        message: 'Invalid OTP',
      })
    }

    const hashedPassword = await hash(password, 12)
    const newExpert = await Expert.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      skills, // Assuming skills is an array of tag IDs
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })

    if (newExpert) {
      return NextResponse.json({
        success: true,
        message: 'Expert account created successfully',
      })
    }
  } catch (err) {
    console.log('Error in register (server) => ', err)
    return NextResponse.json({
      success: false,
      message: 'Something went wrong. Please retry later!',
    })
  }
}
