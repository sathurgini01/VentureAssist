const mockMentors = [
  {
    id: 'm1',
    photo: 'NP',
    name: 'Nadia Perera',
    title: 'Fundraising Mentor',
    rating: '4.9',
    reviews: 48,
    expertise: ['Pitch Decks', 'Investor Updates', 'Grants'],
    availability: 'Open this week',
    rate: '$75 / hour',
    priceBand: '75',
  },
  {
    id: 'm2',
    photo: 'LS',
    name: 'Liam Santos',
    title: 'Growth Strategist',
    rating: '4.8',
    reviews: 35,
    expertise: ['Go-to-market', 'Acquisition', 'Messaging'],
    availability: 'Limited slots',
    rate: '$90 / hour',
    priceBand: '90',
  },
  {
    id: 'm3',
    photo: 'AR',
    name: 'Amina Rahman',
    title: 'Product Advisor',
    rating: '5.0',
    reviews: 22,
    expertise: ['Roadmaps', 'UX Research', 'Retention'],
    availability: 'Available weekends',
    rate: '$85 / hour',
    priceBand: '85',
  },
]

const mockMentorRequests = [
  {
    id: 'r1',
    userName: 'Ayesha Fernando',
    topic: 'Pitch deck review',
    preferredTime: 'March 30, 10:00 AM',
    message: 'Looking for feedback before an investor meeting next week.',
    status: 'pending',
  },
  {
    id: 'r2',
    userName: 'Kasun Peris',
    topic: 'Growth planning',
    preferredTime: 'April 1, 3:00 PM',
    message: 'Need help with first-channel acquisition priorities.',
    status: 'pending',
  },
]

export async function getMentors() {
  return Promise.resolve(mockMentors)
}

export async function getMentorRequests() {
  return Promise.resolve(mockMentorRequests)
}

const mentorService = {
  getMentors,
  getMentorRequests,
}

export default mentorService
