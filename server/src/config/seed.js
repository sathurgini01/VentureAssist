import Toolkit from "../models/toolkitModel.js";
import Mentor from "../models/mentorModel.js";

export async function seedIfEmpty() {
  // Seed Toolkits
  const toolkitCount = await Toolkit.countDocuments();
  if (toolkitCount === 0) {
    await Toolkit.insertMany([
      {
        title: "Business Model Canvas Template",
        category: "Canvas",
        description: "1-page template to map key business parts.",
        content:
          "Sections: Key Partners, Key Activities, Value Props, Customer Segments, Channels, Revenue Streams, Cost Structure...",
        downloadUrl: "/downloads/toolkits/business-model-canvas.pdf"
      },
      {
        title: "Value Proposition Canvas",
        category: "Canvas",
        description: "Match customer pains with your product gains.",
        content:
          "Customer Jobs, Pains, Gains + Products & Services, Pain Relievers, Gain Creators...",
        downloadUrl: "/downloads/toolkits/value-proposition-canvas.pdf"
      },
      {
        title: "Customer Persona Builder",
        category: "Persona",
        description: "Define target user persona clearly.",
        content:
          "Name, Age, Goals, Frustrations, Buying behavior, Channels, Price sensitivity...",
        downloadUrl: "/downloads/toolkits/customer-persona.pdf"
      },
      {
        title: "Competitor Analysis Checklist",
        category: "Competitor",
        description: "Compare competitors across price/features/USP.",
        content:
          "List competitors, strengths, weaknesses, pricing, channels, reviews summary...",
        downloadUrl: "/downloads/toolkits/competitor-analysis.pdf"
      },
      {
        title: "Pitch Deck Outline",
        category: "Pitch",
        description: "Simple pitch deck structure for startups.",
        content:
          "Problem, Solution, Market, Business Model, Traction, Go-to-market, Team, Ask...",
        downloadUrl: "/downloads/toolkits/pitch-deck-outline.pdf"
      }
    ]);
    console.log("Seeded 5 toolkits ✅");
  }

  // Seed Mentors
  const mentorCount = await Mentor.countDocuments();
  if (mentorCount === 0) {
    await Mentor.insertMany([
      {
        name: "Amal Perera",
        imageUrl: "https://ui-avatars.com/api/?name=Amal+Perera",
        expertise: "Business Strategy",
        bio: "10+ years helping startups validate ideas and build go-to-market plans."
      },
      {
        name: "Shanika Silva",
        imageUrl: "https://ui-avatars.com/api/?name=Shanika+Silva",
        expertise: "Operations",
        bio: "Specialist in operations, delivery planning, and scaling small businesses."
      },
      {
        name: "Dinesh Fernando",
        imageUrl: "https://ui-avatars.com/api/?name=Dinesh+Fernando",
        expertise: "Product",
        bio: "Product mentor: user research, MVP design, and product-market fit guidance."
      }
    ]);
    console.log("Seeded mentors ✅");
  }
}