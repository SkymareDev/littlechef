/** Used by the Core Experience section, the game page and the Press Kit fact sheet. Source: GDD (Overview, Booster). */
export const coreSteps = [
  { id: 'discover', title: 'Take the order', line: 'Every customer tells you what they want. Remember it.' },
  { id: 'interact', title: 'Cook it right', line: 'Roll, spread, fry, grill and top with simple taps, drags and swipes.' },
  { id: 'satisfy', title: 'Serve and earn', line: 'Box it up, hand it over and collect your coins and tips.' },
];

/** The core loop from the GDD, written for players. */
export const coreLoop = [
  'A customer walks in and tells you their order.',
  'Cook it step by step: cut, cook, layer the ingredients and add the toppings.',
  'Serve the dish. Get it right and fast for a bigger tip.',
  'Spend your coins to unlock new ingredients and recipes.',
  'Save enough and open your next restaurant.',
];

export const boosters = [
  { name: 'Order Recall', line: 'Show the customer’s original order again.' },
  { name: 'Turbo Machines', line: 'Boost your machines for faster cooking all day.' },
  { name: 'Golden Tip', line: 'Double all tips earned this day.' },
  { name: 'Happy Customer', line: 'Customers stay extremely happy all day.' },
];

export const pressFacts = [
  ['Developer', 'Skymare Studio'],
  ['Genre', 'Casual cooking, restaurant simulation'],
  ['Platforms', 'iOS, Android'],
  ['Art style', '2D stylized, bright and glossy food'],
  ['Release', 'Android: out now on Google Play. iOS: TBD'],
  ['Price', 'Free to download'],
  ['Languages', 'English (more TBD)'],
] as const;

export const pressFeatures = [
  'Remember each customer’s order and cook it exactly right',
  'Hands-on cooking: roll dough, fry chicken, grill patties, sear steak, slice and box',
  'Fast, accurate service earns tips on top of every sale',
  'Unlock new ingredients, grow your menu and open new restaurants: Pizza, Fried Chicken, Hot Dog, Burger, Steak and more',
  'Boosters like Order Recall and Golden Tip for busy days',
];
