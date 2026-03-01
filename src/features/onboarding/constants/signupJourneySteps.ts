export type SignupJourneyStep = {
    id: string;
    title: string;
    description: string;
};

export const signupJourneySteps: SignupJourneyStep[] = [
    {
        id: '01',
        title: 'Create Your Account',
        description: 'Enter all the information your name, email, and create a password.',
    },
    {
        id: '02',
        title: 'Survey For Healing',
        description: 'This is a short survey with mood selector & goal checks for your Healing Journey.',
    },
    {
        id: '03',
        title: 'Astrology',
        description: 'This is an astrological insight related to your Birth.',
    },
    {
        id: '04',
        title: 'Consent & Privacy',
        description: 'Just some agreements & terms for your account type.',
    },
    {
        id: '05',
        title: 'Recommendations',
        description: 'Guide the user to their first action based on intake.',
    },
];