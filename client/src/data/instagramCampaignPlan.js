export const INSTAGRAM_PACKAGE = {
  title: 'Instagram Growth Sprint - 14 Days Edition',
  duration: '14 Days',
  budget: 25000,
  goal: 'Generate 80–150 Leads',
}

export const WEEKLY_PLAN = [
  {
    week: 1,
    title: 'Awareness & Engagement Phase',
    objective: 'Increase visibility, improve engagement, and build a warm audience pool for retargeting.',
    budget: 12000,
    budgetItems: [
      'Awareness Ads – LKR 7,000',
      'Engagement Boost – LKR 5,000',
    ],
    dayTasks: [
      { day: 1, title: 'Content Creation Setup', tasks: ['Post Reel #1 (educational)', 'Write strong 3-second hook', 'Add clear CTA (Follow/Save/Share)'] },
      { day: 2, title: 'Value Content Day', tasks: ['Post Carousel #1 (tips/insights)', 'Post interactive stories (poll/Q&A)', 'Engage with 15 niche accounts'] },
      { day: 3, title: 'Community Engagement Day', tasks: ['Reply to all comments in 24h', 'Reply to DMs consistently', 'Comment meaningfully on competitor posts'] },
      { day: 4, title: 'Paid Awareness Launch', tasks: ['Launch awareness ad campaign', 'Target interest-based audience', 'Monitor ad performance and adjust if CTR is low'] },
      { day: 5, title: 'Proof + Boost Day', tasks: ['Post testimonial/social proof content', 'Pin top-performing content', 'Boost best-performing organic post'] },
      { day: 6, title: 'Reel + Carousel Expansion', tasks: ['Post Reel #2 (problem-solving)', 'Post Carousel #2 (value-based)', 'Engage with story replies'] },
      { day: 7, title: 'Week 1 Optimization', tasks: ['Post Reel #3', 'Review hashtag effectiveness', 'Review peak engagement time', 'Record Week 1 metrics'] },
    ],
    requiredMetrics: [
      { key: 'week1Reach', label: 'Reach', description: 'Number of unique accounts that saw your content.' },
      { key: 'week1Engagement', label: 'Engagement', description: 'Total interactions (Likes + Comments + Shares).' },
      { key: 'week1Ctr', label: 'CTR', description: 'Percentage of users who clicked after seeing content or ad.' },
      { key: 'week1AdSpend', label: 'Ad Spend', description: 'Total amount spent during Week 1.' },
      { key: 'week1FollowersGained', label: 'Followers Gained', description: 'Number of new followers gained this week.' },
    ],
    expectedOutput: [
      '15,000 – 25,000 Reach',
      '4% – 6% Engagement Rate',
      'Increased profile visits',
      'Strong retargeting audience built',
      '10–30 warm inquiries (optional)',
    ],
  },
  {
    week: 2,
    title: 'Lead Generation & Conversion Phase',
    objective: 'Convert engaged audience into qualified leads.',
    budget: 13000,
    budgetItems: [
      'Lead Generation Ads – LKR 9,000',
      'Retargeting Ads – LKR 4,000',
    ],
    dayTasks: [
      { day: 8, title: 'Lead Magnet Day', tasks: ['Post lead magnet offer (guide/discount)', 'Write benefit-driven caption', 'Add urgency messaging', 'Pin lead post'] },
      { day: 9, title: 'Conversion Reel Day 1', tasks: ['Post conversion Reel #1 with strong CTA', 'Use story countdown sticker', 'Follow up manually with interested users'] },
      { day: 10, title: 'Paid Lead Campaign Launch', tasks: ['Launch lead generation ad campaign', 'Retarget video viewers/profile visitors', 'Track CPL daily'] },
      { day: 11, title: 'DM Conversion Day', tasks: ['Respond quickly to DMs', 'Track potential prospects', 'Refine CTA copy in captions'] },
      { day: 12, title: 'Live Session Day', tasks: ['Conduct Instagram Live session', 'Promote offer during live', 'Capture inbound leads from live traffic'] },
      { day: 13, title: 'Objection Handling Day', tasks: ['Post FAQ/objection handling carousel', 'Pause low-performing ads', 'Adjust targeting from Week 1 learnings'] },
      { day: 14, title: 'Final Push + Wrap', tasks: ['Post conversion Reel #2', 'Run limited-time final push', 'Record Week 2 metrics', 'Compare Week 1 vs Week 2 outcomes'] },
    ],
    requiredMetrics: [
      { key: 'week2Reach', label: 'Reach', description: 'Number of people who saw your content.' },
      { key: 'week2Ctr', label: 'CTR', description: 'Percentage of users who clicked your link or ad.' },
      { key: 'week2LeadsGenerated', label: 'Leads Generated', description: 'Number of users who signed up, messaged, or filled the form.' },
      { key: 'week2Cpl', label: 'Cost Per Lead (CPL)', description: 'Ad Spend ÷ Leads. Amount spent to acquire one lead.' },
      { key: 'week2AdSpend', label: 'Ad Spend', description: 'Total amount spent during Week 2.' },
    ],
    expectedOutput: [
      '80 – 150 Qualified Leads',
      'CPL under LKR 150',
      'Higher DM conversions',
      'Top-performing content clearly identified',
      'Strong base for next scaling campaign',
    ],
  },
]

export const FINAL_EXPECTED_OUTCOME = [
  '80–150 Leads',
  '30,000+ Total Reach',
  'Improved CTR',
  'Measurable ROI',
  'Data-driven insights for future campaigns',
]

// Backward-compatible metric export used by analytics page
export const CAMPAIGN_METRIC_FIELDS = [
  ...WEEKLY_PLAN[0].requiredMetrics,
  ...WEEKLY_PLAN[1].requiredMetrics,
]
