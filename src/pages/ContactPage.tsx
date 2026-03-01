
export default function ContactPage() {
  return (
    <div className="w-full bg-[#f3f3f3] text-black">
      <section className="mx-auto min-h-[1510px] w-full max-w-[1440px] px-6 pb-24 pt-[120px] sm:px-10 lg:px-[82px]">

        <div className="mt-6 text-center">
          <h1 className="text-[32px] font-semibold tracking-[-0.32px] text-black">Get In Touch With Soul Yatri</h1>
          <p className="mt-4 text-[16px] tracking-[-0.16px] text-black/50">
            Fill out the form below or schedule a meeting with us at your convenience
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[500px_1fr] lg:gap-[30px]">
          <div>
            <form className="space-y-7">
              <label className="block">
                <span className="mb-3 block text-[16px] tracking-[-0.16px] text-black">Enter Full Name <span className="text-[#d93025]">*</span></span>
                <input className="h-[60px] w-full rounded-[25px] border border-black/10 bg-[#f9f9f9] px-[30px] text-[14px] tracking-[-0.14px] placeholder:text-black/50 focus:outline-none" placeholder="Ex. Dhruv Paleja" />
              </label>

              <label className="block">
                <span className="mb-3 block text-[16px] tracking-[-0.16px] text-black">Enter Mail <span className="text-[#d93025]">*</span></span>
                <input className="h-[60px] w-full rounded-[25px] border border-black/10 bg-[#f9f9f9] px-[30px] text-[14px] tracking-[-0.14px] placeholder:text-black/50 focus:outline-none" placeholder="Ex. dhruvpaleja10@hotmail.com" />
              </label>

              <label className="block">
                <span className="mb-3 block text-[16px] tracking-[-0.16px] text-black">Enter Mobile Number <span className="text-[#d93025]">*</span></span>
                <div className="flex h-[60px] items-center rounded-[25px] border border-black/10 bg-[#f9f9f9] px-[14px]">
                  <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-black/50 bg-white text-[#ff8b00]">
                    <img src="/images/contact/contact-flag-icon.png" alt="India" className="h-[16px] w-[16px] rounded-full object-cover" />
                  </span>
                  <span className="ml-3 text-[14px] font-semibold tracking-[-0.14px]">+91</span>
                  <input className="ml-4 w-full bg-transparent text-[14px] tracking-[-0.14px] placeholder:text-black/50 focus:outline-none" placeholder="88888 99999" />
                </div>
              </label>

              <label className="block">
                <span className="mb-3 block text-[16px] tracking-[-0.16px] text-black">Message you want to convey</span>
                <textarea className="h-[250px] w-full resize-none rounded-[25px] border border-black/10 bg-[#f9f9f9] px-[30px] py-[30px] text-[14px] tracking-[-0.14px] placeholder:text-black/50 focus:outline-none" placeholder="write your message..." />
              </label>

              <label className="inline-flex items-center gap-3">
                <input type="checkbox" className="h-[24px] w-[24px] rounded-[5px] border border-black/50 accent-black" />
                <span className="text-[16px] tracking-[-0.16px] text-black">
                  I agree with the <span className="underline">Terms & Conditions</span>
                </span>
              </label>

              <button type="button" className="h-[60px] w-full rounded-[25px] border border-white bg-[#080808] text-[16px] font-semibold tracking-[-0.16px] text-white">
                Send Request
              </button>
            </form>

            <h3 className="mt-12 text-[24px] font-semibold tracking-[-0.24px]">You can contact us via</h3>

            <div className="mt-8 flex flex-wrap items-center gap-7">
              <div className="flex items-center gap-4">
                <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-black/10 bg-white text-[#ea4335]">
                  <img src="/images/contact/contact-mail-icon.png" alt="Mail" className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[16px] tracking-[-0.16px]">soulyatriofficial.com</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-black/10 bg-white text-[#4caf50]">
                  <img src="/images/contact/contact-phone-icon.png" alt="Phone" className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[16px] tracking-[-0.16px]">+91 89999 99999</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-[24px] font-semibold tracking-[-0.24px]">Terms & Conditions</h2>
            <div className="mt-7 h-[750px] overflow-hidden rounded-[25px] border border-black/10 bg-white p-[30px]">
              <div className="h-full overflow-auto pr-2 text-[14px] leading-[30px] tracking-[-0.14px] text-black">
                <p className="text-[16px] font-semibold">Terms of Service – Soul Yatri</p>
                <p>&nbsp;</p>
                <p>Last Updated: <span className="font-semibold">[January 01 2026]</span></p>
                <p>Welcome to Soul Yatri, a digital platform focused on mental wellness, counselling, guided courses, astrology insights, habit-building tools, and community support. By accessing or using our website, mobile app, or services, you agree to the following Terms of Service.</p>
                <p className="font-semibold">1. Acceptance of Terms:</p>
                <p>By using Soul Yatri, you confirm that you have read, understood, and agree to these Terms. If you do not agree, please discontinue using the platform.</p>
                <p className="font-semibold">2. Services Provided:</p>
                <p>Soul Yatri offers the following services:</p>
                <ul className="list-disc pl-7">
                  <li>Mental health counselling and sessions (online/telephonic/video).</li>
                  <li>Astrology-based wellness insights and guidance.</li>
                  <li>Self-help courses, habit-building programs, and guided activities.</li>
                  <li>Wellness blogs, community engagement, and digital content.</li>
                </ul>
                <p>These services may evolve and update from time to time.</p>
                <p className="font-semibold">3. Eligibility:</p>
                <p>You must be at least 18 years old to access counselling services. Users below 18 may access general content with parental guidance.</p>
                <p className="font-semibold">4. Not a Medical Emergency Service:</p>
                <p>Soul Yatri does not provide crisis intervention or emergency medical services.</p>
                <p>If you are in danger, experiencing suicidal thoughts, or facing a medical emergency, please contact your local emergency helpline immediately.</p>
              </div>
            </div>

            <button type="button" className="mx-auto mt-[30px] block h-[60px] w-[130px] rounded-[25px] border border-white bg-[#080808] text-[16px] font-semibold tracking-[-0.16px] text-white">
              Read More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}