import { User } from '@/model/user'
import { NextResponse } from 'next/server'
import connectDB from '@/utils/db'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import dotenv from 'dotenv'
dotenv.config()

//!Login
export async function POST(req) {
  await connectDB()
  try {
    const { email, password } = await req.json() //get data from req body

    if (!email || !password) {
      // validate krlo means all inbox are filled or not;

      return NextResponse.json({
        success: false,
        message: 'all fields are required',
      })
    }

    const user = await User.findOne({ email }) //user check exist or not
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'user not registered',
      })
    }

    if (await compare(password, user.password)) {
      //generate JWT, after password matching/comparing
      const payload = {
        // generate payload;
        email: user.email,
        id: user._id,
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '20h',
      })
      user.token = token
      user.password = undefined

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }

      // set the cookies
      cookies().set('tokken', token, options)
      return NextResponse.json({
        success: true,
        token,
        user,
        message: 'Logged in successfully',
      })
    } else {
      //
      return NextResponse.json({ success: false, message: 'wrong password' })
    }
  } catch (error) {
    console.log(error)
    return NextResponse.json({ success: false, message: error.message })
  }
}
