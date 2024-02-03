import { User } from '@/model/user'
import { NextResponse } from 'next/server'
import connectDB from '@/utils/db'
import { OTP } from '@/model/otp'
import { hash } from 'bcryptjs'

export async function POST(req) {
  console.log('error is coming ...')
  await connectDB()
  try {
    const { firstName, lastName, email, password, confirmPassword, otp } =
      await req.json()

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return NextResponse.json({
        success: false,
        message: 'all fields are required',
      })
    }
    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: 'Password and ConfirmPassword Value does not match',
      })
    }

    const ifExist = await User.findOne({ email })
    if (ifExist) {
      return NextResponse.json({
        success: false,
        message: 'User Already Exist',
      })
    }
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
    if (response.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'OTP NOT  Found',
      })
    } else if (otp !== response[0].otp) {
      return NextResponse.json({
        success: false,
        message: 'invalid otp',
      })
    }

    const hashedPassword = await hash(password, 12)
    const createUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })
    if (createUser)
      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
      })
  } catch (err) {
    console.log('Error in register (server) => ', err)
    return NextResponse.json({
      success: false,
      message: 'Something Went Wrong Please Retry Later !',
    })
  }
}

export async function GET(req) {
  NextResponse.json({
    success: true,
    message: 'hjdfshjksdk',
  })
}
