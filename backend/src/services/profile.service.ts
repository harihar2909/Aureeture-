import Profile, { IProfile } from '../models/profile.model';
import User from '../models/user.model';

export const getUserProfile = async (userId: string) => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    const profile = await Profile.findOne({ userId: user._id }).populate('userId', 'name email avatar');
    return profile;
};

export const createUserProfile = async (userId: string, profileData: Partial<IProfile>) => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ userId: user._id });
    if (existingProfile) {
        throw new Error('Profile already exists');
    }

    const profile = await Profile.create({
        userId: user._id,
        ...profileData
    });

    return profile.populate('userId', 'name email avatar');
};

export const updateUserProfile = async (userId: string, updateData: Partial<IProfile>) => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        throw new Error('User not found');
    }

    const profile = await Profile.findOneAndUpdate(
        { userId: user._id },
        updateData,
        { new: true, runValidators: true }
    ).populate('userId', 'name email avatar');

    if (!profile) {
        throw new Error('Profile not found');
    }

    return profile;
};
