import type { NewsPost } from './types';
import { img } from './assets';

const thumb = (alt: string, slug: string) => ({ kind: 'image' as const, src: img(`04_Images/News/news-${slug}`), alt, ratio: '16/9', spec: '1600×900 WebP, text-free' });

/** Newest first is handled in code. To add a post, append an object. Slugs are live URLs: do not rename. */
export const news: NewsPost[] = [
  {
    slug: 'announcing-the-game', title: 'Meet Little Chef: your own little restaurant street', date: '2026-11-01', category: 'Game Updates', placeholder: false,
    excerpt: 'Take orders, cook every dish by hand and grow from one Pizza House into a whole street of restaurants.',
    thumbnail: thumb('The Fried Chicken House with a customer outside', 'announcing-the-game'),
    body: [
      'Little Chef is a cosy cooking game for iOS and Android. Customers walk in, tell you what they want, and it is up to you to remember the order and cook it exactly right.',
      'Every dish is made by hand. Roll out the dough, spread the tomato sauce, sprinkle the cheese and slide the pizza into the oven. Later you will dip and fry chicken, grill sausages, stack burgers and sear steaks.',
      'Serve fast and accurately and your customers leave a tip on top of the price. Spend your coins on new ingredients like Pepperoni, Mushroom and Shrimp, grow your menu, and save up to open your next restaurant.',
      'Little Chef is out now on Google Play, and the iOS version is on its way. Sign up on the home page and we will email you when it lands on the App Store.',
    ],
  },
  {
    slug: 'how-a-level-is-made', title: 'Inside the Pizza House kitchen', date: '2026-10-20', category: 'Behind the Scenes', placeholder: false,
    excerpt: 'How one Cheese Pizza became the first thing every player learns to cook.',
    thumbnail: thumb('The pizza station: dough balls, rolling pin, sauce, cheese and toppings', 'how-a-level-is-made'),
    body: [
      'The Pizza House is the first restaurant in Little Chef, so its kitchen had to teach the whole game without feeling like a lesson.',
      'Each step is one simple gesture. Drag a dough ball onto the board. Use the rolling pin to flatten it. Tap the tomato sauce and spread it evenly. Sprinkle the cheese. Drag the pizza into the oven, then follow the dotted lines with the pizza cutter. Box it and serve.',
      'Toppings unlock as you play. Pepperoni arrives on Day 2, then Bell Pepper, Mushroom and Shrimp, and with them bigger orders like the Deluxe Pizza.',
    ],
  },
  {
    slug: 'why-it-feels-satisfying', title: 'Why slicing a pizza feels so good', date: '2026-10-05', category: 'Development', placeholder: false,
    excerpt: 'Dotted lines, a perfect cut and a happy customer: the small details behind the payoff.',
    thumbnail: thumb('A cheese pizza cut into eight slices on the board', 'why-it-feels-satisfying'),
    body: [
      'Cooking games live or die on the last step. In Little Chef that is often the moment you cut the pizza: follow the dotted lines and eight clean slices fall into place.',
      'Every dish is judged when you serve it. A Perfect order earns the best tip, a Good one still pays, and a Bad one teaches you to look at the order again.',
      'Busy days get a hand from boosters: Order Recall shows the original order again, Turbo Machines speed up cooking, Golden Tip doubles your tips and Happy Customer keeps everyone smiling.',
    ],
  },
];

export const sortedNews = () => [...news].sort((a, b) => b.date.localeCompare(a.date));
export const getPost = (slug: string) => news.find((p) => p.slug === slug);
