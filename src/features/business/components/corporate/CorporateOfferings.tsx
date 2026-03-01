const offerings = [
    {
        title: '1:1 Counselling',
        image: '/images/service-counsellor-figma.png',
    },
    {
        title: 'On Demand Wellbeing Content',
        image: '/images/feature-tools.png',
    },
    {
        title: 'Emotional Assessment',
        image: '/images/service-therapist-figma.png',
    },
    {
        title: 'Multi Language Counsellors',
        image: '/images/service-breathwork-figma.png',
    },
];

export default function CorporateOfferings() {
    return (
        <section className="w-full bg-black py-20 md:py-28">
            <div className="max-w-[1240px] mx-auto px-6 md:px-16">
                <h2
                    className="text-center text-white text-[24px] md:text-[32px] font-semibold leading-[1.2] tracking-[-0.64px] mb-14"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                    Soul Yatri Offers For Corporate Wellness
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {offerings.map((item, index) => (
                        <div
                            key={index}
                            className="group rounded-2xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] hover:border-orange-500/30 transition-all duration-500 flex flex-col"
                        >
                            {/* Card Image */}
                            <div className="relative w-full h-[200px] md:h-[240px] overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                {/* Dark overlay with title */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-5">
                                    <h3
                                        className="text-white text-[14px] md:text-[16px] font-semibold leading-[1.3] text-center w-full"
                                        style={{ fontFamily: "'Manrope', sans-serif" }}
                                    >
                                        {item.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Learn More button */}
                            <div className="p-4 flex justify-center">
                                <button
                                    className="w-full py-3 rounded-full border border-white/20 text-[13px] font-medium text-white hover:bg-white hover:text-black transition-all duration-300"
                                    style={{ fontFamily: "'Manrope', sans-serif" }}
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
