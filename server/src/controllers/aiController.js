import CampaignMarketing from "../models/CampaignMarketing.js";
import { analyzeCampaignWithGemini, safeDiv, pct, money } from "../services/geminiService.js";

export const analyzeCampaignMarketing = async (req, res) => {
  try {
    const campaign = await CampaignMarketing.findById(req.params.id);

    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    // Ownership check (your schema uses owner)
    if (req.user.role !== "admin" && campaign.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden: not your campaign" });
    }

    const m = campaign.metrics || {};

    // If you add impressions/clicks (Option A), these will work.
    const impressions = Number(m.impressions || 0);
    const clicks = Number(m.clicks || 0);

    const leads = Number(m.leads || 0);
    const engagement = Number(m.engagement || 0);
    const sales = Number(m.sales || 0);
    const budget = Number(m.budgetSpentLKR || 0);

    // Derived metrics
    const ctr = safeDiv(clicks, impressions);
    const cpl = leads > 0 ? safeDiv(budget, leads) : 0;
    const cpa = sales > 0 ? safeDiv(budget, sales) : 0;
    const clickToLead = safeDiv(leads, clicks);
    const clickToSale = safeDiv(sales, clicks);

    // Missing data flags (for AI + honesty)
    const missingData = [];
    if (!impressions) missingData.push("impressions");
    if (!clicks) missingData.push("clicks");

    const snapshot = {
      id: campaign._id.toString(),
      title: campaign.title,
      status: campaign.status,
      progress: campaign.progress,
      tasksTotal: campaign.tasks?.length || 0,
      tasksDone: campaign.tasks?.filter((t) => t.isDone).length || 0,
      metrics: {
        impressions,
        clicks,
        leads,
        engagement,
        sales,
        budgetSpentLKR: budget,

        ctrPct: impressions ? pct(ctr) : null,
        cplLKR: leads ? money(cpl) : null,
        cpaLKR: sales ? money(cpa) : null,
        clickToLeadPct: clicks ? pct(clickToLead) : null,
        clickToSalePct: clicks ? pct(clickToSale) : null
      },
      notes: m.notes || "",
      missingData
    };

    if (req.body?.context && typeof req.body.context === "object") {
      snapshot.context = req.body.context;
    }

    const report = await analyzeCampaignWithGemini(snapshot);

    // Optional: store
    campaign.lastAiReport = report;
    campaign.lastAiReportAt = new Date();
    await campaign.save();

    return res.status(200).json({
      message: "Campaign AI analysis generated",
      campaignId: campaign._id,
      snapshot,
      report
    });
  } catch (err) {
    console.error("AI analyze error:", err);
    return res.status(500).json({ message: "AI analysis failed", error: err.message });
  }
};