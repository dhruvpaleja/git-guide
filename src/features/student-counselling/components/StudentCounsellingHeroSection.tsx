import StudentCounsellingHeroContent from './StudentCounsellingHeroContent';

export default function StudentCounsellingHeroSection() {
    return (
        <section className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col">
            {/* Background gradient elements - positioned at center-right */}
            <div className="absolute -top-64 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] pointer-events-none">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500/25 via-teal-400/10 to-transparent blur-3xl opacity-50" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col">
                <StudentCounsellingHeroContent />
            </div>
        </section>
    );
}