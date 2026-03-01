import { useState, useRef } from 'react';
import { ArrowLeft, MapPin, Clock, Upload, X, User, Heart, AlertCircle } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';

type OnboardingPartnerDetailsPageProps = {
    onBack: () => void;
    onSubmit: (data?: any) => void;
    initialData?: {
        name?: string;
        birthDate?: string;
        birthTime?: string;
        birthTimeAmPm?: string;
        birthCity?: string;
        faceImage?: string | null;
        unknownBirthTime?: boolean;
    } | null;
};

type FieldErrors = {
    partnerName?: string;
    partnerBirthDate?: string;
    partnerBirthTime?: string;
    partnerBirthCity?: string;
};

export default function OnboardingPartnerDetailsPage({ onBack, onSubmit, initialData }: OnboardingPartnerDetailsPageProps) {
    const [partnerName, setPartnerName] = useState(initialData?.name || '');
    const [partnerBirthDate, setPartnerBirthDate] = useState(initialData?.birthDate || '');
    const [partnerBirthTime, setPartnerBirthTime] = useState(
        initialData?.unknownBirthTime ? '' : (initialData?.birthTime || '')
    );
    const [partnerBirthTimeAmPm, setPartnerBirthTimeAmPm] = useState<'AM' | 'PM'>(
        (initialData?.birthTimeAmPm as 'AM' | 'PM') || 'AM'
    );
    const [partnerBirthCity, setPartnerBirthCity] = useState(initialData?.birthCity || '');
    const [partnerFaceImage, setPartnerFaceImage] = useState<string>(initialData?.faceImage || '');
    const [dontKnowTime, setDontKnowTime] = useState(initialData?.unknownBirthTime || false);
    const [roughTime, setRoughTime] = useState<'morning' | 'afternoon' | 'evening' | 'latenight' | ''>(
        initialData?.unknownBirthTime ? (initialData?.birthTime as any || '') : ''
    );
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const roughTimeOptions = [
        { id: 'morning', label: 'Morning', time: '6am - 12pm', icon: '🌅' },
        { id: 'afternoon', label: 'Afternoon', time: '12pm - 5pm', icon: '☀️' },
        { id: 'evening', label: 'Evening', time: '5pm - 9pm', icon: '🌆' },
        { id: 'latenight', label: 'Late Night', time: '9pm - 6am', icon: '🌙' },
    ];

    const validateFields = (): FieldErrors => {
        const errors: FieldErrors = {};

        if (!partnerName.trim()) errors.partnerName = 'Partner name is required';

        if (partnerBirthDate) {
            if (dontKnowTime) {
                if (!roughTime) errors.partnerBirthTime = 'Please select an approximate birth time';
            } else {
                if (!partnerBirthTime) errors.partnerBirthTime = 'Birth time is required';
            }
            if (!partnerBirthCity.trim()) errors.partnerBirthCity = 'Birth city is required';
        }

        setFieldErrors(errors);
        return errors;
    };

    const handleFaceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPEG, PNG, WebP)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                if (img.width < 200 || img.height < 200) {
                    alert('Image is too small. Please upload a photo at least 200x200 pixels.');
                    return;
                }
                setPartnerFaceImage(event.target?.result as string);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const removeFaceImage = () => {
        setPartnerFaceImage('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setHasAttemptedSubmit(true);
        const errors = validateFields();

        if (Object.keys(errors).length > 0) return;

        onSubmit({
            name: partnerName,
            birthDate: partnerBirthDate,
            birthTime: dontKnowTime ? roughTime : partnerBirthTime,
            birthTimeAmPm: dontKnowTime ? 'N/A' : partnerBirthTimeAmPm,
            birthCity: partnerBirthCity,
            faceImage: partnerFaceImage || null,
            unknownBirthTime: dontKnowTime,
        });
    };

    const handleSkip = () => {
        onSubmit(null);
    };

    function InlineError({ message }: { message?: string }) {
        if (!message) return null;
        return (
            <div className="flex items-center gap-1.5 mt-2">
                <AlertCircle className="size-[12px] text-red-500 flex-shrink-0" />
                <p className="text-[11px] text-red-500 tracking-[-0.01em]">{message}</p>
            </div>
        );
    }

    const inputErrorClass = (fieldName: keyof FieldErrors) =>
        fieldErrors[fieldName] ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-black/8 focus:border-black/20 focus:ring-black/10';

    const hasAnyErrors = Object.keys(fieldErrors).length > 0;

    return (
        <div className="min-h-screen bg-[#f4f4f4]" data-theme="light">
            <Navigation />

            <div className="pt-32 pb-16 min-h-screen">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-20 lg:items-start lg:min-h-[calc(100vh-280px)]">
                        {/* Form Section */}
                        <div className="max-w-[540px] mx-auto lg:mx-0 lg:pr-8">
                            {/* Back Button */}
                            <button
                                onClick={onBack}
                                className="mb-12 flex items-center justify-center size-[36px] rounded-full border border-black/15
                                         hover:border-black/30 hover:bg-black/5 transition-all duration-200 group
                                         text-black/60 hover:text-black"
                                type="button"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="size-[16px]" strokeWidth={2} />
                            </button>

                            <div>
                                {/* Icon + Heading */}
                                <div className="flex items-center gap-3 mb-2.5">
                                    <div className="size-[44px] rounded-full bg-black flex items-center justify-center">
                                        <Heart className="size-[20px] text-white" strokeWidth={2} />
                                    </div>
                                    <h1
                                        className="text-[32px] sm:text-[36px] lg:text-[40px]
                                                 font-semibold leading-[1.2] tracking-[-0.02em]
                                                 text-black"
                                    >
                                        Partner Details
                                    </h1>
                                </div>

                                {/* Subtext */}
                                <p className="text-[14px] sm:text-[15px] text-black/50 tracking-[-0.01em] mb-8">
                                    Add your partner's details for matchmaking compatibility analysis.
                                </p>

                                {/* Error banner */}
                                {hasAttemptedSubmit && hasAnyErrors && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[12px] flex items-start gap-3">
                                        <AlertCircle className="size-[16px] text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-[12px] text-red-600 tracking-[-0.01em]">
                                            Please fix the highlighted fields below to continue.
                                        </p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                    {/* Partner Name */}
                                    <div>
                                        <label className="block text-[13px] sm:text-[14px] text-black/60
                                                        tracking-[-0.01em] mb-3 font-medium">
                                            Partner's Full Name{' '}
                                            <span className="font-semibold text-red-400">(Required)</span>
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 size-[16px] text-black/30 pointer-events-none" />
                                            <input
                                                type="text"
                                                placeholder="Enter partner's full name"
                                                value={partnerName}
                                                onChange={(e) => setPartnerName(e.target.value)}
                                                className={`w-full h-[56px] pl-12 pr-4 bg-white border
                                                         rounded-[12px] text-[14px] text-black
                                                         placeholder:text-black/30 tracking-[-0.01em]
                                                         focus:outline-none focus:ring-1
                                                         transition-all duration-200 ${inputErrorClass('partnerName')}`}
                                            />
                                        </div>
                                        <InlineError message={fieldErrors.partnerName} />
                                    </div>

                                    {/* Partner Birth Date */}
                                    <div>
                                        <label className="block text-[13px] sm:text-[14px] text-black/60
                                                        tracking-[-0.01em] mb-3 font-medium">
                                            Partner's Birth Date{' '}
                                            <span className="font-semibold text-black/40">(Optional)</span>
                                        </label>
                                        <input
                                            type="date"
                                            value={partnerBirthDate}
                                            onChange={(e) => setPartnerBirthDate(e.target.value)}
                                            className="w-full h-[56px] px-5 bg-white border border-black/8
                                                     rounded-[12px] text-[14px] text-black
                                                     placeholder:text-black/30 tracking-[-0.01em]
                                                     focus:outline-none focus:border-black/20 focus:ring-1 focus:ring-black/10
                                                     transition-all duration-200 cursor-pointer
                                                     [color-scheme:light]"
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'calc(100% - 16px) center',
                                                paddingRight: '44px',
                                            }}
                                        />
                                    </div>

                                    {/* Partner Birth Time */}
                                    <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="block text-[13px] sm:text-[14px] text-black/60
                                                                tracking-[-0.01em] font-medium">
                                                    Partner's Birth Time{' '}
                                                    <span className="font-semibold text-red-400">(Required)</span>
                                                </label>
                                            </div>

                                            {!dontKnowTime ? (
                                                <>
                                                    <div className="flex gap-2 mb-3">
                                                        <div className="flex-1 relative">
                                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-[16px] text-black/30 pointer-events-none" />
                                                            <input
                                                                type="time"
                                                                value={partnerBirthTime}
                                                                onChange={(e) => setPartnerBirthTime(e.target.value)}
                                                                className={`w-full h-[56px] pl-12 pr-4 bg-white border
                                                                         rounded-[12px] text-[14px] text-black
                                                                         placeholder:text-black/30 tracking-[-0.01em]
                                                                         focus:outline-none focus:ring-1
                                                                         transition-all duration-200 cursor-pointer
                                                                         [color-scheme:light] ${inputErrorClass('partnerBirthTime')}`}
                                                            />
                                                        </div>
                                                        <div className="flex items-center bg-white border border-black/8 rounded-[12px] p-1 gap-1">
                                                            {(['AM', 'PM'] as const).map((period) => (
                                                                <button
                                                                    key={period}
                                                                    type="button"
                                                                    onClick={() => setPartnerBirthTimeAmPm(period)}
                                                                    className={`px-3.5 py-1.5 text-[12px] font-semibold rounded-[8px]
                                                                               transition-all duration-200 tracking-[-0.01em]
                                                                               ${partnerBirthTimeAmPm === period
                                                                                   ? 'bg-black text-white shadow-sm'
                                                                                   : 'text-black/50 hover:text-black/70'
                                                                               }`}
                                                                >
                                                                    {period}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <InlineError message={fieldErrors.partnerBirthTime} />
                                                    <button
                                                        type="button"
                                                        onClick={() => { setDontKnowTime(true); setPartnerBirthTime(''); }}
                                                        className="text-[11px] text-black/50 hover:text-black transition-colors duration-200 tracking-[-0.01em] mt-2"
                                                    >
                                                        I don't know their exact birth time
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="space-y-3">
                                                    <p className="text-[12px] text-black/60 tracking-[-0.01em] mb-2 font-medium">
                                                        When were they born? (Approximate)
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {roughTimeOptions.map((option) => (
                                                            <button
                                                                key={option.id}
                                                                type="button"
                                                                onClick={() => setRoughTime(option.id as typeof roughTime)}
                                                                className={`p-3 rounded-[12px] border-2 transition-all duration-200 text-center
                                                                           ${roughTime === option.id
                                                                               ? 'bg-black/5 border-black/30'
                                                                               : fieldErrors.partnerBirthTime && !roughTime
                                                                                   ? 'bg-white border-red-300 hover:border-red-400'
                                                                                   : 'bg-white border-black/10 hover:border-black/20'
                                                                           }`}
                                                            >
                                                                <div className="text-[20px] mb-1">{option.icon}</div>
                                                                <div className="text-[11px] font-semibold text-black">{option.label}</div>
                                                                <div className="text-[9px] text-black/50">{option.time}</div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <InlineError message={fieldErrors.partnerBirthTime} />
                                                    <button
                                                        type="button"
                                                        onClick={() => { setDontKnowTime(false); setRoughTime(''); }}
                                                        className="text-[11px] text-black/50 hover:text-black transition-colors duration-200 tracking-[-0.01em]"
                                                    >
                                                        I know their exact birth time
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                    {/* Partner Birth City */}
                                    <div>
                                        <label className="block text-[13px] sm:text-[14px] text-black/60
                                                        tracking-[-0.01em] mb-3 font-medium">
                                            Partner's Birth City{' '}
                                            <span className={`font-semibold ${partnerBirthDate ? 'text-red-400' : 'text-black/40'}`}>
                                                ({partnerBirthDate ? 'Required' : 'Optional'})
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-[16px] text-black/30 pointer-events-none" />
                                            <input
                                                type="text"
                                                placeholder="Partner's birth city"
                                                value={partnerBirthCity}
                                                onChange={(e) => setPartnerBirthCity(e.target.value)}
                                                className={`w-full h-[56px] pl-12 pr-4 bg-white border
                                                         rounded-[12px] text-[14px] text-black
                                                         placeholder:text-black/30 tracking-[-0.01em]
                                                         focus:outline-none focus:ring-1
                                                         transition-all duration-200 ${inputErrorClass('partnerBirthCity')}`}
                                            />
                                        </div>
                                        <InlineError message={fieldErrors.partnerBirthCity} />
                                    </div>

                                    {/* Partner Face Photo (Optional) */}
                                    <div>
                                        <label className="block text-[13px] sm:text-[14px] text-black/60
                                                        tracking-[-0.01em] mb-2 font-medium">
                                            Partner's Face Photo{' '}
                                            <span className="font-semibold text-black/40">(Optional)</span>
                                        </label>
                                        <p className="text-[10px] text-black/40 tracking-[-0.01em] mb-3 leading-relaxed">
                                            For enhanced compatibility analysis. Ensure full face with forehead and hair visible.
                                        </p>
                                        {!partnerFaceImage ? (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-full p-4 bg-white border-2 border-dashed border-black/20 rounded-[12px]
                                                             hover:border-black/30 transition-all duration-200 flex flex-col items-center gap-2"
                                                >
                                                    <Upload className="size-[20px] text-black/50" />
                                                    <div className="text-[12px] font-medium text-black/60">Upload Partner's Photo</div>
                                                    <div className="text-[9px] text-black/35">JPEG, PNG, WebP — Max 5MB</div>
                                                </button>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={handleFaceImageUpload}
                                                    className="hidden"
                                                />
                                            </>
                                        ) : (
                                            <div className="relative rounded-[12px] overflow-hidden border-2 border-green-300">
                                                <img src={partnerFaceImage} alt="Partner face" className="w-full h-[200px] object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={removeFaceImage}
                                                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black rounded-full text-white transition-all duration-200"
                                                >
                                                    <X className="size-[16px]" />
                                                </button>
                                                <div className="absolute bottom-0 left-0 right-0 bg-green-600/90 px-3 py-1.5">
                                                    <p className="text-[10px] text-white font-medium tracking-[-0.01em]">Photo uploaded successfully</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit + Skip Buttons */}
                                    <div className="space-y-3 pt-4">
                                        <button
                                            type="submit"
                                            className="w-full h-[56px] bg-[#1e1e1e] text-white text-[14px] sm:text-[15px]
                                                     font-semibold tracking-[-0.01em] rounded-[12px]
                                                     hover:bg-black transition-all duration-200
                                                     focus:outline-none focus:ring-2 focus:ring-black/20
                                                     focus:ring-offset-0
                                                     active:scale-[0.98] group"
                                        >
                                            <span className="group-active:scale-95 inline-block transition-transform duration-200">
                                                Submit Partner Details
                                            </span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleSkip}
                                            className="w-full h-[48px] bg-transparent text-black/50 text-[13px] sm:text-[14px]
                                                     font-medium tracking-[-0.01em] rounded-[12px]
                                                     border border-black/10
                                                     hover:border-black/20 hover:text-black/70 transition-all duration-200
                                                     focus:outline-none"
                                        >
                                            Skip for Now
                                        </button>
                                    </div>

                                    {/* Footer Text */}
                                    <p className="text-[11px] sm:text-[12px] text-black/40 text-center
                                                tracking-[-0.01em] pt-1">
                                        Partner details are kept private and used only for compatibility analysis.
                                    </p>
                                </form>
                            </div>
                        </div>

                        {/* Image Section */}
                        <div className="hidden lg:flex justify-center items-center lg:sticky lg:top-32">
                            <div className="w-full max-w-[400px] text-center">
                                <div className="size-[120px] mx-auto rounded-full bg-black/5 flex items-center justify-center mb-8">
                                    <Heart className="size-[48px] text-black/20" strokeWidth={1.5} />
                                </div>
                                <h2 className="text-[24px] font-semibold text-black/80 tracking-[-0.02em] mb-3">
                                    Compatibility Analysis
                                </h2>
                                <p className="text-[14px] text-black/40 tracking-[-0.01em] leading-relaxed max-w-[320px] mx-auto">
                                    By adding your partner's birth details, we can generate a detailed
                                    astrological compatibility report comparing your charts.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
