const Lead = require("../models/Lead");
const validator = require("validator");

const BUDGET_RANGES = ["₹10,000 - ₹25,000", "₹25,000 - ₹50,000", "₹50,000+"];
const LEAD_STATUSES = ["New", "Contacted", "Closed"];

// Create Lead
const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, budget, service, message } = req.body;

    if (!name?.trim() || !email?.trim() || !budget || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, email, budget, and message are required.",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email address." });
    }

    if (!BUDGET_RANGES.includes(budget)) {
      return res.status(400).json({ success: false, message: "Choose a valid budget range." });
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim(),
      company: company?.trim(),
      budget,
      service: service?.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Lead Created Successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Leads
const getLeads = async (req, res) => {
  try {
    const search = req.query.search || "";

    const leads = await Lead.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Lead Status
const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!LEAD_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Choose a valid lead status." });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    lead.status = status;

    await lead.save();

    res.json({
      success: true,
      message: "Lead Status Updated",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Lead
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Lead Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
};
