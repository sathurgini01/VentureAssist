import CampaignMarketing from "../models/CampaignMarketing.js";

export const campaignOwnerOrAdmin = async (req, res, next) => {
  try {
    const campaign = await CampaignMarketing.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const isOwner = campaign.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Forbidden: not campaign owner" });
    }

    req.campaign = campaign; // attach for controller use
    next();
  } catch (err) {
    next(err);
  }
};