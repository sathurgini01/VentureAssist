const INSTAGRAM_PLAN = {
  key: 'instagram',
  package: {
    title: 'Instagram Growth Sprint - 14 Days Edition',
    duration: '14 Days',
    budget: 25000,
    goal: 'Generate 80–150 Leads',
  },
  shortPreview: {
    subtitle: '14-day structured Instagram growth plan',
    pills: [
      { label: 'Duration', value: '14 Days' },
      { label: 'Budget', value: 'LKR 25,000' },
      { label: 'Goal', value: 'Generate 80–150 Leads' },
    ],
    flow: ['Week 1: Awareness + Engagement', 'Week 2: Lead Generation + Conversion'],
    expected: ['30,000+ Reach', '80–150 Leads'],
  },
  phases: [
    {
      phase: 1,
      title: 'Awareness & Engagement Phase',
      objective: 'Increase visibility, improve engagement, and build a warm audience pool for retargeting.',
      budget: 12000,
      budgetItems: ['Awareness Ads – LKR 7,000', 'Engagement Boost – LKR 5,000'],
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
        { key: 'week1Reach', label: 'Reach', type: 'number', description: 'Number of unique accounts that saw your content.' },
        { key: 'week1Engagement', label: 'Engagement', type: 'number', description: 'Total interactions (Likes + Comments + Shares).' },
        { key: 'week1Ctr', label: 'CTR', type: 'percentage', description: 'Percentage of users who clicked after seeing content or ad.' },
        { key: 'week1AdSpend', label: 'Ad Spend', type: 'currency', description: 'Total amount spent during Week 1.' },
        { key: 'week1FollowersGained', label: 'Followers Gained', type: 'number', description: 'Number of new followers gained this week.' },
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
      phase: 2,
      title: 'Lead Generation & Conversion Phase',
      objective: 'Convert engaged audience into qualified leads.',
      budget: 13000,
      budgetItems: ['Lead Generation Ads – LKR 9,000', 'Retargeting Ads – LKR 4,000'],
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
        { key: 'week2Reach', label: 'Reach', type: 'number', description: 'Number of people who saw your content.' },
        { key: 'week2Ctr', label: 'CTR', type: 'percentage', description: 'Percentage of users who clicked your link or ad.' },
        { key: 'week2LeadsGenerated', label: 'Leads Generated', type: 'number', description: 'Number of users who signed up, messaged, or filled the form.' },
        { key: 'week2Cpl', label: 'Cost Per Lead (CPL)', type: 'currency', description: 'Ad Spend ÷ Leads. Amount spent to acquire one lead.' },
        { key: 'week2AdSpend', label: 'Ad Spend', type: 'currency', description: 'Total amount spent during Week 2.' },
      ],
      expectedOutput: [
        '80 – 150 Qualified Leads',
        'CPL under LKR 150',
        'Higher DM conversions',
        'Top-performing content clearly identified',
        'Strong base for next scaling campaign',
      ],
    },
  ],
  finalExpectedOutcome: [
    '80–150 Leads',
    '30,000+ Total Reach',
    'Improved CTR',
    'Measurable ROI',
    'Data-driven insights for future campaigns',
  ],
}

const FACEBOOK_PLAN = {
  key: 'facebook',
  package: {
    title: 'Facebook 7-Day Smart Lead Campaign',
    duration: '7 Days',
    budget: 15000,
    goal: 'Generate Leads & Increase Page Engagement',
  },
  shortPreview: {
    subtitle: '1-week Facebook conversion campaign demo',
    pills: [
      { label: 'Duration', value: '7 Days' },
      { label: 'Active Days', value: 'Day 1, 2, 4, 5, 7' },
      { label: 'Budget', value: 'LKR 15,000' },
    ],
    flow: [
      'Day 1: Campaign Setup + Awareness Ad Launch',
      'Day 2: Engagement Boost + Audience Interaction',
      'Day 4: Lead Ad Launch',
      'Day 5: Retargeting Ad Activation',
      'Day 7: Optimization + Final Push',
    ],
    expected: ['Expected Leads: 40–80', 'Expected Reach: 20,000+'],
  },
  phases: [
    {
      phase: 1,
      title: '1-Week Conversion Execution',
      objective: 'Generate qualified leads while building engagement and retargeting audience.',
      budget: 15000,
      budgetItems: [
        'Awareness Ads – LKR 5,000',
        'Engagement Boost – LKR 3,000',
        'Lead Generation Ads – LKR 5,000',
        'Retargeting Ads – LKR 2,000',
      ],
      dayTasks: [
        {
          day: 1,
          title: 'Campaign Setup & Awareness Launch',
          tasks: [
            'Create campaign objective (Traffic or Awareness)',
            'Define target audience (interest-based)',
            'Design 1 promotional creative (image or video)',
            'Launch Awareness Ad',
            'Post 1 organic post on page',
          ],
        },
        {
          day: 2,
          title: 'Engagement Boost',
          tasks: [
            'Boost best-performing post',
            'Reply to comments and messages',
            'Post 1 interactive content (poll or question)',
            'Engage with 10–15 related pages',
          ],
        },
        {
          day: 4,
          title: 'Lead Generation Ad Launch',
          tasks: [
            'Create Lead Form (Name, Phone, Email)',
            'Launch Lead Ad campaign',
            'Add strong CTA (Sign Up / Get Offer)',
            'Pin lead post to top',
          ],
        },
        {
          day: 5,
          title: 'Retargeting Campaign',
          tasks: [
            'Create custom audience (video viewers/page visitors)',
            'Launch retargeting ad',
            'Add urgency message (Limited Offer)',
            'Follow up with interested users',
          ],
        },
        {
          day: 7,
          title: 'Optimization & Final Push',
          tasks: [
            'Analyze best-performing ads',
            'Pause low-performing ads',
            'Increase budget on high CTR ad',
            'Post final reminder offer',
            'Record campaign summary',
          ],
        },
      ],
      requiredMetrics: [
        { key: 'fbDay1Reach', label: 'Day 1 Reach', type: 'number', description: 'Unique users reached during Awareness launch.' },
        { key: 'fbDay1Impressions', label: 'Day 1 Impressions', type: 'number', description: 'Total times the awareness ad was shown.' },
        { key: 'fbDay1Ctr', label: 'Day 1 CTR', type: 'percentage', description: 'Click-through rate for Day 1 awareness ad.' },
        { key: 'fbDay1AdSpend', label: 'Day 1 Ad Spend', type: 'currency', description: 'Ad spend for Day 1 launch.' },
        { key: 'fbDay2Engagement', label: 'Day 2 Post Engagement', type: 'number', description: 'Likes + comments + shares from boosted engagement activities.' },
        { key: 'fbDay2PageVisits', label: 'Day 2 Page Visits', type: 'number', description: 'Number of users visiting the page on Day 2.' },
        { key: 'fbDay2FollowersGained', label: 'Day 2 Followers Gained', type: 'number', description: 'Net new followers gained on Day 2.' },
        { key: 'fbDay2AdSpend', label: 'Day 2 Ad Spend', type: 'currency', description: 'Ad spend for engagement boost.' },
        { key: 'fbDay4LeadsGenerated', label: 'Day 4 Leads Generated', type: 'number', description: 'Lead form submissions from Day 4 lead ad.' },
        { key: 'fbDay4Cpl', label: 'Day 4 Cost Per Lead', type: 'currency', description: 'Day 4 ad spend divided by Day 4 leads.' },
        { key: 'fbDay4Ctr', label: 'Day 4 CTR', type: 'percentage', description: 'Click-through rate for lead generation ad.' },
        { key: 'fbDay4AdSpend', label: 'Day 4 Ad Spend', type: 'currency', description: 'Ad spend for lead generation launch.' },
        { key: 'fbDay5RetargetingLeads', label: 'Day 5 Retargeting Leads', type: 'number', description: 'Leads generated from retargeting ad set.' },
        { key: 'fbDay5Ctr', label: 'Day 5 CTR', type: 'percentage', description: 'Click-through rate for retargeting ads.' },
        { key: 'fbDay5Cpl', label: 'Day 5 Cost Per Lead', type: 'currency', description: 'Retargeting spend divided by retargeting leads.' },
        { key: 'fbDay5AdSpend', label: 'Day 5 Ad Spend', type: 'currency', description: 'Ad spend for retargeting activation.' },
        { key: 'fbDay7TotalLeads', label: 'Day 7 Total Leads', type: 'number', description: 'Total leads at campaign completion.' },
        { key: 'fbDay7TotalReach', label: 'Day 7 Total Reach', type: 'number', description: 'Total campaign reach at completion.' },
        { key: 'fbDay7TotalAdSpend', label: 'Day 7 Total Ad Spend', type: 'currency', description: 'Total spend for all active days.' },
        { key: 'fbDay7OverallCpl', label: 'Day 7 Overall CPL', type: 'currency', description: 'Overall campaign spend divided by total leads.' },
        { key: 'fbDay7EngagementRate', label: 'Day 7 Engagement Rate', type: 'percentage', description: 'Overall campaign engagement rate.' },
      ],
      expectedOutput: [
        '20,000 – 35,000 Reach',
        '4%+ Engagement Rate',
        '40 – 80 Leads',
        'Cost Per Lead below LKR 200',
        'Increased Page Followers',
      ],
    },
  ],
  finalExpectedOutcome: [
    'Total Reach',
    'Total Engagement',
    'Total Leads',
    'Average CPL',
    'ROI Indicator (Good / Moderate / Needs Improvement)',
  ],
}

export const CAMPAIGN_PLANS = {
  instagram: INSTAGRAM_PLAN,
  facebook: FACEBOOK_PLAN,
}

export const getCampaignPlanByKey = (planKey = 'instagram') => {
  return CAMPAIGN_PLANS[planKey] || CAMPAIGN_PLANS.instagram
}

export const inferPlanKeyFromTemplateTitle = (title = '') => {
  const value = String(title).toLowerCase()
  if (value.includes('facebook')) return 'facebook'
  return 'instagram'
}

export const parsePlanKeyFromNotes = (notes = '') => {
  const match = String(notes).match(/Plan Key:\s*(\w+)/i)
  if (!match) return null
  return String(match[1]).toLowerCase()
}

// Backward-compatible exports used by existing analytics page
export const INSTAGRAM_PACKAGE = INSTAGRAM_PLAN.package
export const WEEKLY_PLAN = INSTAGRAM_PLAN.phases
export const FINAL_EXPECTED_OUTCOME = INSTAGRAM_PLAN.finalExpectedOutcome
export const CAMPAIGN_METRIC_FIELDS = INSTAGRAM_PLAN.phases.flatMap((phase) => phase.requiredMetrics)
