const mockCampaigns = [
  {
    id: 'cmp-101',
    name: 'Launch Countdown',
    title: 'Launch Countdown',
    status: 'active',
    platform: 'Instagram',
    impressions: '42900',
    owner: 'Ayesha Fernando',
    description: 'Countdown campaign for the spring product launch.',
    audience: 'Startup founders, product leads',
    budget: '$1200',
    cta: 'Join the waitlist',
    startDate: '2026-04-01',
    endDate: '2026-04-15',
  },
  {
    id: 'cmp-102',
    name: 'Mentor Match Outreach',
    title: 'Mentor Match Outreach',
    status: 'draft',
    platform: 'Email',
    impressions: '8120',
    owner: 'Ayesha Fernando',
    description: 'Email campaign to connect founders with mentors.',
    audience: 'Early-stage founders',
    budget: '$860',
    cta: 'Book a mentor',
    startDate: '2026-04-05',
    endDate: '2026-04-19',
  },
  {
    id: 'cmp-103',
    name: 'Investor Awareness Push',
    title: 'Investor Awareness Push',
    status: 'paused',
    platform: 'LinkedIn',
    impressions: '19600',
    owner: 'Dilan Silva',
    description: 'Brand awareness campaign for investor visibility.',
    audience: 'Angels and operators',
    budget: '$1500',
    cta: 'Read the founder brief',
    startDate: '2026-04-08',
    endDate: '2026-04-22',
  },
]

export async function getCampaigns() {
  return Promise.resolve(mockCampaigns)
}

export async function getCampaignById(campaignId) {
  return Promise.resolve(
    mockCampaigns.find((campaign) => campaign.id === campaignId) ?? mockCampaigns[0],
  )
}

const campaignService = {
  getCampaigns,
  getCampaignById,
}

export default campaignService
