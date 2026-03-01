import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import OnboardingCreateAccountPage from '@/features/onboarding/screens/OnboardingCreateAccountPage';
import OnboardingSignupPage from '@/features/onboarding/screens/OnboardingSignupPage';
import OnboardingAstrologyPage from '@/features/onboarding/screens/OnboardingAstrologyPage';
import OnboardingPartnerDetailsPage from '@/features/onboarding/screens/OnboardingPartnerDetailsPage';
import apiService from '@/services/api.service';

export default function SignupPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const step = searchParams.get('step');

    // Store astrology data to pass partner initial data forward
    const [astrologyData, setAstrologyData] = useState<any>(null);

    const persistAstrologyProfile = async (payload: Record<string, unknown>) => {
        const response = await apiService.post('/users/astrology-profile', payload);

        if (!response.success) {
            toast.error(response.error?.message || 'Could not save astrology profile. Continuing anyway.');
        }
    };

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
                        void persistAstrologyProfile(data || {}).finally(() => {
                            navigate('/journey-preparation');
                        });
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
                onSubmit={(partnerData) => {
                    const merged = {
                        ...(astrologyData || {}),
                        partners: partnerData ? [partnerData] : (astrologyData?.partners || []),
                        wantMatchmaking: true,
                    };

                    void persistAstrologyProfile(merged).finally(() => {
                        navigate('/journey-preparation');
                    });
                }}
                initialData={astrologyData?.partner || null}
            />
        );
    }

    return <OnboardingSignupPage />;
}
