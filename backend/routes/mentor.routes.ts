import { Router } from 'express';
import MentorSession from '../models/mentorSession.model';
import MentorAvailability from '../models/mentorAvailability.model';
import { generateAgoraToken } from '../services/agoraToken.service';
import { sendEmail, generateSessionConfirmationEmail } from '../services/email.service';

const router = Router();

// Helper to ensure demo sessions exist
const ensureDemoSessionsForMentor = async (mentorId: string, forceCreate: boolean = false) => {
  const count = await MentorSession.countDocuments({ mentorId });
  if (count >= 3 && !forceCreate) return;
  
  const now = new Date();
  const timestamp = Date.now();
  const inMinutes = (mins: number) => new Date(now.getTime() + mins * 60_000);
  const inHours = (hours: number) => new Date(now.getTime() + hours * 60 * 60_000);
  const inDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60_000);
  const addMinutes = (date: Date, mins: number) => new Date(date.getTime() + mins * 60_000);

  await MentorSession.create([
    {
      mentorId,
      studentName: 'Rishabh Jain',
      studentEmail: 'rishabh@example.com',
      studentId: 'student_rishabh_123',
      title: 'Frontend Portfolio Review',
      description: 'Deep dive on React portfolio and project storytelling.',
      startTime: inMinutes(30),
      endTime: inMinutes(30 + 45),
      durationMinutes: 45,
      status: 'scheduled',
      paymentStatus: 'paid',
      bookingType: 'paid',
      meetingLink: `https://meet.aureeture.ai/session/rishabh-1`,
      agoraChannel: `session-${timestamp}-${mentorId.slice(-8)}-1`,
      amount: 1500,
      currency: 'INR',
      paymentId: 'pay_rishabh_001',
      rescheduleCount: 0,
      rescheduleRequests: [],
    },
    {
      mentorId,
      studentName: 'Aditi Rao',
      studentEmail: 'aditi@example.com',
      studentId: 'student_aditi_456',
      title: 'System Design Mock Interview',
      description: 'Practice high‑signal system design interview questions.',
      startTime: inHours(-2),
      endTime: inHours(-1),
      durationMinutes: 60,
      status: 'completed',
      paymentStatus: 'paid',
      bookingType: 'paid',
      meetingLink: `https://meet.aureeture.ai/session/aditi-1`,
      agoraChannel: `session-${timestamp}-${mentorId.slice(-8)}-2`,
      recordingUrl: 'https://recordings.aureeture.ai/aditi-1',
      notes: 'Strong on fundamentals. Needs crisper trade‑off communication.',
      amount: 2000,
      currency: 'INR',
      paymentId: 'pay_aditi_002',
      startedAt: inHours(-2),
      endedAt: inHours(-1),
      rescheduleCount: 0,
      rescheduleRequests: [],
    },
    {
      mentorId,
      studentName: 'Karan Patel',
      studentEmail: 'karan@example.com',
      studentId: 'student_karan_789',
      title: 'Career Roadmap Strategy',
      description: 'Clarify next 12–18 month plan for roles and skills.',
      startTime: inDays(1),
      endTime: addMinutes(inDays(1), 30),
      durationMinutes: 30,
      status: 'scheduled',
      paymentStatus: 'paid',
      bookingType: 'paid',
      meetingLink: `https://meet.aureeture.ai/session/karan-1`,
      agoraChannel: `session-${timestamp}-${mentorId.slice(-8)}-3`,
      amount: 1000,
      currency: 'INR',
      paymentId: 'pay_karan_003',
      rescheduleCount: 0,
      rescheduleRequests: [],
    },
  ]);
};

// POST /api/mentor-sessions/create-demo
router.post('/sessions/create-demo', async (req, res) => {
  try {
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    await ensureDemoSessionsForMentor(mentorId, true);
    const sessions = await MentorSession.find({ mentorId }).sort({ startTime: 1 });
    res.json({ message: 'Demo sessions created successfully', count: sessions.length, sessions });
  } catch (error) {
    console.error('Error creating demo sessions:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// GET /api/mentor-sessions
router.get('/mentor-sessions', async (req, res) => {
  try {
    const { mentorId, scope = 'all' } = req.query as {
      mentorId?: string;
      scope?: 'all' | 'upcoming' | 'past';
    };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    await ensureDemoSessionsForMentor(mentorId);
    const now = new Date();
    const query: any = { mentorId };
    if (scope === 'upcoming') {
      query.startTime = { $gte: now };
    } else if (scope === 'past') {
      query.endTime = { $lt: now };
    }
    const sessions = await MentorSession.find(query).sort({ startTime: 1 });
    const upcoming = sessions.filter(
      (s) => s.startTime >= now || (s.status === 'scheduled' || s.status === 'ongoing')
    );
    const past = sessions.filter(
      (s) => s.endTime < now || (s.status === 'completed' || s.status === 'cancelled')
    );
    res.json({ upcoming, past });
  } catch (error) {
    console.error('Error fetching mentor sessions:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// GET /api/mentor-sessions/:id
router.get('/mentor-sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    const session = await MentorSession.findOne({ _id: id, mentorId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    console.error('Error fetching session by id:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// POST /api/mentor-sessions
router.post('/mentor-sessions', async (req, res) => {
  try {
    const {
      mentorId,
      studentName,
      studentEmail,
      title,
      description,
      startTime,
      endTime,
      meetingLink,
    } = req.body;
    if (!mentorId || !studentName || !title || !startTime || !endTime) {
      return res.status(400).json({
        message: 'mentorId, studentName, title, startTime, and endTime are required.',
      });
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ message: 'Invalid startTime/endTime values.' });
    }
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60_000);
    const session = await MentorSession.create({
      mentorId,
      studentName,
      studentEmail,
      title,
      description,
      startTime: start,
      endTime: end,
      durationMinutes,
      meetingLink,
      status: 'scheduled',
    });
    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating mentor session:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// PATCH /api/mentor-sessions/:id
router.patch('/mentor-sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    const { status, startTime, endTime, notes, meetingLink, recordingUrl } = req.body;
    const update: any = {};
    if (status) {
      if (!['scheduled', 'ongoing', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
      }
      update.status = status;
    }
    if (startTime || endTime) {
      if (!startTime || !endTime) {
        return res.status(400).json({
          message: 'Both startTime and endTime are required when rescheduling.',
        });
      }
      const start = new Date(startTime);
      const end = new Date(endTime);
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
        return res.status(400).json({ message: 'Invalid startTime/endTime values.' });
      }
      update.startTime = start;
      update.endTime = end;
      update.durationMinutes = Math.round((end.getTime() - start.getTime()) / 60_000);
    }
    if (typeof notes === 'string') update.notes = notes;
    if (typeof meetingLink === 'string') update.meetingLink = meetingLink;
    if (typeof recordingUrl === 'string') update.recordingUrl = recordingUrl;
    const session = await MentorSession.findOneAndUpdate(
      { _id: id, mentorId },
      { $set: update },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    console.error('Error updating mentor session:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// GET /api/mentor-sessions/:id/verify-join
router.get('/mentor-sessions/:id/verify-join', async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    const session = await MentorSession.findOne({ _id: id, mentorId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    const now = new Date();
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime);
    const fifteenMinutesBefore = new Date(startTime.getTime() - 15 * 60 * 1000);
    if (session.paymentStatus !== 'paid') {
      return res.status(403).json({ 
        message: 'Payment not confirmed. Cannot join session until payment is confirmed.',
        canJoin: false 
      });
    }
    if (session.status !== 'scheduled' && session.status !== 'ongoing') {
      return res.status(403).json({ 
        message: `Session is ${session.status}. Cannot join.`,
        canJoin: false 
      });
    }
    if (now > endTime) {
      return res.status(403).json({ 
        message: 'Session has ended.',
        canJoin: false 
      });
    }
    if (now < fifteenMinutesBefore) {
      const msUntilJoin = fifteenMinutesBefore.getTime() - now.getTime();
      const minutesUntilJoin = Math.ceil(msUntilJoin / (1000 * 60));
      return res.status(403).json({ 
        message: `Session hasn't started yet. You can join 15 minutes before the scheduled time.`,
        canJoin: false,
        minutesUntilJoin 
      });
    }
    if (session.status === 'scheduled' && now >= fifteenMinutesBefore) {
      await MentorSession.findByIdAndUpdate(id, { status: 'ongoing' });
      session.status = 'ongoing';
    }
    let agoraChannel = session.agoraChannel;
    if (!agoraChannel) {
      agoraChannel = `session-${session._id}`;
      await MentorSession.findByIdAndUpdate(id, { agoraChannel });
    }
    res.json({
      canJoin: true,
      meetingLink: session.meetingLink,
      sessionId: String(session._id),
      channelName: agoraChannel,
      role: 'host',
    });
  } catch (error) {
    console.error('Error verifying join:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// POST /api/mentor-sessions/:id/complete
router.post('/mentor-sessions/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    const session = await MentorSession.findOneAndUpdate(
      { _id: id, mentorId },
      { $set: { status: 'completed' } },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// DELETE /api/mentor-sessions/:id
router.delete('/mentor-sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    const result = await MentorSession.findOneAndDelete({ _id: id, mentorId });
    if (!result) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting mentor session:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// GET /api/mentor-mentees
router.get('/mentor-mentees', async (req, res) => {
  try {
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    await ensureDemoSessionsForMentor(mentorId);
    const sessions = await MentorSession.find({ mentorId }).sort({ startTime: -1 });
    const menteeMap = new Map<string, any>();
    sessions.forEach((session) => {
      const key = session.studentId || session.studentName;
      if (!menteeMap.has(key)) {
        const lastSession = session.startTime;
        const upcomingSessions = sessions.filter(
          (s) => (s.studentId || s.studentName) === key && s.startTime > new Date()
        );
        const nextSession = upcomingSessions.length > 0
          ? upcomingSessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0]
          : null;
        const allSessionsForMentee = sessions.filter(
          (s) => (s.studentId || s.studentName) === key
        );
        const completedCount = allSessionsForMentee.filter(
          (s) => s.status === 'completed'
        ).length;
        const totalCount = allSessionsForMentee.length;
        const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        let status: 'Active' | 'Paused' | 'New' = 'New';
        if (nextSession) {
          status = 'Active';
        } else if (completedCount > 0) {
          status = 'Paused';
        }
        menteeMap.set(key, {
          id: session.studentId || `mentee-${key}`,
          name: session.studentName,
          email: session.studentEmail,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(session.studentName)}`,
          goal: session.title || 'Career development',
          progress,
          lastSession: lastSession.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          nextSession: nextSession
            ? nextSession.startTime.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                hour: 'numeric',
                minute: '2-digit',
              })
            : undefined,
          status,
          studentId: session.studentId,
        });
      }
    });
    const mentees = Array.from(menteeMap.values());
    res.json({ mentees, total: mentees.length });
  } catch (error) {
    console.error('Error fetching mentor mentees:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// GET /api/mentor-mentees/:id
router.get('/mentor-mentees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { mentorId } = req.query as { mentorId?: string };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    const sessions = await MentorSession.find({
      mentorId,
      $or: [{ studentId: id }, { studentName: { $regex: id, $options: 'i' } }],
    }).sort({ startTime: -1 });
    if (sessions.length === 0) {
      return res.status(404).json({ message: 'Mentee not found' });
    }
    const firstSession = sessions[0];
    const upcomingSessions = sessions.filter((s) => s.startTime > new Date());
    const nextSession = upcomingSessions.length > 0
      ? upcomingSessions.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())[0]
      : null;
    const completedCount = sessions.filter((s) => s.status === 'completed').length;
    const totalCount = sessions.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    let status: 'Active' | 'Paused' | 'New' = 'New';
    if (nextSession) {
      status = 'Active';
    } else if (completedCount > 0) {
      status = 'Paused';
    }
    const milestones = [
      {
        id: 'm1',
        title: 'Complete Data Structures & Algorithms',
        description: 'Master core DSA concepts and solve 200+ problems',
        completed: progress >= 25,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      },
      {
        id: 'm2',
        title: 'System Design Fundamentals',
        description: 'Learn distributed systems, scalability, and design patterns',
        completed: progress >= 50,
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      },
      {
        id: 'm3',
        title: 'Mock Interviews',
        description: 'Complete 10 mock interviews with feedback',
        completed: progress >= 75,
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      },
    ];
    const sessionList = sessions.slice(0, 10).map((s) => ({
      id: String(s._id),
      date: s.startTime.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: s.startTime > new Date() ? 'numeric' : undefined,
        minute: s.startTime > new Date() ? '2-digit' : undefined,
      }),
      title: s.title,
      status: s.status === 'completed' ? 'completed' : s.startTime > new Date() ? 'upcoming' : 'cancelled',
    }));
    const mentee = {
      id: firstSession.studentId || `mentee-${firstSession.studentName}`,
      name: firstSession.studentName,
      email: firstSession.studentEmail,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firstSession.studentName)}`,
      goal: firstSession.title || 'Career development',
      progress,
      lastSession: sessions
        .filter((s) => s.status === 'completed')
        .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())[0]
        ?.startTime.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }) || 'Never',
      nextSession: nextSession
        ? nextSession.startTime.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: '2-digit',
          })
        : undefined,
      status,
      studentId: firstSession.studentId,
      milestones,
      sessions: sessionList,
      notes: sessions.find((s) => s.notes)?.notes || undefined,
    };
    res.json(mentee);
  } catch (error) {
    console.error('Error fetching mentee details:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// GET /api/mentor-availability/slots
router.get('/mentor-availability/slots', async (req, res) => {
  try {
    const { mentorId, startDate, endDate } = req.query as {
      mentorId?: string;
      startDate?: string;
      endDate?: string;
    };
    if (!mentorId) {
      return res.status(400).json({ message: 'mentorId is required' });
    }
    const availability = await MentorAvailability.findOne({ mentorId });
    if (!availability) {
      return res.status(404).json({ message: 'Mentor availability not found' });
    }
    const slots: Array<{
      id: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
      isBooked: boolean;
    }> = [];
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const weeklySlot = availability.weeklySlots.find(
        (s) => s.day === dayName && s.isActive
      );
      if (weeklySlot) {
        const override = availability.overrideSlots.find(
          (o) => o.date.toDateString() === date.toDateString()
        );
        if (!override || !override.isBlocked) {
          const [startHour, startMin] = weeklySlot.startTime.split(':').map(Number);
          const [endHour, endMin] = weeklySlot.endTime.split(':').map(Number);
          const slotStart = new Date(date);
          slotStart.setHours(startHour, startMin, 0, 0);
          const slotEnd = new Date(date);
          slotEnd.setHours(endHour, endMin, 0, 0);
          const existingSession = await MentorSession.findOne({
            mentorId,
            startTime: { $gte: slotStart, $lt: slotEnd },
            status: { $in: ['scheduled', 'ongoing'] },
          });
          slots.push({
            id: `slot-${date.getTime()}-${startHour}`,
            startTime: slotStart.toISOString(),
            endTime: slotEnd.toISOString(),
            isAvailable: true,
            isBooked: !!existingSession,
          });
        }
      }
    }
    res.json({ slots });
  } catch (error) {
    console.error('Error fetching availability slots:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

// POST /api/mentor-sessions/confirm-payment
router.post('/mentor-sessions/confirm-payment', async (req, res) => {
  try {
    const {
      mentorId,
      studentId,
      studentName,
      studentEmail,
      title,
      description,
      startTime,
      endTime,
      amount,
      paymentId,
      mentorEmail,
      mentorName,
    } = req.body;
    if (!mentorId || !studentName || !title || !startTime || !endTime) {
      return res.status(400).json({
        message: 'mentorId, studentName, title, startTime, and endTime are required.',
      });
    }
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ message: 'Invalid startTime/endTime values.' });
    }
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60_000);
    const sessionId = `session-${Date.now()}`;
    const meetingLink = `https://meet.jit.si/aureeture-${sessionId}`;
    const agoraChannel = `session-${Date.now()}-${mentorId.slice(-8)}`;
    const session = await MentorSession.create({
      mentorId,
      studentId,
      studentName,
      studentEmail,
      title,
      description,
      startTime: start,
      endTime: end,
      durationMinutes,
      status: 'scheduled',
      paymentStatus: 'paid',
      bookingType: 'paid',
      meetingLink,
      agoraChannel,
      amount,
      paymentId,
      rescheduleCount: 0,
      rescheduleRequests: [],
    });
    if (studentEmail) {
      const studentEmailContent = generateSessionConfirmationEmail(
        studentName,
        title,
        mentorName || 'Your Mentor',
        start,
        end,
        meetingLink,
        false
      );
      await sendEmail({
        to: studentEmail,
        subject: studentEmailContent.subject,
        html: studentEmailContent.html,
      });
    }
    if (mentorEmail) {
      const mentorEmailContent = generateSessionConfirmationEmail(
        mentorName || 'Mentor',
        title,
        studentName,
        start,
        end,
        meetingLink,
        true
      );
      await sendEmail({
        to: mentorEmail,
        subject: mentorEmailContent.subject,
        html: mentorEmailContent.html,
      });
    }
    res.status(201).json({
      session,
      message: 'Session confirmed and notifications sent',
    });
  } catch (error) {
    console.error('Error confirming payment and creating session:', error);
    res.status(500).json({ message: 'An error occurred on the server.' });
  }
});

export default router;

