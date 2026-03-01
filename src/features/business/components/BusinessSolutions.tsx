import SolutionCard from './SolutionCard';

const solutionsData = [
    {
        title: 'Employee Counselling',
        category: 'Corporate Wellness',
        metricsText: '1.2K+ Companies has completed this program.',
        description: 'With on-demand digital counselling subscriptions and expert 1:1 sessions, employees gain immediate access to emotional and mental health support. This enhances workplace productivity, balance, and overall well-being.',
        imagePath: '/images/corporate-figma.png',
        imagePosition: 'left' as const,
        linkTo: '/business/corporate',
    },
    {
        title: 'Student Counselling',
        category: 'Student Wellness',
        metricsText: '1.2K+ Universities has completed this program.',
        description: 'By providing students with accessible digital counselling subscriptions and expert 1:1 sessions, universities can ensure mental health resources are always within reach. Offering confidential counsellor support, Student Wellness strengthens emotional well-being across college communities.',
        imagePath: '/images/service-counsellor-figma.png',
        imagePosition: 'right' as const,
        linkTo: '/business/student-counselling-demo',
    },
    {
        title: 'Workshops & Trainings',
        category: 'Overall Wellness',
        metricsText: '1.2K+ Companies has completed this program.',
        description: 'Workshops & Trainings deliver live, expert-driven sessions on managing stress, reducing anxiety, and strengthening mental fitness. Designed for teams, these programs enhance workplace well-being and performance.',
        imagePath: '/images/feature-sessions.png',
        imagePosition: 'left' as const,
        linkTo: '/business/workshop-demo',
    }
];

export default function BusinessSolutions() {
    return (
        <section className="w-full flex flex-col items-center gap-[60px] pb-[120px] px-6">
            {solutionsData.map((data, index) => (
                <SolutionCard
                    key={index}
                    title={data.title}
                    category={data.category}
                    metricsText={data.metricsText}
                    description={data.description}
                    imagePath={data.imagePath}
                    imagePosition={data.imagePosition}
                    linkTo={(data as any).linkTo}
                />
            ))}
        </section>
    );
}
