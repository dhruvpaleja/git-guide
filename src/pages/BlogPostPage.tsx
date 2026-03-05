import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  CornerUpLeft,
  Send,
} from 'lucide-react';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedDate: string;
  updatedDate?: string;
  readingTime: number;
  category: string;
  image: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
};

interface CommentAuthor {
  name: string;
  avatar: string;
}

interface Comment {
  id: string;
  author: CommentAuthor;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

// Blog posts data with full content
const blogPosts: Record<string, BlogPost> = {
  '1': {
    id: '1',
    title: 'The Quiet Weight of Everyday Anxiety.',
    excerpt: 'Understanding how daily stress silently affects our mental well-being.',
    author: {
      name: 'Dr. Ananya Mehra',
      avatar: '/images/blogs/blogs-author-icon-dark.png',
      bio: 'Clinical psychologist with 12 years of experience in mental health and wellness.',
    },
    publishedDate: '2 days ago',
    readingTime: 8,
    category: 'Mental Health',
    image: '/images/blogs/blogs-card-01.jpg',
    content: `
## The Silent Struggle

Anxiety doesn't always announce itself with loud sirens and obvious warnings. Most of the time, it creeps in quietly—like a weight slowly settling on your shoulders. You might not even notice it at first. But eventually, you realize you're carrying something heavy, something that wasn't there before.

This is everyday anxiety—the kind that millions of people experience silently, often without even naming it as anxiety.

## What is Everyday Anxiety?

Everyday anxiety is different from clinical anxiety disorders. It's the normal stress response that anyone can feel when facing something uncertain or challenging. It's the nervousness before a presentation, the worry about a relationship, the stress of deadlines, or the concern about your health.

But here's what makes it "everyday": it doesn't go away. It lingers. It becomes part of your baseline experience of the world.

### Common Signs You're Carrying This Weight:

- Constant tension in your shoulders and neck
- Difficulty sleeping or waking up too early
- Racing thoughts that won't settle
- A nagging sense of dread about things that might not even happen
- Physical restlessness—difficulty sitting still
- Overthinking small conversations or interactions
- A tendency to expect the worst outcomes
- Difficulty concentrating on one task

## Why It's So Silent

The reason everyday anxiety is so quiet is that it doesn't fit neatly into our understanding of "mental illness." People with everyday anxiety often function well on the outside. They go to work, maintain relationships, accomplish goals. No one can tell they're struggling.

This can actually make it worse. When you look fine on the outside but feel heavy on the inside, you might start to doubt yourself. "Is this even real? Am I just being dramatic? Should I just get over it?"

But it is real. And you're not dramatic for finding it exhausting.

## The Physical Toll

We often think of anxiety as a mental health issue, but it absolutely has physical consequences:

1. **Sleep Disruption**: Anxiety keeps your nervous system on high alert, making it hard to fall or stay asleep.
2. **Muscle Tension**: Your body literally braces itself against perceived threats, leading to chronic tension.
3. **Digestive Issues**: Your gut is sensitive to anxiety, which can cause stomach problems.
4. **Fatigue**: The constant vigilance and worry drain your physical energy.
5. **Weakened Immunity**: Chronic stress suppresses immune function.

## Breaking Free from the Weight

Recovery from everyday anxiety isn't about eliminating stress entirely—that's impossible. Real life will always have challenges. Recovery is about:

### 1. Naming It
The first step is recognizing that what you're experiencing is anxiety. You can't address something you don't acknowledge.

### 2. Understanding the Root
Work with a therapist to identify what specific situations or thought patterns trigger your anxiety. Often, everyday anxiety connects to deeper beliefs about safety, control, or worth.

### 3. Developing Coping Strategies
These might include:
- **Breathing exercises**: Slow, deep breathing signals safety to your nervous system
- **Mindfulness**: Training your mind to stay present rather than spiraling into "what-ifs"
- **Movement**: Exercise is one of the most effective ways to process stress
- **Connection**: Talking to people you trust can lighten the load
- **Professional help**: Therapy (especially CBT or somatic approaches) is highly effective

### 4. Challenging Your Thoughts
Anxiety often tells you stories that aren't true. A therapist can help you question these stories and develop more balanced perspectives.

### 5. Building Safety
This might mean setting boundaries, creating routines, or changing certain situations in your life that feed your anxiety.

## A Word About Time

Healing from everyday anxiety isn't linear. You might have days when the weight feels light and days when it feels crushing again. This is normal. Progress isn't about never feeling anxious—it's about carrying it more lightly and knowing you can work with it.

## You're Not Alone

Millions of people are silently carrying this weight. You might not see them, but they're there. And many of them have found their way to lighter days.

If you're experiencing everyday anxiety, consider reaching out to a mental health professional. You deserve support. You deserve to be heard. And you deserve to feel better.

The weight doesn't have to be permanent. And you don't have to carry it alone.

---

*Remember: If you're having thoughts of self-harm, please reach out to a crisis helpline immediately. In India, you can contact AASRA: 9820466726 or iCall: 9152987821.*
    `,
    likes: 1234,
    comments: 45,
    tags: ['anxiety', 'mental health', 'stress', 'wellness', 'mindfulness'],
  },
  '2': {
    id: '2',
    title: 'Healing Is Not Linear.',
    excerpt: 'Why emotional recovery takes time, patience, and self-compassion.',
    author: {
      name: 'Rohan Malhotra',
      avatar: '/images/blogs/blogs-author-icon-dark.png',
      bio: 'Psychotherapist and author specializing in trauma and emotional healing.',
    },
    publishedDate: '1 day ago',
    readingTime: 10,
    category: 'Mental Health',
    image: '/images/blogs/blogs-card-02.jpg',
    content: `
## The Myth of the Straight Line

We're taught that progress is linear. You start at point A, move steadily forward, and eventually reach point B. This works for some things—building a house, learning a skill, climbing a mountain. But it doesn't work for healing.

Healing is messy. It has ups and downs, backward slides, and unexpected turns. And that's not only normal—it's exactly how it should be.

## Why Healing Isn't Linear

When you're healing from trauma, grief, or any emotional wound, you're not just processing one thing. You're:

- Rewiring neural pathways that formed the wound
- Learning new ways to respond to triggers
- Grieving what was lost
- Integrating difficult experiences into your sense of self
- Processing emotions that might have been suppressed for years
- Building new healthy patterns while old ones still try to pull you back

This is complex work. It doesn't happen in a straight line.

## The Pattern of Healing

In reality, healing often looks more like a spiral. You might feel great for weeks, think you've moved past something, and then suddenly be triggered and feel like you're back at square one. But you're not back at square one. You're at the same issue, but at a higher level of understanding and capability.

Each time you spiral back and work through something again, you deepen your healing. You integrate the lesson more fully. You build more resilience.

## Why This Matters

If you understand that healing isn't linear, you're less likely to:

1. **Give up when you have a setback**: You won't interpret a difficult day as proof that therapy doesn't work or that you're hopeless.
2. **Judge yourself harshly**: You won't see yourself as "broken" for still struggling with something you thought you'd healed from.
3. **Rush the process**: You won't push yourself into an arbitrarily fast timeline for recovery.

## The Role of Self-Compassion

The biggest accelerator of non-linear healing is self-compassion. When you have a setback, can you:

- Treat yourself kindly instead of critically?
- Remember that this is part of the process?
- Seek support instead of isolating?
- Trust that you're still making progress?

Self-compassion isn't self-pity. It's the recognition that you're human, you're doing hard work, and you deserve kindness—especially from yourself.

## Patience as a Practice

Patience isn't passive. It's not just waiting around for healing to happen. Real patience means:

- Staying committed to your healing even when progress feels invisible
- Trying different approaches if one isn't working
- Celebrating small wins
- Trusting the process even when you can't see the destination
- Taking breaks when you need them

## Moving Forward

If you're in the healing process, remember:

- Setbacks don't erase your progress
- You don't need to heal perfectly
- Your timeline is your own
- Progress is happening even when you can't see it
- You're stronger than you know

The path to healing isn't a straight line. But every single step—forward, sideways, even backward—is moving you toward wholeness.

And that's enough.
    `,
    likes: 892,
    comments: 34,
    tags: ['healing', 'mental health', 'recovery', 'self-compassion'],
  },
  '3': {
    id: '3',
    title: 'When Rest Feels Like Guilt.',
    excerpt: 'Exploring burnout culture and the importance of mental rest.',
    author: {
      name: 'Neha Kulkarni',
      avatar: '/images/blogs/blogs-author-icon-dark.png',
      bio: 'Wellness coach and advocate for work-life balance and sustainable productivity.',
    },
    publishedDate: '2 days ago',
    readingTime: 7,
    category: 'Mental Health',
    image: '/images/blogs/blogs-card-03.jpg',
    content: `
## The Paradox of Modern Rest

You're exhausted. You know you need a break. But when you try to rest, you feel... guilty. Anxious. Like you should be doing something productive. This is the paradox of rest in modern culture.

We've created a world where rest feels like laziness, where downtime feels like failure, where the only time that "counts" is time spent producing or achieving something.

This is destroying us.

## The Culture of Hustle

For decades, we've been fed a particular narrative: success requires sacrifice. You need to hustle. You need to grind. You need to push through exhaustion. Rest is for people who don't have ambition.

But here's what we're not talking about: burnout. Creativity loss. Relationship deterioration. Health problems. Mental health crises.

The hustle culture isn't producing super-achievers. It's producing burnout.

## What Burnout Actually Is

Burnout isn't just feeling tired. It's a state of physical, emotional, and mental exhaustion caused by prolonged stress. When you're burned out, you:

- Feel cynical and detached
- Have depleted emotional reserves
- Experience decreased productivity (ironically)
- Feel hopeless about your situation
- May develop physical symptoms (headaches, insomnia, etc.)

And the insidious part? Burnout whispers to you that the solution is more hustle. You didn't achieve enough, so push harder. You're not productive enough, so work longer hours.

This is a lie.

## Why Rest Matters

Mental rest isn't indulgence. It's maintenance. It's the same reason you need to charge your phone or service your car. Without rest, you deteriorate.

When you rest:

- Your brain consolidates memories and processes emotions
- Your nervous system downregulates from high stress
- Your immune system strengthens
- Your creativity recharges
- Your capacity for connection increases

## The Guilt Component

So why does rest feel guilty? Often because:

1. **We've internalized productivity as worth**: We believe our value is tied to our output.
2. **Others' expectations**: Sometimes the guilt isn't ours—it's absorbed from people who judge us for resting.
3. **Fear of falling behind**: In a competitive world, rest feels risky.
4. **Disconnection from our needs**: We've learned to override our body's signals of exhaustion.

## Real Rest vs. Fake Rest

Not all downtime is rest. You can scroll social media for hours and not feel rested. Real rest is:

- **Active**: You choose to rest intentionally, not just collapse when you can't function
- **Restorative**: You do things that actually feel nourishing
- **Guilt-free**: You're not mentally checking a productivity checklist while "resting"
- **Varied**: Different types of rest (physical, mental, emotional, social) matter

## How to Redefine Rest

1. **Give yourself permission**: Rest isn't something you earn through hustle. It's a right and a necessity.
2. **Identify what actually restores you**: For some it's sleep, for others it's nature, creativity, connection, or solitude.
3. **Schedule it**: Rest that depends on "free time" often doesn't happen. Put it on your calendar.
4. **Protect it**: Defend your rest time like you'd defend an important meeting.
5. **Let go of guilt**: Notice the guilt, acknowledge it, and choose to rest anyway.

## A Radical Idea

What if you're not lazier when you rest—you're smarter? What if taking care of yourself isn't selfish—it's essential? What if the most productive thing you can do today is rest?

The world needs you at your best, not burnt out. And you deserve to be well more than you deserve to be productive.

So rest. Without guilt. Without condition. Because you're worth it.
    `,
    likes: 756,
    comments: 28,
    tags: ['burnout', 'rest', 'wellness', 'mental health', 'self-care'],
  },
  '4': {
    id: '4',
    title: "Becoming Better Without Becoming Hard.",
    excerpt: "Growth doesn't require losing your softness or empathy.",
    author: {
      name: 'Arjun Verma',
      avatar: '/images/blogs/blogs-author-icon-dark.png',
      bio: 'Coach and writer focused on humane leadership and growth.',
    },
    publishedDate: '1 day ago',
    readingTime: 6,
    category: 'Self-Help',
    image: '/images/blogs/blogs-card-04.jpg',
    content: `
## Strength That Keeps Its Kindness

Ambition and gentleness are not opposites. You can pursue excellence while holding clear boundaries, compassion, and humility. The pressure to be hard — to sacrifice empathy for results — is a cultural myth that too often leads to burnout and damaged relationships.

Growth that lasts comes from steady practice, not coercion. When we develop skills through curiosity and care, we create change that sustains itself.

### Practices to Grow with Kindness

- Name the outcome you want and the person you need to be to get there.
- Use feedback, not guilt, to correct course.
- Celebrate small wins and rest when momentum fades.

Small shifts compound. Soft leadership creates environments where people thrive, not just survive.
    `,
    likes: 412,
    comments: 22,
    tags: ['growth', 'leadership', 'softness', 'self-help'],
  },
  '5': {
    id: '5',
    title: 'Small Habits That Change Your Mindset.',
    excerpt: 'Simple daily practices that create long-term personal change.',
    author: {
      name: 'Pooja Nair',
      avatar: '/images/blogs/blogs-author-icon-dark.png',
      bio: 'Behavioural coach helping people design better days.',
    },
    publishedDate: '4 hrs ago',
    readingTime: 7,
    category: 'Self-Help',
    image: '/images/blogs/blogs-card-05.jpg',
    content: `
## Tiny Changes, Big Shifts

You don't need radical overhaul to see real change. Tiny habits—five minutes of focused practice, a single small boundary—compound over weeks and months.

Start with one habit that aligns with your values. Track it. Reduce friction. Keep going.

### Habit ideas

- Write one sentence of gratitude every morning.
- Replace one distracting ritual with a mindful pause.
- Spend ten minutes reading something that stretches your perspective.

Over time these simple choices move your default responses and open up new possibilities.
    `,
    likes: 289,
    comments: 8,
    tags: ['habits', 'mindset', 'self-help'],
  },
  '6': {
    id: '6',
    title: 'Learning to Choose Yourself.',
    excerpt: 'A guide to self-worth, boundaries, and inner confidence.',
    author: {
      name: 'Kunal Shah',
      avatar: '/images/blogs/blogs-author-icon-dark.png',
      bio: 'Author on personal agency and mindful decisions.',
    },
    publishedDate: '3 hrs ago',
    readingTime: 9,
    category: 'Self-Help',
    image: '/images/blogs/blogs-card-09.jpg',
    content: `
## Choosing Yourself is Permission

Choosing yourself means prioritising your clarity, health and values. It's not selfishness; it's the groundwork for offering others your best self.

Boundaries are the language you use to choose yourself. They tell others what you will and will not accept, and they protect your capacity to show up well.

Start by practicing small, kind no's. Notice the relief and the growing sense of agency.
    `,
    likes: 198,
    comments: 12,
    tags: ['self-worth', 'boundaries', 'confidence'],
  },
  '7': {
    id: '7',
    title: 'What Your Moon Sign Says About Your Emotions.',
    excerpt: 'Understanding emotional patterns through lunar astrology.',
    author: {
      name: 'Astrologer Kavya Joshi',
      avatar: '/images/blogs/blogs-author-icon-dark.png',
      bio: 'Astrologer exploring psyche through the stars.',
    },
    publishedDate: '5 days ago',
    readingTime: 6,
    category: 'Astrology',
    image: '/images/blogs/blogs-card-10.jpg',
    content: `
## The Moon and the Inner Tide

Your moon sign describes how you process feelings and what brings you comfort. Unlike the sun sign (your outward identity), the moon sits in quiet places: memories, needs, and habitual responses.

Knowing your moon helps you locate patterns and respond with more care.

### Reflection

Write down one recurring emotional reaction. Ask where it might come from, and what small practice could soothe it.
    `,
    likes: 134,
    comments: 6,
    tags: ['astrology', 'moon', 'emotions'],
  },
  '8': {
    id: '8',
    title: "Mercury Retrograde Isn't Always Bad.",
    excerpt: 'Reframing fear around retrogrades and cosmic slowdowns.',
    author: {
      name: 'Aman Trivedi',
      avatar: '/images/blogs/blogs-author-icon-dark.png',
      bio: 'Writes on practical astrology and life rhythms.',
    },
    publishedDate: '3 days ago',
    readingTime: 5,
    category: 'Astrology',
    image: '/images/blogs/blogs-card-11.png',
    content: `
## Space to Re-evaluate

Retrogrades invite review. When Mercury slows down, the world can feel glitchy—but it's also a useful pause to revisit plans, clear miscommunications, and update systems.

Use retrograde windows to tidy details, reconnect with old projects, and practise patience.
    `,
    likes: 97,
    comments: 3,
    tags: ['mercury', 'retrograde', 'astrology'],
  },
  '9': {
    id: '9',
    title: 'Birth Charts as a Tool for Self-Awareness.',
    excerpt: 'Using astrology to better understand your personality and path.',
    author: {
      name: 'Ritu Sharma',
      avatar: '/images/blogs/blogs-author-icon-dark.png',
      bio: 'Astrology teacher and counsellor.',
    },
    publishedDate: '5 days ago',
    readingTime: 8,
    category: 'Astrology',
    image: '/images/blogs/blogs-card-12.jpg',
    content: `
## A Map, Not a Script

Your birth chart is a map of potentials, tendencies and gifts. It doesn't dictate choices, but it offers language to describe recurring strengths and challenges.

Approach your chart with curiosity. Look for themes rather than deterministic statements.
    `,
    likes: 156,
    comments: 9,
    tags: ['birth-chart', 'self-awareness', 'astrology'],
  },
  '10': {
    id: '10',
    title: 'Healthy Love Begins With Boundaries.',
    excerpt: 'Why emotional limits strengthen, not weaken, relationships.',
    author: {
      name: 'Simran Kaur',
      avatar: '/images/blogs/blogs-author-icon-dark.png',
      bio: 'Couples therapist specialising in secure communication.',
    },
    publishedDate: '2 days ago',
    readingTime: 7,
    category: 'Relationship',
    image: '/images/blogs/blogs-card-06.jpg',
    content: `
## Boundaries as Care

Boundaries say what you need to feel safe. They are a gift to yourself and to your partner: clear limits reduce resentment and foster trust.

Start with one practical boundary—sleep, work hours, or digital time—and communicate it kindly.
    `,
    likes: 210,
    comments: 14,
    tags: ['boundaries', 'relationships', 'love'],
  },
  '11': {
    id: '11',
    title: 'Communication Is More Than Words.',
    excerpt: 'How listening and presence shape meaningful connections.',
    author: {
      name: 'Rahul Iyer',
      avatar: '/images/blogs/blogs-author-icon-dark.png',
      bio: 'Facilitator and trainer in communication skills.',
    },
    publishedDate: '7 days ago',
    readingTime: 6,
    category: 'Relationship',
    image: '/images/blogs/blogs-card-07.jpg',
    content: `
## Listening as a Practice

We often think of communication as talking, but listening is the active skill that creates space for real connection.

Practices like reflecting back what you heard, asking curious questions, and pausing before reacting can transform conversations.
    `,
    likes: 178,
    comments: 11,
    tags: ['communication', 'listening', 'relationships'],
  },
  '12': {
    id: '12',
    title: 'Attachment Styles and Modern Love.',
    excerpt: 'Understanding how past experiences affect present relationships.',
    author: {
      name: 'Dr. Sneha Patil',
      avatar: '/images/blogs/blogs-author-icon-dark.png',
      bio: 'Psychologist working with couples and families.',
    },
    publishedDate: '1 day ago',
    readingTime: 9,
    category: 'Relationship',
    image: '/images/blogs/blogs-card-08.jpg',
    content: `
## The Echoes of Early Bonds

Attachment styles describe our patterned ways of seeking safety in relationships. Recognising your style gives you agency to choose different responses.

Therapeutic work and practice can soften rigid patterns and open new possibilities for secure connection.
    `,
    likes: 164,
    comments: 10,
    tags: ['attachment', 'relationships', 'psychology'],
  },
  '13': {
    id: '13',
    title: 'Why Safe Spaces Matter More Than Ever.',
    excerpt: 'The role of supportive communities in emotional healing.',
    author: {
      name: 'Ayesha Khan',
      avatar: '/images/blogs/blogs-author-icon-dark.png',
      bio: 'Community organiser and wellbeing advocate.',
    },
    publishedDate: '6 days ago',
    readingTime: 8,
    category: 'Community',
    image: '/images/blogs/blogs-card-13.jpg',
    content: `
## Shelter for Growth

Safe spaces let people risk honesty without fear of shaming. They are vital for healing and for honest inquiry into difficult topics.

Creating safety is a group practice—it requires curiosity, consistent boundaries, and clear accountability.
    `,
    likes: 143,
    comments: 7,
    tags: ['community', 'safety', 'healing'],
  },
  '14': {
    id: '14',
    title: 'Healing Together, Not Alone.',
    excerpt: 'How shared stories create strength and belonging.',
    author: {
      name: 'Mohit Deshpande',
      avatar: '/images/blogs/blogs-author-icon-dark.png',
      bio: 'Social worker and storyteller.',
    },
    publishedDate: '3 days ago',
    readingTime: 7,
    category: 'Community',
    image: '/images/blogs/blogs-card-14.jpg',
    content: `
## Shared Stories, Shared Strength

When people tell their stories and are witnessed, healing accelerates. Shared narrative builds common ground and eases isolation.

Communities that listen well become reservoirs of resilience.
    `,
    likes: 120,
    comments: 5,
    tags: ['storytelling', 'community', 'resilience'],
  },
  '15': {
    id: '15',
    title: 'Building Digital Communities With Heart.',
    excerpt: 'Creating online spaces rooted in empathy and trust.',
    author: {
      name: 'Tanya Bose',
      avatar: '/images/blogs/blogs-author-icon-dark.png',
      bio: 'Designer focused on humane online experiences.',
    },
    publishedDate: '4 days ago',
    readingTime: 6,
    category: 'Community',
    image: '/images/blogs/blogs-card-15.jpg',
    content: `
## Design for Belonging

Digital spaces can either fragment or bring people together. Intentional design—clear norms, moderation, and rituals—create places where people feel safe and seen.

Start with simple norms and a welcoming onboarding that signals values.
    `,
    likes: 99,
    comments: 4,
    tags: ['digital', 'community', 'design'],
  },
};

function CommentItem({
  comment,
  onReply,
  onToggleLike,
}: {
  comment: Comment;
  onReply: (parentId: string, text: string) => void;
  onToggleLike: (id: string) => void;
}) {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <img src={comment.author.avatar} alt={comment.author.name} className="w-12 h-12 rounded-full" />
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-semibold">{comment.author.name}</span>
              <span className="text-sm text-black/50">· {comment.createdAt}</span>
            </div>
            <p className="mt-2 text-black/80">{comment.content}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleLike(comment.id)}
              className="text-sm text-black/60 hover:text-black flex items-center gap-1"
              aria-label="Like comment"
            >
              <Heart size={16} />
              <span className="text-xs">{comment.likes}</span>
            </button>
            <button
              onClick={() => setReplying((s) => !s)}
              className="text-sm text-black/60 hover:text-black flex items-center gap-1"
              aria-label="Reply to comment"
            >
              <CornerUpLeft size={16} />
            </button>
          </div>
        </div>

        {replying && (
          <div className="mt-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              className="w-full p-3 border border-black/10 rounded-md resize-none"
              placeholder={`Reply to ${comment.author.name}`}
            />
            <div className="flex items-center justify-end gap-3 mt-2">
              <button onClick={() => { setReplying(false); setReplyText(''); }} className="px-3 py-1 rounded bg-white">Cancel</button>
              <button
                onClick={() => {
                  if (!replyText.trim()) return;
                  onReply(comment.id, replyText.trim());
                  setReplyText('');
                  setReplying(false);
                }}
                className="px-3 py-1 rounded bg-black text-white flex items-center gap-2"
              >
                <Send size={14} /> Reply
              </button>
            </div>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 border-l border-black/5 pl-4 space-y-4">
            {comment.replies.map((r) => (
              <div key={r.id} className="flex gap-4">
                <img src={r.author.avatar} alt={r.author.name} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{r.author.name}</span>
                        <span className="text-sm text-black/50">· {r.createdAt}</span>
                      </div>
                      <p className="mt-2 text-black/80">{r.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => onToggleLike(r.id)} className="text-black/60 hover:text-black flex items-center gap-1">
                        <Heart size={14} />
                        <span className="text-xs">{r.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  useDocumentTitle('Blog Post');
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const commentsRef = useRef<HTMLDivElement | null>(null);

  type Comment = {
    id: string;
    parentId?: string | null;
    author: { name: string; avatar: string };
    content: string;
    createdAt: string;
    likes: number;
    replies?: Comment[];
  };

  // sample initial comments (client-side only)
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      parentId: null,
      author: { name: 'Asha Patel', avatar: '/images/blogs/blogs-author-icon-dark.png' },
      content: 'This is incredibly resonant — thank you for writing this.',
      createdAt: '2h',
      likes: 4,
      replies: [
        {
          id: 'c1r1',
          parentId: 'c1',
          author: { name: 'Rohit', avatar: '/images/blogs/blogs-author-icon-dark.png' },
          content: 'Totally — I felt the same on the second read.',
          createdAt: '1h',
          likes: 1,
        },
      ],
    },
    {
      id: 'c2',
      parentId: null,
      author: { name: 'Meera', avatar: '/images/blogs/blogs-author-icon-dark.png' },
      content: 'Can anyone recommend exercises to manage this daily?',
      createdAt: '3h',
      likes: 2,
    },
  ]);

  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // optional: focus comments when navigated with #comments
    if (window.location.hash === '#comments' && commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  if (!id || !blogPosts[id]) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Not Found</h1>
          <button
            onClick={() => navigate('/blog')}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const post = blogPosts[id];
  const contentSections = post.content.split('\n\n').filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal header (site-level) - kept but back button moved to image overlay */}
      <div className="sticky top-0 z-50 bg-white/60 backdrop-blur-sm border-b border-black/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div />
          <div />
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative w-full h-[250px] sm:h-[400px] lg:h-[500px] overflow-hidden bg-gray-200">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />

        {/* Overlay fixed back button on image (left) and action buttons (bottom-right on image) */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate('/blog')}
            aria-label="Back to articles"
            className="bg-white/90 hover:bg-white px-3 py-2 rounded-lg shadow-md flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <button
            onClick={() => setLiked(!liked)}
            aria-pressed={liked}
            aria-label={liked ? 'Unlike article' : 'Like article'}
            className={`p-3 rounded-full transition-all shadow-md flex items-center justify-center ${
              liked ? 'bg-red-100 text-red-600' : 'bg-white/90 text-black hover:bg-white'
            }`}
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => {
              // simple share placeholder (client-only)
              navigator.clipboard?.writeText(window.location.href);
              alert('Link copied to clipboard');
            }}
            className="p-3 rounded-full bg-white/90 text-black shadow-md hover:bg-white"
            aria-label="Share article"
          >
            <Share2 size={18} />
          </button>
          <button
            onClick={() => commentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="p-3 rounded-full bg-white/90 text-black shadow-md hover:bg-white"
            aria-label="Jump to comments"
          >
            <MessageCircle size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#080808] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Category Badge */}
          <div className="inline-block mb-6">
            <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg sm:text-xl text-white/70 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 border-b border-white/20">
            <div className="flex items-center gap-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-16 h-16 rounded-full bg-white p-3"
              />
              <div>
                <h3 className="font-semibold text-lg">{post.author.name}</h3>
                <p className="text-white/60 text-sm">{post.author.bio}</p>
              </div>
            </div>
            <div className="flex gap-6 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{post.readingTime} min read</span>
              </div>
              <span>{post.publishedDate}</span>
            </div>
          </div>

          {/* Engagement Stats (below hero) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  liked ? 'bg-red-100 text-red-600' : 'bg-white text-black/90 hover:bg-white/95'
                }`}
              >
                <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                <span className="font-medium">{post.likes + (liked ? 1 : 0)}</span>
              </button>

              <button
                onClick={() => commentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-black/90 hover:bg-white/95"
              >
                <MessageCircle size={18} />
                <span className="font-medium">{post.comments}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="px-3 py-2 rounded-lg bg-white text-black/90 hover:bg-white/95"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="prose prose-lg max-w-none">
            {contentSections.map((section, idx) => {
              // Check if section starts with markdown heading
              if (section.startsWith('##')) {
                const heading = section.replace('##', '').trim();
                return (
                  <h2
                    key={idx}
                    className="text-3xl font-bold mt-12 mb-6 text-black tracking-tight"
                  >
                    {heading}
                  </h2>
                );
              }

              if (section.startsWith('###')) {
                const subheading = section.replace('###', '').trim();
                return (
                  <h3
                    key={idx}
                    className="text-2xl font-semibold mt-8 mb-4 text-black/80"
                  >
                    {subheading}
                  </h3>
                );
              }

              // Check if it's a list (starts with -)
              if (section.split('\n').every(line => line.trim().startsWith('-') || line.trim() === '')) {
                const items = section
                  .split('\n')
                  .filter(line => line.trim().startsWith('-'))
                  .map(line => line.replace('-', '').trim());
                return (
                  <ul key={idx} className="list-disc list-inside space-y-3 my-6 text-black/70 text-lg leading-relaxed">
                    {items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );
              }

              // Regular paragraph
              return (
                <p
                  key={idx}
                  className="text-lg leading-relaxed text-black/70 mb-6 tracking-wide"
                >
                  {section}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="mt-12 pt-12 border-t border-black/10">
            <h4 className="font-semibold text-black mb-4">Tags</h4>
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag) => (
                <button
                  key={tag}
                  className="px-4 py-2 bg-black/5 hover:bg-black/10 text-black rounded-full text-sm font-medium transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Author Bio Card */}
          <div className="mt-16 p-8 bg-gradient-to-br from-black/5 to-black/2 rounded-2xl border border-black/10">
            <div className="flex gap-6">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-20 h-20 rounded-full bg-white p-2"
              />
              <div>
                <h4 className="text-xl font-bold text-black mb-2">{post.author.name}</h4>
                <p className="text-black/70 mb-4">{post.author.bio}</p>
                <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors font-medium">
                  Follow Author
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div ref={commentsRef} className="mt-12 pt-12 border-t border-black/10">
            <h3 className="text-2xl font-bold text-black mb-4">Comments</h3>

            <div className="mb-6">
              <label htmlFor="new-comment" className="sr-only">Add a comment</label>
              <textarea
                id="new-comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                placeholder="Share your thoughts..."
                className="w-full p-4 border border-black/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black/10"
              />
              <div className="flex items-center justify-end mt-3 gap-3">
                <button
                  onClick={() => setNewComment('')}
                  className="px-4 py-2 rounded-lg bg-white text-black/80 hover:bg-white/95"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!newComment.trim()) return;
                    const c: Comment = {
                      id: `c${Date.now()}`,
                      parentId: null,
                      author: { name: 'Guest', avatar: '/images/blogs/blogs-author-icon-dark.png' },
                      content: newComment.trim(),
                      createdAt: 'now',
                      likes: 0,
                    };
                    setComments([c, ...comments]);
                    setNewComment('');
                  }}
                  className="px-4 py-2 rounded-lg bg-black text-white hover:bg-black/90 flex items-center gap-2"
                >
                  <Send size={16} />
                  Comment
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {comments.map((c) => (
                <CommentItem
                  key={c.id}
                  comment={c}
                  onReply={(parentId, text) => {
                    if (!text.trim()) return;
                    const reply: Comment = {
                      id: `c${Date.now()}`,
                      parentId,
                      author: { name: 'Guest', avatar: '/images/blogs/blogs-author-icon-dark.png' },
                      content: text.trim(),
                      createdAt: 'now',
                      likes: 0,
                    };
                    setComments((prev) => prev.map((pc) => (pc.id === parentId ? { ...pc, replies: [reply, ...(pc.replies || [])] } : pc)));
                  }}
                  onToggleLike={(targetId) => {
                    const toggle = (arr: Comment[]): Comment[] =>
                      arr.map((it) => {
                        if (it.id === targetId) return { ...it, likes: it.likes + 1 };
                        if (it.replies) return { ...it, replies: toggle(it.replies || []) };
                        return it;
                      });
                    setComments((prev) => toggle(prev));
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles Section */}
      <div className="bg-white border-t border-black/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h3 className="text-3xl font-bold mb-8 text-black">Related Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.values(blogPosts)
              .filter(p => p.id !== id && p.category === post.category)
              .slice(0, 2)
              .map(relatedPost => (
                <button
                  key={relatedPost.id}
                  onClick={() => navigate(`/blog/${relatedPost.id}`)}
                  className="group text-left overflow-hidden rounded-xl border border-black/10 hover:border-black/20 hover:shadow-lg transition-all"
                >
                  <div className="h-40 overflow-hidden bg-gray-200">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-black group-hover:text-black/70 line-clamp-2">
                      {relatedPost.title}
                    </h4>
                    <p className="text-black/60 text-sm mt-2">{relatedPost.publishedDate}</p>
                  </div>
                </button>
              ))}
          </div>
          <button
            onClick={() => navigate('/blog')}
            className="mt-8 px-6 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-colors font-medium"
          >
            View All Articles
          </button>
        </div>
      </div>
    </div>
  );
}
