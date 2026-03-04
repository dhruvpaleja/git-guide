import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/layout/Navigation';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, IdCard, FileText, Globe } from 'lucide-react';

interface Step1Data {
  name: string;
  email: string;
  password: string;
  phone: string;
  specialization: string;
  signupAs: 'therapist' | 'astrologer';
}

interface Step2Data {
  kycDocument: 'national_id' | 'voter_id' | 'passport' | '';
  highSchool: string;
  license: string;
  kycFile?: File | null;
}

interface Step3Data {
  bio: string;
  languages: string;
  pricing: string;
  avatarFile?: File | null;
}

// common input style used across forms
const inputCls = "w-full h-14 rounded-full border border-gray-200 bg-gray-50 px-4 text-black placeholder-gray-400";

export default function PractitionerOnboardingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const initialStep = parseInt(searchParams.get('step') || '1', 10);
  const initialRole = (searchParams.get('role') || 'therapist') as 'therapist' | 'astrologer';

  const [step, setStep] = useState(initialStep);

  // Initialize with user data if available (lazy initialization pattern)
  const getInitialData1 = (): Step1Data => ({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    phone: '',
    specialization: '',
    signupAs: initialRole,
  });

  const [data1, setData1] = useState<Step1Data>(getInitialData1);
  const [data2, setData2] = useState<Step2Data>({ kycDocument: '', highSchool: '', license: '', kycFile: null });
  const [data3, setData3] = useState<Step3Data>({ bio: '', languages: '', pricing: '' });

  // keep search params in sync for deep-linking if step or signupAs changes
  useEffect(() => {
    const params: Record<string,string> = { step: String(step) };
    if (data1.signupAs) params.role = data1.signupAs;
    const query = new URLSearchParams(params).toString();
    navigate(`/practitioner-onboarding?${query}`, { replace: true });
  }, [step, data1.signupAs, navigate]);

  const { signup } = useAuth();
  const [signupError, setSignupError] = useState<string | null>(null);

  const handleNext1 = async (values: Step1Data) => {
    // perform signup for practitioner/astrologer
    setSignupError(null);
    const response = await signup({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.signupAs,
    });
    if (!response.success) {
      setSignupError(response.error || 'Unable to create account');
      return;
    }
    setData1(values);
    setStep(2);
  };
  const handleNext2 = (values: Step2Data) => {
    setData2(values);
    setStep(3);
  };
  const handleFinish = (values: Step3Data) => {
    setData3(values);
    // here we would normally submit to server or update profile
    console.log('practitioner onboarding complete', { ...data1, ...data2, ...values });
    // mark onboarding complete; redirect to appropriate dashboard
    if (data1.signupAs === 'astrologer') {
      navigate('/astrology');
    } else {
      navigate('/practitioner');
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      <Navigation />
      <main className="pt-20 pb-20 px-4 sm:px-6 lg:px-10">
        {/* page header / intro */}
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">Partner with Soul Yatri.</h1>
          <p className="mt-2 text-gray-600 text-sm">
            Join a purpose-driven wellness platform designed to support your practice, amplify your impact,
            and connect you with real seekers.
          </p>
          <div className="mt-6">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-black transition-width duration-500 ease-in-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600 text-left">
              {step === 1 && 'Step 1 - Information'}
              {step === 2 && 'Step 2 - Know Your Customer'}
              {step === 3 && 'Step 3 - Profile'}
            </div>
          </div>
        </div>

          {/* form container */}
          <div className="mt-10">
            {step === 1 && (
              <>
                {signupError && (
                <div className="max-w-3xl mx-auto mb-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-700">
                  {signupError}
                </div>
              )}
              <Step1Form initial={data1} onNext={handleNext1} />
            </>
          )}
          {step === 2 && (
            <Step2Form initial={data2} onNext={handleNext2} onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <Step3Form initial={data3} onNext={handleFinish} onBack={() => setStep(2)} />
          )}
        </div>

        {/* down arrow */}
        <div className="mt-10 flex justify-center">
          <ChevronDown size={24} className="text-gray-400 animate-bounce" />
        </div>
      </main>
    </div>
  );
}

function Step1Form({ initial, onNext }: { initial: Step1Data; onNext: (v: Step1Data) => void }) {
  const [form, setForm] = useState<Step1Data>(initial);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // validate
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.phone.trim() ||
      !form.specialization.trim()
    ) {
      setError('Please fill all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Email must be a valid address.');
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }
    setError(null);
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-center">Step 1 - Information</h2>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Enter Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex. Shweta Basu..."
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Enter Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Ex. shewtabasuofficial@gmail.com..."
              type="email"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Create Password</label>
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              placeholder="Choose a secure password"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Enter Phone Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">+91</span>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
                placeholder="Ex. 8993454544"
                className={`${inputCls} pl-14`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Sign Up As</label>
            <select
              value={form.signupAs}
              onChange={(e) =>
                setForm({ ...form, signupAs: e.target.value as 'therapist' | 'astrologer' })
              }
              className={`${inputCls} appearance-none bg-gray-50`}
            >
              <option value="therapist">Therapist</option>
              <option value="astrologer">Astrologer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Specialization</label>
            <input
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              placeholder={
                form.signupAs === 'astrologer'
                  ? 'Ex. Vedic, Western, Numerology...'
                  : 'Ex. Counsellor, Therapist, Psychologist...'
              }
              className={inputCls}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-black text-white px-8 py-3 rounded-full shadow hover:bg-gray-900"
          >
            Submit & Next Step
          </button>
        </div>
      </div>
    </form>
  );
}

function Step2Form({ initial, onNext, onBack }: { initial: Step2Data; onNext: (v: Step2Data) => void; onBack: () => void }) {
  const [form, setForm] = useState<Step2Data>(initial);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDocClick = (doc: Step2Data['kycDocument']) => {
    setForm({ ...form, kycDocument: doc });
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 200 * 1024 * 1024) {
      setError('File must be smaller than 200MB');
      return;
    }
    setError(null);
    setForm({ ...form, kycFile: f });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // validation
    if (!form.kycDocument) {
      setError('Select a KYC document and upload file');
      return;
    }
    if (!form.kycFile) {
      setError('Please upload the selected document');
      return;
    }
    if (!form.highSchool.trim() || !form.license.trim()) {
      setError('Please fill all fields.');
      return;
    }
    setError(null);
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-center">Step 2 - Know Your Customer</h2>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              KYC Documents <span className="text-xs text-gray-400">(max 200MB)</span>
            </p>
            <div className="flex items-center gap-4">
              {(['national_id', 'voter_id', 'passport'] as Step2Data['kycDocument'][]).map((doc) => {
                const icon =
                  doc === 'national_id' ? (
                    <IdCard size={24} className="text-gray-400 mb-1" />
                  ) : doc === 'voter_id' ? (
                    <FileText size={24} className="text-gray-400 mb-1" />
                  ) : (
                    <Globe size={24} className="text-gray-400 mb-1" />
                  );
                return (
                  <div
                    key={doc}
                    onClick={() => handleDocClick(doc)}
                    className={`w-28 h-28 rounded-2xl border flex flex-col items-center justify-center cursor-pointer p-2 ${
                      form.kycDocument === doc ? 'border-black' : 'border-gray-300'
                    }`}
                  >
                    {icon}
                    <span className="text-xs text-gray-500 text-center">
                      {doc === 'national_id'
                        ? 'National ID Card'
                        : doc === 'voter_id'
                        ? 'Voter ID Card'
                        : 'Passport'}
                    </span>
                    {form.kycDocument === doc && form.kycFile && (
                      <span className="mt-1 text-xs text-green-600 truncate">
                        {form.kycFile.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">What's your High School Degree?</label>
              <input
                value={form.highSchool}
                onChange={(e) => setForm({ ...form, highSchool: e.target.value })}
                placeholder="Ex. Psychology & Therapy Expert Degree."
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Do you have a License of your Profession?</label>
              <input
                value={form.license}
                onChange={(e) => setForm({ ...form, license: e.target.value })}
                placeholder="Ex. Counsellor, Therapist, Psychologist..."
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button type="button" onClick={onBack} className="text-gray-600 hover:underline">
            Back
          </button>
          <button type="submit" className="bg-black text-white px-8 py-3 rounded-full shadow hover:bg-gray-900">
            Submit & Next Step
          </button>
        </div>
      </div>
    </form>
  );
}

function Step3Form({ initial, onNext, onBack }: { initial: Step3Data; onNext: (v: Step3Data) => void; onBack: () => void }) {
  const [form, setForm] = useState<Step3Data>(initial);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => fileRef.current?.click();
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setForm({ ...form, avatarFile: f });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-center">Step 3 - Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* avatar upload */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          <label className="relative" onClick={handleAvatarClick}>
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer overflow-hidden">
              {form.avatarFile ? (
                <img
                  src={URL.createObjectURL(form.avatarFile)}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.717 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                setForm((prev) => ({ ...prev, avatarFile: file }));
              }}
            />
          </label>
          <span className="text-sm text-gray-600">Pick Your Image</span>
        </div>
        <div className="space-y-4">
          <label className="block text-sm text-gray-600">Bio</label>
          <textarea
            value={form.bio}
            onChange={e => setForm({ ...form, bio: e.target.value })}
            rows={5}
            placeholder="Ex. Hi there! I'm Sakshi Sharma. I'm a counsellor and mind psychologist who helps..."
            className="w-full rounded-[32px] border border-gray-200 bg-gray-50 px-4 py-2 text-black placeholder-gray-400"
          />
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Which Languages you Speak?</label>
            <input
              value={form.languages}
              onChange={e => setForm({ ...form, languages: e.target.value })}
              placeholder="Ex. English, Hindi, Marathi, Tamil, Telugu..."
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">What's your Pricing Per Sessions?</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                value={form.pricing}
                onChange={e => setForm({ ...form, pricing: e.target.value })}
                placeholder="Ex. 699 - 900"
                className={`${inputCls} pl-12`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="text-gray-600 hover:underline">
          Back
        </button>
        <button type="submit" className="bg-black text-white px-8 py-3 rounded-full shadow hover:bg-gray-900">
          Finish
        </button>
      </div>
      </div> {/* wrapper end */}
    </form>
  );
}