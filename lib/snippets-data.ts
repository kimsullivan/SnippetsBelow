export type SnippetCategory =
  | "Most commonly used"
  | "Paraphrased"
  | "Concise"
  | "Funder aligned";

export interface Snippet {
  text: string;
  categories: SnippetCategory[];
}

export const snippets: Snippet[] = [
  {
    text: "Our organization is committed to delivering impactful community programs.",
    categories: ["Most commonly used"]
  },
  {
    text: "We regularly assess our projects to ensure alignment with funder priorities.",
    categories: ["Funder aligned"]
  },
  {
    text: "We measure success by tracking key outcomes.",
    categories: ["Concise"]
  },
  {
    text: "Our team adapts strategies based on feedback and results.",
    categories: ["Paraphrased"]
  },
  {
    text: "We use evidence-based approaches to maximize impact.",
    categories: ["Most commonly used", "Funder aligned"]
  },
  {
    text: "We tailor our services to meet the unique needs of each community.",
    categories: ["Paraphrased", "Concise"]
  },
  {
    text: "Our reporting process is transparent and data-driven.",
    categories: ["Concise", "Funder aligned"]
  },
  {
    text: "We collaborate with stakeholders to ensure program relevance.",
    categories: ["Most commonly used", "Paraphrased"]
  }
];

export const sources: string[] = [
  "2023 Organization Overview.pdf",
  "FY24 Approved Budget.xlsx",
  "2022 Annual Impact Report.docx",
  "Past Grant Proposal - Youth Empowerment Initiative.pdf",
  "Board of Directors Roster.docx",
  "IRS 501(c)(3) Determination Letter.pdf",
  "2023 Community Needs Assessment.pdf",
  "2021-2023 Strategic Plan.pptx",
  "Sample Funded Proposal - Health Equity.docx"
]; 