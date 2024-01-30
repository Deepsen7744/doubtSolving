import mongoose from 'mongoose'

const tagsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
    },
  ],
})

export const Tags = mongoose.models.Tags || mongoose.model('Tags', tagsSchema)
