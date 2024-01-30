import { Expert } from '@/model/expert' // Update the path to your expert model
import { NextResponse } from 'next/server'
import connectDB from '@/utils/db'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import dotenv from 'dotenv'
dotenv.config()

//! Login for Expert
export async function POST(req) {
  await connectDB()
  try {
    const { email, password } = await req.json() // Get data from req body

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'All fields are required',
      })
    }

    const expert = await Expert.findOne({ email })

    if (!expert) {
      return NextResponse.json({
        success: false,
        message: 'Expert not registered',
      })
    }

    if (await compare(password, expert.password)) {
      const payload = {
        email: expert.email,
        id: expert._id,
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '20h',
      })

      expert.token = token
      expert.password = undefined

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }

      // Set the cookies
      cookies().set('token', token, options)

      return NextResponse.json({
        success: true,
        token,
        expert,
        message: 'Logged in successfully',
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'Wrong password',
      })
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      success: false,
      message: 'Something went wrong. Please retry later!',
    })
  }
}
