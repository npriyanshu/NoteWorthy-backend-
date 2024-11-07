import mongoose, { Document, ObjectId, Schema } from "mongoose";

// Define the User interface
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    notes: ObjectId[];  // Array of ObjectId references to the Note model
    createdAt?: Date;
    updatedAt?: Date;
}

// Create schema
const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
        minlength: 3,
        
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
      },
      notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
      }],
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
});

// Create model using schema
const User = mongoose.model<IUser>("User", userSchema);

export default User;
