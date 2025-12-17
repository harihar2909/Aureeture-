import { Schema, model, Document } from 'mongoose';

export interface IMentorMenteeMessage extends Document {
  mentorId: string; // Clerk userId for mentor
  menteeId: string; // Clerk userId for mentee (studentId in sessions)
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const MentorMenteeMessageSchema = new Schema<IMentorMenteeMessage>(
  {
    mentorId: { type: String, required: true, index: true },
    menteeId: { type: String, required: true, index: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default model<IMentorMenteeMessage>('MentorMenteeMessage', MentorMenteeMessageSchema);