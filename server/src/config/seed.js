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
        downloadUrl: "/toolkits/Business_Model_Canvas_Toolkit.pdf"
      },
      {
        title: "Market Research Toolkit",
        category: "Research",
        description: "Validate market demand and analyze competitors.",
        content:
          "Target market, competitor analysis, demand validation steps, survey ideas, pilot testing checklist...",
        downloadUrl: "/toolkits/Market_Research_Toolkit.pdf"
      },
      {
        title: "Customer Persona Builder",
        category: "Persona",
        description: "Define target user persona clearly.",
        content:
          "Name, Age, Goals, Frustrations, Buying behavior, Channels, Price sensitivity...",
        downloadUrl: "/toolkits/Customer_Persona_Template.pdf"
      },
      {
        title: "SWOT Analysis Toolkit",
        category: "Strategy",
        description: "Analyze strengths, weaknesses, opportunities, threats.",
        content:
          "SWOT matrix + prompts to fill Strengths, Weaknesses, Opportunities, Threats with examples...",
        downloadUrl: "/toolkits/SWOT_Analysis_Toolkit.pdf"
      },
      {
        title: "Lean Startup Guide",
        category: "Startup",
        description: "MVP + Build-Measure-Learn approach.",
        content:
          "Problem validation, MVP checklist, Build-Measure-Learn loop, iteration plan...",
        downloadUrl: "/toolkits/Lean_Startup_Guide.pdf"
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