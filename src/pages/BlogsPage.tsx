import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

type BlogPost = {
  title: string;
  excerpt: string;
  author: string;
  time: string;
  image: string;
  featured?: boolean;
};

const categories = ['All', 'Mental Health', 'Self-Help', 'Astrology', 'Relationship', 'Community'];

const posts: BlogPost[] = [
  {
    title: 'The Quiet Weight of Everyday Anxiety.',
    excerpt: 'Understanding how daily stress silently affects our mental well-being.',
    author: 'Dr. Ananya Mehra',
    time: '2 days ago',
    image: '/images/blogs/blogs-card-01.jpg',
    featured: true,
  },
  {
    title: 'Healing Is Not Linear.',
    excerpt: 'Why emotional recovery takes time, patience, and self-compassion.',
    author: 'Rohan Malhotra',
    time: '1 day ago',
    image: '/images/blogs/blogs-card-02.jpg',
  },
  {
    title: 'When Rest Feels Like Guilt.',
    excerpt: 'Exploring burnout culture and the importance of mental rest.',
    author: 'Neha Kulkarni',
    time: '2 days ago',
    image: '/images/blogs/blogs-card-03.jpg',
  },
  {
    title: 'Becoming Better Without Becoming Hard.',
    excerpt: 'Growth doesn’t require losing your softness or empathy.',
    author: 'Arjun Verma',
    time: '1 day ago',
    image: '/images/blogs/blogs-card-04.jpg',
  },
  {
    title: 'Small Habits That Change Your Mindset.',
    excerpt: 'Simple daily practices that create long-term personal change.',
    author: 'Pooja Nair',
    time: '4 hrs ago',
    image: '/images/blogs/blogs-card-05.jpg',
  },
  {
    title: 'Learning to Choose Yourself.',
    excerpt: 'A guide to self-worth, boundaries, and inner confidence.',
    author: 'Kunal Shah',
    time: '3 hrs ago',
    image: '/images/blogs/blogs-card-09.jpg',
  },
  {
    title: 'What Your Moon Sign Says About Your Emotions.',
    excerpt: 'Understanding emotional patterns through lunar astrology.',
    author: 'Astrologer Kavya Joshi',
    time: '5 days ago',
    image: '/images/blogs/blogs-card-10.jpg',
  },
  {
    title: 'Mercury Retrograde Isn’t Always Bad.',
    excerpt: 'Reframing fear around retrogrades and cosmic slowdowns.',
    author: 'Aman Trivedi',
    time: '3 days ago',
    image: '/images/blogs/blogs-card-11.png',
  },
  {
    title: 'Birth Charts as a Tool for Self-Awareness.',
    excerpt: 'Using astrology to better understand your personality and path.',
    author: 'Ritu Sharma',
    time: '5 days ago',
    image: '/images/blogs/blogs-card-12.jpg',
  },
  {
    title: 'Healthy Love Begins With Boundaries.',
    excerpt: 'Why emotional limits strengthen, not weaken, relationships.',
    author: 'Simran Kaur',
    time: '2 days ago',
    image: '/images/blogs/blogs-card-06.jpg',
  },
  {
    title: 'Communication Is More Than Words.',
    excerpt: 'How listening and presence shape meaningful connections.',
    author: 'Rahul Iyer',
    time: '7 days ago',
    image: '/images/blogs/blogs-card-07.jpg',
  },
  {
    title: 'Attachment Styles and Modern Love.',
    excerpt: 'Understanding how past experiences affect present relationships.',
    author: 'Dr. Sneha Patil',
    time: '1 day ago',
    image: '/images/blogs/blogs-card-08.jpg',
  },
  {
    title: 'Why Safe Spaces Matter More Than Ever.',
    excerpt: 'The role of supportive communities in emotional healing.',
    author: 'Ayesha Khan',
    time: '6 days ago',
    image: '/images/blogs/blogs-card-13.jpg',
  },
  {
    title: 'Healing Together, Not Alone.',
    excerpt: 'How shared stories create strength and belonging.',
    author: 'Mohit Deshpande',
    time: '3 days ago',
    image: '/images/blogs/blogs-card-14.jpg',
  },
  {
    title: 'Building Digital Communities With Heart.',
    excerpt: 'Creating online spaces rooted in empathy and trust.',
    author: 'Tanya Bose',
    time: '4 days ago',
    image: '/images/blogs/blogs-card-15.jpg',
  },
];

function BlogCard({ post }: { post: BlogPost }) {
  const dark = Boolean(post.featured);

  return (
    <article
      className={`h-full rounded-[25px] border p-[15px] ${dark
        ? 'border-white bg-[#080808] text-white shadow-[0_10px_60px_rgba(0,0,0,0.3)]'
        : 'border-black/20 bg-white text-black'
        }`}
    >
      <div className="h-[225px] overflow-hidden rounded-[22px] border border-black/20">
        <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
      </div>

      <div className="mt-[30px]">
        <h3 className="text-[24px] font-semibold leading-[30px] tracking-[-0.24px]">{post.title}</h3>
        <p className={`mt-5 text-[16px] leading-[30px] tracking-[-0.16px] ${dark ? 'text-white/80' : 'text-black/50'}`}>{post.excerpt}</p>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`flex h-[50px] w-[50px] items-center justify-center rounded-full ${dark ? 'bg-white' : 'bg-black'}`}>
            <img
              src={dark ? '/images/blogs/blogs-author-icon-light.png' : '/images/blogs/blogs-author-icon-dark.png'}
              alt="Author"
              className="h-[25px] w-[25px]"
            />
          </span>
          <span className="text-[16px] font-semibold tracking-[-0.16px]">{post.author}</span>
        </div>
        <span className={`text-[14px] tracking-[-0.14px] ${dark ? 'text-white' : 'text-black/50'}`}>{post.time}</span>
      </div>
    </article>
  );
}

export default function BlogsPage() {
  const sections = [
    { title: 'Top Picks', slice: [0, 3] },
    { title: 'Self Help', slice: [3, 6] },
    { title: 'Astrology', slice: [6, 9] },
    { title: 'Relationships', slice: [9, 12] },
    { title: 'Community', slice: [12, 15] },
  ] as const;

  return (
    <div className="w-full bg-white text-black">
      <section className="relative mx-auto w-full max-w-[1440px] overflow-hidden px-6 pb-20 pt-[60px] sm:px-10 lg:px-[77px]">
        <img src="/images/blogs/blogs-grey-ellipse.svg" alt="" className="pointer-events-none absolute left-0 top-[25px] w-full max-w-none" />

        <img src="/images/blogs/blogs-header-logo.png" alt="Soul Yatri" className="relative z-10 mx-auto h-[51px] w-[60px] object-contain" />

        <nav className="relative z-10 mx-auto mt-10 flex h-[60px] w-full max-w-[726px] items-center justify-center gap-6 rounded-[25px] text-[14px] tracking-[-0.14px] sm:gap-10">
          <Link to="/home" className="text-black/50">Home</Link>
          <a href="#" className="text-black/50">About Soul Yatri</a>
          <span className="font-semibold text-black">Blogs</span>
          <a href="#" className="text-black/50">Business</a>
          <Link to="/login" className="text-black/50">Login</Link>
          <Link to="/signup" className="text-black/50">Create Account</Link>
        </nav>

        <div className="relative z-10 mt-16 text-center">
          <h1 className="text-[32px] font-semibold tracking-[-0.32px]">The Journey Within</h1>
          <p className="mt-2 text-[24px] tracking-[-0.24px] text-black/50">Our Blog</p>
        </div>

        <div className="relative z-10 mx-auto mt-14 flex h-[60px] w-full max-w-[395px] items-center rounded-[25px] border border-black/20 bg-white px-[30px]">
          <input className="w-full bg-transparent text-[16px] tracking-[-0.16px] placeholder:text-black/50 focus:outline-none" placeholder="Search what you want..." />
          <Search size={16} className="text-black/50" />
        </div>

        <div className="relative z-10 mt-20 text-center text-[16px] font-semibold tracking-[-0.16px]">Top Picks</div>

        <div className="relative z-10 mx-auto mt-8 flex w-full max-w-[715px] flex-wrap items-center justify-center gap-2 rounded-[25px] border border-black/20 p-[5px]">
          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={`h-[50px] rounded-[22px] px-4 text-[14px] tracking-[-0.14px] ${index === 0 ? 'w-[80px] border border-white bg-[#080808] font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)]' : 'w-[120px] bg-white text-black/50'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative z-10 mt-[105px] space-y-[105px]">
          {sections.map((section) => (
            <section key={section.title}>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-[-0.2px] text-black/70">{section.title}</h2>
                <button type="button" className="text-[14px] text-black/50">View All</button>
              </div>
              <div className="grid grid-cols-1 gap-[30px] lg:grid-cols-3">
                {posts.slice(section.slice[0], section.slice[1]).map((post) => (
                  <BlogCard key={post.title} post={post} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <footer className="mx-auto w-full max-w-[1440px] rounded-t-[50px] bg-black px-6 pb-9 pt-20 text-white sm:px-10 lg:px-[77px]">
        <div className="border-t border-white/20 pt-20">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:gap-8">
            <div className="max-w-[699px]">
              <div className="mb-6 flex items-center gap-6 text-[14px]">
                <img src="/images/blogs/blogs-footer-logo.png" alt="Soul Yatri" className="h-[42px] w-[200px] object-contain" />
                <span className="hidden h-[19px] w-px bg-white/30 sm:block" />
                <Link to="/login" className="hidden sm:block">Login</Link>
                <Link to="/signup" className="hidden sm:block">Create Account</Link>
              </div>
              <p className="text-[14px] leading-[30px] tracking-[-0.14px] text-white/50">Soul Yatri blends modern psychology with cultural wisdom to offer compassionate, science-backed and culturally-sensitive mental well-being. We help you understand what&apos;s happening inside and give you practical steps—whether you prefer a therapist, a healer, or both.</p>
              <div className="mt-8 flex flex-wrap gap-[20px]">
                <input className="h-[60px] w-[340px] rounded-[25px] border border-white/20 bg-[#080808] px-[31px] text-[16px] tracking-[-0.16px] text-white placeholder:text-white/50 focus:outline-none" placeholder="Enter Email Address" />
                <button type="button" className="h-[60px] w-[220px] rounded-[25px] bg-white text-[16px] font-semibold text-black">Book A Therapist</button>
              </div>
            </div>

            <div className="space-y-4 text-right text-[14px] tracking-[-0.14px]">
              <a href="#overview" className="block">Overview</a>
              <Link to="/careers" className="block">Careers</Link>
              <Link to="/blogs" className="block font-semibold">Blog</Link>
              <a href="#b2b" className="block">B2B</a>
              <a href="#terms" className="block">Terms & Conditions</a>
              <a href="#privacy" className="block">Privacy Policy</a>
              <Link to="/contact" className="block">Contact</Link>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 text-[14px] tracking-[-0.14px] lg:flex-row lg:items-center">
            <p>© 2025 Soul Yatri Pvt. Ltd. | All Rights Reserved</p>
            <div className="flex items-center gap-4">
              <span>Follow Our Journey:</span>
              <img src="/images/blogs/blogs-social-instagram.png" alt="Instagram" className="h-[20px] w-[20px]" />
              <img src="/images/blogs/blogs-social-facebook.png" alt="Facebook" className="h-[20px] w-[20px]" />
              <img src="/images/blogs/blogs-social-linkedin.png" alt="LinkedIn" className="h-[20px] w-[20px]" />
              <img src="/images/blogs/blogs-social-twitter.png" alt="Twitter" className="h-[20px] w-[20px]" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
