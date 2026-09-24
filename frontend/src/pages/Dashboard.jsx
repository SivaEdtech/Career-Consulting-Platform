import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../api/axios";
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
    Loader2,
    ExternalLink,
    CheckCircle2,
    MessageSquare,
    Copy,
    FileText,
    Target,
    Compass,
    BookOpen,
    GraduationCap,
    Globe,
    Layers,
    Lightbulb
} from 'lucide-react';

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
        comment: 'Elena provided incredible insights into LLM fine-tuning and gave concrete actionable feedback on my portfolio.'
    },
    {
        id: 'r2',
        studentName: 'Devon Miller',
        studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        rating: 5,
        date: '1 week ago',
        comment: 'Clear, concise, and deeply practical career mentorship. Unlocked my confidence for upcoming top-tier interviews!'
    }
];

export default function Dashboard() {
    const { user, loading } = useAuth();
  
    const normalizedRole = user?.role ? user.role.toUpperCase() : undefined;
    const isLearner = normalizedRole === 'LEARNER';
    const isMentorOrProfessional = normalizedRole === 'PROFESSIONAL';

    // Dynamic state management
    const [mentors, setMentors] = useState([]);
    const [mentorsLoading, setMentorsLoading] = useState(false);
    const [mentorsError, setMentorsError] = useState(null);

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
    const [mentorSlots, setMentorSlots] = useState([]);
    const [newSlotDate, setNewSlotDate] = useState('');
    const [newSlotTime, setNewSlotTime] = useState('10:00 AM');
    // Session Detail Modal State
    const [sessionDetailModal, setSessionDetailModal] = useState({ isOpen: false, session: null });

    // Fetch mentors / professionals from backend API
    useEffect(() => {
        if (!isLearner) return;

        const fetchMentors = async () => {
            setMentorsLoading(true);
            setMentorsError(null);
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/professionals`,
                    { withCredentials: true }
                );

                console.log("res prof:",response)
               
                const fetchedMentors = response.data?.professionals || [];
                setMentors(fetchedMentors);
            } catch (err) { 
                console.error("Error fetching mentors:", err);
                setMentorsError("Failed to load mentors. Please try again.");
            } finally {
                setMentorsLoading(false);
            }
        };

        fetchMentors();
    }, [isLearner]);

    // Filter Mentors
    const filteredMentors = useMemo(() => {
        return mentors.filter(m => {
            const domain = m.domain || m.specialty || '';
            const name = m.name || '';
            const title = m.title || m.role || '';
            const company = m.company || '';
            const skills = m.skills || [];

            const matchesDomain = selectedDomain === 'All' || domain.toLowerCase() === selectedDomain.toLowerCase();
            const matchesSearch =
                name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
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

    const toggleSlotStatus = (id) => {
        setMentorSlots(mentorSlots.map(s => s.id === id ? { ...s, active: !s.active } : s));
    };

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

    const currUserAccountId = user?.account_id;

    return (
        <div className="min-h-screen bg-slate-50 text-black font-sans antialiased flex flex-col selection:bg-blue-600 selection:text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                            C
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                                Career<span className="text-blue-600">Nav</span>
                            </span>
                            <span className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase mt-0.5">
                                1:1 Career Consultation
                            </span>
                        </div>
                    </div>

                    {/* Search Bar in Header for Learner */}
                    {isLearner && (
                        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search domain, role, or mentor..."
                                className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50/80 text-black placeholder-gray-400 transition"
                            />
                        </div>
                    )}

                    {/* Right User Actions */}
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-600 hover:text-black rounded-xl hover:bg-gray-100 transition">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
                        </button>

                        <div className="flex items-center space-x-3 pl-2 border-l border-gray-200">
                            <button
                                onClick={() => navigate(`/user/${currUserAccountId}/profile`)}
                                className="focus:outline-none group relative"
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
                                    className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-blue-600 shadow-xs transition"
                                />
                            </button>
                            <div className="hidden md:block text-left">
                                <p className="text-xs font-bold text-black">{user?.name || (isLearner ? 'Alex Rivera' : 'Elena Rostova')}</p>
                                <p className="text-[10px] text-gray-500 font-semibold capitalize">
                                    {isLearner ? 'learner' : 'professional'} Profile
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-10">
                {isLearner ? (
                    <LearnerDashboardView
                        mentors={filteredMentors}
                        mentorsLoading={mentorsLoading}
                        mentorsError={mentorsError}
                        allDomains={['All', 'Engineering', 'AI & Data Science', 'Product & Business', 'Design & Creative', 'Finance & Consulting', 'Marketing']}
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
                        setMentorSlots={setMentorSlots}
                        onToggleSlot={toggleSlotStatus}
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
                        <div className="bg-gradient-to-b from-gray-100 to-slate-50 text-black p-6 flex justify-between items-start border-b border-gray-200">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={bookingModal.mentor.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
                                    alt={bookingModal.mentor.name}
                                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500"
                                />
                                <div>
                                    <h3 className="text-lg font-bold text-black">{bookingModal.mentor.name}</h3>
                                    <p className="text-xs text-gray-700 font-medium">{bookingModal.mentor.title} @ {bookingModal.mentor.company}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="inline-flex items-center text-xs font-bold text-black">
                                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" />
                                            {bookingModal.mentor.rating || '5.0'} ({bookingModal.mentor.reviewsCount || 0})
                                        </span>
                                        <span className="text-gray-600 text-xs">• ${bookingModal.mentor.rate || 100}/hr</span>
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
                                    <div className="w-16 h-16 bg-black text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-200 shadow-xs">
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
                                            {(bookingModal.mentor.slots || []).map((slot) => {
                                                const isSelected = selectedSlot?.id === slot.id;
                                                return (
                                                    <button
                                                        key={slot.id}
                                                        type="button"
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${isSelected
                                                            ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                                                            : 'border-gray-200 hover:border-blue-400 bg-white'
                                                            }`}
                                                    >
                                                        <div className="flex items-center space-x-1.5 text-xs font-bold text-black">
                                                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                                            <span>{slot.date}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1.5 text-xs text-gray-700 font-bold mt-1">
                                                            <Clock className="w-3.5 h-3.5 text-gray-500" />
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
                                            placeholder="e.g. Career guidance, portfolio review, interview advice, domain transition..."
                                            className="w-full p-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-gray-50 text-black placeholder-gray-400"
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
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            Confirm Booking (${bookingModal.mentor.rate || 100})
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
                        <div className="bg-gradient-to-b from-gray-100 to-slate-50 text-black p-5 flex justify-between items-center border-b border-gray-200">
                            <h3 className="font-extrabold text-base flex items-center space-x-2">
                                <Video className="w-5 h-5 text-blue-600" />
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
                            <div className="flex items-center space-x-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
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
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition shadow-md"
                            >
                                <Video className="w-4 h-4" />
                                <span>Launch Google Meet</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-slate-900 text-gray-400 py-8 border-t border-slate-800 text-xs mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                            C
                        </div>
                        <span className="text-white font-bold">CareerNav Mentorship Platform</span>
                    </div>
                    <p className="text-gray-400">© {new Date().getFullYear()} CareerNav Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function LearnerDashboardView({
    mentors,
    mentorsLoading,
    mentorsError,
    allDomains,
    selectedDomain,
    setSelectedDomain,
    searchQuery,
    setSearchQuery,
    learnerSessions,
    onBookSession,
    onOpenMeeting
}) {

    const navigate = useNavigate();
    return (
        <div className="space-y-12">
            {/* SECTION 2: Consult Top Mentors Online For Any Career Concern */}
            <section className="space-y-8 py-4">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Consult top experts online for any career concern
                        </h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">
                            Private online consultations with verified professionals across all specialties
                        </p>
                    </div>
                    <button
                        onClick={() => setSelectedDomain('All')}
                        className="text-xs font-semibold text-cyan-600 border border-cyan-400 hover:bg-cyan-50/50 px-4 py-2.5 rounded-md transition-colors self-start sm:self-auto bg-transparent"
                    >
                        View All Specialties
                    </button>
                </div>

                {/* Circular Category Concerns Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
                    {/* Item 1 */}
                    <div
                        onClick={() => setSelectedDomain('Engineering')}
                        className="flex flex-col items-center text-center cursor-pointer group"
                    >
                        <div className="w-28 h-28 rounded-full bg-blue-50/70 border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-blue-100/70 transition duration-200">
                            <Layers className="w-12 h-12 text-blue-600 stroke-[1.5]" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-800 leading-snug px-2 min-h-[2.5rem] flex items-center justify-center">
                            Engineering & Software
                        </h4>
                        <span className="text-[11px] font-bold text-cyan-500 tracking-wider group-hover:underline mt-1">
                            CONSULT NOW
                        </span>
                    </div>

                    {/* Item 2 */}
                    <div
                        onClick={() => setSelectedDomain('AI & Data Science')}
                        className="flex flex-col items-center text-center cursor-pointer group"
                    >
                        <div className="w-28 h-28 rounded-full bg-teal-50/70 border border-teal-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-teal-100/70 transition duration-200">
                            <Sparkles className="w-12 h-12 text-teal-600 stroke-[1.5]" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-800 leading-snug px-2 min-h-[2.5rem] flex items-center justify-center">
                            AI & Data Science
                        </h4>
                        <span className="text-[11px] font-bold text-cyan-500 tracking-wider group-hover:underline mt-1">
                            CONSULT NOW
                        </span>
                    </div>

                    {/* Item 3 */}
                    <div
                        onClick={() => setSelectedDomain('Product & Business')}
                        className="flex flex-col items-center text-center cursor-pointer group"
                    >
                        <div className="w-28 h-28 rounded-full bg-amber-50/70 border border-amber-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-amber-100/70 transition duration-200">
                            <Briefcase className="w-12 h-12 text-amber-600 stroke-[1.5]" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-800 leading-snug px-2 min-h-[2.5rem] flex items-center justify-center">
                            Product & Management
                        </h4>
                        <span className="text-[11px] font-bold text-cyan-500 tracking-wider group-hover:underline mt-1">
                            CONSULT NOW
                        </span>
                    </div>

                    {/* Item 4 */}
                    <div
                        onClick={() => setSelectedDomain('Design & Creative')}
                        className="flex flex-col items-center text-center cursor-pointer group"
                    >
                        <div className="w-28 h-28 rounded-full bg-purple-50/70 border border-purple-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-purple-100/70 transition duration-200">
                            <Compass className="w-12 h-12 text-purple-600 stroke-[1.5]" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-800 leading-snug px-2 min-h-[2.5rem] flex items-center justify-center">
                            Design & Creative Art
                        </h4>
                        <span className="text-[11px] font-bold text-cyan-500 tracking-wider group-hover:underline mt-1">
                            CONSULT NOW
                        </span>
                    </div>

                    {/* Item 5 */}
                    <div
                        onClick={() => setSelectedDomain('Finance & Consulting')}
                        className="flex flex-col items-center text-center cursor-pointer group"
                    >
                        <div className="w-28 h-28 rounded-full bg-emerald-50/70 border border-emerald-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-emerald-100/70 transition duration-200">
                            <DollarSign className="w-12 h-12 text-emerald-600 stroke-[1.5]" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-800 leading-snug px-2 min-h-[2.5rem] flex items-center justify-center">
                            Finance & Consulting
                        </h4>
                        <span className="text-[11px] font-bold text-cyan-500 tracking-wider group-hover:underline mt-1">
                            CONSULT NOW
                        </span>
                    </div>

                    {/* Item 6 */}
                    <div
                        onClick={() => setSelectedDomain('Marketing')}
                        className="flex flex-col items-center text-center cursor-pointer group"
                    >
                        <div className="w-28 h-28 rounded-full bg-rose-50/70 border border-rose-100 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-rose-100/70 transition duration-200">
                            <Lightbulb className="w-12 h-12 text-rose-600 stroke-[1.5]" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-800 leading-snug px-2 min-h-[2.5rem] flex items-center justify-center">
                            Marketing & Sales
                        </h4>
                        <span className="text-[11px] font-bold text-cyan-500 tracking-wider group-hover:underline mt-1">
                            CONSULT NOW
                        </span>
                    </div>
                </div>
            </section>

            {/* SECTION 3: Book an appointment for a 1:1 Consultation */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                        Book a 1:1 session for specialized career guidance
                    </h2>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                        Find experienced career leaders across all fields
                    </p>
                </div>

                {/* Domain Pills Filter */}
                <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-1">
                    {allDomains.map((domain) => (
                        <button
                            key={domain}
                            onClick={() => setSelectedDomain(domain)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${selectedDomain === domain
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {domain}
                        </button>
                    ))}
                </div>

                {/* Mentors Grid */}
                {mentorsLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-2" />
                        <span className="text-sm text-gray-600 font-semibold">Loading available mentors...</span>
                    </div>
                ) : mentorsError ? (
                    <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200">
                        <p className="text-sm font-bold text-red-600">{mentorsError}</p>
                    </div>
                ) : mentors.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-sm font-bold text-gray-700">No mentors found</p>
                        <p className="text-xs text-gray-500 mt-1">Try selecting a different domain or clearing search filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                        {mentors.slice(0, 4).map((mentor) => (
                            <div
                                key={mentor.id}
                                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between cursor-pointer"
                                onClick={() => navigate(`/professionals/${mentor.id}`)}
                           
                                tabIndex={0}
                                role="button"
                            >
                                <div>
                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                        <img
                                            src={mentor.profile_photo
                                                || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
                                            alt={mentor.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-gray-900 shadow-xs flex items-center">
                                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" />
                                            {mentor.rating || '5.0'}
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <h3 className="font-bold text-base text-gray-900 leading-snug">{mentor.name}</h3>
                                        <p className="text-xs text-blue-600 font-semibold">{mentor.title || mentor.role} @ {mentor.company}</p>
                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{mentor.bio}</p>

                                        <div className="flex flex-wrap gap-1 pt-1">
                                            {(mentor.skills || []).slice(0, 3).map((s, i) => (
                                                <span key={i} className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between" onClick={e => e.stopPropagation()}>
                                    <span className="text-sm font-extrabold text-gray-900">${mentor.rate || 100}<span className="text-[10px] text-gray-500 font-normal">/hr</span></span>
                                    <button
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onBookSession(mentor);
                                        }}
                                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs"
                                    >
                                        Book 1:1 Call
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
              
                )}
          
            </section>

            {/* SECTION 4: Upcoming Booked Sessions Section */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                            <Video className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h2 className="text-lg font-bold text-gray-900">My Booked Sessions</h2>
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">Active and upcoming 1:1 career consultations</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-full shadow-xs">
                        {learnerSessions.length} Active {learnerSessions.length === 1 ? 'Call' : 'Calls'}
                    </span>
                </div>

                {learnerSessions.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Clock className="w-9 h-9 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-bold text-gray-700">No upcoming sessions scheduled</p>
                        <p className="text-xs text-gray-500 mt-1">Browse available mentors above to schedule your first 1:1 consultation.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {learnerSessions.map((session) => (
                            <div
                                key={session.id}
                                className="bg-slate-50/80 border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="relative">
                                                <img
                                                    src={session.mentorAvatar}
                                                    alt={session.mentorName}
                                                    className="w-13 h-13 rounded-2xl object-cover ring-2 ring-blue-500"
                                                />
                                                <span className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white w-3.5 h-3.5 rounded-full" title="Active Booking" />
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-base text-black">{session.mentorName}</h4>
                                                <p className="text-xs text-gray-600 font-medium">{session.mentorTitle} • <strong className="text-black font-semibold">{session.mentorCompany}</strong></p>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                                            {session.status || 'Confirmed'}
                                        </span>
                                    </div>

                                    {/* Topic Card */}
                                    <div className="mt-4 bg-white p-3 rounded-xl border border-gray-200 text-xs text-gray-800">
                                        <div className="flex items-center space-x-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                                            <MessageSquare className="w-3 h-3 text-blue-600" />
                                            <span>Session Agenda</span>
                                        </div>
                                        <p className="font-medium line-clamp-2 text-gray-900">{session.topic}</p>
                                    </div>

                                    {/* Time Tag */}
                                    <div className="mt-3 flex items-center justify-between text-xs font-semibold text-gray-800 bg-white px-3 py-2 rounded-xl border border-gray-200">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                            <span>{session.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-1.5 text-black font-bold">
                                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                                            <span>{session.time}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 pt-3 border-t border-gray-200 flex items-center justify-between">
                                    <button
                                        onClick={() => navigator.clipboard.writeText(session.meetingLink)}
                                        className="text-[11px] font-bold text-gray-600 hover:text-black flex items-center space-x-1 transition"
                                        title="Copy link"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Meet Link</span>
                                    </button>
                                    <button
                                        onClick={() => onOpenMeeting(session.meetingLink)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center space-x-2 transition shadow-xs active:scale-95"
                                    >
                                        <Video className="w-3.5 h-3.5" />
                                        <span>Join Google Meet</span>
                                        <ExternalLink className="w-3 h-3 text-blue-200" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function MentorDashboardView({
    mentorBookings,
    mentorSlots,
    setMentorSlots,
    onAddSlot,
    onToggleSlot,
    newSlotDate,
    setNewSlotDate,
    newSlotTime,
    setNewSlotTime,
    reviews,
    onViewDetails,
}) {
    const [slotSubmitError, setSlotSubmitError] = useState(null);
    const [slotSuccess, setSlotSuccess] = useState(null);

    // Used for clearing error/success after some time
    useEffect(() => {
        let timer;
        if (slotSubmitError) {
            timer = setTimeout(() => setSlotSubmitError(null), 4000);
        } else if (slotSuccess) {
            timer = setTimeout(() => setSlotSuccess(null), 4000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [slotSubmitError, slotSuccess]);

    // Modal state for slot deletion confirmation
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [slotIdToDelete, setSlotIdToDelete] = useState(null);

    // API call to fetch mentor's own slots from /slots/me
    const fetchMentorSlots = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/slots/me`,
                { withCredentials: true }
            );
            const slots = response.data.slots || [];
            setMentorSlots(slots);
        } catch (error) {
            setSlotSuccess(null);
            setSlotSubmitError(
                error?.response?.data?.message ||
                error?.response?.data?.errors?.[0]?.msg ||
                "We were unable to fetch your available slots. Please try again shortly, or contact support if the problem persists."
            );
        }
    };

    useEffect(() => {
        fetchMentorSlots();
    }, []);

    const createSlotAPI = async (e) => {
        e.preventDefault();
        setSlotSuccess(null);
        setSlotSubmitError(null);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/slots`,
                {
                    date: newSlotDate,
                    time: newSlotTime
                },
                { withCredentials: true }
            );

            const createdSlot = response.data.slot ||
            {
                id: response.data.slot.id,
                date: newSlotDate,
                time: newSlotTime,
                status: response.data.slot.status
            };

            setMentorSlots([
                ...mentorSlots,
                {
                    slot_id: createdSlot.id || `ms-${Date.now()}`,
                    date: createdSlot.date || newSlotDate,
                    start_time: createdSlot.time || newSlotTime,
                    status: createdSlot.status 
                }
            ]);
            setSlotSubmitError(null);
            setSlotSuccess(
                response.data.message ||
                "Slot added successfully. Students can now see and book this slot."
            );
        } catch (error) {
            setSlotSuccess(null);
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.errors?.[0]?.msg ||
                "There was an error while adding your slot. Please try again and ensure your selected time and date are valid.";
            setSlotSubmitError(message);
        }
    };

    // Delete API, called after confirmation
    const confirmDeleteSlot = async () => {
        if (!slotIdToDelete) return;
        setSlotSuccess(null);
        setSlotSubmitError(null);
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/slots/${slotIdToDelete}`,
                { withCredentials: true }
            );
            setMentorSlots(mentorSlots.filter(slot => slot.slot_id !== slotIdToDelete));
            setDeleteModalOpen(false);
            setSlotIdToDelete(null);
            setSlotSubmitError(null);
            setSlotSuccess(
                response.data.message ||
                "Slot deleted successfully. Your availability has been updated."
            );
        } catch (error) {
            setSlotSuccess(null);
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.errors?.[0]?.msg ||
                "Failed to delete this slot; please try again or refresh the page.";
            setSlotSubmitError(message);
            setDeleteModalOpen(false);
            setSlotIdToDelete(null);
        }
    };

    // Handler for trash button to open modal
    const handleDeleteClick = (slotId) => {
        setSlotIdToDelete(slotId);
        setDeleteModalOpen(true);
    };

    // Handler to close modal without deleting
    const handleCloseModal = () => {
        setDeleteModalOpen(false);
        setSlotIdToDelete(null);
    };

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500">Monthly Earnings</p>
                            <h3 className="text-2xl font-extrabold text-black">$3,840</h3>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center space-x-0.5">
                        <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
                    </span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-black text-blue-600 rounded-xl border border-blue-100">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500">Booked Sessions</p>
                            <h3 className="text-2xl font-extrabold text-black">{mentorBookings.length}</h3>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold bg-black text-blue-700 px-2 py-0.5 rounded-full">
                        Active
                    </span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-amber-50 text-amber-500 rounded-xl border border-amber-100">
                            <Star className="w-6 h-6 fill-amber-500" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-500">Average Rating</p>
                            <h3 className="text-2xl font-extrabold text-black">5.0</h3>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full flex items-center">
                        ★ 100% Top Tier
                    </span>
                </div>
            </section>

            {/* Layout Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Learner Bookings */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div>
                                <h2 className="text-lg font-extrabold text-black">Upcoming Learner Consultations</h2>
                                <p className="text-xs text-gray-500">Confirmed student calls needing your expertise</p>
                            </div>
                            <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-full">
                                {mentorBookings.length} Scheduled
                            </span>
                        </div>
                        <div className="space-y-3">
                            {mentorBookings.map((b) => (
                                <div key={b.id} className="p-4 bg-slate-50 hover:bg-gray-100/80 rounded-2xl border border-gray-200 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center space-x-3.5">
                                        <div className="relative">
                                            <img src={b.studentAvatar} alt={b.studentName} className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-300" />
                                            <span className="absolute bottom-0 right-0 bg-emerald-500 w-3 h-3 rounded-full border-2 border-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h4 className="font-bold text-sm text-black">{b.studentName}</h4>
                                                <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md uppercase">
                                                    {b.careerInterest}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 font-medium flex items-center space-x-2 mt-0.5">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                <span>{b.date} at {b.time}</span>
                                                <span>•</span>
                                                <span className="font-bold text-black">${b.amount} Payout</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 self-end sm:self-center">
                                        <button onClick={() => onViewDetails(b)} className="px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition shadow-2xs">
                                            Details
                                        </button>
                                        <button onClick={() => window.open(b.meetingLink, '_blank')} className="px-3.5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 hover:bg-blue-700 transition shadow-xs">
                                            <Video className="w-3.5 h-3.5" />
                                            <span>Launch Call</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    {/* Student Feedback & Reviews */}
                    <section className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div>
                                <h2 className="text-base font-extrabold text-black">Recent Student Reviews</h2>
                                <p className="text-xs text-gray-500">Feedback from completed mentorship sessions</p>
                            </div>
                            <Award className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reviews.map((rev) => (
                                <div key={rev.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col justify-between space-y-3">
                                    <p className="text-xs text-gray-700 italic leading-relaxed">"{rev.comment}"</p>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                                        <div className="flex items-center space-x-2">
                                            <img src={rev.studentAvatar} alt={rev.studentName} className="w-7 h-7 rounded-full object-cover" />
                                            <div>
                                                <p className="text-xs font-bold text-black leading-none">{rev.studentName}</p>
                                                <span className="text-[10px] text-gray-400">{rev.date}</span>
                                            </div>
                                        </div>
                                        <div className="flex text-amber-500">
                                            {[...Array(rev.rating)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-amber-500" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
                {/* Right: Slot Management */}
                <section className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200 space-y-5 h-fit">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-blue-600 text-white rounded-xl">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-black">Manage Availability</h2>
                                <p className="text-[11px] text-gray-500 font-medium">Configure public mentorship slots</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold bg-black text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
                            {mentorSlots.length} Slots
                        </span>
                    </div>
                    {/* Add Slot Form */}
                    <form
                        onSubmit={createSlotAPI}
                        className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200"
                    >
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Add New Slot</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date Picker */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">
                                    <span className="flex items-center space-x-1">
                                        <Calendar className="inline w-3.5 h-3.5 text-blue-600" />
                                        <span>Select Date</span>
                                    </span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={newSlotDate}
                                    onChange={(e) => setNewSlotDate(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 outline-none transition text-black shadow-sm placeholder:text-gray-400"
                                />
                            </div>
                            {/* Time Picker */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">
                                    <span className="flex items-center space-x-1">
                                        <Clock className="inline w-3.5 h-3.5 text-blue-600" />
                                        <span>Select Time Slot</span>
                                    </span>
                                </label>
                                <select
                                    value={newSlotTime}
                                    onChange={(e) => setNewSlotTime(e.target.value)}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 outline-none transition text-black shadow-sm cursor-pointer"
                                >
                                    <option disabled value="">Choose a time...</option>
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
                                <span className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 w-full block">
                                    {slotSubmitError}
                                </span>
                            )}
                            {!slotSubmitError && slotSuccess && (
                                <span className="text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2 w-full block">
                                    {slotSuccess}
                                </span>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-xs"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Available Slot</span>
                        </button>
                    </form>
                    {/* Slots List */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-700">Current Schedule</p>
                            {mentorSlots.length > 3 && (
                                <span className="text-[10px] text-gray-400 font-medium">Scroll for more</span>
                            )}
                        </div>
                        {mentorSlots.length === 0 ? (
                            <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 text-xs">
                                No availability slots configured
                            </div>
                        ) : (
                            <div className="max-h-[260px] overflow-y-auto space-y-2.5 pr-1 transition-all">
                                {mentorSlots.map((slot) => (
                                    <div
                                        key={slot.slot_id}
                                        className="flex justify-between items-center p-3.5 border border-gray-200 rounded-xl text-xs bg-white hover:border-blue-500 transition shadow-2xs"
                                    >
                                        <div className="space-y-0.5">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                                <span className="font-bold text-black">{slot.date}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-gray-700 font-medium">{slot.start_time}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => onToggleSlot(slot.slot_id)}
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition ${slot.status
                                                    ? 'bg-green-700 text-white border-blue-600'
                                                    : 'bg-gray-300 text-white border-gray-200'
                                                    }`}
                                            >
                                                {slot.status ? 'Available' : 'Booked'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteClick(slot.slot_id)}
                                                className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition"
                                                title="Delete Slot"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Delete Confirmation Modal */}
                    {deleteModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all">
                            <div className="bg-white rounded-xl shadow-xl p-5 sm:p-6 md:p-7 max-w-[96vw] w-full max-w-xs sm:max-w-sm md:max-w-xs border border-gray-100 transition-all">
                                <div className="flex flex-col items-center mb-4">
                                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-10 md:h-10 rounded-full bg-red-50 mb-2">
                                        <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 md:w-5 md:h-5 text-red-500" />
                                    </div>
                                    <h2 className="font-semibold text-base sm:text-lg mb-1 text-gray-900 tracking-tight text-center">
                                        Confirm Deletion
                                    </h2>
                                    <p className="text-xs sm:text-sm text-gray-600 text-center">
                                        Are you sure you want to delete this slot? <br />
                                        <span className="text-red-500 font-semibold">This cannot be undone.</span>
                                    </p>
                                </div>
                                <div className="flex items-center justify-end space-x-2 pt-1">
                                    <button
                                        className="px-3 py-1.5 rounded-lg text-xs sm:text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium border border-gray-200 transition"
                                        onClick={handleCloseModal}
                                        autoFocus
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-3 py-1.5 rounded-lg text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white font-semibold border border-transparent shadow-sm transition"
                                        onClick={confirmDeleteSlot}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}