import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../api/axios"
import { useAuth } from "../context/AuthContext";
import {
    User,
    Briefcase,
    Star,
    Calendar,
    Clock,
    Video,
    Search,
    Filter,
    Plus,
    Trash2,
    DollarSign,
    TrendingUp,
    Award,
    Users,
    ChevronRight,
    Bell,
    Sparkles,
    Shield,
    X,
    Check,
    Loader2
} from 'lucide-react';

const INITIAL_MENTORS = [
    {
        id: 'm1',
        name: 'Elena Rostova',
        title: 'Staff AI Engineer',
        company: 'Meta',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
        rating: 4.9,
        reviewsCount: 128,
        experience: '9+ yrs',
        rate: 120,
        domain: 'AI/ML',
        skills: ['PyTorch', 'LLMs', 'System Design', 'AI Ethics'],
        bio: 'Helping engineers transition into Senior AI research & engineering roles. Ex-Google Brain.',
        slots: [
            { id: 's1', date: '2026-09-21', time: '10:00 AM', status: 'available' },
            { id: 's2', date: '2026-09-21', time: '02:00 PM', status: 'available' },
            { id: 's3', date: '2026-09-22', time: '11:00 AM', status: 'available' },
        ]
    },
    {
        id: 'm2',
        name: 'Marcus Vance',
        title: 'Principal Architect',
        company: 'Stripe',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
        rating: 5.0,
        reviewsCount: 94,
        experience: '12+ yrs',
        rate: 150,
        domain: 'Backend Architecture',
        skills: ['Distributed Systems', 'Microservices', 'Go', 'Kubernetes'],
        bio: 'Specialized in ultra-scalable distributed backend architecture & high-throughput payment pipelines.',
        slots: [
            { id: 's4', date: '2026-09-21', time: '04:00 PM', status: 'available' },
            { id: 's5', date: '2026-09-23', time: '01:00 PM', status: 'available' },
        ]
    },
    {
        id: 'm3',
        name: 'Sophia Chen',
        title: 'VP of Product',
        company: 'Airbnb',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
        rating: 4.95,
        reviewsCount: 210,
        experience: '11+ yrs',
        rate: 140,
        domain: 'Product Management',
        skills: ['Product Strategy', 'GTM Planning', 'PM Interviews', 'Growth'],
        bio: 'Passion for guiding aspiring PMs to land mid-to-senior product roles at top tech companies.',
        slots: [
            { id: 's6', date: '2026-09-22', time: '03:00 PM', status: 'available' },
            { id: 's7', date: '2026-09-24', time: '10:00 AM', status: 'available' },
        ]
    },
    {
        id: 'm4',
        name: 'David Kim',
        title: 'Lead Frontend Architect',
        company: 'Vercel',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        rating: 4.88,
        reviewsCount: 76,
        experience: '8+ yrs',
        rate: 110,
        domain: 'Frontend Engineering',
        skills: ['React', 'Next.js', 'Web Performance', 'Design Systems'],
        bio: 'Passionate about web performance, UI animation, and mastering modern frontend ecosystems.',
        slots: [
            { id: 's8', date: '2026-09-21', time: '06:00 PM', status: 'available' },
        ]
    }
];

const INITIAL_LEARNER_SESSIONS = [
    {
        id: 'ls1',
        mentorName: 'Elena Rostova',
        mentorTitle: 'Staff AI Engineer',
        mentorCompany: 'Meta',
        mentorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
        date: '2026-09-20',
        time: '03:00 PM',
        topic: 'Transitioning to Senior AI Engineering & Portfolio Review',
        meetingLink: 'https://meet.google.com/nav-ai-session',
        status: 'Upcoming'
    }
];

const INITIAL_MENTOR_BOOKINGS = [
    {
        id: 'mb1',
        studentName: 'Alex Rivera',
        studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
        careerInterest: 'AI / Machine Learning',
        date: '2026-09-20',
        time: '03:00 PM',
        topic: 'Code review for LLM fine-tuning pipeline & resume feedback.',
        meetingLink: 'https://meet.google.com/nav-ai-session',
        amount: 120,
        status: 'Confirmed'
    },
    {
        id: 'mb2',
        studentName: 'Priya Sharma',
        studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
        careerInterest: 'Backend Architecture',
        date: '2026-09-22',
        time: '05:00 PM',
        topic: 'System design strategies for global microservices platform.',
        meetingLink: 'https://meet.google.com/nav-sys-design',
        amount: 120,
        status: 'Confirmed'
    }
];

const INITIAL_REVIEWS = [
    {
        id: 'r1',
        studentName: 'Sarah Jenkins',
        studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
        rating: 5,
        date: '2 days ago',
        comment: 'Elena provided incredible insights into LLM fine-tuning and gave concrete actionable feedback on my GitHub portfolio.'
    },
    {
        id: 'r2',
        studentName: 'Devon Miller',
        studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        rating: 5,
        date: '1 week ago',
        comment: 'Clear, concise, and deeply practical system design mentorship. Unlocked my confidence for upcoming FAANG interviews!'
    }
];

export default function Dashboard() {
    const { user, loading } = useAuth();

    const navigate = useNavigate();

    // Always derive role from auth user, no local state needed
    // Show 'LEARNER' dashboard for role 'LEARNER', show 'MENTOR/PROFESSIONAL' dashboard for role 'MENTOR' or 'PROFESSIONAL'
    const normalizedRole = user?.role ? user.role.toUpperCase() : undefined;

    const isLearner = normalizedRole === 'LEARNER';
    const isMentorOrProfessional = normalizedRole === 'MENTOR' || normalizedRole === 'PROFESSIONAL';

    // Dynamic state management
    const [mentors] = useState(INITIAL_MENTORS);
    const [learnerSessions, setLearnerSessions] = useState(INITIAL_LEARNER_SESSIONS);
    const [mentorBookings] = useState(INITIAL_MENTOR_BOOKINGS);
    const [reviews] = useState(INITIAL_REVIEWS);

    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('All');

    // Booking Modal State
    const [bookingModal, setBookingModal] = useState({ isOpen: false, mentor: null });
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [bookingTopic, setBookingTopic] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Mentor Slot Management State
    const [mentorSlots, setMentorSlots] = useState([
        { id: 'ms1', date: '2026-09-21', time: '09:00 AM', active: true },
        { id: 'ms2', date: '2026-09-21', time: '11:00 AM', active: true },
        { id: 'ms3', date: '2026-09-22', time: '10:00 AM', active: true }
    ]);
    const [newSlotDate, setNewSlotDate] = useState('');
    const [newSlotTime, setNewSlotTime] = useState('10:00 AM');
    // Session Detail Modal State
    const [sessionDetailModal, setSessionDetailModal] = useState({ isOpen: false, session: null });



    // Filter Mentors
    const filteredMentors = useMemo(() => {
        return mentors.filter(m => {
            const matchesDomain = selectedDomain === 'All' || m.domain === selectedDomain;
            const matchesSearch =
                m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesDomain && matchesSearch;
        });
    }, [mentors, selectedDomain, searchQuery]);

    // Handle Confirm Booking
    const handleConfirmBooking = () => {
        if (!selectedSlot || !bookingModal.mentor) return;

        const newSession = {
            id: `ls-${Date.now()}`,
            mentorName: bookingModal.mentor.name,
            mentorTitle: bookingModal.mentor.title,
            mentorCompany: bookingModal.mentor.company,
            mentorAvatar: bookingModal.mentor.avatar,
            date: selectedSlot.date,
            time: selectedSlot.time,
            topic: bookingTopic || 'General Career Consultation & Portfolio Review',
            meetingLink: 'https://meet.google.com/nav-session-live',
            status: 'Upcoming'
        };

        setLearnerSessions([newSession, ...learnerSessions]);
        setBookingSuccess(true);

        setTimeout(() => {
            setBookingSuccess(false);
            setBookingModal({ isOpen: false, mentor: null });
            setSelectedSlot(null);
            setBookingTopic('');
        }, 1500);
    };

    // Slot Handlers
    const handleAddSlot = (e) => {
        e.preventDefault();
        if (!newSlotDate) return;
        setMentorSlots([...mentorSlots, { id: `ms-${Date.now()}`, date: newSlotDate, time: newSlotTime, active: true }]);
        setNewSlotDate('');
    };

    const toggleSlotStatus = (id) => {
        setMentorSlots(mentorSlots.map(s => s.id === id ? { ...s, active: !s.active } : s));
    };

    const deleteSlot = (id) => {
        setMentorSlots(mentorSlots.filter(s => s.id !== id));
    };

    // Professional loading screen while user data is being fetched, or show error if user data is not present
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 via-slate-50 to-gray-200 items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-200 mb-8">
                    <Loader2 className="w-8 h-8 text-black animate-spin" />
                </div>
                <h1 className="text-2xl font-extrabold text-black mb-2">Loading your dashboard...</h1>
                <p className="text-sm text-gray-600 mb-2">
                    Please wait while we securely fetch your career profile and personalized mentorship data.
                </p>
                <div className="mt-5 flex items-center space-x-2 text-xs text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>CareerNav Mentorship Platform</span>
                </div>
            </div>
        );
    }

    if (!user) {
        // If user data could not be fetched, show an error message
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 via-slate-50 to-gray-200 items-center justify-center">
                <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-lg border border-red-200 mb-8">
                    <Shield className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-extrabold text-red-600 mb-2">Error fetching user data</h1>
                <p className="text-sm text-gray-600 mb-2 text-center max-w-sm">
                    We were unable to retrieve your account information. Please try refreshing the page or logging in again.<br />
                    If the problem persists, contact support.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 via-slate-50 to-gray-200 text-black font-sans antialiased flex flex-col selection:bg-black selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">

                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-xl shadow-md">
                            C
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-extrabold tracking-tight text-black leading-none">
                                Career<span className="text-gray-600">Nav</span>
                            </span>
                            <span className="text-[10px] font-semibold text-gray-700 tracking-wider uppercase mt-0.5">
                                1:1 Expert Consultation
                            </span>
                        </div>
                    </div>

                    {/* Right User Actions */}
                    <div className="flex items-center space-x-4">

                        {/* The deprecated role switcher removed, as role is only set by AuthContext now */}
                        {/* <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-300 text-xs font-semibold">
                            <button
                                onClick={() => setRole('LEARNER')}
                                className={`px-3 py-1.5 rounded-lg transition ${role === 'LEARNER' ? 'bg-black text-white shadow-sm' : 'text-gray-700 hover:text-black'}`}
                            >
                                Learner
                            </button>
                            <button
                                onClick={() => setRole('MENTOR')}
                                className={`px-3 py-1.5 rounded-lg transition ${role === 'MENTOR' ? 'bg-black text-white shadow-sm' : 'text-gray-700 hover:text-black'}`}
                            >
                                Mentor
                            </button>
                        </div> */}

                        <button className="relative p-2 text-gray-700 hover:text-black rounded-xl hover:bg-gray-100 transition">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-black rounded-full" />
                        </button>

                        <div className="flex items-center space-x-3 pl-2 border-l border-gray-300">
                            <button
                                onClick={() => navigate('/profile')}
                                className="focus:outline-none"
                                style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                                aria-label="Go to profile"
                            >
                                <img
                                    src={
                                        user?.avatar ||
                                        (isLearner
                                            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                                            : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
                                        )
                                    }
                                    alt={user?.name || "User Avatar"}
                                    className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-300 shadow-sm"
                                />
                            </button>
                            <div className="hidden md:block text-left">
                                <p className="text-xs font-bold text-black">{user?.name || (isLearner ? 'Alex Rivera' : 'Elena Rostova')}</p>
                                <p className="text-[10px] text-gray-600 font-semibold capitalize">
                                    {isLearner ? 'learner' : 'professional'} Profile
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </header>

            {/* HERO SECTION */}
            <div className="bg-gradient-to-b from-gray-200 via-slate-100 to-gray-200 text-black py-8 border-b border-gray-300 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center space-x-2 bg-white border border-gray-300 px-3 py-1 rounded-full text-black text-xs font-semibold tracking-wide uppercase shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-black" />
                            <span>
                                {isLearner
                                    ? 'Verified Tech Mentors'
                                    : 'Mentor Management Suite'}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black">
                            {isLearner
                                ? 'Find Your Career Mentor'
                                : 'Mentor Dashboard & Schedule'}
                        </h1>
                        <p className="text-gray-700 text-xs sm:text-sm max-w-2xl leading-relaxed">
                            {isLearner
                                ? 'Connect 1:1 with top engineers, product leads, and industry leaders to accelerate your career growth.'
                                : 'Manage your availability, review upcoming student 1:1 consultations, and track earnings.'}
                        </p>
                    </div>

                    <div className="flex items-center space-x-3 bg-white p-3.5 rounded-2xl border border-gray-300 shadow-sm self-start md:self-auto shrink-0">
                        <div className="p-2.5 bg-gray-100 text-black rounded-xl">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div className="text-xs">
                            <p className="font-bold text-black">Verified Professional Network</p>
                            <p className="text-gray-600 text-[11px] font-medium">100% Private 1:1 Video Calls</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
                {isLearner ? (
                    <LearnerDashboardView
                        mentors={filteredMentors}
                        allDomains={['All', 'AI/ML', 'Backend Architecture', 'Product Management', 'Frontend Engineering']}
                        selectedDomain={selectedDomain}
                        setSelectedDomain={setSelectedDomain}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        learnerSessions={learnerSessions}
                        onBookSession={(mentor) => setBookingModal({ isOpen: true, mentor })}
                        onOpenMeeting={(url) => window.open(url, '_blank')}
                    />
                ) : isMentorOrProfessional ? (
                    <MentorDashboardView
                        mentorBookings={mentorBookings}
                        mentorSlots={mentorSlots}
                        onAddSlot={handleAddSlot}
                        onToggleSlot={toggleSlotStatus}
                        onDeleteSlot={deleteSlot}
                        newSlotDate={newSlotDate}
                        setNewSlotDate={setNewSlotDate}
                        newSlotTime={newSlotTime}
                        setNewSlotTime={setNewSlotTime}
                        reviews={reviews}
                        onViewDetails={(session) => setSessionDetailModal({ isOpen: true, session })}
                    />
                ) : (
                    <div className="py-10 text-center text-gray-500">No dashboard available for your role.</div>
                )}
            </main>

            {/* Booking Modal */}
            {bookingModal.isOpen && bookingModal.mentor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col">
                        <div className="bg-gradient-to-b from-gray-200 to-slate-100 text-black p-6 flex justify-between items-start border-b border-gray-300">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={bookingModal.mentor.avatar}
                                    alt={bookingModal.mentor.name}
                                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-300"
                                />
                                <div>
                                    <h3 className="text-lg font-bold text-black">{bookingModal.mentor.name}</h3>
                                    <p className="text-xs text-gray-700 font-medium">{bookingModal.mentor.title} @ {bookingModal.mentor.company}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="inline-flex items-center text-xs font-bold text-black">
                                            <Star className="w-3.5 h-3.5 text-black fill-black mr-1" />
                                            {bookingModal.mentor.rating} ({bookingModal.mentor.reviewsCount})
                                        </span>
                                        <span className="text-gray-600 text-xs">• ${bookingModal.mentor.rate}/hr</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setBookingModal({ isOpen: false, mentor: null })}
                                className="text-gray-500 hover:text-black p-1 rounded-full hover:bg-gray-200 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {bookingSuccess ? (
                                <div className="py-8 text-center space-y-3">
                                    <div className="w-16 h-16 bg-gray-100 text-black rounded-full flex items-center justify-center mx-auto border border-gray-300 shadow-sm">
                                        <Check className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-extrabold text-black">Session Confirmed!</h4>
                                    <p className="text-xs text-gray-600">
                                        Your 1:1 mentorship session has been successfully scheduled.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                            1. Select an Available Slot
                                        </label>
                                        <div className="grid grid-cols-2 gap-2.5">
                                            {bookingModal.mentor.slots.map((slot) => {
                                                const isSelected = selectedSlot?.id === slot.id;
                                                return (
                                                    <button
                                                        key={slot.id}
                                                        type="button"
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${isSelected
                                                            ? 'border-black bg-gray-100 ring-2 ring-black/10'
                                                            : 'border-gray-200 hover:border-black bg-white'
                                                            }`}
                                                    >
                                                        <div className="flex items-center space-x-1.5 text-xs font-bold text-black">
                                                            <Calendar className="w-3.5 h-3.5 text-gray-700" />
                                                            <span>{slot.date}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1.5 text-xs text-gray-700 font-bold mt-1">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span>{slot.time}</span>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                                            2. Topic & Notes
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={bookingTopic}
                                            onChange={(e) => setBookingTopic(e.target.value)}
                                            placeholder="e.g. System design preparation for L5 backend role, portfolio review..."
                                            className="w-full p-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:outline-none bg-gray-50 text-black placeholder-gray-400"
                                        />
                                    </div>

                                    <div className="flex space-x-3 pt-2">
                                        <button
                                            onClick={() => setBookingModal({ isOpen: false, mentor: null })}
                                            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            disabled={!selectedSlot}
                                            onClick={handleConfirmBooking}
                                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition ${selectedSlot
                                                ? 'bg-black hover:bg-gray-800 text-white shadow-md'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            Confirm Booking (${bookingModal.mentor.rate})
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Session Detail Modal */}
            {sessionDetailModal.isOpen && sessionDetailModal.session && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200">
                        <div className="bg-gradient-to-b from-gray-200 to-slate-100 text-black p-5 flex justify-between items-center border-b border-gray-300">
                            <h3 className="font-extrabold text-base flex items-center space-x-2">
                                <Video className="w-5 h-5 text-black" />
                                <span>Session Overview</span>
                            </h3>
                            <button
                                onClick={() => setSessionDetailModal({ isOpen: false, session: null })}
                                className="text-gray-500 hover:text-black p-1 rounded-full hover:bg-gray-200 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center space-x-3 bg-gray-100 p-3.5 rounded-2xl border border-gray-200">
                                <img
                                    src={sessionDetailModal.session.studentAvatar}
                                    alt={sessionDetailModal.session.studentName}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-300"
                                />
                                <div>
                                    <p className="text-sm font-bold text-black">{sessionDetailModal.session.studentName}</p>
                                    <p className="text-xs text-gray-600 font-semibold">{sessionDetailModal.session.careerInterest}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between py-1.5 border-b border-gray-200">
                                    <span className="text-gray-600 font-medium">Date & Time:</span>
                                    <span className="font-bold text-black">{sessionDetailModal.session.date} at {sessionDetailModal.session.time}</span>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-gray-200">
                                    <span className="text-gray-600 font-medium">Payout Amount:</span>
                                    <span className="font-extrabold text-black">${sessionDetailModal.session.amount}.00</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Student Notes
                                </label>
                                <p className="text-xs bg-gray-50 p-3 rounded-xl text-gray-800 border border-gray-200 leading-relaxed">
                                    "{sessionDetailModal.session.topic}"
                                </p>
                            </div>

                            <button
                                onClick={() => window.open(sessionDetailModal.session.meetingLink, '_blank')}
                                className="w-full py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition shadow-md"
                            >
                                <Video className="w-4 h-4" />
                                <span>Launch Google Meet</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-black text-gray-400 py-8 border-t border-gray-800 text-xs mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-black font-bold text-xs">
                            C
                        </div>
                        <span className="text-white font-bold">CareerNav Mentorship Platform</span>
                    </div>
                    <p className="text-gray-500">© {new Date().getFullYear()} CareerNav Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function LearnerDashboardView({
    mentors,
    allDomains,
    selectedDomain,
    setSelectedDomain,
    searchQuery,
    setSearchQuery,
    learnerSessions,
    onBookSession,
    onOpenMeeting
}) {
    return (
        <div className="space-y-8">
            {/* Upcoming Sessions */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-gray-100 text-black rounded-xl">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-black">My Upcoming Sessions</h2>
                            <p className="text-xs text-gray-600">Scheduled 1:1 mentorship calls</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold bg-gray-100 text-black px-3 py-1 rounded-full border border-gray-200">
                        {learnerSessions.length} Active Call{learnerSessions.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {learnerSessions.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-gray-600">No upcoming sessions scheduled</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {learnerSessions.map((session) => (
                            <div
                                key={session.id}
                                className="bg-gradient-to-b from-gray-200 via-slate-100 to-gray-200 text-black p-5 rounded-2xl shadow-sm flex flex-col justify-between border border-gray-300"
                            >
                                <div>
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={session.mentorAvatar}
                                            alt={session.mentorName}
                                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gray-300"
                                        />
                                        <div>
                                            <h4 className="font-bold text-sm text-black">{session.mentorName}</h4>
                                            <p className="text-xs text-gray-700 font-medium">{session.mentorTitle} @ {session.mentorCompany}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 bg-white p-2.5 rounded-xl border border-gray-200 text-xs text-black font-semibold flex items-center">
                                        <Clock className="w-3.5 h-3.5 text-black mr-1.5" />
                                        <span>{session.date} at {session.time}</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => onOpenMeeting(session.meetingLink)}
                                        className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl font-bold text-xs flex items-center space-x-2 transition shadow-sm"
                                    >
                                        <Video className="w-3.5 h-3.5" />
                                        <span>Join Google Meet</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Search & Domain Filter Bar */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300 space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search mentors by name, company, or skill..."
                            className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none bg-gray-50 text-black placeholder-gray-500"
                        />
                    </div>

                    <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto scrollbar-none">
                        {allDomains.map((domain) => (
                            <button
                                key={domain}
                                onClick={() => setSelectedDomain(domain)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${selectedDomain === domain
                                    ? 'bg-black text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                    }`}
                            >
                                {domain}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mentors Grid */}
            <section className="space-y-4">
                <h2 className="text-lg font-extrabold text-black">Available Mentors ({mentors.length})</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mentors.map((mentor) => (
                        <div key={mentor.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300 flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <div className="flex items-start justify-between">
                                    <div className="flex space-x-4">
                                        <img src={mentor.avatar} alt={mentor.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-300" />
                                        <div>
                                            <h3 className="font-bold text-base text-black">{mentor.name}</h3>
                                            <p className="text-xs text-gray-600 font-medium">{mentor.title} @ <strong className="text-black">{mentor.company}</strong></p>
                                            <div className="flex items-center space-x-2 mt-1 text-xs text-gray-600">
                                                <span className="flex items-center font-bold text-black">
                                                    <Star className="w-3.5 h-3.5 text-black fill-black mr-1" /> {mentor.rating}
                                                </span>
                                                <span>•</span>
                                                <span className="font-medium">{mentor.experience}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-lg font-extrabold text-black">${mentor.rate}<span className="text-xs text-gray-500 font-normal">/hr</span></span>
                                </div>
                                <p className="text-xs text-gray-700 mt-3 line-clamp-2 leading-relaxed">{mentor.bio}</p>
                            </div>

                            <div className="mt-5 pt-3 border-t border-gray-200 flex items-center justify-between">
                                <span className="text-xs text-black font-semibold">{mentor.slots.length} slots available</span>
                                <button
                                    onClick={() => onBookSession(mentor)}
                                    className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl flex items-center space-x-1 transition shadow-sm"
                                >
                                    <span>Book 1:1 Call</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

function MentorDashboardView({
    mentorBookings,
    mentorSlots,
    onAddSlot,
    onToggleSlot,
    onDeleteSlot,
    newSlotDate,
    setNewSlotDate,
    newSlotTime,
    setNewSlotTime,
    reviews,
    onViewDetails,
}) {
    const [slotSubmitError, setSlotSubmitError] = useState(null)
    const[slotSuccess,setSlotSuccess] = useState(null);

    // Helper to add slot via API - returns a promise
    const createSlotAPI = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/slots`,
                {
                    date: newSlotDate,
                    time: newSlotTime
                },
                { withCredentials: true }
            );
            console.log(response.data);

            setSlotSuccess(response.data.message);
        } catch (error) {
            // You can extend this error handling as needed for your app
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.errors?.[0]?.msg ||
                "Something went wrong";

            setSlotSubmitError(message);
        }
    }
    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-300 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-gray-100 text-black rounded-xl"><DollarSign className="w-6 h-6" /></div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600">Monthly Earnings</p>
                        <h3 className="text-2xl font-extrabold text-black">$3,840</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-300 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-gray-100 text-black rounded-xl"><Calendar className="w-6 h-6" /></div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600">Booked Sessions</p>
                        <h3 className="text-2xl font-extrabold text-black">{mentorBookings.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-300 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-gray-100 text-black rounded-xl"><Star className="w-6 h-6" /></div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600">Average Rating</p>
                        <h3 className="text-2xl font-extrabold text-black">5.0</h3>
                    </div>
                </div>
            </section>

            {/* Layout Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Bookings */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300 space-y-4">
                        <h2 className="text-lg font-extrabold text-black">Upcoming Learner Bookings</h2>
                        <div className="space-y-3">
                            {mentorBookings.map((b) => (
                                <div key={b.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <img src={b.studentAvatar} alt={b.studentName} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-300" />
                                        <div>
                                            <h4 className="font-bold text-sm text-black">{b.studentName}</h4>
                                            <p className="text-xs text-gray-600 font-medium">{b.date} at {b.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => onViewDetails(b)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-800 bg-white hover:bg-gray-100 transition">
                                            Details
                                        </button>
                                        <button onClick={() => window.open(b.meetingLink, '_blank')} className="px-3 py-1.5 bg-black text-white rounded-lg text-xs font-bold flex items-center space-x-1 hover:bg-gray-800 transition">
                                            <Video className="w-3.5 h-3.5" />
                                            <span>Join</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right: Slot Management */}
                <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300 space-y-5">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-gray-100 text-black rounded-lg">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-black">Manage Availability</h2>
                                <p className="text-[11px] text-gray-600 font-medium">Configure public mentorship slots</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold bg-gray-100 text-black px-2.5 py-1 rounded-full border border-gray-200">
                            {mentorSlots.length} Slots
                        </span>
                    </div>

                    {/* Add Slot Form */}
                    <form
                        onSubmit={createSlotAPI}
                        className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200"
                    >
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Add New Slot</p>
                        <div className="space-y-2">
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Select Date</label>
                                <input
                                    type="date"
                                    required
                                    value={newSlotDate}
                                    onChange={(e) => setNewSlotDate(e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-black outline-none transition text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Select Time Slot</label>
                                <select
                                    value={newSlotTime}
                                    onChange={(e) => setNewSlotTime(e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-black outline-none transition text-black cursor-pointer"
                                >
                                    <option value="00:00:00">00:00</option>
                                    <option value="01:00:00">01:00</option>
                                    <option value="02:00:00">02:00</option>
                                    <option value="03:00:00">03:00</option>
                                    <option value="04:00:00">04:00</option>
                                    <option value="05:00:00">05:00</option>
                                    <option value="06:00:00">06:00</option>
                                    <option value="07:00:00">07:00</option>
                                    <option value="08:00:00">08:00</option>
                                    <option value="09:00:00">09:00</option>
                                    <option value="10:00:00">10:00</option>
                                    <option value="11:00:00">11:00</option>
                                    <option value="12:00:00">12:00</option>
                                    <option value="13:00:00">13:00</option>
                                    <option value="14:00:00">14:00</option>
                                    <option value="16:00:00">16:00</option>
                                    <option value="17:00:00">17:00</option>
                                    <option value="18:00:00">18:00</option>
                                    <option value="19:00:00">19:00</option>
                                    <option value="20:00:00">20:00</option>
                                    <option value="21:00:00">21:00</option>
                                    <option value="22:00:00">22:00</option>
                                    <option value="23:00:00">23:00</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-2">
                            {slotSubmitError && (
                                <span className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 w-full block animate-fade-out">
                                    {slotSubmitError}
                                </span>
                            )}
                            {slotSuccess && (
                                <span className="text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2 w-full block animate-fade-out">
                                    Slot successfully added!
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-sm"
                        >
                            <span>+ Add Available Slot</span>
                        </button>
                    </form>
              


                    {/* Slots List */}
                    <div className="space-y-2.5">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Current Schedule</p>
                        {mentorSlots.length === 0 ? (
                            <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 text-xs">
                                No availability slots configured
                            </div>
                        ) : (
                            mentorSlots.map((slot) => (
                                <div
                                    key={slot.id}
                                    className="flex justify-between items-center p-3.5 border border-gray-200 rounded-xl text-xs bg-white hover:border-black transition shadow-xs"
                                >
                                    <div className="space-y-0.5">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-3.5 h-3.5 text-black" />
                                            <span className="font-bold text-black">{slot.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-3.5 h-3.5 text-gray-500" />
                                            <span className="text-gray-700 font-medium">{slot.time}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => onToggleSlot(slot.id)}
                                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${slot.active
                                                ? 'bg-gray-100 text-black border-gray-300 hover:bg-gray-200'
                                                : 'bg-gray-50 text-gray-400 border-gray-200'
                                                }`}
                                        >
                                            {slot.active ? 'Active' : 'Inactive'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDeleteSlot(slot.id)}
                                            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition"
                                            title="Delete Slot"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}