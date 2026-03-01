import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, Clock, Upload, Camera, X, ChevronDown, ChevronUp, Plus, Heart, User, Trash2, AlertCircle } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';

type OnboardingAstrologyPageProps = {
    onBack: () => void;
    onSubmit: (data?: any) => void;
};

interface PartnerData {
    name: string;
    birthDate: string;
    birthTime: string;
    birthTimeAmPm: 'AM' | 'PM';
    birthCity: string;
    faceImage: string;
}

const EMPTY_PARTNER: PartnerData = {
    name: '',
    birthDate: '',
    birthTime: '',
    birthTimeAmPm: 'AM',
    birthCity: '',
    faceImage: '',
};

export default function OnboardingAstrologyPage({ onBack, onSubmit }: OnboardingAstrologyPageProps) {
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [birthTimeAmPm, setBirthTimeAmPm] = useState<'AM' | 'PM'>('AM');
    const [birthCity, setBirthCity] = useState('');
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    // Unknown birth time flow
    const [dontKnowTime, setDontKnowTime] = useState(false);
    const [roughTime, setRoughTime] = useState<'morning' | 'afternoon' | 'evening' | 'latenight'>('morning');
    const [faceImage, setFaceImage] = useState<string>('');
    const [faceValidationMsg, setFaceValidationMsg] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    // Matchmaking & Partner details (Option C: inline collapsible + full section)
    const [wantMatchmaking, setWantMatchmaking] = useState(false);
    const [partnerSectionOpen, setPartnerSectionOpen] = useState(false);
    const [partners, setPartners] = useState<PartnerData[]>([]);
    const [editingPartnerIdx, setEditingPartnerIdx] = useState<number | null>(null);
    const [currentPartner, setCurrentPartner] = useState<PartnerData>({ ...EMPTY_PARTNER });
    const [partnerErrors, setPartnerErrors] = useState<string[]>([]);
    const partnerFileInputRef = useRef<HTMLInputElement>(null);
    const partnerVideoRef = useRef<HTMLVideoElement>(null);
    const partnerCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isPartnerCameraOpen, setIsPartnerCameraOpen] = useState(false);

    // Auto-detect location on mount
    useEffect(() => {
        if (!birthCity) {
            detectLocation();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Cleanup cameras on unmount
    useEffect(() => {
        return () => {
            if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
            if (partnerVideoRef.current?.srcObject) {
                (partnerVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const detectLocation = async () => {
        setIsLoadingLocation(true);
        setLocationError('');
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            if (data.city) {
                setBirthCity(data.city);
            } else {
                setLocationError('Could not detect location');
            }
        } catch {
            setLocationError('Location detection unavailable');
        } finally {
            setIsLoadingLocation(false);
        }
    };

    // Face Image Validation
    const validateFaceImage = (file: File): string | null => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
        if (!allowedTypes.includes(file.type)) {
            return 'Please upload a JPG, PNG, or WebP image.';
        }
        if (file.size > 5 * 1024 * 1024) {
            return 'Image must be under 5 MB.';
        }
        if (file.size < 10 * 1024) {
            return 'Image is too small. Please upload a clearer photo.';
        }
        return null;
    };

    // User Face Upload
    const handleFaceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFaceValidationMsg('');
        const err = validateFaceImage(file);
        if (err) {
            setFaceValidationMsg(err);
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            setFaceImage(event.target?.result as string);
            setFaceValidationMsg('');
        };
        reader.readAsDataURL(file);
    };

    // User Camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraOpen(true);
                setFaceValidationMsg('');
            }
        } catch {
            setFaceValidationMsg('Camera access denied. Please allow camera permissions.');
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                ctx.drawImage(videoRef.current, 0, 0);
                setFaceImage(canvasRef.current.toDataURL('image/jpeg', 0.95));
                stopCamera();
            }
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
    };

    const removeFaceImage = () => {
        setFaceImage('');
        setFaceValidationMsg('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Partner Face Upload
    const handlePartnerFaceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const err = validateFaceImage(file);
        if (err) {
            setPartnerErrors([err]);
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            setCurrentPartner(prev => ({ ...prev, faceImage: event.target?.result as string }));
            setPartnerErrors([]);
        };
        reader.readAsDataURL(file);
    };

    const startPartnerCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
            });
            if (partnerVideoRef.current) {
                partnerVideoRef.current.srcObject = stream;
                setIsPartnerCameraOpen(true);
            }
        } catch {
            setPartnerErrors(['Camera access denied.']);
        }
    };

    const capturePartnerPhoto = () => {
        if (partnerVideoRef.current && partnerCanvasRef.current) {
            const ctx = partnerCanvasRef.current.getContext('2d');
            if (ctx) {
                partnerCanvasRef.current.width = partnerVideoRef.current.videoWidth;
                partnerCanvasRef.current.height = partnerVideoRef.current.videoHeight;
                ctx.drawImage(partnerVideoRef.current, 0, 0);
                setCurrentPartner(prev => ({
                    ...prev,
                    faceImage: partnerCanvasRef.current?.toDataURL('image/jpeg', 0.95) || '',
                }));
                stopPartnerCamera();
            }
        }
    };

    const stopPartnerCamera = () => {
        if (partnerVideoRef.current?.srcObject) {
            (partnerVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            partnerVideoRef.current.srcObject = null;
        }
        setIsPartnerCameraOpen(false);
    };

    // Partner CRUD
    const savePartner = () => {
        const errs: string[] = [];
        if (!currentPartner.name.trim()) errs.push('Partner name is required.');
        if (!currentPartner.birthDate) errs.push('Partner birth date is required.');
        if (!currentPartner.birthTime) errs.push('Partner birth time is required.');
        if (!currentPartner.birthCity.trim()) errs.push('Partner birth city is required.');
        setPartnerErrors(errs);
        if (errs.length > 0) return;

        if (editingPartnerIdx !== null) {
            setPartners(prev => prev.map((p, i) => i === editingPartnerIdx ? { ...currentPartner } : p));
        } else {
            setPartners(prev => [...prev, { ...currentPartner }]);
        }
        setCurrentPartner({ ...EMPTY_PARTNER });
        setEditingPartnerIdx(null);
        setPartnerErrors([]);
    };

    const editPartner = (idx: number) => {
        setCurrentPartner({ ...partners[idx] });
        setEditingPartnerIdx(idx);
        setPartnerErrors([]);
    };

    const removePartner = (idx: number) => {
        setPartners(prev => prev.filter((_, i) => i !== idx));
        if (editingPartnerIdx === idx) {
            setCurrentPartner({ ...EMPTY_PARTNER });
            setEditingPartnerIdx(null);
        }
    };

    // Main Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: string[] = [];

        if (birthDate) {
            if (dontKnowTime) {
                if (!faceImage) newErrors.push('Face image is required for birth time analysis.');
                if (!birthCity.trim()) newErrors.push('Birth city is required.');
            } else {
                if (!birthTime) newErrors.push('Birth time is required when birth date is provided.');
                if (!birthCity.trim()) newErrors.push('Birth city is required when birth date is provided.');
            }
        }

        setErrors(newErrors);
        if (newErrors.length > 0) return;

        onSubmit({
            birthDate,
            birthTime: dontKnowTime ? roughTime : birthTime,
            birthTimeAmPm: dontKnowTime ? 'N/A' : birthTimeAmPm,
            birthCity,
            faceImage: dontKnowTime ? faceImage : null,
            unknownBirthTime: dontKnowTime,
            wantMatchmaking,
            partners: wantMatchmaking ? partners : [],
        });
    };

    const formatDateForDisplay = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const cityLabel = birthDate ? '(Required)' : '(Optional)';

    return (
        <div className="min-h-screen bg-[#f4f4f4]" data-theme="light">
            <Navigation />

            <div className="pt-32 pb-16 min-h-screen">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-20 lg:items-start lg:min-h-[calc(100vh-280px)]">
                        {/* Form Section */}
                        <div className="max-w-[540px] mx-auto lg:mx-0 lg:pr-8">
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
                                <h1 className="text-[32px] sm:text-[36px] lg:text-[40px] font-semibold leading-[1.2] tracking-[-0.02em] text-black mb-2.5">
                                    Add Context to Your Journey.
                                </h1>
                                <p className="text-[14px] sm:text-[15px] text-black/50 tracking-[-0.01em] mb-8">
                                    Just simple questions to know what's better for you.
                                </p>

                                {errors.length > 0 && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[12px]">
                                        {errors.map((error, idx) => (
                                            <p key={idx} className="text-[12px] text-red-600 tracking-[-0.01em] mb-1 last:mb-0 flex items-start gap-1.5">
                                                <AlertCircle className="size-[14px] mt-0.5 shrink-0" />
                                                {error}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">

                                    {/* BIRTH DATE */}
                                    <div>
                                        <label className="block text-[13px] sm:text-[14px] text-black/60 tracking-[-0.01em] mb-3 font-medium">
                                            What's your birth date{' '}
                                            <span className="font-semibold text-black/40">(Optional)</span>
                                        </label>
                                        <div className="relative group">
                                            <input
                                                type="date"
                                                value={birthDate}
                                                onChange={(e) => setBirthDate(e.target.value)}
                                                className="w-full h-[56px] px-5 bg-white border border-black/8
                                                         rounded-[12px] text-[14px] text-black
                                                         placeholder:text-black/30 tracking-[-0.01em]
                                                         focus:outline-none focus:border-black/20 focus:ring-1 focus:ring-black/10
                                                         transition-all duration-200 cursor-pointer [color-scheme:light]"
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E")`,
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'calc(100% - 16px) center',
                                                    paddingRight: '44px',
                                                }}
                                            />
                                            {birthDate && (
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pr-12 text-[12px] text-black/40 pointer-events-none">
                                                    {formatDateForDisplay(birthDate)}
                                                </div>
                                            )}
                                        </div>

                                    {/* BIRTH TIME */}
                                    <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="block text-[13px] sm:text-[14px] text-black/60 tracking-[-0.01em] font-medium">
                                                    What's your birth time?{' '}
                                                    <span className="font-semibold text-black/40">(Required)</span>
                                                </label>
                                            </div>

                                            {!dontKnowTime ? (
                                                <>
                                                    <div className="flex gap-2 mb-3">
                                                        <div className="flex-1 relative">
                                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 size-[16px] text-black/30 pointer-events-none" />
                                                            <input
                                                                type="time"
                                                                value={birthTime}
                                                                onChange={(e) => setBirthTime(e.target.value)}
                                                                className="w-full h-[56px] pl-12 pr-4 bg-white border border-black/8
                                                                         rounded-[12px] text-[14px] text-black placeholder:text-black/30 tracking-[-0.01em]
                                                                         focus:outline-none focus:border-black/20 focus:ring-1 focus:ring-black/10
                                                                         transition-all duration-200 cursor-pointer [color-scheme:light]"
                                                            />
                                                        </div>
                                                        <div className="flex items-center bg-white border border-black/8 rounded-[12px] p-1 gap-1">
                                                            {(['AM', 'PM'] as const).map((period) => (
                                                                <button
                                                                    key={period}
                                                                    type="button"
                                                                    onClick={() => setBirthTimeAmPm(period)}
                                                                    className={`px-3.5 py-1.5 text-[12px] font-semibold rounded-[8px] transition-all duration-200 tracking-[-0.01em]
                                                                               ${birthTimeAmPm === period ? 'bg-black text-white shadow-sm' : 'text-black/50 hover:text-black/70'}`}
                                                                >
                                                                    {period}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setDontKnowTime(true); setBirthTime(''); }}
                                                        className="text-[11px] text-black/50 hover:text-black transition-colors duration-200 tracking-[-0.01em] underline underline-offset-2"
                                                    >
                                                        I don't know my exact birth time
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="space-y-5 p-5 bg-white/60 border border-black/8 rounded-[16px]">
                                                    <div>
                                                        <p className="text-[12px] text-black/60 tracking-[-0.01em] mb-3 font-medium">
                                                            Approximate time of birth
                                                        </p>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {([
                                                                { id: 'morning' as const, label: 'Morning', time: '6 AM - 12 PM', icon: '\u{1F305}' },
                                                                { id: 'afternoon' as const, label: 'Afternoon', time: '12 PM - 5 PM', icon: '\u{2600}\u{FE0F}' },
                                                                { id: 'evening' as const, label: 'Evening', time: '5 PM - 9 PM', icon: '\u{1F306}' },
                                                                { id: 'latenight' as const, label: 'Late Night', time: '9 PM - 6 AM', icon: '\u{1F319}' },
                                                            ]).map((option) => (
                                                                <button
                                                                    key={option.id}
                                                                    type="button"
                                                                    onClick={() => setRoughTime(option.id)}
                                                                    className={`p-3.5 rounded-[12px] border-2 transition-all duration-200 text-center
                                                                               ${roughTime === option.id ? 'bg-black/5 border-black/30 shadow-sm' : 'bg-white border-black/10 hover:border-black/20'}`}
                                                                >
                                                                    <div className="text-[22px] mb-1.5">{option.icon}</div>
                                                                    <div className="text-[11px] font-semibold text-black">{option.label}</div>
                                                                    <div className="text-[9px] text-black/50 mt-0.5">{option.time}</div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-[12px] text-black/60 tracking-[-0.01em] mb-2 font-medium">
                                                            Upload your face photo for analysis{' '}
                                                            <span className="font-semibold text-black/40">(Required)</span>
                                                        </p>
                                                        <p className="text-[10px] text-black/40 mb-3">
                                                            Ensure full face is visible - forehead, hair, and both ears should be clear. No sunglasses or heavy filters.
                                                        </p>

                                                        {faceValidationMsg && (
                                                            <p className="text-[11px] text-red-500 mb-2 flex items-center gap-1">
                                                                <AlertCircle className="size-[12px]" /> {faceValidationMsg}
                                                            </p>
                                                        )}

                                                        {!faceImage ? (
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => fileInputRef.current?.click()}
                                                                    className="p-4 bg-white border-2 border-dashed border-black/15 rounded-[12px]
                                                                             hover:border-black/30 transition-all duration-200 flex flex-col items-center gap-2"
                                                                >
                                                                    <Upload className="size-[20px] text-black/50" />
                                                                    <div className="text-[11px] font-medium text-black/60">Upload Photo</div>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={startCamera}
                                                                    className="p-4 bg-white border-2 border-dashed border-black/15 rounded-[12px]
                                                                             hover:border-black/30 transition-all duration-200 flex flex-col items-center gap-2"
                                                                >
                                                                    <Camera className="size-[20px] text-black/50" />
                                                                    <div className="text-[11px] font-medium text-black/60">Take Photo</div>
                                                                </button>
                                                                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFaceImageUpload} className="hidden" />
                                                            </div>
                                                        ) : (
                                                            <div className="relative rounded-[12px] overflow-hidden border border-black/10">
                                                                <img src={faceImage} alt="Your face" className="w-full h-[200px] object-cover" />
                                                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                                                    <p className="text-[10px] text-white/80">Face photo uploaded successfully</p>
                                                                </div>
                                                                <button type="button" onClick={removeFaceImage}
                                                                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black rounded-full text-white transition-all duration-200">
                                                                    <X className="size-[14px]" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => { setDontKnowTime(false); setFaceImage(''); setFaceValidationMsg(''); }}
                                                        className="text-[11px] text-black/50 hover:text-black transition-colors duration-200 tracking-[-0.01em] underline underline-offset-2"
                                                    >
                                                        I know my exact birth time
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* BIRTH CITY */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="block text-[13px] sm:text-[14px] text-black/60 tracking-[-0.01em] font-medium">
                                                Which city were you born in?{' '}
                                                <span className="font-semibold text-black/40">{cityLabel}</span>
                                            </label>
                                            <button type="button" onClick={detectLocation} disabled={isLoadingLocation}
                                                className="text-[11px] sm:text-[12px] text-black/50 hover:text-black tracking-[-0.01em] transition-colors duration-200 disabled:text-black/30 disabled:cursor-wait font-medium">
                                                {isLoadingLocation ? 'Detecting...' : 'Suggest A Location'}
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-[16px] text-black/30 pointer-events-none" />
                                            <input
                                                type="text"
                                                placeholder="Ex. Mumbai, Gujarat"
                                                value={birthCity}
                                                onChange={(e) => { setBirthCity(e.target.value); setLocationError(''); }}
                                                className="w-full h-[56px] pl-12 pr-4 bg-white border border-black/8 rounded-[12px] text-[14px] text-black
                                                         placeholder:text-black/30 tracking-[-0.01em] focus:outline-none focus:border-black/20 focus:ring-1 focus:ring-black/10 transition-all duration-200"
                                            />
                                        </div>
                                        {locationError && <p className="text-[11px] text-black/40 mt-1.5 tracking-[-0.01em]">{locationError}</p>}
                                    </div>

                                    {/* MATCHMAKING TOGGLE */}
                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            onClick={() => { const next = !wantMatchmaking; setWantMatchmaking(next); if (next) setPartnerSectionOpen(true); }}
                                            className={`w-full flex items-center justify-between p-4 rounded-[12px] border-2 transition-all duration-200
                                                       ${wantMatchmaking ? 'border-black/20 bg-black/[0.03]' : 'border-black/8 bg-white hover:border-black/15'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Heart className={`size-[18px] transition-colors ${wantMatchmaking ? 'text-red-500 fill-red-500' : 'text-black/30'}`} />
                                                <div className="text-left">
                                                    <div className="text-[13px] font-semibold text-black">Partner Matchmaking</div>
                                                    <div className="text-[10px] text-black/40 mt-0.5">Add partner details for compatibility analysis</div>
                                                </div>
                                            </div>
                                            <div className={`w-[42px] h-[24px] rounded-full transition-all duration-200 flex items-center p-0.5 ${wantMatchmaking ? 'bg-black' : 'bg-black/15'}`}>
                                                <div className={`size-[20px] rounded-full bg-white shadow-sm transition-transform duration-200 ${wantMatchmaking ? 'translate-x-[18px]' : 'translate-x-0'}`} />
                                            </div>
                                        </button>
                                    </div>

                                    {/* PARTNER DETAILS (Option C: collapsible inline) */}
                                    {wantMatchmaking && (
                                        <div className="space-y-4">
                                            <button type="button" onClick={() => setPartnerSectionOpen(!partnerSectionOpen)} className="w-full flex items-center justify-between text-left">
                                                <span className="text-[13px] font-semibold text-black tracking-[-0.01em]">
                                                    Partner Details {partners.length > 0 && `(${partners.length} added)`}
                                                </span>
                                                {partnerSectionOpen ? <ChevronUp className="size-[16px] text-black/40" /> : <ChevronDown className="size-[16px] text-black/40" />}
                                            </button>

                                            {partnerSectionOpen && (
                                                <div className="space-y-4">
                                                    {partners.length > 0 && (
                                                        <div className="space-y-2">
                                                            {partners.map((partner, idx) => (
                                                                <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-[12px] border border-black/8">
                                                                    {partner.faceImage ? (
                                                                        <img src={partner.faceImage} alt={partner.name} className="size-[40px] rounded-full object-cover" />
                                                                    ) : (
                                                                        <div className="size-[40px] rounded-full bg-black/5 flex items-center justify-center">
                                                                            <User className="size-[18px] text-black/30" />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-[13px] font-semibold text-black truncate">{partner.name}</p>
                                                                        <p className="text-[10px] text-black/40">{formatDateForDisplay(partner.birthDate)} &middot; {partner.birthCity}</p>
                                                                    </div>
                                                                    <div className="flex gap-1.5">
                                                                        <button type="button" onClick={() => editPartner(idx)} className="p-1.5 hover:bg-black/5 rounded-lg transition-colors">
                                                                            <ChevronDown className="size-[14px] text-black/40" />
                                                                        </button>
                                                                        <button type="button" onClick={() => removePartner(idx)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                                                                            <Trash2 className="size-[14px] text-red-400" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <div className="p-4 bg-white/80 border border-black/10 rounded-[16px] space-y-4">
                                                        <p className="text-[12px] font-semibold text-black/70">
                                                            {editingPartnerIdx !== null ? 'Edit Partner' : 'Add a Partner'}
                                                        </p>

                                                        {partnerErrors.length > 0 && (
                                                            <div className="p-3 bg-red-50 border border-red-200 rounded-[10px]">
                                                                {partnerErrors.map((err, i) => (
                                                                    <p key={i} className="text-[11px] text-red-600 flex items-center gap-1 mb-0.5 last:mb-0">
                                                                        <AlertCircle className="size-[12px] shrink-0" /> {err}
                                                                    </p>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div>
                                                            <label className="block text-[11px] text-black/50 mb-1.5 font-medium">Partner Name *</label>
                                                            <input type="text" placeholder="Full name" value={currentPartner.name}
                                                                onChange={(e) => setCurrentPartner(p => ({ ...p, name: e.target.value }))}
                                                                className="w-full h-[48px] px-4 bg-white border border-black/8 rounded-[10px] text-[13px] text-black placeholder:text-black/30 focus:outline-none focus:border-black/20 focus:ring-1 focus:ring-black/10 transition-all duration-200" />
                                                        </div>

                                                        <div>
                                                            <label className="block text-[11px] text-black/50 mb-1.5 font-medium">Birth Date *</label>
                                                            <input type="date" value={currentPartner.birthDate}
                                                                onChange={(e) => setCurrentPartner(p => ({ ...p, birthDate: e.target.value }))}
                                                                className="w-full h-[48px] px-4 bg-white border border-black/8 rounded-[10px] text-[13px] text-black focus:outline-none focus:border-black/20 focus:ring-1 focus:ring-black/10 transition-all duration-200 [color-scheme:light]" />
                                                        </div>

                                                        <div>
                                                            <label className="block text-[11px] text-black/50 mb-1.5 font-medium">Birth Time *</label>
                                                            <div className="flex gap-2">
                                                                <div className="flex-1 relative">
                                                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-[14px] text-black/30 pointer-events-none" />
                                                                    <input type="time" value={currentPartner.birthTime}
                                                                        onChange={(e) => setCurrentPartner(p => ({ ...p, birthTime: e.target.value }))}
                                                                        className="w-full h-[48px] pl-10 pr-3 bg-white border border-black/8 rounded-[10px] text-[13px] text-black focus:outline-none focus:border-black/20 focus:ring-1 focus:ring-black/10 transition-all duration-200 [color-scheme:light]" />
                                                                </div>
                                                                <div className="flex items-center bg-white border border-black/8 rounded-[10px] p-0.5 gap-0.5">
                                                                    {(['AM', 'PM'] as const).map((period) => (
                                                                        <button key={period} type="button"
                                                                            onClick={() => setCurrentPartner(p => ({ ...p, birthTimeAmPm: period }))}
                                                                            className={`px-3 py-1 text-[11px] font-semibold rounded-[8px] transition-all duration-200
                                                                                       ${currentPartner.birthTimeAmPm === period ? 'bg-black text-white shadow-sm' : 'text-black/50 hover:text-black/70'}`}>
                                                                            {period}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-[11px] text-black/50 mb-1.5 font-medium">Birth City *</label>
                                                            <div className="relative">
                                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-[14px] text-black/30 pointer-events-none" />
                                                                <input type="text" placeholder="Ex. Delhi" value={currentPartner.birthCity}
                                                                    onChange={(e) => setCurrentPartner(p => ({ ...p, birthCity: e.target.value }))}
                                                                    className="w-full h-[48px] pl-10 pr-3 bg-white border border-black/8 rounded-[10px] text-[13px] text-black placeholder:text-black/30 focus:outline-none focus:border-black/20 focus:ring-1 focus:ring-black/10 transition-all duration-200" />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block text-[11px] text-black/50 mb-1.5 font-medium">
                                                                Face Photo <span className="text-black/30">(Optional)</span>
                                                            </label>
                                                            {!currentPartner.faceImage ? (
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <button type="button" onClick={() => partnerFileInputRef.current?.click()}
                                                                        className="p-3 bg-white border border-dashed border-black/15 rounded-[10px] hover:border-black/25 transition-all duration-200 flex flex-col items-center gap-1.5">
                                                                        <Upload className="size-[16px] text-black/40" />
                                                                        <div className="text-[10px] font-medium text-black/50">Upload</div>
                                                                    </button>
                                                                    <button type="button" onClick={startPartnerCamera}
                                                                        className="p-3 bg-white border border-dashed border-black/15 rounded-[10px] hover:border-black/25 transition-all duration-200 flex flex-col items-center gap-1.5">
                                                                        <Camera className="size-[16px] text-black/40" />
                                                                        <div className="text-[10px] font-medium text-black/50">Camera</div>
                                                                    </button>
                                                                    <input ref={partnerFileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePartnerFaceUpload} className="hidden" />
                                                                </div>
                                                            ) : (
                                                                <div className="relative rounded-[10px] overflow-hidden border border-black/10 h-[140px]">
                                                                    <img src={currentPartner.faceImage} alt="Partner" className="w-full h-full object-cover" />
                                                                    <button type="button"
                                                                        onClick={() => { setCurrentPartner(p => ({ ...p, faceImage: '' })); if (partnerFileInputRef.current) partnerFileInputRef.current.value = ''; }}
                                                                        className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-black rounded-full text-white transition-all">
                                                                        <X className="size-[12px]" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="flex gap-2 pt-1">
                                                            <button type="button" onClick={savePartner}
                                                                className="flex-1 h-[42px] bg-black text-white text-[12px] font-semibold rounded-[10px] hover:bg-black/90 transition-all duration-200 flex items-center justify-center gap-1.5">
                                                                <Plus className="size-[14px]" />
                                                                {editingPartnerIdx !== null ? 'Update Partner' : 'Save Partner'}
                                                            </button>
                                                            {editingPartnerIdx !== null && (
                                                                <button type="button"
                                                                    onClick={() => { setCurrentPartner({ ...EMPTY_PARTNER }); setEditingPartnerIdx(null); setPartnerErrors([]); }}
                                                                    className="h-[42px] px-4 text-black/50 text-[12px] font-medium rounded-[10px] border border-black/10 hover:bg-black/5 transition-all duration-200">
                                                                    Cancel
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* SUBMIT */}
                                    <button
                                        type="submit"
                                        className="w-full h-[56px] bg-[#1e1e1e] text-white text-[14px] sm:text-[15px]
                                                 font-semibold tracking-[-0.01em] rounded-[12px] hover:bg-black transition-all duration-200
                                                 focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-0 mt-8 active:scale-[0.98] group"
                                    >
                                        <span className="group-active:scale-95 inline-block transition-transform duration-200">
                                            {wantMatchmaking ? 'Continue with Matchmaking' : 'Submit'}
                                        </span>
                                    </button>

                                    <p className="text-[11px] sm:text-[12px] text-black/40 text-center tracking-[-0.01em] pt-1">
                                        By clicking this button you consent &amp; agree to our terms.
                                    </p>
                                </form>
                            </div>
                        </div>

                        {/* IMAGE SECTION */}
                        <div className="hidden lg:flex justify-center items-center sticky top-32">
                            <img src="/images/onboarding/astrology-hero.png" alt="Spiritual guide in traditional attire"
                                className="w-full max-w-[500px] object-contain" loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>

            {/* CAMERA MODALS */}
            {isCameraOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-[500px]">
                        <div className="mb-3 text-center">
                            <p className="text-[13px] text-white/80 font-medium">Position your face in the center</p>
                            <p className="text-[10px] text-white/50 mt-1">Ensure forehead and hair are visible</p>
                        </div>
                        <div className="relative rounded-[16px] overflow-hidden">
                            <video ref={videoRef} autoPlay playsInline className="w-full" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-[200px] h-[260px] border-2 border-white/30 rounded-[50%]" />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button type="button" onClick={capturePhoto} className="flex-1 py-3 bg-white text-black rounded-[10px] text-[14px] font-semibold hover:bg-white/90 transition-all">Capture</button>
                            <button type="button" onClick={stopCamera} className="flex-1 py-3 bg-white/10 text-white border border-white/20 rounded-[10px] text-[14px] font-semibold hover:bg-white/20 transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {isPartnerCameraOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-[500px]">
                        <div className="mb-3 text-center">
                            <p className="text-[13px] text-white/80 font-medium">Capture partner's face</p>
                        </div>
                        <div className="relative rounded-[16px] overflow-hidden">
                            <video ref={partnerVideoRef} autoPlay playsInline className="w-full" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-[200px] h-[260px] border-2 border-white/30 rounded-[50%]" />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button type="button" onClick={capturePartnerPhoto} className="flex-1 py-3 bg-white text-black rounded-[10px] text-[14px] font-semibold hover:bg-white/90 transition-all">Capture</button>
                            <button type="button" onClick={stopPartnerCamera} className="flex-1 py-3 bg-white/10 text-white border border-white/20 rounded-[10px] text-[14px] font-semibold hover:bg-white/20 transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
            <canvas ref={partnerCanvasRef} className="hidden" />
        </div>
    );
}
