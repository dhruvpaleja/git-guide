import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PractitionerSidebar } from '@/features/dashboard/components/PractitionerSidebar';
import {
    Search, SlidersHorizontal, AlertCircle, ChevronLeft,
    Camera, Upload, Plus, X, Save, Trash2, Edit3, Eye, EyeOff
} from 'lucide-react';

/* ── Hard-coded profile data ─────────────────────────────────── */

const initialProfile = {
    firstName: 'Swati',
    lastName: 'Agarwal',
    displayName: 'Swati Agarwal',
    email: 'swati.agarwal@soulyatri.com',
    phone: '+91 98765 43210',
    bio: 'Experienced counsellor and therapist specializing in cognitive behavioural therapy, mindfulness-based stress reduction, and relationship counselling. Passionate about helping individuals find inner balance and emotional resilience.',
    gender: 'Female',
    dateOfBirth: '1990-05-15',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    languages: ['English', 'Hindi', 'Marathi'],
    specializations: ['Cognitive Behavioural Therapy', 'Mindfulness', 'Relationship Counselling', 'Stress Management', 'Anxiety'],
    experience: '8',
    qualifications: 'M.A. Clinical Psychology, Certified CBT Practitioner',
    licenseNumber: 'RCI/PSY/2018/4521',
    sessionRate: '1500',
    sessionDuration: '60',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableFrom: '10:00',
    availableTo: '18:00',
    password: '••••••••••',
};

/* ── Component ───────────────────────────────────────────────── */

export default function EditProfilePage() {
    useDocumentTitle('Edit Profile');
    const [profile, setProfile] = useState(initialProfile);
    const [newLanguage, setNewLanguage] = useState('');
    const [newSpecialization, setNewSpecialization] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeSection, setActiveSection] = useState('personal');
    const [showPassword, setShowPassword] = useState(false);

    const updateField = (field: string, value: string) => {
        setProfile(p => ({ ...p, [field]: value }));
        setSaved(false);
    };

    const addLanguage = () => {
        if (newLanguage.trim() && !profile.languages.includes(newLanguage.trim())) {
            setProfile(p => ({ ...p, languages: [...p.languages, newLanguage.trim()] }));
            setNewLanguage('');
        }
    };

    const removeLanguage = (lang: string) => {
        setProfile(p => ({ ...p, languages: p.languages.filter(l => l !== lang) }));
    };

    const addSpecialization = () => {
        if (newSpecialization.trim() && !profile.specializations.includes(newSpecialization.trim())) {
            setProfile(p => ({ ...p, specializations: [...p.specializations, newSpecialization.trim()] }));
            setNewSpecialization('');
        }
    };

    const removeSpecialization = (spec: string) => {
        setProfile(p => ({ ...p, specializations: p.specializations.filter(s => s !== spec) }));
    };

    const toggleDay = (day: string) => {
        setProfile(p => ({
            ...p,
            availableDays: p.availableDays.includes(day)
                ? p.availableDays.filter(d => d !== day)
                : [...p.availableDays, day],
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 1200));
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const sections = [
        { id: 'personal', label: 'Personal Info' },
        { id: 'professional', label: 'Professional' },
        { id: 'availability', label: 'Availability' },
        { id: 'security', label: 'Security' },
    ];

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex font-sans">
            <PractitionerSidebar />

            <main className="flex-1 ml-20 md:ml-24 overflow-y-auto">
                {/* ─── Top Welcome Bar ─── */}
                <div className="bg-white px-6 md:px-10 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <img src="/images/main-logo.png" alt="Soul Yatri" className="w-8 h-8 object-contain" />
                        <span className="text-2xl font-bold text-gray-900 hidden sm:block">Welcome!</span>
                        <img src="/images/practitioner/imgImage.png" alt="Swati Agarwal" className="w-10 h-10 rounded-full object-cover border-2 border-gray-100" />
                        <div className="hidden md:flex flex-col">
                            <span className="text-sm font-semibold text-gray-800">Swati Agarwal</span>
                            <span className="text-[11px] text-gray-400">Counsellor | Therapist</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <button aria-label="Notifications" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                            <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        </button>
                        <div className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-100 min-w-[200px]">
                            <span className="text-sm text-gray-400 truncate">Search for what you want...</span>
                            <Search className="w-4 h-4 text-gray-300 ml-auto shrink-0" />
                        </div>
                        <button aria-label="Filter" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                            <SlidersHorizontal className="w-4 h-4" />
                        </button>
                        <button aria-label="Info" className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                            <AlertCircle className="w-4 h-4" />
                        </button>
                        <button className="text-sm font-medium text-orange-400 hover:text-orange-500 transition-colors hidden md:block">Ignored Clients</button>
                        <button className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors hidden md:block">Report</button>
                    </div>
                </div>

                {/* ─── Page Content ─── */}
                <div className="px-6 md:px-10 py-6 max-w-[1400px] mx-auto">
                    {/* Breadcrumb */}
                    <span className="text-xs text-gray-400 font-medium">Practitioner Dashboard</span>

                    {/* Title Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mt-1 mb-6 gap-4">
                        <div className="flex items-center gap-3">
                            <Link to="/practitioner" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors bg-white shrink-0">
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </Link>
                            <div>
                                <h1 className="text-2xl sm:text-3xl md:text-[36px] font-bold text-gray-900 leading-tight">Edit Profile</h1>
                                <p className="text-[13px] text-gray-400 mt-1 max-w-md leading-relaxed">
                                    Update your personal and professional details to keep your profile accurate.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm shrink-0 self-start sm:self-auto ${saved
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-[#2C2F7A] text-white hover:bg-[#24276B]'
                                } disabled:opacity-60`}
                        >
                            {isSaving ? (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : saved ? (
                                <>✓ Saved</>
                            ) : (
                                <><Save className="w-4 h-4" /> Save Changes</>
                            )}
                        </button>
                    </div>

                    {/* ─── Two Column Layout ─── */}
                    <div className="flex flex-col xl:flex-row gap-6">

                        {/* ─── LEFT: Profile Card + Section Nav ─── */}
                        <div className="xl:w-[280px] shrink-0 flex flex-col gap-4">
                            {/* Profile Card */}
                            <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 text-center">
                                <div className="relative w-24 h-24 mx-auto mb-4 group">
                                    <img src="/images/practitioner/imgImage.png" alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-gray-100" />
                                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 cursor-pointer">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                    <button aria-label="Edit profile photo" className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#2C2F7A] text-white flex items-center justify-center shadow-md hover:bg-[#24276B] transition-colors">
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{profile.firstName} {profile.lastName}</h3>
                                <p className="text-[12px] text-gray-400 mt-0.5">Counsellor | Therapist</p>
                                <p className="text-[11px] text-gray-400 mt-1">{profile.email}</p>

                                <div className="flex gap-2 mt-4 justify-center">
                                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-semibold text-[#2C2F7A] bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors">
                                        <Upload className="w-3.5 h-3.5" /> Upload
                                    </button>
                                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-semibold text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" /> Remove
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-300 mt-2">JPG, PNG or GIF. Max 5MB.</p>
                            </div>

                            {/* Section Navigation */}
                            <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-3">
                                {sections.map(section => (
                                    <button
                                        key={section.id}
                                        onClick={() => {
                                            setActiveSection(section.id);
                                            document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-[12px] text-sm font-semibold transition-all duration-200 mb-1 last:mb-0 ${activeSection === section.id
                                                ? 'bg-[#1A1A1A] text-white shadow-sm'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                            }`}
                                    >
                                        {section.label}
                                    </button>
                                ))}
                            </div>

                            {/* Stats Mini Card */}
                            <div className="bg-[#1A1A1A] rounded-[20px] p-5 text-white">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider">Your Rating</span>
                                    <span className="text-lg font-bold">4.8 <span className="text-yellow-400">★</span></span>
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider">Total Sessions</span>
                                    <span className="text-lg font-bold">100+</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-white/50 font-medium uppercase tracking-wider">Active Clients</span>
                                    <span className="text-lg font-bold">24</span>
                                </div>
                            </div>
                        </div>

                        {/* ─── RIGHT: Form Sections ─── */}
                        <div className="flex-1 flex flex-col gap-5">

                            {/* ── Personal Information ── */}
                            <div id="section-personal" className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 sm:p-6 scroll-mt-24">
                                <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <span className="w-1.5 h-5 bg-[#2C2F7A] rounded-full" />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: 'First Name', field: 'firstName', type: 'text' },
                                        { label: 'Last Name', field: 'lastName', type: 'text' },
                                        { label: 'Display Name', field: 'displayName', type: 'text' },
                                        { label: 'Email Address', field: 'email', type: 'email' },
                                        { label: 'Phone Number', field: 'phone', type: 'tel' },
                                        { label: 'Date of Birth', field: 'dateOfBirth', type: 'date' },
                                        { label: 'City', field: 'city', type: 'text' },
                                        { label: 'State', field: 'state', type: 'text' },
                                    ].map(item => (
                                        <div key={item.field}>
                                            <label className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">{item.label}</label>
                                            <input
                                                value={(profile as Record<string, unknown>)[item.field] as string}
                                                onChange={e => updateField(item.field, e.target.value)}
                                                type={item.type}
                                                className="w-full h-[44px] px-4 bg-[#F9F9FB] border border-gray-100 rounded-[12px] text-sm text-gray-800 font-medium focus:outline-none focus:border-[#2C2F7A] focus:ring-2 focus:ring-[#2C2F7A]/10 transition-all"
                                            />
                                        </div>
                                    ))}
                                    <div>
                                        <label htmlFor="edit-gender" className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Gender</label>
                                        <select
                                            id="edit-gender"
                                            value={profile.gender}
                                            onChange={e => updateField('gender', e.target.value)}
                                            className="w-full h-[44px] px-4 bg-[#F9F9FB] border border-gray-100 rounded-[12px] text-sm text-gray-800 font-medium focus:outline-none focus:border-[#2C2F7A] focus:ring-2 focus:ring-[#2C2F7A]/10 transition-all appearance-none cursor-pointer"
                                        >
                                            <option>Female</option>
                                            <option>Male</option>
                                            <option>Other</option>
                                            <option>Prefer not to say</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="edit-country" className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Country</label>
                                        <input
                                            id="edit-country"
                                            value={profile.country}
                                            onChange={e => updateField('country', e.target.value)}
                                            className="w-full h-[44px] px-4 bg-[#F9F9FB] border border-gray-100 rounded-[12px] text-sm text-gray-800 font-medium focus:outline-none focus:border-[#2C2F7A] focus:ring-2 focus:ring-[#2C2F7A]/10 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="mt-4">
                                    <label htmlFor="edit-bio" className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Professional Bio</label>
                                    <textarea
                                        id="edit-bio"
                                        value={profile.bio}
                                        onChange={e => updateField('bio', e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 bg-[#F9F9FB] border border-gray-100 rounded-[12px] text-sm text-gray-800 font-medium leading-relaxed focus:outline-none focus:border-[#2C2F7A] focus:ring-2 focus:ring-[#2C2F7A]/10 transition-all resize-none"
                                    />
                                </div>

                                {/* Languages */}
                                <div className="mt-4">
                                    <span className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Languages</span>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {profile.languages.map(lang => (
                                            <span key={lang} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[11px] font-semibold border border-indigo-100 transition-all hover:bg-indigo-100">
                                                {lang}
                                                <button onClick={() => removeLanguage(lang)} aria-label={`Remove ${lang}`} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                                            </span>
                                        ))}
                                        <div className="flex items-center gap-1">
                                            <input
                                                value={newLanguage}
                                                onChange={e => setNewLanguage(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                                                placeholder="Add language"
                                                className="h-[30px] px-3 bg-white border border-gray-200 rounded-full text-[11px] text-gray-700 focus:outline-none focus:border-[#2C2F7A] w-[110px] transition-colors"
                                            />
                                            <button onClick={addLanguage} aria-label="Add language" className="w-[30px] h-[30px] rounded-full bg-[#2C2F7A] text-white flex items-center justify-center hover:bg-[#24276B] transition-all active:scale-90">
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Professional Details ── */}
                            <div id="section-professional" className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 sm:p-6 scroll-mt-24">
                                <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <span className="w-1.5 h-5 bg-emerald-500 rounded-full" />
                                    Professional Details
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="edit-experience" className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Years of Experience</label>
                                        <input id="edit-experience" value={profile.experience} onChange={e => updateField('experience', e.target.value)} type="number" className="w-full h-[44px] px-4 bg-[#F9F9FB] border border-gray-100 rounded-[12px] text-sm text-gray-800 font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all" />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-qualifications" className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Qualifications</label>
                                        <input id="edit-qualifications" value={profile.qualifications} onChange={e => updateField('qualifications', e.target.value)} className="w-full h-[44px] px-4 bg-[#F9F9FB] border border-gray-100 rounded-[12px] text-sm text-gray-800 font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all" />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-licenseNumber" className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">License Number</label>
                                        <input id="edit-licenseNumber" value={profile.licenseNumber} onChange={e => updateField('licenseNumber', e.target.value)} className="w-full h-[44px] px-4 bg-[#F9F9FB] border border-gray-100 rounded-[12px] text-sm text-gray-800 font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all" />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-sessionRate" className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Session Rate (₹)</label>
                                        <input id="edit-sessionRate" value={profile.sessionRate} onChange={e => updateField('sessionRate', e.target.value)} type="number" className="w-full h-[44px] px-4 bg-[#F9F9FB] border border-gray-100 rounded-[12px] text-sm text-gray-800 font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all" />
                                    </div>
                                </div>

                                {/* Specializations */}
                                <div className="mt-4">
                                    <span className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Specializations</span>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {profile.specializations.map(spec => (
                                            <span key={spec} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-semibold border border-emerald-100 transition-all hover:bg-emerald-100">
                                                {spec}
                                                <button onClick={() => removeSpecialization(spec)} aria-label={`Remove ${spec}`} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                                            </span>
                                        ))}
                                        <div className="flex items-center gap-1">
                                            <input
                                                value={newSpecialization}
                                                onChange={e => setNewSpecialization(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                                                placeholder="Add specialization"
                                                className="h-[30px] px-3 bg-white border border-gray-200 rounded-full text-[11px] text-gray-700 focus:outline-none focus:border-emerald-500 w-[140px] transition-colors"
                                            />
                                            <button onClick={addSpecialization} aria-label="Add specialization" className="w-[30px] h-[30px] rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-all active:scale-90">
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Availability Settings ── */}
                            <div id="section-availability" className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 sm:p-6 scroll-mt-24">
                                <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <span className="w-1.5 h-5 bg-amber-500 rounded-full" />
                                    Availability Settings
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                    <div>
                                        <label htmlFor="edit-sessionDuration" className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Session Duration</label>
                                        <select
                                            id="edit-sessionDuration"
                                            value={profile.sessionDuration}
                                            onChange={e => updateField('sessionDuration', e.target.value)}
                                            className="w-full h-[44px] px-4 bg-[#F9F9FB] border border-gray-100 rounded-[12px] text-sm text-gray-800 font-medium focus:outline-none focus:border-amber-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="30">30 minutes</option>
                                            <option value="45">45 minutes</option>
                                            <option value="60">60 minutes</option>
                                            <option value="90">90 minutes</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label htmlFor="edit-availableFrom" className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">From</label>
                                            <input id="edit-availableFrom" value={profile.availableFrom} onChange={e => updateField('availableFrom', e.target.value)} type="time" className="w-full h-[44px] px-4 bg-[#F9F9FB] border border-gray-100 rounded-[12px] text-sm text-gray-800 font-medium focus:outline-none focus:border-amber-500 transition-all" />
                                        </div>
                                        <div>
                                            <label htmlFor="edit-availableTo" className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">To</label>
                                            <input id="edit-availableTo" value={profile.availableTo} onChange={e => updateField('availableTo', e.target.value)} type="time" className="w-full h-[44px] px-4 bg-[#F9F9FB] border border-gray-100 rounded-[12px] text-sm text-gray-800 font-medium focus:outline-none focus:border-amber-500 transition-all" />
                                        </div>
                                    </div>
                                </div>

                                <span className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Available Days</span>
                                <div className="flex flex-wrap gap-2">
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                        <button
                                            key={day}
                                            onClick={() => toggleDay(day)}
                                            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 ${profile.availableDays.includes(day)
                                                    ? 'bg-[#1A1A1A] text-white shadow-sm scale-105'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                                                }`}
                                        >
                                            {day.slice(0, 3)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ── Security ── */}
                            <div id="section-security" className="bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 sm:p-6 scroll-mt-24">
                                <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                                    <span className="w-1.5 h-5 bg-red-500 rounded-full" />
                                    Security & Account
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                    <div>
                                        <label htmlFor="edit-password" className="block text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Current Password</label>
                                        <div className="relative">
                                            <input
                                                id="edit-password"
                                                value={profile.password}
                                                onChange={e => updateField('password', e.target.value)}
                                                type={showPassword ? 'text' : 'password'}
                                                className="w-full h-[44px] px-4 pr-12 bg-[#F9F9FB] border border-gray-100 rounded-[12px] text-sm text-gray-800 font-medium focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/10 transition-all"
                                            />
                                            <button onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-end">
                                        <button className="px-5 py-2.5 rounded-full text-sm font-semibold text-[#2C2F7A] bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors">
                                            Change Password
                                        </button>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="mt-3 bg-red-50/50 rounded-[16px] border border-red-100 p-5">
                                    <h4 className="text-sm font-bold text-red-700 mb-1">Danger Zone</h4>
                                    <p className="text-[12px] text-red-400 mb-3 leading-relaxed">Permanently delete your account and all data. This cannot be undone.</p>
                                    <button className="flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-bold text-white bg-red-500 hover:bg-red-600 transition-all active:scale-95">
                                        <Trash2 className="w-3.5 h-3.5" /> Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
