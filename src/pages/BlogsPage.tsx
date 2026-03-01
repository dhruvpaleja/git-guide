import { Search } from 'lucide-react';

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
    <>
      <section className="relative mx-auto w-full max-w-[1440px] overflow-hidden px-6 pb-20 pt-[140px] sm:px-10 lg:px-[77px]">
        <img src="/images/blogs/blogs-grey-ellipse.svg" alt="" className="pointer-events-none absolute left-0 top-[25px] w-full max-w-none" />

        <div className="relative z-10 text-center">
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
    </>
  );
}
