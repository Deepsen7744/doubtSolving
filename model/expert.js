import mongoose from 'mongoose'

// Define the user schema using the Mongoose Schema constructor
const expertSchema = new mongoose.Schema(
  {
    // Define the name field with type String, required, and trimmed
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    // Define the email field with type String, required, and trimmed
    email: {
      type: String,
      required: true,
      trim: true,
    },

    // Define the password field with type String and required
    password: {
      type: String,
      required: true,
    },

    token: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    Skills: [
      {
        type: String,
      },
    ],
    avgRating: {
      type: Number,
      default: 0,
    },
    Time: {
      start: Date,
      end: Date,
    },

    count: {
      type: Number,
    },
    satisfyStudent: {
      type: Number,
    },

    on_off: {
      type: Boolean,
    },
  },
  { timestamps: true }
)

// Export the Mongoose model for the user schema, using the name "user"
export const Expert =
  mongoose.models.Expert || mongoose.model('Expert', expertSchema)
// export default mongoose.model("Expert", expertSchema);
