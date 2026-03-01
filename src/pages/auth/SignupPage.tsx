import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import OnboardingCreateAccountPage from '@/features/onboarding/screens/OnboardingCreateAccountPage';
import OnboardingSignupPage from '@/features/onboarding/screens/OnboardingSignupPage';
import OnboardingAstrologyPage from '@/features/onboarding/screens/OnboardingAstrologyPage';
import OnboardingPartnerDetailsPage from '@/features/onboarding/screens/OnboardingPartnerDetailsPage';

export default function SignupPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const step = searchParams.get('step');

    // Store astrology data to pass partner initial data forward
    const [astrologyData, setAstrologyData] = useState<any>(null);

    if (step === 'account') {
        return (
            <OnboardingCreateAccountPage
                onBack={() => {
                    setSearchParams({});
                }}
            />
        );
    }

    if (step === 'astrology') {
        return (
            <OnboardingAstrologyPage
                onBack={() => {
                    setSearchParams({ step: 'account' });
                }}
                onSubmit={(data) => {
                    setAstrologyData(data);
                    if (data?.wantMatchmaking) {
                        setSearchParams({ step: 'partner-details' });
                    } else {
                        navigate('/dashboard');
                    }
                }}
            />
        );
    }

    if (step === 'partner-details') {
        return (
            <OnboardingPartnerDetailsPage
                onBack={() => {
                    setSearchParams({ step: 'astrology' });
                }}
                onSubmit={() => {
                    navigate('/dashboard');
                }}
                initialData={astrologyData?.partner || null}
            />
        );
    }

    return <OnboardingSignupPage />;
}
