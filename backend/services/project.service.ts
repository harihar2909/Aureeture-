import Project from '../models/project.model';
import User from '../models/user.model';

export const getProjects = async (page: number, limit: number, filters: any) => {
    const skip = (page - 1) * limit;
    const query: any = { isActive: true, status: 'Open' };

    // Apply filters
    if (filters.difficulty) {
        query.difficulty = filters.difficulty;
    }
    if (filters.technologies) {
        const techArray = Array.isArray(filters.technologies) ? filters.technologies : [filters.technologies];
        query.technologies = { $in: techArray };
    }

    const projects = await Project.find(query)
        .populate('mentorId', 'name avatar')
        .populate('participants', 'name avatar')
        .sort({ startDate: 1 })
        .skip(skip)
        .limit(limit);

    const total = await Project.countDocuments(query);

    return {
        projects,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

export const getProjectById = async (projectId: string) => {
    const project = await Project.findById(projectId)
        .populate('mentorId', 'name avatar')
        .populate('participants', 'name avatar');

    if (!project) {
        throw new Error('Project not found');
    }

    return project;
};

export const joinProject = async (userId: string, projectId: string) => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        throw new Error('User not found');
    }
    const userObjectId = (user as any)._id;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new Error('Project not found');
    }

    if (project.status !== 'Open') {
        throw new Error('Project is not open for new participants');
    }

    if (project.participants.length >= project.maxParticipants) {
        throw new Error('Project is full');
    }

    if (project.participants.includes(userObjectId)) {
        throw new Error('You are already a participant in this project');
    }

    project.participants.push(userObjectId);
    
    // If project is full, change status to In Progress
    if (project.participants.length >= project.maxParticipants) {
        project.status = 'In Progress';
    }

    await project.save();

    await (project as any).populate('mentorId', 'name avatar');
    await (project as any).populate('participants', 'name avatar');
    return project;
};

export const getUserProjects = async (userId: string) => {
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
        throw new Error('User not found');
    }
    const userObjectId = (user as any)._id;

    const projects = await Project.find({
        $or: [
            { participants: userObjectId },
            { mentorId: userObjectId }
        ]
    })
    .populate('mentorId', 'name avatar')
    .populate('participants', 'name avatar')
    .sort({ startDate: -1 });

    return projects;
};



