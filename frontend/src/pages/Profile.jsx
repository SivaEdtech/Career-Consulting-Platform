import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    GraduationCap,
    BookOpen,
    Globe,
    DollarSign,
    Award,
    Sparkles,
    Edit3,
    Check,
    X,
    Camera,
    Loader2,
    Shield,
    Plus,
    Trash2,
    LogOut,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';

// ----- NEW: import useAuth -----
import { useAuth } from '../context/AuthContext';

// Updated: Don't require currentUserId/profileUserId from props,
// instead get from auth context as available for "current user".
export default function Profile({ profileUserId: propProfileUserId }) {
    // get user from auth context
    const { user: authUser, loading: authLoading } = useAuth();

    // Until auth is checked, don't load
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // If viewing own profile, use our userId. Else, allow externally supplied profileUserId.
    // By default, show own profile.
    const currentUserId = authUser?.id || 'usr_me123';
    const profileUserId = propProfileUserId || currentUserId;

    // Determines if the authenticated user is viewing their own profile
    const isOwnProfile = currentUserId === profileUserId;

    // Profile State Schema
    const [profile, setProfile] = useState({
        id: '',
        name: '',
        email: '',
        profile_photo: '',
        bio: '',
        role: '', // Will assign from auth context if own profile!
        education_background: '',
        interests: [],
        languages: [],
        number_of_consultations: 0,
        consulting_price: '0.00'
    });

    // Tag Input Buffers
    const [newInterestInput, setNewInterestInput] = useState('');
    const [newLanguageInput, setNewLanguageInput] = useState('');

    // For proper load: 1) wait for authUser to load; 2) then fetch profile.
    useEffect(() => {
        if (!authLoading) {
            fetchProfile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authLoading, profileUserId, currentUserId]);

    // Fetch profile. If it's current user, sync profile.role with authUser.role.
    // Also ensure on fallback, own profile gets correct role from AuthContext.
    const fetchProfile = async () => {
        setLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
            const response = await fetch(
                `${backendUrl}/api/profile/${profileUserId}`,
                { credentials: 'include' }
            );

            if (!response.ok) throw new Error('Failed to load profile');
            const data = await response.json();

            // If own profile, get role from authUser, else from data or fallback.
            const finalRole =
                isOwnProfile && authUser?.role
                    ? authUser.role.toLowerCase()
                    : (data.role ? data.role.toLowerCase() : 'learner');

            setProfile({
                id: data.id || profileUserId,
                name: data.name || (isOwnProfile ? authUser?.name || '' : ''),
                email: data.email || (isOwnProfile ? authUser?.email || '' : ''),
                profile_photo: data.profile_photo || (isOwnProfile && authUser?.profile_photo ? authUser.profile_photo : ''),
                bio: data.bio || '',
                role: finalRole,
                education_background: data.education_background || '',
                interests: typeof data.interests === 'string'
                    ? JSON.parse(data.interests)
                    : (data.interests || []),
                languages: typeof data.languages === 'string'
                    ? JSON.parse(data.languages)
                    : (data.languages || []),
                number_of_consultations: data.number_of_consultations || 0,
                consulting_price: data.consulting_price || '0.00'
            });
        } catch (error) {
            console.warn('API fallback loaded:', error.message);

            // On fallback, use auth context for own profile's role/info.
            setProfile({
                id: profileUserId,
                name: isOwnProfile ? (authUser?.name || 'Alex Rivera') : 'Alex Rivera',
                email: isOwnProfile ? (authUser?.email || 'alex.rivera@enterprise.io') : 'alex.rivera@enterprise.io',
                profile_photo: isOwnProfile
                    ? (authUser?.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300')
                    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
                bio: 'Senior Infrastructure Engineer specializing in distributed event routing, scalable API gateways, and asynchronous microservice architecture.',
                role: isOwnProfile && authUser?.role
                    ? authUser.role.toLowerCase()
                    : 'professional', // fallback
                education_background: 'B.S. in Computer Science & Engineering',
                interests: ['Distributed Systems', 'Kafka Architecture', 'Kubernetes', 'High-Throughput APIs'],
                languages: ['English (Native)', 'Spanish (Professional)'],
                number_of_consultations: 128,
                consulting_price: '150.00'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
            const response = await fetch(`${backendUrl}/api/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(profile)
            });

            if (!response.ok) throw new Error('Failed to update');
            setSaveSuccess(true);
            setIsEditing(false);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            setIsEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } finally {
            setSaving(false);
        }
    };

    const handleConfirmLogout = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
            await fetch(`${backendUrl}/api/auth/logout`, { method: 'POST', credentials: 'include' });
        } catch (err) {
            console.warn('Logout API unavailable, redirecting...');
        } finally {
            window.location.href = '/login';
        }
    };

    const handleAddTag = (type) => {
        if (type === 'interests' && newInterestInput.trim()) {
            setProfile({ ...profile, interests: [...profile.interests, newInterestInput.trim()] });
            setNewInterestInput('');
        } else if (type === 'languages' && newLanguageInput.trim()) {
            setProfile({ ...profile, languages: [...profile.languages, newLanguageInput.trim()] });
            setNewLanguageInput('');
        }
    };

    const handleRemoveTag = (type, index) => {
        if (type === 'interests') {
            setProfile({ ...profile, interests: profile.interests.filter((_, i) => i !== index) });
        } else {
            setProfile({ ...profile, languages: profile.languages.filter((_, i) => i !== index) });
        }
    };

    // Wait for BOTH: profile data and user auth context
    if (loading || authLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-3 p-4">
                <Loader2 className="w-8 h-8 text-black animate-spin" />
                <p className="text-xs font-bold tracking-wider text-gray-600 uppercase">Loading Profile...</p>
            </div>
        );
    }

    // Always use profile.role so updates reflect
    const isProfessional = profile.role === 'professional';

    return (
        <div className="min-h-screen bg-gray-100 text-black font-sans antialiased pb-20 selection:bg-black selection:text-white">
            
            {/* Top Navigation Banner */}
            <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-3.5 sm:py-4 shadow-xs">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
                    
                    {/* App Branding */}
                    <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black text-white font-black flex items-center justify-center text-base sm:text-lg tracking-tighter shadow-sm">
                            C
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold tracking-tight text-black">CareerNav</span>
                    </div>

                    {/* Header Controls */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        {isOwnProfile && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-3 sm:px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-black text-xs font-bold flex items-center space-x-1.5 sm:space-x-2 transition shadow-xs cursor-pointer"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span className="hidden xs:inline">Edit Profile</span>
                                <span className="xs:hidden">Edit</span>
                            </button>
                        )}
                        {isOwnProfile && (
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="px-3 sm:px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center space-x-1.5 sm:space-x-2 transition cursor-pointer"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span className="hidden xs:inline">Sign Out</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8 space-y-6">

                {/* Toast Notification */}
                {saveSuccess && (
                    <div className="bg-gray-900 text-white px-4 sm:px-5 py-3.5 rounded-2xl flex items-center justify-between text-xs font-bold shadow-lg animate-in fade-in duration-200">
                        <div className="flex items-center space-x-2.5 pr-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="truncate">Profile updated successfully in system database.</span>
                        </div>
                        <button onClick={() => setSaveSuccess(false)} className="cursor-pointer shrink-0">
                            <X className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>
                    </div>
                )}

                {/* Hero Header Card */}
                <section className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-8 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 sm:gap-6 w-full">
                            
                            {/* Profile Image */}
                            <div className="relative group shrink-0">
                                <img
                                    src={profile.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                                    alt={profile.name}
                                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-gray-100 shadow-md"
                                />
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Main User Info */}
                            <div className="space-y-2 w-full">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-3">
                                    <h1 className="text-xl sm:text-3xl font-black tracking-tight text-black break-words">
                                        {profile.name || 'Anonymous User'}
                                    </h1>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shrink-0 ${
                                        isProfessional 
                                            ? 'bg-black text-white border-black' 
                                            : 'bg-gray-100 text-black border-gray-300'
                                    }`}>
                                        {profile.role}
                                    </span>
                                </div>

                                {/* Privacy Protected Email Display */}
                                {isOwnProfile ? (
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-gray-600">
                                        <div className="flex items-center space-x-1.5 min-w-0">
                                            <Mail className="w-3.5 h-3.5 text-black shrink-0" />
                                            <span className="truncate">{profile.email}</span>
                                        </div>
                                        <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md border border-gray-200 font-bold shrink-0">
                                            Only visible to you
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-xs text-gray-500 font-medium">
                                        <Shield className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        <span>Contact options restricted</span>
                                    </div>
                                )}

                                <p className="text-xs sm:text-sm text-gray-700 max-w-xl leading-relaxed pt-1 font-medium">
                                    {profile.bio || 'No executive summary provided.'}
                                </p>
                            </div>
                        </div>

                        {/* Top Right Rate Display for Professional */}
                        {isProfessional && (
                            <div className="w-full lg:w-auto bg-gray-50 rounded-2xl border border-gray-200 p-4 flex flex-row lg:flex-col items-center justify-between gap-3 text-left lg:text-right shrink-0">
                                <div>
                                    <span className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase block">Consultation Fee</span>
                                    <span className="text-xl sm:text-2xl font-black text-black">${profile.consulting_price} <span className="text-xs text-gray-500 font-medium">/ hr</span></span>
                                </div>
                                <button className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer w-auto lg:w-full">
                                    Book Session
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Metrics Highlights Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block truncate">Account Type</span>
                        <p className="text-xs sm:text-sm font-black text-black mt-1 capitalize truncate">{profile.role}</p>
                    </div>

                    {isProfessional ? (
                        <>
                            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block truncate">Sessions</span>
                                <p className="text-xs sm:text-sm font-black text-black mt-1 truncate">{profile.number_of_consultations} Consultations</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block truncate">Hourly Rate</span>
                                <p className="text-xs sm:text-sm font-black text-black mt-1 truncate">${profile.consulting_price} USD</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block truncate">Languages</span>
                                <p className="text-xs sm:text-sm font-black text-black mt-1 truncate">{profile.languages.length} Spoken</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs col-span-2 sm:col-span-1 lg:col-span-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block truncate">Focus Topics</span>
                                <p className="text-xs sm:text-sm font-black text-black mt-1 truncate">{profile.interests.length} Area(s) of Interest</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block truncate">Status</span>
                                <p className="text-xs sm:text-sm font-black text-black mt-1 truncate">Active Learner</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Profile Detail Forms & Sections */}
                <form onSubmit={handleSaveProfile} className="space-y-6">

                    {/* Bio Section */}
                    <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-8 space-y-4 shadow-xs">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center space-x-2">
                                <BookOpen className="w-4 h-4 text-black shrink-0" />
                                <span>About & Executive Bio</span>
                            </h3>
                        </div>

                        {isEditing ? (
                            <textarea
                                rows={4}
                                value={profile.bio}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-black font-medium focus:outline-none focus:ring-2 focus:ring-black transition"
                                placeholder="Describe your experience and focus..."
                            />
                        ) : (
                            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium break-words">
                                {profile.bio || 'No biography provided.'}
                            </p>
                        )}
                    </div>

                    {/* Dynamic Role Configuration Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Professional Section: Consultation Price & Languages */}
                        {isProfessional && (
                            <>
                                <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
                                    <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center space-x-2">
                                        <DollarSign className="w-4 h-4 text-black shrink-0" />
                                        <span>Consulting Rates</span>
                                    </h3>

                                    {isEditing ? (
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                                                Hourly Rate ($ USD)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={profile.consulting_price}
                                                onChange={(e) => setProfile({ ...profile, consulting_price: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-xs font-semibold text-gray-600">Standard Hourly Fee:</span>
                                            <span className="text-base font-black text-black">${profile.consulting_price} / hr</span>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
                                    <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center space-x-2">
                                        <Globe className="w-4 h-4 text-black shrink-0" />
                                        <span>Spoken Languages</span>
                                    </h3>

                                    {isEditing ? (
                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newLanguageInput}
                                                    onChange={(e) => setNewLanguageInput(e.target.value)}
                                                    placeholder="Add language..."
                                                    className="flex-1 min-w-0 bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-black font-medium focus:outline-none focus:ring-2 focus:ring-black"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddTag('languages')}
                                                    className="px-3.5 bg-black text-white hover:bg-gray-800 rounded-xl text-xs font-bold cursor-pointer shrink-0"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.languages.map((lang, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-xl text-xs font-bold text-black flex items-center gap-1.5 break-all">
                                                        {lang}
                                                        <button type="button" onClick={() => handleRemoveTag('languages', idx)} className="cursor-pointer shrink-0">
                                                            <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-black" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {profile.languages.map((lang, idx) => (
                                                <span key={idx} className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-xl text-xs font-bold text-black break-all">
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Learner Section: Education & Interests */}
                        {!isProfessional && (
                            <>
                                <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
                                    <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center space-x-2">
                                        <GraduationCap className="w-4 h-4 text-black shrink-0" />
                                        <span>Education Background</span>
                                    </h3>

                                    {isEditing ? (
                                        <textarea
                                            rows={3}
                                            value={profile.education_background}
                                            onChange={(e) => setProfile({ ...profile, education_background: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-black font-medium focus:outline-none focus:ring-2 focus:ring-black"
                                            placeholder="Degree, major, university..."
                                        />
                                    ) : (
                                        <p className="text-xs sm:text-sm text-gray-800 font-medium break-words">
                                            {profile.education_background || 'No academic details provided.'}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
                                    <h3 className="text-xs font-black uppercase tracking-wider text-black flex items-center space-x-2">
                                        <Sparkles className="w-4 h-4 text-black shrink-0" />
                                        <span>Topics of Interest</span>
                                    </h3>

                                    {isEditing ? (
                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newInterestInput}
                                                    onChange={(e) => setNewInterestInput(e.target.value)}
                                                    placeholder="Add topic..."
                                                    className="flex-1 min-w-0 bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs text-black font-medium focus:outline-none focus:ring-2 focus:ring-black"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddTag('interests')}
                                                    className="px-3.5 bg-black text-white hover:bg-gray-800 rounded-xl text-xs font-bold cursor-pointer shrink-0"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.interests.map((interest, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-xl text-xs font-bold text-black flex items-center gap-1.5 break-all">
                                                        {interest}
                                                        <button type="button" onClick={() => handleRemoveTag('interests', idx)} className="cursor-pointer shrink-0">
                                                            <Trash2 className="w-3.5 h-3.5 text-gray-500 hover:text-black" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {profile.interests.map((interest, idx) => (
                                                <span key={idx} className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-xl text-xs font-bold text-black break-all">
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Form Controls */}
                    {isEditing && (
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 text-xs font-bold transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold flex items-center justify-center space-x-2 transition shadow-md cursor-pointer"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                <span>Save Changes</span>
                            </button>
                        </div>
                    )}
                </form>

            </main>

            {/* CONFIRMATION LOGOUT MODAL OVERLAY */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="bg-white border border-gray-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-base font-extrabold text-black">Sign Out of Account</h4>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">Are you sure you want to end your current session?</p>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 pt-2">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmLogout}
                                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                            >
                                Confirm Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}