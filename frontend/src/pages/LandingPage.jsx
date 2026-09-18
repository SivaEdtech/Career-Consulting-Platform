import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import axios from "../api/axios"
import {
  Search, MapPin, UserCheck, Video, FileText, Briefcase,
  Star, ChevronRight, CheckCircle2, Smartphone, Shield,
  Clock, ArrowRight, User, Lock, Mail, Building, Sparkles, X, Filter,
  Code2, BrainCircuit, Layout, Cloud, BarChart3, GraduationCap,
  MessageSquare, DollarSign, Target, Award, ArrowUpRight, Check
} from 'lucide-react';

const CAREER_TRACKS = [
  {
    id: 'swe',
    name: 'Software & Backend Engineering',
    description: 'System design, microservices, algorithms, and distributed systems.',
    mentorCount: 1240,
    skills: ['System Design', 'Java / Go / Node', 'DSA & LeetCode', 'Architecture'],
    icon: Code2,
    gradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
    borderColor: 'hover:border-teal-600',
    iconColor: 'text-teal-600 bg-teal-50'
  },
  {
    id: 'ds_ai',
    name: 'Data Science & Generative AI',
    description: 'Machine learning models, LLMs, data pipelines, and analytics.',
    mentorCount: 890,
    skills: ['PyTorch / ML', 'LLM Fine-Tuning', 'SQL & BigData', 'NLP'],
    icon: BrainCircuit,
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    borderColor: 'hover:border-emerald-600',
    iconColor: 'text-emerald-600 bg-emerald-50'
  },
  {
    id: 'pm',
    name: 'Product Management & Strategy',
    description: 'Product roadmaps, PRD creation, user metrics, and product execution.',
    mentorCount: 650,
    skills: ['Product Strategy', 'Metric Analysis', 'UI/UX Wireframing', 'PRDs'],
    icon: Layout,
    gradient: 'from-cyan-500/10 via-teal-500/5 to-transparent',
    borderColor: 'hover:border-cyan-600',
    iconColor: 'text-cyan-600 bg-cyan-50'
  },
  {
    id: 'ux',
    name: 'UI/UX & Product Design',
    description: 'User research, Figma design systems, portfolio reviews, and prototyping.',
    mentorCount: 510,
    skills: ['Figma Systems', 'User Research', 'Portfolio Audits', 'Interaction'],
    icon: Layout,
    gradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
    borderColor: 'hover:border-teal-600',
    iconColor: 'text-teal-700 bg-teal-50'
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps Engineering',
    description: 'Kubernetes, AWS/GCP infrastructure, CI/CD pipelines, and site reliability.',
    mentorCount: 430,
    skills: ['AWS / GCP', 'Kubernetes', 'CI/CD Pipelines', 'Terraform'],
    icon: Cloud,
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    borderColor: 'hover:border-emerald-600',
    iconColor: 'text-emerald-700 bg-emerald-50'
  },
  {
    id: 'consulting',
    name: 'Management Consulting & Strategy',
    description: 'Case interview prep, financial modeling, and corporate strategy.',
    mentorCount: 380,
    skills: ['Case Interviews', 'Market Sizing', 'Financial Models', 'Strategy'],
    icon: BarChart3,
    gradient: 'from-cyan-500/10 via-teal-500/5 to-transparent',
    borderColor: 'hover:border-cyan-600',
    iconColor: 'text-cyan-700 bg-cyan-50'
  }
];

const PROBLEM_CATEGORIES = [
  { id: 'switch', label: 'Switching Careers?', icon: Target, color: 'bg-emerald-100 text-emerald-800' },
  { id: 'resume', label: 'Resume Not Shortlisted?', icon: FileText, color: 'bg-teal-100 text-teal-800' },
  { id: 'faang', label: 'Landed FAANG Interview?', icon: Award, color: 'bg-cyan-100 text-cyan-800' },
  { id: 'salary', label: 'Salary Negotiation Tips?', icon: DollarSign, color: 'bg-emerald-100 text-emerald-800' },
  { id: 'system', label: 'System Design Help?', icon: Code2, color: 'bg-teal-100 text-teal-800' }
];

const FEATURED_MENTORS = [
  {
    id: 1,
    name: 'Ananya Sharma',
    role: 'Senior Staff Engineer',
    company: 'Google',
    exp: '9+ Yrs Exp',
    rating: '4.95',
    reviews: 142,
    domain: 'Software & Backend Engineering',
    skills: ['System Design', 'Distributed Systems', 'FAANG Prep'],
    fee: '₹799',
    time: '30 mins session',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    availableToday: true
  },
  {
    id: 2,
    name: 'Rohan Mehta',
    role: 'Lead Product Manager',
    company: 'Uber',
    exp: '7+ Yrs Exp',
    rating: '4.91',
    reviews: 98,
    domain: 'Product Management & Strategy',
    skills: ['Product Strategy', 'PM Interviews', 'Growth Metrics'],
    fee: '₹999',
    time: '30 mins session',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250',
    availableToday: true
  },
  {
    id: 3,
    name: 'Priya Nair',
    role: 'Principal UX Designer',
    company: 'Adobe',
    exp: '8+ Yrs Exp',
    rating: '4.98',
    reviews: 185,
    domain: 'UI/UX & Product Design',
    skills: ['Portfolio Review', 'Design Systems', 'UX Research'],
    fee: '₹699',
    time: '30 mins session',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    availableToday: false
  },
  {
    id: 4,
    name: 'Vikramaditya Roy',
    role: 'AI Research Scientist',
    company: 'Microsoft',
    exp: '6+ Yrs Exp',
    rating: '4.89',
    reviews: 76,
    domain: 'Data Science & Generative AI',
    skills: ['Machine Learning', 'LLM Tuning', 'PhD Career Guidance'],
    fee: '₹899',
    time: '30 mins session',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    availableToday: true
  }
];

export default function LandingPage() {
  const [selectedDomain, setSelectedDomain] = useState('All Fields');
  const [searchQuery, setSearchQuery] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  
  // Auth Form State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [smsPhone, setSmsPhone] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [userRole, setUserRole] = useState('learner'); // 'learner' or 'mentor'

  //Auth error and loader
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const navigate = useNavigate()

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };


  //google authentication api
  const handleGoogleAuth = () => {
    window.location.href =
      `${import.meta.env.VITE_BACKEND_URL}/api/google?role=${userRole}`;

      navigate("/dashboard")
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitError(null);
      setSubmitting(true);

      let response;

      if (authMode === 'signup') {
        // If user selects 'mentor', send 'professional' as role to API but keep everything else as is
        let apiRole = userRole === 'mentor' ? 'professional' : userRole;
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
          {
            displayName: authName,
            email: authEmail,
            password: authPassword,
            role: apiRole
          },
          { withCredentials: true }
        );
      } else if (authMode === 'login') {
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
          {
            email: authEmail,
            password: authPassword
          },
          { withCredentials: true }
        );
      }

      console.log(response);

      setAuthModalOpen(false);
      navigate("/dashboard")

    } catch (error) {
      console.log(error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.msg ||
        "Something went wrong";

      setSubmitError(message)
    } finally {
      setSubmitting(false);
    }
  };

  const handleSmsSubmit = (e) => {
    e.preventDefault();
    if (smsPhone.trim().length >= 10) {
      setSmsSent(true);
      setTimeout(() => setSmsSent(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-teal-500 selection:text-white">
      { }
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <a href="#" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-800 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-teal-900/20 group-hover:scale-105 transition transform">
                C
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                  Career<span className="text-teal-700">Nav</span>
                </span>
                <span className="text-[10px] font-semibold text-teal-800 tracking-wider uppercase mt-0.5">
                  1:1 Expert Consultation
                </span>
              </div>
            </a>

            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
              <a href="#mentors" className="hover:text-teal-700 transition">Find Mentors</a>
              <a href="#services" className="hover:text-teal-700 transition">1:1 Video Sessions</a>
              <a href="#tracks" className="hover:text-teal-700 transition">Career Tracks</a>
              <a href="#app-download" className="hover:text-teal-700 transition">Mobile App</a>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => openAuth('login')}
              className="px-4 py-2 text-sm font-semibold text-teal-800 hover:text-teal-900 transition"
            >
              Log In
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-sm transition transform hover:-translate-y-0.5"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      { }
      <section className="bg-gradient-to-b from-teal-950 via-teal-900 to-teal-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-600/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/80 border border-teal-500/30 text-teal-200 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Verified Industry Mentors
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Connect 1-on-1 with Top Professionals for <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">Career Guidance</span>
          </h1>
          <p className="text-base sm:text-lg text-teal-100 max-w-2xl mx-auto font-light leading-relaxed">
            Book private 1:1 video sessions with mentors working at Google, Amazon, Uber & top global tech firms. Get personalized advice, mock interviews & portfolio audits.
          </p>

          {/* Dual Search Bar */}
          <div className="mt-8 bg-white p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-slate-100 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-2 text-slate-800">
            {/* Domain Dropdown Selector */}
            <div className="w-full md:w-2/5 flex items-center gap-2 px-3 py-2 bg-slate-50 md:bg-white rounded-xl border md:border-r md:border-y-0 md:border-l-0 border-slate-200">
              <MapPin className="w-5 h-5 text-teal-700 shrink-0" />
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                aria-label="Select Career Domain"
                className="w-full bg-transparent text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All Fields">All Career Fields</option>
                <option value="Software & Backend Engineering">Software & Backend Eng.</option>
                <option value="Data Science & Generative AI">Data Science & AI</option>
                <option value="Product Management & Strategy">Product Management</option>
                <option value="UI/UX & Product Design">UI/UX & Product Design</option>
                <option value="Cloud & DevOps Engineering">Cloud & DevOps</option>
                <option value="Management Consulting & Strategy">Management Consulting</option>
              </select>
            </div>

            {/* Keyword / Professional Search */}
            <div className="w-full md:w-3/5 flex items-center gap-2 px-3 py-2">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search mentor name, company (Google, Uber), or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm font-medium bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Search Button */}
            <button className="w-full md:w-auto px-7 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2 shrink-0">
              <span>Find Mentors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-teal-200 font-medium pt-2">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Verified Professionals</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Private 1:1 Video Calls</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Flexible Timings</span>
          </div>
        </div>
      </section>

      { }
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:border-teal-300 hover:shadow-xl transition flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-700 group-hover:text-white transition">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">1:1 Video Mentorship</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Connect 1-on-1 with industry experts in 30-minute private video calls.</p>
            </div>
            <a href="#mentors" className="mt-4 text-xs font-bold text-teal-700 flex items-center gap-1 hover:underline">
              Book Session <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:border-emerald-300 hover:shadow-xl transition flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Search Mentors by Role</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Find verified engineers, product managers & design leads by experience.</p>
            </div>
            <a href="#mentors" className="mt-4 text-xs font-bold text-teal-700 flex items-center gap-1 hover:underline">
              Explore Directory <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:border-cyan-300 hover:shadow-xl transition flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-4 group-hover:bg-cyan-700 group-hover:text-white transition">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Resume & Portfolio Review</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Get actionable feedback to optimize your resume for ATS and recruiter screening.</p>
            </div>
            <a href="#mentors" className="mt-4 text-xs font-bold text-teal-700 flex items-center gap-1 hover:underline">
              Get Feedback <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:border-teal-300 hover:shadow-xl transition flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-700 group-hover:text-white transition">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Mock Interviews & Feedback</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Practice real technical & behavioral rounds with detailed performance notes.</p>
            </div>
            <a href="#mentors" className="mt-4 text-xs font-bold text-teal-700 flex items-center gap-1 hover:underline">
              Practice Now <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      { }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-teal-700 tracking-wider uppercase">Instant Help</span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">What is your primary career challenge?</h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {PROBLEM_CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedDomain('All Fields')}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-full shadow-sm hover:border-teal-600 hover:shadow-md transition flex items-center gap-2 group cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${cat.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 group-hover:text-teal-800 transition">{cat.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition" />
              </button>
            );
          })}
        </div>
      </section>

      { }
      <section id="tracks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
          <div>
            <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider">
              Domain Expertise
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Explore Mentors by Career Field
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-xl">
              Choose your specialized track to find domain leaders, tailored interview guides, and structured career roadmaps.
            </p>
          </div>
          <button
            onClick={() => setSelectedDomain('All Fields')}
            className="mt-4 md:mt-0 text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 border-b border-teal-700 pb-0.5"
          >
            View All Specialized Fields <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* High Precision Enterprise Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAREER_TRACKS.map((track) => {
            const TrackIcon = track.icon;
            return (
              <div
                key={track.id}
                onClick={() => setSelectedDomain(track.name)}
                className={`bg-white rounded-2xl p-6 border border-slate-200 ${track.borderColor} shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between cursor-pointer group relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${track.gradient} rounded-full -mr-10 -mt-10 pointer-events-none`}></div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${track.iconColor} flex items-center justify-center font-bold shadow-sm`}>
                      <TrackIcon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/80">
                      {track.mentorCount}+ Mentors
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition">
                    {track.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {track.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-2">Key Skills Covered</span>
                    <div className="flex flex-wrap gap-1.5">
                      {track.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200/60 text-slate-600 text-[10px] font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 flex items-center justify-between text-xs font-bold text-teal-700 group-hover:text-teal-800">
                  <span>Explore Mentors</span>
                  <div className="w-7 h-7 rounded-full bg-teal-50 group-hover:bg-teal-700 group-hover:text-white transition flex items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      { }
      <section id="mentors" className="bg-slate-100/70 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Top Verified Professionals Available</h2>
              <p className="text-slate-500 text-sm mt-1">Book a 1:1 session for personalized guidance, resume review, or mock interviews.</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Filtering by:</span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-teal-800 shadow-sm flex items-center gap-1">
                <Filter className="w-3 h-3" /> {selectedDomain}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_MENTORS.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="p-5 flex items-start gap-4 border-b border-slate-100">
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-600/20"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-bold text-slate-900 text-base">{mentor.name}</h3>
                        <Shield className="w-4 h-4 text-teal-600 fill-teal-50" />
                      </div>
                      <p className="text-xs font-medium text-slate-600">{mentor.role}</p>
                      <p className="text-xs font-bold text-teal-800">{mentor.company}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold text-[11px]">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {mentor.rating}
                        </span>
                        <span className="text-[11px] text-slate-400">({mentor.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Experience:</span>
                      <span className="font-semibold text-slate-800">{mentor.exp}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {mentor.skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Session Fee</span>
                    <span className="text-base font-extrabold text-slate-900">{mentor.fee}</span>
                    <span className="text-[10px] text-slate-500 block">/ 30 mins</span>
                  </div>
                  <button
                    onClick={() => openAuth('signup')}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition"
                  >
                    Book 1:1 Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      { }
      <section id="app-download" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-teal-800/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                Mobile Convenience
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                Get 1:1 Mentorship <br /><span className="text-emerald-400">Anytime, Anywhere</span>
              </h2>
              <p className="text-teal-100 text-sm sm:text-base font-light leading-relaxed max-w-xl">
                Download the CareerNav app to instantly schedule video calls, chat with mentors, receive session reminders, and track your career growth journey seamless on mobile.
              </p>

              {/* SMS App Link Sender */}
              <form onSubmit={handleSmsSubmit} className="pt-2 max-w-md">
                <label className="block text-xs font-semibold text-teal-200 mb-2">
                  Get the link to download the app
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-teal-900/80 border border-teal-700 text-xs text-white placeholder-teal-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-md shrink-0"
                  >
                    Send Link
                  </button>
                </div>
                {smsSent && (
                  <p className="text-xs text-emerald-300 font-semibold mt-2 flex items-center gap-1">
                    <Check className="w-4 h-4" /> App download link sent successfully!
                  </p>
                )}
              </form>

              {/* Store Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-teal-800/80">
                <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold border border-white/20 flex items-center gap-3 transition">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <div className="text-left">
                    <span className="text-[10px] text-teal-300 block">Download on</span>
                    <span>App Store</span>
                  </div>
                </button>
                <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold border border-white/20 flex items-center gap-3 transition">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <div className="text-left">
                    <span className="text-[10px] text-teal-300 block">Get it on</span>
                    <span>Google Play</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Column: Custom Phone Mockup SVG Frame */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              <div className="relative w-64 h-auto sm:w-72 bg-slate-900 rounded-[40px] p-3 shadow-2xl border-4 border-slate-700 ring-1 ring-white/20">
                {/* Phone Speaker Notch */}
                <div className="w-20 h-4 bg-slate-800 rounded-b-xl mx-auto absolute top-3 left-1/2 -translate-x-1/2 z-20"></div>

                {/* Simulated Screen Content */}
                <div className="bg-slate-50 rounded-[30px] overflow-hidden text-slate-800 pt-8 pb-4 px-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-extrabold text-teal-800">CareerNav App</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Live 1:1 Call</span>
                  </div>

                  {/* Call Card Simulation */}
                  <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"
                        alt="Ananya Sharma"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Ananya Sharma</div>
                        <div className="text-[10px] text-teal-700 font-semibold">Google • Senior Staff Eng</div>
                      </div>
                    </div>
                    <div className="bg-teal-50 p-2 rounded-lg text-[10px] text-teal-900 flex items-center justify-between">
                      <span>Today, 7:00 PM</span>
                      <span className="font-bold text-teal-700">30 Mins Call</span>
                    </div>
                  </div>

                  {/* Rating Card Simulation */}
                  <div className="bg-emerald-800 text-white p-3 rounded-xl shadow text-center space-y-1">
                    <div className="text-xs font-bold">Session Completed 🎉</div>
                    <p className="text-[10px] text-emerald-200">"Ananya gave great insights on my System Design resume!"</p>
                    <div className="text-xs text-amber-300">★★★★★</div>
                  </div>

                  <div className="pt-2 text-center">
                    <span className="text-[10px] text-slate-400 font-semibold">Joined by 50,000+ Learners</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      { }
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
                C
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CareerNav</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Empowering learners with direct 1-on-1 mentorship from top tech and business professionals worldwide.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">For Learners</h4>
            <ul className="space-y-2">
              <li><a href="#mentors" className="hover:text-white transition">Find Industry Mentors</a></li>
              <li><a href="#services" className="hover:text-white transition">Book Mock Interviews</a></li>
              <li><a href="#services" className="hover:text-white transition">Resume & Portfolio Audit</a></li>
              <li><a href="#tracks" className="hover:text-white transition">Explore Career Tracks</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">For Professionals</h4>
            <ul className="space-y-2">
              <li><a href="#" onClick={() => openAuth('signup')} className="hover:text-white transition">Become a Mentor</a></li>
              <li><a href="#" className="hover:text-white transition">Mentor Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition">Community & Earnings</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-800 text-center text-slate-500">
          © {new Date().getFullYear()} CareerNav Inc. All rights reserved. Strictly 1:1 Learner-Mentor Guidance Platform.
        </div>
      </footer>

      { }
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 mx-auto flex items-center justify-center mb-3">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {authMode === 'login' ? 'Welcome Back to CareerNav' : 'Create your CareerNav Account'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {authMode === 'login' ? 'Sign in to access your 1:1 video sessions' : 'Connect with top industry mentors today'}
              </p>
            </div>

            {/* Role Selector for Sign Up */}
            {authMode === 'signup' && (
              <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUserRole('learner')}
                  className={`py-2 text-xs font-bold rounded-lg transition ${userRole === 'learner' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  I am a Learner
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole('mentor')}
                  className={`py-2 text-xs font-bold rounded-lg transition ${userRole === 'mentor' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  I am a Mentor
                </button>
              </div>
            )}

            {/* Google Social Login Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-3 shadow-sm transition mb-4"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-3 text-[11px] font-medium text-slate-400 uppercase">Or email</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3">

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              {submitError && (
                <div className="w-full bg-red-100 border border-red-300 text-red-700 text-xs rounded-xl px-3 py-2 mb-2 flex items-center">
                  <svg className="h-4 w-4 mr-2 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                  </svg>
                  {submitError}
                </div>
              )}
         

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs shadow-md transition mt-2 flex items-center justify-center"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  authMode === 'login'
                    ? 'Sign In'
                    : `Create ${userRole === 'Professional' ? 'Professional' : 'Learner'} Account`
                )}
              </button>
         
            </form>

            {/* Modal Footer Toggle */}
            <div className="mt-5 text-center text-xs text-slate-500">
              {authMode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      if (submitError) setSubmitError('');
                    }}
                    className="text-teal-700 font-bold hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      if (submitError) setSubmitError('');
                    }}
                    className="text-teal-700 font-bold hover:underline"
                  >
                    Log In
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}