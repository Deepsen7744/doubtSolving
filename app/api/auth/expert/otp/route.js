import { Expert } from '@/model/expert'
import { NextResponse } from 'next/server'
import connectDB from '@/utils/db'
import otpGenerator from 'otp-generator'
import { OTP } from '@/model/otp'
import mailSender from '@/utils/mailsender'
import emailTemplate from '@/templates/otpsend'

//!sendOTP
export async function POST(req) {
  await connectDB()

  try {
    const { email } = await req.json()
    console.log(email)
    const checkUserPresent = await Expert.findOne({ email })

    if (checkUserPresent) {
      return NextResponse.json({
        success: false,
        message: 'user alredy registered',
      })
    }
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })
    console.log('OTP generated: ', otp)

    let result = await OTP.findOne({ otp: otp })
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      })
      result = await OTP.findOne({ otp: otp })
    }
    // create a model of otp
    const otpPayload = { email, otp }

    try {
      // three things email, title, body
      const mailResponse = await mailSender(
        email,
        'Verification Email from DoubtSolver',
        emailTemplate(otp)
      )
      console.log('Email sent Successfully: ', mailResponse)
    } catch (error) {
      console.log('error occured while sending mails: ', error)
      // throw error;
      return NextResponse.json({
        success: false,
        message: 'OTP Sent failed',
        otp,
      })
    }

    const otpBody = await OTP.create(otpPayload)
    console.log('OTP Body', otpBody)

    return NextResponse.json({
      success: true,
      message: 'OTP Sent Successfully',
      otp,
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      success: false,
      message: error,
    })
  }
}
