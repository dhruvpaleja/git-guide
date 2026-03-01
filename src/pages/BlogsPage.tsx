import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  time: string;
  image: string;
  category: string;
  featured?: boolean;
  searchContent?: string;
};

const categories = ['All', 'Mental Health', 'Self-Help', 'Astrology', 'Relationship', 'Community'];

const posts: BlogPost[] = [
  {
    id: '1',
    title: 'The Quiet Weight of Everyday Anxiety.',
    excerpt: 'Understanding how daily stress silently affects our mental well-being.',
    author: 'Dr. Ananya Mehra',
    time: '2 days ago',
    image: '/images/blogs/blogs-card-01.jpg',
    category: 'Mental Health',
    featured: true,
    searchContent: 'anxiety stress mental health wellbeing daily pressure',
  },
  {
    id: '2',
    title: 'Healing Is Not Linear.',
    excerpt: 'Why emotional recovery takes time, patience, and self-compassion.',
    author: 'Rohan Malhotra',
    time: '1 day ago',
    image: '/images/blogs/blogs-card-02.jpg',
    category: 'Mental Health',
    searchContent: 'healing recovery emotional patience self-compassion',
  },
  {
    id: '3',
    title: 'When Rest Feels Like Guilt.',
    excerpt: 'Exploring burnout culture and the importance of mental rest.',
    author: 'Neha Kulkarni',
    time: '2 days ago',
    image: '/images/blogs/blogs-card-03.jpg',
    category: 'Mental Health',
    searchContent: 'rest guilt burnout mental fatigue self-care',
  },
  {
    id: '4',
    title: 'Becoming Better Without Becoming Hard.',
    excerpt: 'Growth doesn\'t require losing your softness or empathy.',
    author: 'Arjun Verma',
    time: '1 day ago',
    image: '/images/blogs/blogs-card-04.jpg',
    category: 'Self-Help',
    searchContent: 'growth empathy personal development softness strength',
  },
  {
    id: '5',
    title: 'Small Habits That Change Your Mindset.',
    excerpt: 'Simple daily practices that create long-term personal change.',
    author: 'Pooja Nair',
    time: '4 hrs ago',
    image: '/images/blogs/blogs-card-05.jpg',
    category: 'Self-Help',
    searchContent: 'habits mindset daily practices personal change transformation',
  },
  {
    id: '6',
    title: 'Learning to Choose Yourself.',
    excerpt: 'A guide to self-worth, boundaries, and inner confidence.',
    author: 'Kunal Shah',
    time: '3 hrs ago',
    image: '/images/blogs/blogs-card-09.jpg',
    category: 'Self-Help',
    searchContent: 'self-worth boundaries confidence inner strength self-love',
  },
  {
    id: '7',
    title: 'What Your Moon Sign Says About Your Emotions.',
    excerpt: 'Understanding emotional patterns through lunar astrology.',
    author: 'Astrologer Kavya Joshi',
    time: '5 days ago',
    image: '/images/blogs/blogs-card-10.jpg',
    category: 'Astrology',
    searchContent: 'moon sign astrology emotions lunar zodiac patterns',
  },
  {
    id: '8',
    title: 'Mercury Retrograde Isn\'t Always Bad.',
    excerpt: 'Reframing fear around retrogrades and cosmic slowdowns.',
    author: 'Aman Trivedi',
    time: '3 days ago',
    image: '/images/blogs/blogs-card-11.png',
    category: 'Astrology',
    searchContent: 'mercury retrograde cosmic astrology planetary influence',
  },
  {
    id: '9',
    title: 'Birth Charts as a Tool for Self-Awareness.',
    excerpt: 'Using astrology to better understand your personality and path.',
    author: 'Ritu Sharma',
    time: '5 days ago',
    image: '/images/blogs/blogs-card-12.jpg',
    category: 'Astrology',
    searchContent: 'birth chart astrology self-awareness personality destiny',
  },
  {
    id: '10',
    title: 'Healthy Love Begins With Boundaries.',
    excerpt: 'Why emotional limits strengthen, not weaken, relationships.',
    author: 'Simran Kaur',
    time: '2 days ago',
    image: '/images/blogs/blogs-card-06.jpg',
    category: 'Relationship',
    searchContent: 'love boundaries relationship emotional healthy connection',
  },
  {
    id: '11',
    title: 'Communication Is More Than Words.',
    excerpt: 'How listening and presence shape meaningful connections.',
    author: 'Rahul Iyer',
    time: '7 days ago',
    image: '/images/blogs/blogs-card-07.jpg',
    category: 'Relationship',
    searchContent: 'communication listening relationships presence connection meaningful',
  },
  {
    id: '12',
    title: 'Attachment Styles and Modern Love.',
    excerpt: 'Understanding how past experiences affect present relationships.',
    author: 'Dr. Sneha Patil',
    time: '1 day ago',
    image: '/images/blogs/blogs-card-08.jpg',
    category: 'Relationship',
    searchContent: 'attachment style relationships love psychology patterns',
  },
  {
    id: '13',
    title: 'Why Safe Spaces Matter More Than Ever.',
    excerpt: 'The role of supportive communities in emotional healing.',
    author: 'Ayesha Khan',
    time: '6 days ago',
    image: '/images/blogs/blogs-card-13.jpg',
    category: 'Community',
    searchContent: 'safe spaces community support healing trust belonging',
  },
  {
    id: '14',
    title: 'Healing Together, Not Alone.',
    excerpt: 'How shared stories create strength and belonging.',
    author: 'Mohit Deshpande',
    time: '3 days ago',
    image: '/images/blogs/blogs-card-14.jpg',
    category: 'Community',
    searchContent: 'healing community shared stories connection strength belonging',
  },
  {
    id: '15',
    title: 'Building Digital Communities With Heart.',
    excerpt: 'Creating online spaces rooted in empathy and trust.',
    author: 'Tanya Bose',
    time: '4 days ago',
    image: '/images/blogs/blogs-card-15.jpg',
    category: 'Community',
    searchContent: 'digital community empathy trust online spaces heart',
  },
];

function BlogCard({ post }: { post: BlogPost }) {
  const navigate = useNavigate();
  const dark = Boolean(post.featured);

  return (
    <button
      onClick={() => navigate(`/blog/${post.id}`)}
      className={`group h-full overflow-hidden rounded-[25px] border overflow-hidden text-left p-[15px] transition-all duration-300 ${
        dark
          ? 'border-white bg-[#080808] text-white shadow-[0_10px_60px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_80px_rgba(0,0,0,0.4)]'
          : 'border-black/20 bg-white text-black hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)]'
      }`}
    >
      <div className="relative h-[200px] overflow-hidden rounded-[22px] border border-black/20 sm:h-[225px]">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${
          dark ? 'bg-white text-black' : 'bg-black/10 text-black/70'
        }`}>
          {post.category}
        </div>
      </div>

      <div className="mt-[20px] sm:mt-[30px]">
        <h3 className="text-[18px] leading-[24px] tracking-[-0.18px] font-semibold sm:text-[24px] sm:leading-[30px] sm:tracking-[-0.24px]">
          {post.title}
        </h3>
        <p className={`mt-3 text-[14px] leading-[22px] tracking-[-0.14px] sm:mt-5 sm:text-[16px] sm:leading-[30px] sm:tracking-[-0.16px] ${
          dark ? 'text-white/70' : 'text-black/50'
        }`}>
          {post.excerpt}
        </p>
      </div>

      <div className="mt-4 flex flex-col items-start justify-between gap-3 sm:mt-5 sm:flex-row sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className={`flex h-[40px] w-[40px] items-center justify-center rounded-full sm:h-[50px] sm:w-[50px] ${
            dark ? 'bg-white' : 'bg-black'
          }`}>
            <img
              src={dark ? '/images/blogs/blogs-author-icon-light.png' : '/images/blogs/blogs-author-icon-dark.png'}
              alt="Author"
              className="h-[20px] w-[20px] sm:h-[25px] sm:w-[25px]"
            />
          </span>
          <span className="text-[13px] font-semibold tracking-[-0.13px] sm:text-[16px] sm:tracking-[-0.16px]">
            {post.author}
          </span>
        </div>
        <span className={`text-[12px] tracking-[-0.12px] sm:text-[14px] sm:tracking-[-0.14px] ${
          dark ? 'text-white/60' : 'text-black/50'
        }`}>
          {post.time}
        </span>
      </div>
    </button>
  );
}

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter blogs based on search term and category
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const categoryMatch =
        selectedCategory === 'All' || post.category === selectedCategory;

      const searchMatch =
        searchTerm === '' ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.searchContent && post.searchContent.toLowerCase().includes(searchTerm.toLowerCase()));

      return categoryMatch && searchMatch;
    });
  }, [searchTerm, selectedCategory]);

  // Separate featured and regular posts
  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <>
      {/* Hero Section */}
      <section className="relative mx-auto w-full max-w-[1440px] overflow-hidden px-4 pb-12 pt-[100px] sm:px-6 sm:pb-16 sm:pt-[120px] lg:px-[77px] lg:pb-20 lg:pt-[140px]">
        {/* Background ellipse */}
        <img
          src="/images/blogs/blogs-grey-ellipse.svg"
          alt=""
          className="pointer-events-none absolute left-0 top-[25px] w-full max-w-none"
        />

        {/* Title Section */}
        <div className="relative z-10 text-center">
          <h1 className="text-[28px] font-semibold tracking-[-0.28px] sm:text-[32px] sm:tracking-[-0.32px]">
            The Journey Within
          </h1>
          <p className="mt-1 text-[18px] tracking-[-0.18px] text-black/50 sm:mt-2 sm:text-[24px] sm:tracking-[-0.24px]">
            Our Blog
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative z-10 mx-auto mt-8 flex h-[50px] w-full items-center rounded-[25px] border border-black/20 bg-white px-4 sm:mt-10 sm:h-[60px] sm:max-w-[395px] sm:px-[30px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-[14px] tracking-[-0.14px] placeholder:text-black/50 focus:outline-none sm:text-[16px] sm:tracking-[-0.16px]"
            placeholder="Search what you want..."
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="ml-2 p-1 hover:bg-black/5 rounded transition-colors"
              aria-label="Clear search"
            >
              <X size={16} className="text-black/50" />
            </button>
          )}
          {!searchTerm && <Search size={16} className="text-black/50" />}
        </div>

        {/* Category Filter Section */}
        <div className="relative z-10 mt-10 sm:mt-12 lg:mt-14">
          <h3 className="mb-4 text-center text-[14px] font-semibold tracking-[-0.14px] text-black/70 sm:text-[16px] sm:tracking-[-0.16px]">
            Filter by Category
          </h3>
          <div className="mx-auto flex w-full flex-wrap items-center justify-center gap-2 rounded-[25px] border border-black/20 bg-white p-2 sm:p-[5px] sm:max-w-[715px]">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`h-[40px] rounded-[20px] px-3 text-[12px] font-medium tracking-[-0.12px] transition-all duration-300 sm:h-[50px] sm:px-4 sm:text-[14px] sm:tracking-[-0.14px] ${
                  selectedCategory === category
                    ? 'w-auto border border-white bg-[#080808] text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)]'
                    : 'w-auto bg-white text-black/50 hover:bg-black/5'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="relative z-10 mt-10 text-center">
          <p className="text-[13px] tracking-[-0.13px] text-black/60 sm:text-[14px] sm:tracking-[-0.14px]">
            {filteredPosts.length === 0
              ? 'No blogs found. Try a different search or category.'
              : `Found ${filteredPosts.length} blog${filteredPosts.length !== 1 ? 's' : ''}`}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Blogs Grid */}
        <div className="relative z-10 mt-10 sm:mt-12 lg:mt-14">
          {filteredPosts.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-black/50">No blogs match your search or filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="mt-4 rounded-lg bg-black px-6 py-2 text-white hover:bg-black/90 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Section */}
              {featuredPosts.length > 0 && (
                <div>
                  <h2 className="mb-6 text-[16px] font-semibold tracking-[-0.16px] text-black/70 sm:mb-8 sm:text-[18px] sm:tracking-[-0.18px]">
                    Featured
                  </h2>
                  <div className="grid grid-cols-1 gap-6 sm:gap-[30px]">
                    {featuredPosts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Posts Grid */}
              {regularPosts.length > 0 && (
                <div>
                  {featuredPosts.length > 0 && (
                    <h2 className="mb-6 text-[16px] font-semibold tracking-[-0.16px] text-black/70 sm:mb-8 sm:text-[18px] sm:tracking-[-0.18px]">
                      Latest
                    </h2>
                  )}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-[30px] lg:grid-cols-3">
                    {regularPosts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
