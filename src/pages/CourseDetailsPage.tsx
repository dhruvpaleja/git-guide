import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Star,
    Clock,
    Monitor,
    CheckCircle2,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { courseSections } from '@/features/courses/constants/courses.data';

export default function CourseDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Find the matching course from our centralized data based on the URL ID parameter
    // React Compiler optimization: manual memoization not preserved, but functionally equivalent
    const activeCourse = useMemo(() => {
        if (!id) return null;
        
        for (const section of courseSections) {
            for (const course of section.courses) {
                // Generate the same ID format used in the Link to match it back
                const courseId = course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                if (courseId === id) {
                    return {
                        ...course,
                        sectionKey: section.key,
                        sectionTitle: section.title,
                        // Fallbacks or extended data that isn't in courseItem but needed for the UI
                        level: 'Beginner Level',
                        overview: `This foundational course helps learners understand how anxiety develops, how it affects the mind and body, and what early signs to look for. It breaks down psychological, emotional, and physiological components in simple language.\n\nBy the end, learners gain clarity, awareness, and the ability to recognize their personal anxiety patterns with confidence.`,
                        features: [
                            {
                                icon: <Clock className="w-4 h-4 text-white/80" />,
                                title: 'Full Lifetime Access',
                            },
                            {
                                icon: <Monitor className="w-4 h-4 text-white/80" />,
                                title: 'Access on Desktop, Laptop & Mobile.',
                            }
                        ],
                        languages: 'English, Hindi, Marathi, Tamil, Telegu, Kannada, Bengali.',
                        instructor: {
                            name: 'Natalia Sharma',
                            title: 'Psychologist',
                            image: 'https://i.pravatar.cc/150?img=47',
                            bio: 'An experienced psychologist specializing in anxiety, emotional regulation, and mind-body healing.',
                        },
                        lastUpdated: '01 Nov 2025',
                        learningOutcomes: [
                            'How anxiety develops in the mind and body and what it truly means.',
                            'The science behind anxiety, including how the brain and nervous system respond to stress.',
                            'How to identify your personal anxiety triggers and early warning signs.',
                            'The lifestyle factors that silently increase anxiety and how to reduce them.',
                        ],
                        curriculum: [
                            { id: 1, title: 'What Anxiety Really ?' },
                            { id: 2, title: 'Brain & Body Response.' },
                            { id: 3, title: 'Types & Key Symtoms.' },
                            { id: 4, title: 'Identify Personal Triggers.' },
                            { id: 5, title: 'Lifestyle Anxiety Factors.' },
                            { id: 6, title: 'Build Self-Awareness Map.' },
                        ],
                    };
                }
            }
        }
        return null;
    }, [id]);

    const [activeTab, setActiveTab] = useState('overview');
    const [expandedTopics, setExpandedTopics] = useState<number[]>([]);
    const [isEnrolling, setIsEnrolling] = useState(false);

    // If no course found for this ID, show error state
    if (!activeCourse) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
                <button
                    onClick={() => navigate('/courses')}
                    className="border border-white/20 px-6 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    Return to Courses
                </button>
            </div>
        );
    }

    const toggleTopic = (topicId: number) => {
        setExpandedTopics((prev) =>
            prev.includes(topicId)
                ? prev.filter((id) => id !== topicId)
                : [...prev, topicId]
        );
    };

    const handleEnrollClick = () => {
        setIsEnrolling(true);
        // Add a tiny delay for a satisfying UI pressing effect before bouncing to login
        setTimeout(() => {
            navigate('/login');
        }, 400);
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/20 pb-20 pt-28">

            {/* TOP NAVIGATION & PAGE TITLE */}
            <div className="max-w-7xl mx-auto px-6 pb-6">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors group"
                    >
                        <ChevronLeft className="w-5 h-5 text-white/70 group-hover:text-white" />
                    </button>
                    <span className="text-white/60 text-sm hidden md:block group-hover:text-white transition-colors cursor-pointer" onClick={() => navigate(-1)}>
                        Back to Courses
                    </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-semibold mb-6 tracking-tight">{activeCourse.category} Courses</h1>
                <div className="flex gap-6 text-sm">
                    <button
                        onClick={() => navigate('/courses')}
                        className="text-white hover:text-white/80 transition-colors font-medium border-b border-white/30 pb-1"
                    >
                        Back To {activeCourse.category} Courses
                    </button>
                    <button className="text-white/50 hover:text-white/80 transition-colors border-b border-transparent pb-1">
                        Report
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <main className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* LEFT COLUMN - COURSE DETAILS (approx 65% width) */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-6">

                        {/* Main Course Details Card */}
                        <div className="border border-white/10 rounded-3xl p-6 md:p-8 bg-[#0A0A0A]">

                            {/* Meta Top */}
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-white/60 text-sm">
                                    {activeCourse.category} Course | {activeCourse.level}
                                </span>
                                <div className="flex items-center gap-1.5 bg-white text-black px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                    <Star className="w-3.5 h-3.5 fill-black" />
                                    <span>{activeCourse.rating}</span>
                                </div>
                            </div>

                            {/* Title & Stats */}
                            <h2 className="text-2xl md:text-3xl xl:text-[32px] font-semibold tracking-tight mb-4 leading-snug">
                                {activeCourse.title}
                            </h2>
                            <div className="flex items-center gap-6 text-sm text-white/80 mb-8 font-medium">
                                <span>{activeCourse.lessons}</span>
                                <span>{activeCourse.duration}</span>
                            </div>

                            {/* Hero Image */}
                            <div className="aspect-[16/10] rounded-[24px] overflow-hidden mb-8 bg-[#1A1A1A] border border-white/5 relative group">
                                {/* Fallback gradient if image not found, to mimic the UI style */}
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black" />
                                <img
                                    src={activeCourse.image}
                                    alt={activeCourse.title}
                                    className="w-full h-full object-cover relative z-10 transition-transform duration-700 ease-out group-hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.opacity = '0.5';
                                        (e.target as HTMLImageElement).style.mixBlendMode = 'lighten';
                                    }}
                                />
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-8 border-b border-white/10 mb-8">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'overview' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                                >
                                    Course Overview
                                    {activeTab === 'overview' && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-t-full" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('resources')}
                                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'resources' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                                >
                                    Resources
                                    {activeTab === 'resources' && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-t-full" />
                                    )}
                                </button>
                            </div>

                            {/* Description */}
                            <div className="space-y-6 text-white/70 text-sm leading-relaxed mb-10">
                                <p>{activeCourse.overview.split('\n')[0]}</p>
                                <p>{activeCourse.overview.split('\n')[2]}</p>
                            </div>

                            {/* Feature Highlights Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-10 text-sm">
                                {/* Row 1 */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        {activeCourse.features[0].icon}
                                        <span className="font-medium text-white/90">{activeCourse.features[0].title}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="font-medium text-white/90">Available In</span>
                                </div>

                                {/* Row 2 */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        {activeCourse.features[1].icon}
                                        <span className="font-medium text-white/90">{activeCourse.features[1].title}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-white/60">{activeCourse.languages}</span>
                                </div>
                            </div>

                            {/* Instructor Card & Bottom Meta area */}
                            <div className="flex flex-col md:flex-row gap-6 justify-between items-end">
                                {/* Instructor Box */}
                                <div className="w-full md:w-auto flex-1 max-w-sm rounded-[24px] border border-white/10 bg-[#161616] p-6 hover:bg-[#1A1A1A] transition-colors">
                                    <h4 className="text-sm font-semibold mb-4 text-white/90">About Instructor</h4>
                                    <div className="flex items-center gap-4 mb-4">
                                        <img
                                            src={activeCourse.instructor.image}
                                            alt={activeCourse.instructor.name}
                                            className="w-12 h-12 rounded-full object-cover border border-white/10"
                                        />
                                        <div>
                                            <div className="font-medium text-sm">{activeCourse.instructor.name}</div>
                                            <div className="text-xs text-white/50">{activeCourse.instructor.title}</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-white/60 leading-relaxed">
                                        {activeCourse.instructor.bio}
                                    </p>
                                </div>

                                {/* Price Display */}
                                <div className="text-right w-full md:w-auto mt-6 md:mt-0">
                                    <div className="text-white/60 text-sm mb-1">Course Fees</div>
                                    <div className="text-4xl md:text-[42px] font-bold mb-1 tracking-tight">{activeCourse.price}</div>
                                    <div className="text-xs text-white/40 mb-1">All Taxes are included.</div>
                                    {activeCourse.originalPrice && (
                                        <div className="text-xs text-white/30 line-through">Original Value: {activeCourse.originalPrice}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 text-xs text-white/40">
                                Course Updated: {activeCourse.lastUpdated}
                            </div>

                        </div>
                    </div>

                    {/* RIGHT COLUMN - STICKY CONTENT (approx 35% width) */}
                    <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">

                        {/* What You Will Learn Card */}
                        <div className="border border-white/10 rounded-3xl p-6 md:p-8 bg-[#0A0A0A]">
                            <h3 className="text-[17px] font-semibold mb-6">What You Will Learn?</h3>
                            <ul className="space-y-5">
                                {activeCourse.learningOutcomes.map((outcome, index) => (
                                    <li key={index} className="flex items-start gap-4">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-sm text-white/80 leading-relaxed">{outcome}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Curriculum / Total Lessons Card */}
                        <div className="border border-white/10 rounded-3xl p-6 md:p-8 bg-[#0A0A0A]">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[17px] font-semibold">Total Lessons</h3>
                                <span className="text-sm text-white/80 font-medium">
                                    {activeCourse.curriculum.length} | {activeCourse.lessons.split(' ')[0] || activeCourse.curriculum.length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {activeCourse.curriculum.map((topic) => {
                                    const isExpanded = expandedTopics.includes(topic.id);
                                    return (
                                        <div
                                            key={topic.id}
                                            className="border border-white/10 rounded-full overflow-hidden transition-all bg-[#0F0F0F]"
                                        >
                                            <button
                                                onClick={() => toggleTopic(topic.id)}
                                                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors group outline-none"
                                            >
                                                <span className="text-sm font-medium text-white/90 group-hover:text-white">{topic.title}</span>
                                                <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-3.5 h-3.5" />
                                                    ) : (
                                                        <ChevronDown className="w-3.5 h-3.5" />
                                                    )}
                                                </div>
                                            </button>
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                                            >
                                                <div className="px-6 pb-5 pt-2 text-sm text-white/60">
                                                    <p>Detailed content for {topic.title} would go here. This module covers essential practical aspects to build your foundation.</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Enroll CTA */}
                        <button
                            onClick={handleEnrollClick}
                            className={`w-full bg-white text-black font-semibold text-lg py-5 rounded-[24px] hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] mt-2 flex justify-center items-center gap-2 ${isEnrolling ? 'scale-95 bg-gray-300 shadow-none' : 'hover:scale-[1.02]'}`}
                        >
                            {isEnrolling ? 'Redirecting...' : 'Enroll Now'}
                        </button>

                    </div>
                </div>
            </main>
        </div>
    );
}
