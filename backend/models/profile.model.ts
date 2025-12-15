import { Schema, model, Document, Types } from 'mongoose';

export interface IProfile extends Document {
  userId: Types.ObjectId;
  careerStage?: string;
  longTermGoal?: string;
  personalInfo: {
    phone?: string;
    linkedIn?: string;
  };
  workHistory: { company: string; role: string; from: Date; to?: Date; description?: string }[];
  education: { institution: string; degree: string; from: Date; to?: Date }[];
  projects: { name: string; description: string; link?: string }[];
  skills: string[];
  preferences: {
    location: string[];
    workModel: 'Remote' | 'Hybrid' | 'On-site';
    salaryRange: { min: number; max: number };
    openToInternships: boolean;
  };
  onboardingComplete: boolean;
}

const ProfileSchema = new Schema<IProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  careerStage: String,
  longTermGoal: String,
  personalInfo: {
    phone: String,
    linkedIn: String,
  },
  workHistory: [{ company: String, role: String, from: Date, to: Date, description: String }],
  education: [{ institution: String, degree: String, from: Date, to: Date }],
  projects: [{ name: String, description: String, link: String }],
  skills: [String],
  preferences: {
    location: [String],
    workModel: { type: String, enum: ['Remote', 'Hybrid', 'On-site'] },
    salaryRange: { min: Number, max: Number },
    openToInternships: Boolean,
  },
  onboardingComplete: { type: Boolean, default: false },
}, { timestamps: true });

export default model<IProfile>('Profile', ProfileSchema);


