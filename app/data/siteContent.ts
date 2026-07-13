export type AccountRoleId = 'business' | 'organization' | 'family';

export interface AccountType {
  id: AccountRoleId;
  title: string;
  blurb: string;
  bullets: string[];
}

export interface SiteContent {
  navItems: Array<{ label: string; href: string }>;
  stats: Array<{ label: string; value: string; detail: string }>;
  accountTypes: AccountType[];
  donationFields: string[];
  matchCards: Array<{
    title: string;
    score: number;
    time: string;
    meals: string;
    carbon: string;
    priority: string;
  }>;
  mapFilters: string[];
  resourceThemes: string[];
  stories: Array<{
    title: string;
    quote: string;
    author: string;
  }>;
}

export const siteContent: SiteContent = {
  navItems: [
    { label: 'Home', href: '#home' },
    { label: 'Find Food', href: '#find-food' },
    { label: 'Donate Food', href: '#donate-food' },
    { label: 'Organizations', href: '#organizations' },
    { label: 'Impact Dashboard', href: '#impact-dashboard' },
    { label: 'About', href: '#about' },
    { label: 'Resources', href: '#resources' },
    { label: 'Contact', href: '#contact' },
  ],
  stats: [
    { label: 'Meals Rescued', value: '1.2M+', detail: '+18% this quarter' },
    { label: 'Pounds of Food Saved', value: '8.4M', detail: 'across 42 cities' },
    { label: 'Businesses Partnered', value: '1,280', detail: 'and growing' },
    { label: 'Food Banks Connected', value: '318', detail: '24/7 support' },
    { label: 'Families Helped', value: '67K', detail: 'every month' },
    { label: 'CO₂ Emissions Prevented', value: '4.9K t', detail: 'equivalent' },
  ],
  accountTypes: [
    {
      id: 'business',
      title: 'Business',
      blurb: 'Restaurants, grocery stores, schools, bakeries, farms, and hotels can donate surplus food in minutes.',
      bullets: ['Fast pickup scheduling', 'Tax receipt history', 'Live impact reporting'],
    },
    {
      id: 'organization',
      title: 'Food Bank / Organization',
      blurb: 'Shelters, pantries, churches, and community kitchens can accept, sort, and dispatch donations.',
      bullets: ['Inventory updates', 'Urgent request routing', 'Simple coordination'],
    },
    {
      id: 'family',
      title: 'Individual / Family',
      blurb: 'Neighbors can discover nearby pantry hours, meal programs, community fridges, and available groceries.',
      bullets: ['Private, simple experience', 'Nearby resource map', 'Language and accessibility options'],
    },
  ],
  donationFields: [
    'Food title',
    'Description',
    'Food category',
    'Quantity',
    'Weight',
    'Expiration date',
    'Pickup deadline',
    'Storage requirements',
    'Temperature',
    'Photo upload',
    'Special notes',
  ],
  matchCards: [
    {
      title: 'Northside Pantry',
      score: 96,
      time: '14 min',
      meals: '180',
      carbon: '84 kg',
      priority: 'High priority',
    },
    {
      title: 'Harvest House Shelter',
      score: 91,
      time: '19 min',
      meals: '154',
      carbon: '71 kg',
      priority: 'Balanced',
    },
    {
      title: 'East End Community Kitchen',
      score: 88,
      time: '22 min',
      meals: '132',
      carbon: '66 kg',
      priority: 'Recommended',
    },
  ],
  mapFilters: ['Today', 'Tomorrow', 'This Week'],
  resourceThemes: [
    'Food waste statistics',
    'Environmental impacts',
    'Food safety',
    'Tax incentives',
  ],
  stories: [
    {
      title: 'A bakery turned surplus into smiles',
      quote:
        'We used to throw away unsold pastries. Now our team can rescue them before sunrise and support families in the same neighborhood.',
      author: 'Maya, owner of Golden Crust Bakery',
    },
    {
      title: 'A pantry that can plan with confidence',
      quote:
        'We used to scramble with last-minute donations. Now we see the forecast, match incoming food, and serve more families reliably.',
      author: 'Rosa, operations lead at Riverstone Pantry',
    },
    {
      title: 'A simple way to share nearby support',
      quote:
        'The flow is clear and calm. Families can find help quickly, and organizations can respond with confidence.',
      author: 'Jordan, community outreach lead',
    },
  ],
};
