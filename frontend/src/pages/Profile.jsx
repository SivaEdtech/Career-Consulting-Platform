import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, BookOpen, GraduationCap, DollarSign, Globe, Sparkles } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  console.log("user:", user)
  const [profile, setProfile] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  let professionalId;

  // 1. Fetch Profile based on User Role
  useEffect(() => {
    if (!user) return;

    if (user.role === 'learner') {
      fetchLearnerProfile();
    } else if (user.role === 'professional') {
      fetchProfessionalProfile();
    }
  }, [user]);

  const fetchLearnerProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/learner/me`, { withCredentials: true });
      console.log("learner data:" , res)
      setProfile(res.data.learner);

    } catch (err) {
      console.error('Error fetching learner profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessionalProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/professional/me `, { withCredentials: true });
      setProfile(res.data.professional);
      professionalId=res.data.professional.id
      fetchSlots();
      console.log("professional data:" , res.data.professional)
    } catch (err) {
      console.error('Error fetching professional profile:', err);
    } finally {
      setLoading(false);
    }
  };


  const fetchSlots = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/professionals/${professionalId}/slots`, { withCredentials: true });
      console.log("response of slots:", res)
      setSlots(res.data?.slots || res.data || []);
    } catch (err) {
      console.error('Error fetching slots:', err);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600 font-medium text-sm">
        Loading profile...
      </div>
    );
  }

  const isProfessional = user?.role === 'professional';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 font-sans text-black">

      {isProfessional ? (
        <>
          {/* Professional Profile Header */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
            <img
              src={profile?.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
              alt={profile?.name || 'Profile Photo'}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
            />
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl font-bold">{profile?.name || 'No name provided'}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-black text-white">
                  {user?.role}
                </span>
              </div>
              <p className="text-sm text-gray-500">{profile?.email || 'No email provided'}</p>
              <p className="text-sm text-gray-700">{profile?.bio || 'No biography available.'}</p>
            </div>
          </div>

          {/* Professional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Consulting Fee */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-2">
              <div className="flex items-center space-x-2 text-gray-700 font-semibold text-sm">
                <DollarSign className="w-4 h-4" />
                <span>Consulting Fee</span>
              </div>
              <p className="text-lg font-bold">
                ${profile?.consulting_price ?? '0.00'} / hr
              </p>
            </div>

            {/* Languages */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-2">
              <div className="flex items-center space-x-2 text-gray-700 font-semibold text-sm">
                <Globe className="w-4 h-4" />
                <span>Languages</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(profile?.languages)
                  ? profile.languages
                  : (profile?.languages
                      ? (() => {
                          try {
                            // Parse JSON string to array if needed
                            const parsed = JSON.parse(profile.languages);
                            return Array.isArray(parsed) ? parsed : [];
                          } catch {
                            return [];
                          }
                        })()
                      : [])
                ).map((lang, idx) => (
                  <span key={idx} className="bg-gray-100 text-xs font-medium px-2.5 py-1 rounded-md">
                    {lang}
                  </span>
                ))}
                {
                  (!profile?.languages ||
                    (Array.isArray(profile.languages) && profile.languages.length === 0) ||
                    (typeof profile.languages === "string" &&
                      (() => {
                        try {
                          return JSON.parse(profile.languages).length === 0;
                        } catch {
                          return true;
                        }
                      })())
                  ) && (
                    <p className="text-xs text-gray-500">None specified</p>
                  )
                }
              </div>
            </div>

            {/* Number of Consultations */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-2">
              <div className="flex items-center space-x-2 text-gray-700 font-semibold text-sm">
                <Calendar className="w-4 h-4" />
                <span>Number of Consultations</span>
              </div>
              <p className="text-lg font-bold">
                {profile?.number_of_consultations ?? 0}
              </p>
            </div>

            {/* Bio (again if desired; already in header) */}
            {/* Can remove this block, bio already shown above - keeping for visibility, but it can easily be omitted */}
            {/* <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col gap-2">
              <div className="flex items-center space-x-2 text-gray-700 font-semibold text-sm">
                <BookOpen className="w-4 h-4" />
                <span>Bio</span>
              </div>
              <p className="text-sm text-gray-800">{profile?.bio || 'No biography available.'}</p>
            </div> */}
          </div>

          {/* Available Slots Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-4">
            <div className="flex items-center space-x-2 border-b border-gray-100 pb-3 mb-3">
              <Calendar className="w-5 h-5 text-black" />
              <h2 className="text-base font-bold text-black">Available Slots</h2>
            </div>
            <div className="flex flex-col gap-3">
              {Array.isArray(slots) && slots.length > 0 ? (
                slots.map((slot) => {
                  // Format date to something like "31 Aug 2026"
                  let formattedDate = '';
                  try {
                    const dateObj = new Date(slot.date);
                    if (!isNaN(dateObj.getTime())) {
                      formattedDate = dateObj.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      });
                    } else {
                      formattedDate = slot.date;
                    }
                  } catch {
                    formattedDate = slot.date;
                  }

                  // Format time - support both HH:mm:ss and possible ISO formats
                  let formattedTime = '';
                  if (slot.start_time) {
                    if (/^\d{2}:\d{2}(:\d{2})?$/.test(slot.start_time)) {
                      formattedTime = slot.start_time.slice(0, 5);
                    } else {
                      try {
                        const t = new Date(`1970-01-01T${slot.start_time}`);
                        if (!isNaN(t.getTime())) {
                          formattedTime = t.toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                        } else {
                          formattedTime = slot.start_time;
                        }
                      } catch {
                        formattedTime = slot.start_time;
                      }
                    }
                  }

                  return (
                    <div
                      key={slot.slot_id}
                      className="flex flex-col md:flex-row md:items-center justify-between border border-gray-100 rounded-xl p-4 bg-gray-50"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-2 text-gray-800 font-medium">
                        <span className="text-sm flex items-center">
                          <Calendar className="inline-block w-4 h-4 mr-1 text-gray-600" />
                          {formattedDate}
                        </span>
                        <span className="hidden md:inline-block w-px h-4 bg-gray-300" />
                        <span className="text-sm flex items-center">
                          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-1" />
                          {formattedTime}
                        </span>
                        <span className="flex items-center ml-2">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1" />
                          <span className="text-green-600 text-xs font-semibold">Available</span>
                        </span>
                      </div>
                      <button
                        className="mt-2 md:mt-0 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 font-semibold transition text-sm"
                        onClick={() => {
                          alert(`Book Slot ID: ${slot.slot_id}`);
                        }}
                      >
                        Book Slot
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No slots currently available</p>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Learner Profile - Completely independent structure */
        <div className="max-w-xl mx-auto flex flex-col gap-7">
          {/* Profile Overview */}
          <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-3xl p-8 shadow-md flex flex-col items-center relative">
            <div className="mb-3">
              <img
                src={profile?.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                alt={profile?.name || 'Profile Photo'}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg bg-gray-100"
              />
            </div>
            <div className="text-2xl font-bold text-gray-900 text-center tracking-tight">
              {profile?.name || <span className="text-gray-400">No name provided</span>}
            </div>
            <span className="mt-2 px-4 py-1 rounded-full text-xs font-semibold uppercase bg-gradient-to-r from-black to-gray-800 text-white tracking-wide shadow">
              {user?.role || "LEARNER"}
            </span>
            <div className="text-sm text-gray-500 italic text-center mt-1">
              {profile?.email || 'No email provided'}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white border border-gray-100 rounded-3xl p-7 shadow flex flex-col gap-2">
            <div className="flex items-center space-x-2 text-blue-700 font-semibold text-base mb-1">
              <GraduationCap className="w-5 h-5" />
              <span>Education</span>
            </div>
            <div className="text-sm text-gray-700 font-medium bg-blue-50 rounded-lg px-3 py-2">
              {profile?.education_background || <span className="text-gray-400">No education info added.</span>}
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white border border-gray-100 rounded-3xl p-7 shadow flex flex-col gap-2">
            <div className="flex items-center space-x-2 text-violet-700 font-semibold text-base mb-1">
              <BookOpen className="w-5 h-5" />
              <span>Bio</span>
            </div>
            <div className="text-sm text-gray-700 bg-violet-50 rounded-lg px-3 py-2">
              {profile?.bio || <span className="text-gray-400">No bio provided.</span>}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-gradient-to-b from-white to-gray-100 border border-gray-100 rounded-3xl p-7 shadow flex flex-col gap-2">
            <div className="flex items-center space-x-2 text-pink-600 font-semibold text-base mb-1">
              <Sparkles className="w-5 h-5" />
              <span>Interests</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {Array.isArray(profile?.interests) && profile.interests.length > 0 ? (
                profile.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="bg-pink-50 text-pink-700 text-xs font-medium px-3 py-1 rounded-full border border-pink-200 shadow-sm"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400 italic">No interests added</span>
              )}
            </div>
          </div>
        </div>
  
      )}
    </div>
  );
}