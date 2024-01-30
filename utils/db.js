import mongoose from 'mongoose'

// connecting to database
const connectDB = async () => {
  const connectionUrl =
    'mongodb+srv://deepsen888:deepsen888@cluster0.mxp3j0e.mongodb.net/?retryWrites=true&w=majority'
  mongoose
    .connect(connectionUrl, {
      dbName: 'work_manager',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`Database connected successfully`))
    .catch((err) =>
      console.log('Getting Error from DB connection' + err.message)
    )
  mongoose.set('strictQuery', false)
}

export default connectDB
