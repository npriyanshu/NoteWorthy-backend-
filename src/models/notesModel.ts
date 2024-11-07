import mongoose, { Document, ObjectId } from "mongoose";

// Define the Note interface
export interface INote extends Document {
    user: ObjectId;  // Reference to the User model
    title: string;
    content: string;
    tags?: string[];  // Optional array of tags
    isArchived?: boolean;  // Optional field to track if the note is archived
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the note schema
const noteSchema = new mongoose.Schema<INote>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: [String],

  isArchived: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model('Note', noteSchema);

export default Note;
