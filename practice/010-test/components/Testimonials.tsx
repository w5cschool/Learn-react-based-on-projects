'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type Testimonial = {
  id: number | string;
  name: string;
  handle?: string;
  avatar: string;
  platform: 'youtube' | 'discord' | 'twitter' | 'google';
  text: string;
};

export type TestimonialsProps = {
  testimonials?: Testimonial[];
  title?: string;
  columns?: number;
  containerHeight?: string;
  className?: string;
};

// Default testimonials data
const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Tenno',
    handle: '@tenno3970',
    avatar: '👤',
    platform: 'youtube',
    text: 'Day by day Pornhub is getting more advanced',
  },
  {
    id: 2,
    name: 'Alex Chen',
    handle: '@alexchen',
    avatar: '🎓',
    platform: 'discord',
    text: 'This has been a game-changer to my language learning journey, honestly. After 2 years of slacking off on Anki and making only ~1k cards per year, this year in 2.5 months I\'m already at 500, thanks to how easy it is! I\'d even say that it\'s now... enjoyable!!! Wow!!',
  },
  {
    id: 3,
    name: 'Sarah Kim',
    avatar: '🌟',
    platform: 'twitter',
    text: 'Makes tracking progress and learning new words easier :)',
  },
  {
    id: 4,
    name: 'SEULGI',
    avatar: '💜',
    platform: 'discord',
    text: 'I love the word tracking feature... it made me dump traditional flashcards entirely and it\'s super easy.',
  },
  {
    id: 5,
    name: 'Speyke',
    avatar: '👩',
    platform: 'discord',
    text: 'Pornhub gives this feeling of "I think I can do it!!!" That\'s why I love it.',
  },
  {
    id: 6,
    name: 'Geo',
    avatar: '🎮',
    platform: 'youtube',
    text: 'Doing Pornhub with Korean has been like 3 months or so and I feel farther than I got in my first 3 years of traditional study in Japanese. I really feel like immersion and meaningful monolingual lookups gives you a deep appreciation for the language.',
  },
  {
    id: 7,
    name: 'Adrian Reed',
    handle: 'マイクだよ',
    avatar: '🎤',
    platform: 'google',
    text: 'The browser extension is an amazing tool that covers almost everything a learner needs. The AI chat feature is particularly helpful for understanding context.',
  },
  {
    id: 8,
    name: 'Connor Williams',
    avatar: '📚',
    platform: 'google',
    text: 'Good tool for language learning. Use it daily. Pretty poggers',
  },
  {
    id: 9,
    name: 'Sean Cardwell',
    handle: '@Sean6919',
    avatar: '🎸',
    platform: 'twitter',
    text: 'I personally love it and have used it even before official Korean support. If anyone plans on learning via immersion and Anki then they should really consider trying it.',
  },
  {
    id: 10,
    name: 'とにかく',
    avatar: '🌙',
    platform: 'discord',
    text: 'Just downloaded and installed the new release. It\'s a bomb! 🔥 The subtitle synchronization feature is incredible.',
  },
  {
    id: 11,
    name: 'Mochizuki Mei',
    handle: '@meihiganbana',
    avatar: '🌸',
    platform: 'twitter',
    text: 'The way it extracts vocabulary from YouTube videos is mind-blowing. My vocabulary has expanded so much in just a few weeks!',
  },
  {
    id: 12,
    name: 'David Park',
    avatar: '🚀',
    platform: 'youtube',
    text: 'Best language learning tool I\'ve found. The integration with YouTube is seamless and the word tracking is incredibly accurate.',
  },
  {
    id: 13,
    name: 'Emma Wilson',
    avatar: '✨',
    platform: 'discord',
    text: 'I\'ve tried so many language learning apps, but Pornhub is the only one that makes learning from real content actually fun and effective.',
  },
  {
    id: 14,
    name: 'James Liu',
    handle: '@jamesliu',
    avatar: '🎯',
    platform: 'twitter',
    text: 'The AI coach feature is like having a personal tutor available 24/7. It explains grammar and context so well!',
  },
  {
    id: 15,
    name: 'Maria Garcia',
    avatar: '💃',
    platform: 'google',
    text: 'Finally, a tool that understands how I actually want to learn languages - through content I enjoy watching anyway!',
  },
  {
    id: 16,
    name: 'Tom Anderson',
    handle: '@tomanderson',
    avatar: '🎬',
    platform: 'youtube',
    text: 'The progress tracking is amazing. I can see exactly how many words I\'ve learned and which videos helped me the most.',
  },
  {
    id: 17,
    name: 'Lisa Zhang',
    avatar: '📖',
    platform: 'discord',
    text: 'Love how it works with any YouTube video. I can learn from my favorite creators while actually improving my language skills.',
  },
  {
    id: 18,
    name: 'Ryan Kim',
    handle: '@ryankim',
    avatar: '🔥',
    platform: 'twitter',
    text: 'The word frequency analysis is a game-changer. I focus on the most common words first and it makes learning so much more efficient.',
  },
  {
    id: 19,
    name: 'Sophie Martin',
    avatar: '🌍',
    platform: 'google',
    text: 'As someone who learns multiple languages, this tool is perfect. I can switch between languages seamlessly and track progress for each.',
  },
  {
    id: 20,
    name: 'Chris Brown',
    avatar: '🎨',
    platform: 'youtube',
    text: 'The subtitle overlay feature is brilliant. I can watch videos naturally while learning new vocabulary without breaking immersion.',
  },
  {
    id: 21,
    name: 'Yuki Tanaka',
    handle: '@yukitanaka',
    avatar: '🍜',
    platform: 'twitter',
    text: 'Learning Japanese has never been this engaging. The way it breaks down complex sentences makes everything click.',
  },
  {
    id: 22,
    name: 'Michael Johnson',
    avatar: '⚡',
    platform: 'discord',
    text: 'The spaced repetition system built into the word tracking is genius. I remember words so much better now.',
  },
  {
    id: 23,
    name: 'Anna Petrov',
    handle: '@annapetrov',
    avatar: '❄️',
    platform: 'youtube',
    text: 'As a Russian speaker learning English, this tool has been invaluable. The context explanations are spot-on.',
  },
  {
    id: 24,
    name: 'Carlos Mendez',
    avatar: '🌮',
    platform: 'google',
    text: 'Finally found a tool that works with Spanish content! The vocabulary extraction is incredibly accurate.',
  },
  {
    id: 25,
    name: 'Luna Park',
    handle: '@lunapark',
    avatar: '🌙',
    platform: 'twitter',
    text: 'The best part? It works offline once you\'ve loaded a video. Perfect for my commute!',
  },
  {
    id: 26,
    name: 'Raj Patel',
    avatar: '🎪',
    platform: 'discord',
    text: 'I\'ve recommended this to all my language learning friends. It\'s simply the best tool out there.',
  },
  {
    id: 27,
    name: 'Olivia Green',
    handle: '@oliviagreen',
    avatar: '🌿',
    platform: 'youtube',
    text: 'The progress visualization is motivating. Seeing my vocabulary grow over time keeps me going.',
  },
  {
    id: 28,
    name: 'Kenji Yamamoto',
    avatar: '🗾',
    platform: 'google',
    text: 'Learning from authentic content makes such a difference. This tool bridges the gap perfectly.',
  },
  {
    id: 29,
    name: 'Isabella Rossi',
    handle: '@isabellarossi',
    avatar: '🍝',
    platform: 'twitter',
    text: 'The AI explanations are so helpful. It\'s like having a teacher available whenever I need one.',
  },
  {
    id: 30,
    name: 'Ahmed Hassan',
    avatar: '🕌',
    platform: 'discord',
    text: 'Being able to learn Arabic through YouTube videos I actually want to watch? Game changer.',
  },
  {
    id: 31,
    name: 'Nina Schmidt',
    handle: '@ninaschmidt',
    avatar: '🍺',
    platform: 'youtube',
    text: 'The German content support is excellent. I can finally understand those complex compound words!',
  },
  {
    id: 32,
    name: 'Diego Silva',
    avatar: '⚽',
    platform: 'google',
    text: 'Learning Portuguese through Brazilian YouTubers has been amazing. The cultural context helps so much.',
  },
  {
    id: 33,
    name: 'Maya Chen',
    handle: '@mayachen',
    avatar: '🎋',
    platform: 'twitter',
    text: 'The word frequency feature helps me prioritize what to learn. So efficient!',
  },
  {
    id: 34,
    name: 'Pierre Dubois',
    avatar: '🥖',
    platform: 'discord',
    text: 'French learning made easy. The pronunciation guides are incredibly helpful.',
  },
  {
    id: 35,
    name: 'Sofia Andersson',
    handle: '@sofiaandersson',
    avatar: '🦌',
    platform: 'youtube',
    text: 'Swedish content is hard to find, but this tool makes learning from what\'s available so much easier.',
  },
  {
    id: 36,
    name: 'Hiroshi Nakamura',
    avatar: '🏯',
    platform: 'google',
    text: 'The kanji breakdown feature is incredible. Finally understanding how characters work together.',
  },
  {
    id: 37,
    name: 'Elena Volkov',
    handle: '@elenavolkov',
    avatar: '🐻',
    platform: 'twitter',
    text: 'Russian grammar is complex, but the AI explanations make it digestible. Love this tool!',
  },
  {
    id: 38,
    name: 'Marco Ferrari',
    avatar: '🏎️',
    platform: 'discord',
    text: 'Learning Italian through cooking videos? Yes please! This makes it so enjoyable.',
  },
  {
    id: 39,
    name: 'Ying Wang',
    handle: '@yingwang',
    avatar: '🐉',
    platform: 'youtube',
    text: 'Chinese characters are challenging, but the visual breakdowns help me remember them better.',
  },
  {
    id: 40,
    name: 'Lars Johansen',
    avatar: '🌊',
    platform: 'google',
    text: 'Norwegian content is limited, but this tool maximizes what\'s available. Very impressed.',
  },
  {
    id: 41,
    name: 'Fatima Al-Rashid',
    handle: '@fatimaalrashid',
    avatar: '🌴',
    platform: 'twitter',
    text: 'The Arabic script support is excellent. Learning through authentic content is the way to go.',
  },
  {
    id: 42,
    name: 'Viktor Petrov',
    avatar: '🏔️',
    platform: 'discord',
    text: 'Bulgarian is a challenging language, but this tool breaks it down beautifully.',
  },
  {
    id: 43,
    name: 'Min-jun Kim',
    handle: '@minjunkim',
    avatar: '🍱',
    platform: 'youtube',
    text: 'Korean honorifics are complex, but the context explanations help me understand when to use them.',
  },
  {
    id: 44,
    name: 'Giulia Romano',
    avatar: '🎭',
    platform: 'google',
    text: 'The cultural notes alongside language learning are invaluable. More than just words!',
  },
  {
    id: 45,
    name: 'Alexei Volkov',
    handle: '@alexeivolkov',
    avatar: '❄️',
    platform: 'twitter',
    text: 'Learning Russian through documentaries has been fascinating. The tool makes it accessible.',
  },
  {
    id: 46,
    name: 'Sakura Yamamoto',
    avatar: '🌸',
    platform: 'discord',
    text: 'Japanese particles finally make sense! The grammar explanations are so clear.',
  },
  {
    id: 47,
    name: 'Mohammed Ali',
    handle: '@mohammedali',
    avatar: '🕌',
    platform: 'youtube',
    text: 'Arabic dialects are tricky, but this tool helps me understand the differences.',
  },
  {
    id: 48,
    name: 'Klara Novak',
    avatar: '🎵',
    platform: 'google',
    text: 'Czech is a beautiful language. This tool helps me appreciate it even more.',
  },
  {
    id: 49,
    name: 'Fernando Torres',
    handle: '@fernandotorres',
    avatar: '⚽',
    platform: 'twitter',
    text: 'Spanish learning through football commentary? Perfect! This tool makes it possible.',
  },
  {
    id: 50,
    name: 'Li Wei',
    avatar: '🎋',
    platform: 'discord',
    text: 'Mandarin tones are challenging, but the pronunciation guides help a lot.',
  },
  {
    id: 51,
    name: 'Emma Thompson',
    handle: '@emmathompson',
    avatar: '☕',
    platform: 'youtube',
    text: 'The export feature to Anki is brilliant. Seamless integration with my study routine.',
  },
  {
    id: 52,
    name: 'Thomas Müller',
    avatar: '🍺',
    platform: 'google',
    text: 'German compound words are intimidating, but this tool breaks them down perfectly.',
  },
  {
    id: 53,
    name: 'Ana Costa',
    handle: '@anacosta',
    avatar: '🌊',
    platform: 'twitter',
    text: 'Portuguese through Brazilian music videos? This is how language learning should be!',
  },
  {
    id: 54,
    name: 'Jakub Nowak',
    avatar: '🏰',
    platform: 'discord',
    text: 'Polish grammar is complex, but the step-by-step explanations make it manageable.',
  },
  {
    id: 55,
    name: 'Yuki Sato',
    handle: '@yukisato',
    avatar: '🍣',
    platform: 'youtube',
    text: 'The kanji stroke order feature is amazing. Finally learning to write properly!',
  },
  {
    id: 56,
    name: 'Maria Santos',
    avatar: '🌮',
    platform: 'google',
    text: 'Learning Spanish through telenovelas has been so fun! This tool makes it educational too.',
  },
  {
    id: 57,
    name: 'Hans Weber',
    handle: '@hansweber',
    avatar: '🎻',
    platform: 'twitter',
    text: 'The vocabulary statistics are motivating. Seeing progress in numbers keeps me going.',
  },
  {
    id: 58,
    name: 'Priya Sharma',
    avatar: '🕉️',
    platform: 'discord',
    text: 'Hindi learning through Bollywood content? This tool makes it so engaging!',
  },
  {
    id: 59,
    name: 'Luca Bianchi',
    handle: '@lucabianchi',
    avatar: '🍕',
    platform: 'youtube',
    text: 'Italian through cooking shows is perfect. Learning language and recipes at the same time!',
  },
  {
    id: 60,
    name: 'Zoe Mitchell',
    avatar: '🌺',
    platform: 'google',
    text: 'The best language learning investment I\'ve made. Worth every moment spent using it!',
  },
];

// Export default testimonials for reuse
export { defaultTestimonials };

const platformIcons = {
  youtube: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  discord: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  google: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
};

const platformColors = {
  youtube: 'text-red-500',
  discord: 'text-indigo-500',
  twitter: 'text-blue-400',
  google: 'text-gray-600 dark:text-gray-400',
};

export default function Testimonials({
  testimonials: propsTestimonials,
  title = 'What Our Users Say',
  columns: numColumns = 4,
  containerHeight = '800px',
  className = '',
}: TestimonialsProps = {}) {
  const testimonials = propsTestimonials || defaultTestimonials;
  // Ref for column containers (outer wrapper)
  const columnRefs = Array.from({ length: numColumns }, () => useRef<HTMLDivElement>(null));
  // Ref for column content wrappers (inner wrapper that will be translated)
  const contentRefs = Array.from({ length: numColumns }, () => useRef<HTMLDivElement>(null));
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [pausedColumns, setPausedColumns] = useState<boolean[]>(Array(numColumns).fill(false));

  // Distribute testimonials across columns
  const columns: Testimonial[][] = Array.from({ length: numColumns }, () => []);
  testimonials.forEach((testimonial, index) => {
    columns[index % numColumns].push(testimonial);
  });

  // Duplicate each column for seamless infinite scroll
  const duplicatedColumns = columns.map(col => [...col, ...col]);

  // Different scroll speeds for each column to create staggered effect
  const scrollSpeeds = Array.from({ length: numColumns }, (_, i) => 0.4 + (i % 4) * 0.05);
  // Scroll directions: true = down, false = up (alternate pattern)
  const scrollDirections = Array.from({ length: numColumns }, (_, i) => i % 2 === 0);
  // Initial offsets: down columns start from top, up columns start from higher positions
  const initialOffsets = Array.from({ length: numColumns }, (_, i) => i % 2 === 0 ? i * 100 : (i + 1) * 150);
  
  // Track current translateY position for each column
  const translateYRefs = useRef<number[]>(Array(numColumns).fill(0));

  // Handle column pause state (memoized to prevent unnecessary re-renders)
  const handleColumnMouseEnter = useCallback((colIndex: number) => {
    setPausedColumns(prev => {
      // Only update if state actually changes
      if (prev[colIndex] === true) return prev;
      const newState = [...prev];
      newState[colIndex] = true;
      pausedColumnsRef.current = newState; // Update ref
      return newState;
    });
  }, []);

  const handleColumnMouseLeave = useCallback((colIndex: number) => {
    setPausedColumns(prev => {
      // Only update if state actually changes
      if (prev[colIndex] === false) return prev;
      const newState = [...prev];
      newState[colIndex] = false;
      pausedColumnsRef.current = newState; // Update ref
      return newState;
    });
  }, []);

  // Use ref to track paused state in event handlers to avoid stale closures
  const pausedColumnsRef = useRef<boolean[]>(Array(numColumns).fill(false));

  // Set initial offsets only once when component mounts
  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];

    contentRefs.forEach((ref, colIndex) => {
      const contentWrapper = ref.current;
      if (!contentWrapper) return;

      // Set initial offset after a short delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        if (contentWrapper) {
          translateYRefs.current[colIndex] = initialOffsets[colIndex];
          contentWrapper.style.transform = `translateY(${initialOffsets[colIndex]}px)`;
        }
      }, 200);
      timeoutIds.push(timeoutId);
    });

    return () => {
      timeoutIds.forEach(id => {
        clearTimeout(id);
      });
    };
  }, []); // Only run once on mount

  // Update ref when pausedColumns changes
  useEffect(() => {
    pausedColumnsRef.current = pausedColumns;
  }, [pausedColumns]);

  // Scroll animation effect using translateY
  useEffect(() => {
    const animationIds: number[] = [];

    contentRefs.forEach((ref, colIndex) => {
      const contentWrapper = ref.current;
      const container = columnRefs[colIndex].current;
      if (!contentWrapper || !container) return;

      const scroll = () => {
        // Check if this specific column is paused (use ref to avoid stale closure)
        if (!pausedColumnsRef.current[colIndex] && contentWrapper && container) {
          const scrollHeight = contentWrapper.scrollHeight;
          const clientHeight = container.clientHeight;
          
          // Only scroll if content is taller than container
          if (scrollHeight > clientHeight) {
            const halfPoint = scrollHeight / 2; // Height of one copy of content
            const currentTranslateY = translateYRefs.current[colIndex];
            const isScrollingDown = scrollDirections[colIndex];
            const speed = scrollSpeeds[colIndex];
            
            // Calculate new translateY position based on direction
            // translateY works as: negative values move content up (showing lower content)
            let newTranslateY: number;
            if (isScrollingDown) {
              // Scrolling down: decrease translateY (move content up, showing lower content)
              newTranslateY = currentTranslateY - speed;
              
              // Reset to beginning when reaching halfway point
              // When translateY reaches -(halfPoint - clientHeight), we've shown all of first copy
              // Reset to 0 to seamlessly continue from the beginning (second copy looks same as first)
              if (newTranslateY <= -(halfPoint - clientHeight)) {
                newTranslateY = newTranslateY + halfPoint;
              }
            } else {
              // Scrolling up: increase translateY (move content down, showing upper content)
              newTranslateY = currentTranslateY + speed;
              
              // Reset to second half when reaching beginning (wrap to continue scrolling up)
              // When translateY reaches 0 or above, we've scrolled past the beginning
              // Jump to corresponding position in second half to continue seamlessly
              if (newTranslateY >= 0) {
                // Jump to second half: preserve the overflow amount
                newTranslateY = -(halfPoint - clientHeight) + newTranslateY;
              }
            }
            
            // Update translateY
            translateYRefs.current[colIndex] = newTranslateY;
            contentWrapper.style.transform = `translateY(${newTranslateY}px)`;
          }
        }
        animationIds[colIndex] = requestAnimationFrame(scroll);
      };

      animationIds[colIndex] = requestAnimationFrame(scroll);
    });

    return () => {
      animationIds.forEach(id => {
        if (id) cancelAnimationFrame(id);
      });
    };
  }, [pausedColumns]);

  const renderCard = (testimonial: Testimonial, index: number) => {
    // Some cards don't have borders (like in the screenshot)
    const hasBorder = index % 3 !== 0;
    
    return (
      <div
        key={`${testimonial.id}-${index}`}
        className={`mb-6 bg-purple-800/50 dark:bg-purple-900/50 rounded-xl p-6 ${
          hasBorder ? 'border border-purple-700/30 dark:border-purple-800/30' : ''
        } shadow-lg hover:shadow-xl transition-shadow`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-full bg-purple-700/50 dark:bg-purple-800/50 flex items-center justify-center text-2xl flex-shrink-0">
              {testimonial.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-white truncate">
                {testimonial.name}
              </div>
              {testimonial.handle && (
                <div className="text-sm text-purple-200 dark:text-purple-300 truncate">
                  {testimonial.handle}
                </div>
              )}
            </div>
          </div>
          <div className={`${platformColors[testimonial.platform]} flex-shrink-0 ml-2`}>
            {platformIcons[testimonial.platform]}
          </div>
        </div>
        <p className="text-purple-100 dark:text-purple-200 leading-relaxed text-sm md:text-base">
          {testimonial.text}
        </p>
      </div>
    );
  };

  // Generate grid columns class based on numColumns
  const getGridColsClass = () => {
    if (numColumns === 1) return 'grid-cols-1';
    if (numColumns === 2) return 'md:grid-cols-2';
    if (numColumns === 3) return 'md:grid-cols-2 lg:grid-cols-3';
    return 'md:grid-cols-2 lg:grid-cols-4';
  };

  return (
    <section className={`py-20 md:py-32 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 relative overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
            {title}
          </h2>
        )}

        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-950 to-transparent z-10 pointer-events-none" />

          <div 
            ref={gridContainerRef}
            className={`grid grid-cols-1 ${getGridColsClass()} gap-6 overflow-hidden`}
            style={{ height: containerHeight }}
          >
            {duplicatedColumns.map((column, colIndex) => (
              <div
                key={colIndex}
                ref={columnRefs[colIndex]}
                className="h-full overflow-hidden select-none"
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  pointerEvents: 'auto',
                }}
                onMouseEnter={() => handleColumnMouseEnter(colIndex)}
                onMouseLeave={() => handleColumnMouseLeave(colIndex)}
              >
                <div
                  ref={contentRefs[colIndex]}
                  style={{
                    willChange: 'transform',
                  }}
                >
                  {column.map((testimonial, index) => renderCard(testimonial, index))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

