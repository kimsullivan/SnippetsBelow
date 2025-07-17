"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Download,
  Plus,
  Send,
  Check,
  MessageCircle,
  Wand2,
  ChevronDown,
  ChevronUp,
  Edit3,
  Copy,
  X,
  Sparkles,
  Pin,
  FileText,
  Database,
  BookmarkPlus,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  CornerUpLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import NovelEditor from "./components/NovelEditor";

interface AnswerSnippet {
  title: string
  text: string
  detailedText: string
  category: string
  sources: string[]
  used?: boolean
}

interface Question {
  id: string
  title: string
  field: string
  answers: AnswerSnippet[]
}

interface ChatMessage {
  id: string
  type: "assistant" | "user" | "revision" | "save-prompt"
  content: string
  timestamp: number
  revisedText?: string
  originalText?: string // Add this field
}

interface SavedPrompt {
  id: string
  text: string
}

// 2. Update answer snippets for each question to be more accurate and detailed
// For 'legal-name', 'ein', etc., keep short and factual
// For 'mission', provide several detailed, realistic examples, including one with bullet points
const advisorQuestions: Question[] = [
  {
    id: "legal-name",
    title: "Legal name of organization",
    field: "legal-name",
    answers: [
      {
        title: "Official Registered Name",
        text: "Community Youth Empowerment Center",
        detailedText: "Community Youth Empowerment Center",
        category: "Most commonly used",
        sources: ["IRS Determination Letter.pdf"],
      },
      {
        title: "Alternate Name",
        text: "CYEC",
        detailedText: "CYEC (Community Youth Empowerment Center)",
        category: "Paraphrased",
        sources: ["State Registration.pdf"],
      },
    ],
  },
  {
    id: "ein",
    title: "EIN (Employer Identification Number)",
    field: "ein",
    answers: [
      {
        title: "Primary EIN",
        text: "45-6789012",
        detailedText: "45-6789012",
        category: "Most commonly used",
        sources: ["IRS EIN Assignment.pdf"],
      },
      {
        title: "Alternate EIN",
        text: "12-3456789",
        detailedText: "12-3456789",
        category: "Paraphrased",
        sources: ["Tax Documents.pdf"],
      },
    ],
  },
  {
    id: "org-type",
    title: "Organization type",
    field: "org-type",
    answers: [
      {
        title: "501(c)(3) Tax-Exempt Nonprofit",
        text: "501(c)(3) Non-profit Organization",
        detailedText:
          "501(c)(3) Non-profit Organization - Federally recognized tax-exempt charitable organization under Internal Revenue Code Section 501(c)(3). This designation allows for tax-deductible donations and grants eligibility while maintaining public benefit focus and operational transparency requirements.",
        category: "Most commonly used",
        sources: ["IRS Determination Letter.pdf"],
      },
      {
        title: "Community-Based Organization",
        text: "Community-based Organization",
        detailedText:
          "Community-based Organization (CBO) - A grassroots nonprofit organization that operates within and serves a specific geographic community or population. CBOs are characterized by local leadership, community-driven programming, and deep understanding of local needs and assets.",
        category: "Paraphrased",
        sources: ["Registration Documents.pdf", "Community Charter.pdf"],
      },
      {
        title: "Faith-Based Organization",
        text: "Faith-based Organization",
        detailedText:
          "Faith-based Organization (FBO) - A nonprofit organization that derives its mission and values from religious or spiritual traditions while providing secular services to the broader community. Maintains religious identity while serving people of all backgrounds without discrimination.",
        category: "Funder aligned",
        sources: ["Articles of Incorporation.pdf"],
      },
    ],
  },
  {
    id: "mission",
    title: "Organization mission statement",
    field: "mission",
    answers: [
      {
        title: "Comprehensive Mission Statement",
        text: "Our mission is to empower underserved youth by providing equitable access to education, mentorship, and community resources. We strive to break cycles of poverty and foster lifelong learning through innovative programming and strategic partnerships.",
        detailedText: "Our mission is to empower underserved youth by providing equitable access to education, mentorship, and community resources. We strive to break cycles of poverty and foster lifelong learning through innovative programming and strategic partnerships. Our holistic approach addresses academic, social, and emotional needs, ensuring every young person has the opportunity to thrive.",
        category: "Most commonly used",
        sources: ["Mission Statement.pdf"],
      },
      {
        title: "Mission with Bullets",
        text: "We are committed to:\n- Delivering after-school tutoring and enrichment\n- Facilitating leadership development workshops\n- Providing family support services\n- Promoting civic engagement and advocacy\n- Building safe, inclusive spaces for youth",
        detailedText: "We are committed to:\n- Delivering after-school tutoring and enrichment\n- Facilitating leadership development workshops\n- Providing family support services\n- Promoting civic engagement and advocacy\n- Building safe, inclusive spaces for youth",
        category: "Paraphrased",
        sources: ["Strategic Plan.pdf"],
      },
      {
        title: "Funder-Aligned Mission (Measurable Outcomes)",
        text: "We partner with funders to achieve measurable outcomes for youth, including a 25% increase in high school graduation rates and a 40% improvement in college readiness among program participants by 2026.",
        detailedText: "We partner with funders to achieve measurable outcomes for youth, including a 25% increase in high school graduation rates and a 40% improvement in college readiness among program participants by 2026. Our data-driven approach ensures accountability and continuous improvement.",
        category: "Funder aligned",
        sources: ["Grant Application 2023.pdf", "Funder Guidelines.pdf"],
      },
      {
        title: "Concise Mission",
        text: "Empowering youth to reach their full potential through education and community support.",
        detailedText: "Empowering youth to reach their full potential through education and community support.",
        category: "Concise",
        sources: ["Mission Statement.pdf"],
      },
      {
        title: "Narrative Mission Example",
        text: "At CYEC, we believe every young person deserves the chance to succeed. Our mission is to remove barriers, inspire hope, and create pathways to success for youth in our community. Through collaboration, compassion, and innovation, we are building a brighter future—one child at a time.",
        detailedText: "At CYEC, we believe every young person deserves the chance to succeed. Our mission is to remove barriers, inspire hope, and create pathways to success for youth in our community. Through collaboration, compassion, and innovation, we are building a brighter future—one child at a time.",
        category: "Paraphrased",
        sources: ["Annual Report.pdf"],
      },
    ],
  },
  // Organization's Point of Contact for this Grant Opportunity
  {
    id: "contact-name",
    title: "Name",
    field: "contact-name",
    answers: [
      {
        title: "Professional Leadership Contact",
        text: "Sarah Johnson",
        detailedText:
          "Sarah Johnson - Experienced nonprofit leader with over 15 years in community development and grant management. Holds Master's in Public Administration and has successfully managed over $2M in federal and foundation grants. Known for collaborative leadership style and community engagement expertise.",
        category: "Most commonly used",
        sources: ["Staff Directory.pdf"],
      },
      {
        title: "Academic Leadership",
        text: "Dr. Michael Rodriguez",
        detailedText:
          "Dr. Michael Rodriguez - Academic leader with extensive background in social work and community psychology. PhD in Social Work from State University, with published research in community-based interventions and youth development. Brings both scholarly expertise and practical field experience.",
        category: "Paraphrased",
        sources: ["Leadership Bios.pdf"],
      },
      {
        title: "Credentialed Social Work Professional",
        text: "Jennifer Chen, MSW",
        detailedText:
          "Jennifer Chen, MSW - Licensed clinical social worker with Master of Social Work degree and specialized training in community organizing and program evaluation. Certified in trauma-informed care and has extensive experience working with diverse populations in urban settings.",
        category: "Funder aligned",
        sources: ["Staff Credentials.pdf"],
      },
      {
        title: "Generational Leadership",
        text: "David Thompson Jr.",
        detailedText:
          "David Thompson Jr. - Second-generation community leader continuing family legacy of service. Brings fresh perspective combined with deep community roots and understanding of local history. Active in multiple community coalitions and known for innovative approaches to traditional challenges.",
        category: "Paraphrased",
        sources: ["Board Members.pdf"],
      },
    ],
  },
  {
    id: "contact-title",
    title: "Title",
    field: "contact-title",
    answers: [
      {
        title: "Executive Leadership Position",
        text: "Executive Director",
        detailedText:
          "Executive Director - Chief executive officer responsible for overall organizational leadership, strategic planning, board relations, and external partnerships. Oversees all programmatic and administrative functions while ensuring mission alignment and organizational sustainability.",
        category: "Most commonly used",
        sources: ["Organizational Chart.pdf"],
      },
      {
        title: "Program Operations Management",
        text: "Program Manager",
        detailedText:
          "Program Manager - Mid-level management position responsible for day-to-day program operations, staff supervision, and program evaluation. Serves as liaison between executive leadership and direct service staff while ensuring program quality and compliance with funder requirements.",
        category: "Paraphrased",
        sources: ["Job Descriptions.pdf"],
      },
      {
        title: "Development and Fundraising",
        text: "Development Coordinator",
        detailedText:
          "Development Coordinator - Specialized position focused on fundraising, grant writing, donor relations, and resource development. Responsible for identifying funding opportunities, managing grant applications, and maintaining relationships with foundations, government funders, and individual donors.",
        category: "Funder aligned",
        sources: ["Staff Directory.pdf"],
      },
      {
        title: "Community Relations Leadership",
        text: "Community Outreach Director",
        detailedText:
          "Community Outreach Director - Senior position responsible for external community relations, partnership development, and public representation of the organization. Manages community engagement strategies, coalition participation, and serves as primary spokesperson for community initiatives.",
        category: "Paraphrased",
        sources: ["Program Structure.pdf"],
      },
    ],
  },
  {
    id: "contact-email",
    title: "Email",
    field: "contact-email",
    answers: [
      {
        title: "Executive Leadership Email",
        text: "director@organization.org",
        detailedText:
          "director@organization.org - Primary executive contact email for organizational leadership communications, board correspondence, and high-level partnership discussions. Monitored by executive assistant with priority routing for urgent matters.",
        category: "Most commonly used",
        sources: ["Contact List.pdf"],
      },
      {
        title: "Program Department Contact",
        text: "programs@organization.org",
        detailedText:
          "programs@organization.org - Departmental email for program-related inquiries, participant communications, and operational coordination. Managed by program staff with established response protocols for different types of inquiries.",
        category: "Paraphrased",
        sources: ["Email Directory.pdf"],
      },
      {
        title: "Grant and Funding Contact",
        text: "grants@organization.org",
        detailedText:
          "grants@organization.org - Specialized contact for all grant-related communications, funding inquiries, and development activities. Monitored by development staff with expertise in funder relations and grant compliance requirements.",
        category: "Funder aligned",
        sources: ["Grant Contacts.pdf"],
      },
    ],
  },
  // Organization Profile
  {
    id: "is-501c3",
    title: "Is your organization a 501(c)(3) nonprofit?",
    field: "is-501c3",
    answers: [
      {
        title: "Yes - Confirmed 501(c)(3)",
        text: "Yes",
        detailedText: "Yes - Our organization has received official 501(c)(3) tax-exempt status from the IRS. We maintain compliance with all federal requirements and file annual Form 990 returns.",
        category: "Most commonly used",
        sources: ["IRS Determination Letter.pdf", "Annual 990 Filings.pdf"],
      },
      {
        title: "No - Not Yet Designated",
        text: "No",
        detailedText: "No - We are currently in the process of applying for 501(c)(3) status. Our application is pending with the IRS and we expect approval within the next 6 months.",
        category: "Paraphrased",
        sources: ["IRS Application Status.pdf"],
      },
    ],
  },
  {
    id: "has-fiscal-sponsor",
    title: "If not, does your organization have a fiscal sponsor?",
    field: "has-fiscal-sponsor",
    answers: [
      {
        title: "Yes - Fiscal Sponsor Partnership",
        text: "Yes",
        detailedText: "Yes - We have established a fiscal sponsorship agreement with [Fiscal Sponsor Name], a 501(c)(3) organization that provides financial oversight and grant management services.",
        category: "Most commonly used",
        sources: ["Fiscal Sponsorship Agreement.pdf"],
      },
      {
        title: "No - Independent Operations",
        text: "No",
        detailedText: "No - We operate independently and are responsible for our own financial management and grant administration.",
        category: "Paraphrased",
        sources: ["Organizational Structure.pdf"],
      },
    ],
  },
  {
    id: "year-founded",
    title: "Year organization was founded",
    field: "year-founded",
    answers: [
      {
        title: "Established 2010",
        text: "2010",
        detailedText: "2010 - Our organization was officially incorporated and began operations in 2010, serving the community for over 13 years.",
        category: "Most commonly used",
        sources: ["Articles of Incorporation.pdf", "IRS EIN Assignment.pdf"],
      },
      {
        title: "Community Roots Since 2008",
        text: "2008",
        detailedText: "2008 - While officially incorporated in 2010, our community work began in 2008 as a grassroots initiative before formal organization.",
        category: "Paraphrased",
        sources: ["Community History.pdf"],
      },
    ],
  },
  {
    id: "website",
    title: "Organization website",
    field: "website",
    answers: [
      {
        title: "Primary Website",
        text: "www.cyec.org",
        detailedText: "www.cyec.org - Our main organizational website featuring program information, impact stories, and ways to get involved.",
        category: "Most commonly used",
        sources: ["Marketing Materials.pdf"],
      },
      {
        title: "Program-Specific Site",
        text: "www.youthempowerment.org",
        detailedText: "www.youthempowerment.org - Dedicated website for our youth empowerment programs with detailed information about services and outcomes.",
        category: "Paraphrased",
        sources: ["Program Documentation.pdf"],
      },
    ],
  },
  // Organization Programming
  {
    id: "programming-description",
    title: "Briefly describe your organization's primary programs and services",
    field: "programming-description",
    answers: [
      {
        title: "Comprehensive Youth Services",
        text: "We provide after-school tutoring, mentorship programs, leadership development workshops, family support services, and community engagement initiatives for underserved youth ages 12-24.",
        detailedText: "We provide after-school tutoring, mentorship programs, leadership development workshops, family support services, and community engagement initiatives for underserved youth ages 12-24. Our programs are designed to address academic, social, and emotional needs while building community connections and fostering long-term success.",
        category: "Most commonly used",
        sources: ["Program Overview.pdf", "Annual Report.pdf"],
      },
      {
        title: "Academic Support Focus",
        text: "Our primary focus is academic support through one-on-one tutoring, homework assistance, test preparation, and college readiness programs. We also offer STEM enrichment and literacy development.",
        detailedText: "Our primary focus is academic support through one-on-one tutoring, homework assistance, test preparation, and college readiness programs. We also offer STEM enrichment and literacy development. All programs are evidence-based and designed to improve educational outcomes.",
        category: "Paraphrased",
        sources: ["Academic Programs.pdf"],
      },
      {
        title: "Holistic Youth Development",
        text: "We take a holistic approach to youth development, offering programs in education, health and wellness, arts and culture, civic engagement, and career exploration.",
        detailedText: "We take a holistic approach to youth development, offering programs in education, health and wellness, arts and culture, civic engagement, and career exploration. This comprehensive model ensures we address the whole child and their family context.",
        category: "Funder aligned",
        sources: ["Strategic Plan.pdf"],
      },
    ],
  },
  // Program/Project Overview
  {
    id: "project-name",
    title: "Program/project name",
    field: "project-name",
    answers: [
      {
        title: "Youth Empowerment Initiative",
        text: "Youth Empowerment Initiative",
        detailedText: "Youth Empowerment Initiative - A comprehensive program designed to empower underserved youth through education, mentorship, and community engagement.",
        category: "Most commonly used",
        sources: ["Program Proposal.pdf"],
      },
      {
        title: "Community Learning Hub",
        text: "Community Learning Hub",
        detailedText: "Community Learning Hub - An innovative approach to community-based education and skill development for youth and families.",
        category: "Paraphrased",
        sources: ["Strategic Plan.pdf"],
      },
      {
        title: "Future Leaders Program",
        text: "Future Leaders Program",
        detailedText: "Future Leaders Program - Focused on developing leadership skills, civic engagement, and community service among young people.",
        category: "Funder aligned",
        sources: ["Leadership Development.pdf"],
      },
    ],
  },
  {
    id: "project-summary",
    title: "Brief summary of the program/project",
    field: "project-summary",
    answers: [
      {
        title: "Comprehensive Youth Development",
        text: "This project will expand our existing youth services to reach 200 additional students annually, providing academic support, mentorship, leadership training, and family engagement services. We will implement evidence-based practices and measure outcomes through rigorous evaluation.",
        detailedText: "This project will expand our existing youth services to reach 200 additional students annually, providing academic support, mentorship, leadership training, and family engagement services. We will implement evidence-based practices and measure outcomes through rigorous evaluation. The program addresses critical gaps in services for underserved youth in our community.",
        category: "Most commonly used",
        sources: ["Project Proposal.pdf", "Needs Assessment.pdf"],
      },
      {
        title: "Academic Achievement Focus",
        text: "Our project focuses on improving academic outcomes for middle and high school students through intensive tutoring, college preparation, and family support. We target students at risk of academic failure and provide wraparound services.",
        detailedText: "Our project focuses on improving academic outcomes for middle and high school students through intensive tutoring, college preparation, and family support. We target students at risk of academic failure and provide wraparound services to address barriers to success.",
        category: "Paraphrased",
        sources: ["Academic Programs.pdf"],
      },
      {
        title: "Community Impact Initiative",
        text: "This initiative will create a community learning hub that serves as a central resource for youth development, family support, and community engagement. We will partner with schools, businesses, and other organizations to maximize impact.",
        detailedText: "This initiative will create a community learning hub that serves as a central resource for youth development, family support, and community engagement. We will partner with schools, businesses, and other organizations to maximize impact and create sustainable change.",
        category: "Funder aligned",
        sources: ["Community Impact.pdf"],
      },
    ],
  },
  // Equity/Metrics in Programming
  {
    id: "equity-definition",
    title: "How does your organization define and measure equity in your programming?",
    field: "equity-definition",
    answers: [
      {
        title: "Access and Outcomes Focus",
        text: "We define equity as ensuring all youth have access to high-quality programs regardless of background, and measuring outcomes to ensure we're closing achievement gaps. We track participation rates, outcomes, and satisfaction across demographic groups.",
        detailedText: "We define equity as ensuring all youth have access to high-quality programs regardless of background, and measuring outcomes to ensure we're closing achievement gaps. We track participation rates, outcomes, and satisfaction across demographic groups including race, ethnicity, income level, and geographic location.",
        category: "Most commonly used",
        sources: ["Equity Framework.pdf"],
      },
      {
        title: "Representation and Voice",
        text: "Equity means ensuring diverse representation in our programs and amplifying youth voices in decision-making. We measure this through participant demographics, youth advisory board participation, and program feedback mechanisms.",
        detailedText: "Equity means ensuring diverse representation in our programs and amplifying youth voices in decision-making. We measure this through participant demographics, youth advisory board participation, and program feedback mechanisms that ensure all voices are heard.",
        category: "Paraphrased",
        sources: ["Youth Engagement.pdf"],
      },
      {
        title: "Systemic Change Approach",
        text: "We view equity as addressing systemic barriers that prevent equal access and outcomes. We measure our impact on reducing disparities in educational achievement, college enrollment, and community engagement.",
        detailedText: "We view equity as addressing systemic barriers that prevent equal access and outcomes. We measure our impact on reducing disparities in educational achievement, college enrollment, and community engagement through longitudinal tracking and community partnerships.",
        category: "Funder aligned",
        sources: ["Systemic Change.pdf"],
      },
    ],
  },
  {
    id: "metrics-used",
    title: "What metrics do you use to track progress?",
    field: "metrics-used",
    answers: [
      {
        title: "Academic and Engagement Metrics",
        text: "We track academic performance (grades, test scores, graduation rates), program participation (attendance, engagement), and long-term outcomes (college enrollment, career readiness). We also measure family engagement and community impact.",
        detailedText: "We track academic performance (grades, test scores, graduation rates), program participation (attendance, engagement), and long-term outcomes (college enrollment, career readiness). We also measure family engagement and community impact through surveys, interviews, and partnership evaluations.",
        category: "Most commonly used",
        sources: ["Evaluation Framework.pdf"],
      },
      {
        title: "Social-Emotional Development",
        text: "Our metrics include social-emotional learning outcomes, leadership development, self-efficacy measures, and community service participation. We use validated assessment tools and youth self-reporting.",
        detailedText: "Our metrics include social-emotional learning outcomes, leadership development, self-efficacy measures, and community service participation. We use validated assessment tools and youth self-reporting to capture the full range of developmental outcomes.",
        category: "Paraphrased",
        sources: ["SEL Assessment.pdf"],
      },
      {
        title: "Equity and Access Measures",
        text: "We measure demographic representation, barriers to access, satisfaction across groups, and progress toward closing achievement gaps. We also track community-level indicators of change.",
        detailedText: "We measure demographic representation, barriers to access, satisfaction across groups, and progress toward closing achievement gaps. We also track community-level indicators of change to understand our broader impact on equity.",
        category: "Funder aligned",
        sources: ["Equity Metrics.pdf"],
      },
    ],
  },
  // Budget and Financial Information
  {
    id: "project-budget",
    title: "What is the total project budget?",
    field: "project-budget",
    answers: [
      {
        title: "Comprehensive Budget",
        text: "$250,000",
        detailedText: "$250,000 - Total project budget covering personnel, program materials, evaluation, and administrative costs over the 18-month grant period.",
        category: "Most commonly used",
        sources: ["Budget Worksheet.pdf", "Financial Projections.pdf"],
      },
      {
        title: "Conservative Estimate",
        text: "$200,000",
        detailedText: "$200,000 - Conservative budget estimate based on current program costs and projected expansion needs.",
        category: "Paraphrased",
        sources: ["Cost Analysis.pdf"],
      },
    ],
  },
  {
    id: "funding-request",
    title: "How much funding are you requesting from this grant?",
    field: "funding-request",
    answers: [
      {
        title: "Primary Grant Request",
        text: "$150,000",
        detailedText: "$150,000 - We are requesting $150,000 from this grant to support program expansion and evaluation activities.",
        category: "Most commonly used",
        sources: ["Grant Request Summary.pdf"],
      },
      {
        title: "Partial Funding Request",
        text: "$100,000",
        detailedText: "$100,000 - Partial funding request to supplement existing resources and leverage additional support.",
        category: "Paraphrased",
        sources: ["Funding Strategy.pdf"],
      },
    ],
  },
  // Timeline and Implementation
  {
    id: "project-timeline",
    title: "What is the project timeline?",
    field: "project-timeline",
    answers: [
      {
        title: "18-Month Implementation",
        text: "18 months",
        detailedText: "18 months - The project will run for 18 months, with program launch in month 1, full implementation by month 3, and evaluation and reporting in the final 3 months.",
        category: "Most commonly used",
        sources: ["Project Timeline.pdf", "Implementation Plan.pdf"],
      },
      {
        title: "12-Month Accelerated Timeline",
        text: "12 months",
        detailedText: "12 months - Accelerated timeline to meet urgent community needs, with rapid implementation and immediate impact measurement.",
        category: "Paraphrased",
        sources: ["Accelerated Plan.pdf"],
      },
    ],
  },
  {
    id: "implementation-phases",
    title: "Describe the implementation phases of your project",
    field: "implementation-phases",
    answers: [
      {
        title: "Three-Phase Approach",
        text: "Phase 1 (Months 1-3): Planning and setup. Phase 2 (Months 4-15): Full program implementation. Phase 3 (Months 16-18): Evaluation and sustainability planning.",
        detailedText: "Phase 1 (Months 1-3): Planning and setup including staff hiring, partner coordination, and program design finalization. Phase 2 (Months 4-15): Full program implementation with ongoing monitoring and adjustment. Phase 3 (Months 16-18): Evaluation and sustainability planning to ensure long-term impact.",
        category: "Most commonly used",
        sources: ["Implementation Plan.pdf"],
      },
      {
        title: "Pilot to Scale Model",
        text: "Pilot phase (Months 1-6): Small-scale testing with 50 students. Scale-up phase (Months 7-15): Expansion to full capacity. Evaluation phase (Months 16-18): Comprehensive assessment and planning.",
        detailedText: "Pilot phase (Months 1-6): Small-scale testing with 50 students to refine program model and identify best practices. Scale-up phase (Months 7-15): Expansion to full capacity serving 200 students. Evaluation phase (Months 16-18): Comprehensive assessment and planning for sustainability.",
        category: "Paraphrased",
        sources: ["Pilot Program.pdf"],
      },
    ],
  },
  // Partnerships and Collaboration
  {
    id: "key-partners",
    title: "Who are your key partners in this project?",
    field: "key-partners",
    answers: [
      {
        title: "School District Partnership",
        text: "Local School District, Community College, United Way, and local businesses",
        detailedText: "Local School District - Provides facilities and student referrals. Community College - Offers dual enrollment opportunities. United Way - Provides volunteer coordination and additional funding. Local businesses - Offer internships and career exploration opportunities.",
        category: "Most commonly used",
        sources: ["Partnership Agreements.pdf", "MOU Documents.pdf"],
      },
      {
        title: "Community Coalition",
        text: "Faith-based organizations, healthcare providers, and youth-serving agencies",
        detailedText: "Faith-based organizations - Provide meeting spaces and community connections. Healthcare providers - Offer health education and wellness programming. Youth-serving agencies - Coordinate services and avoid duplication.",
        category: "Paraphrased",
        sources: ["Community Partners.pdf"],
      },
    ],
  },
  {
    id: "partnership-roles",
    title: "What role will each partner play in the project?",
    field: "partnership-roles",
    answers: [
      {
        title: "Defined Responsibilities",
        text: "School District: Facilities and referrals. College: Academic support. United Way: Volunteer management. Businesses: Career exposure and internships.",
        detailedText: "School District: Provides facilities, student referrals, and academic data sharing. College: Offers academic support, dual enrollment, and college readiness programming. United Way: Manages volunteer recruitment, training, and coordination. Businesses: Provide career exposure, internships, and mentorship opportunities.",
        category: "Most commonly used",
        sources: ["Partnership Roles.pdf"],
      },
      {
        title: "Collaborative Model",
        text: "All partners contribute to program design, implementation, and evaluation through regular coordination meetings and shared decision-making.",
        detailedText: "All partners contribute to program design, implementation, and evaluation through regular coordination meetings and shared decision-making. This collaborative approach ensures buy-in and maximizes community resources.",
        category: "Paraphrased",
        sources: ["Collaboration Framework.pdf"],
      },
    ],
  },
  // Sustainability and Impact
  {
    id: "sustainability-plan",
    title: "How will you sustain this project after the grant period?",
    field: "sustainability-plan",
    answers: [
      {
        title: "Multi-Source Funding Strategy",
        text: "We will diversify funding through individual donations, corporate sponsorships, government contracts, and earned income from program fees for families who can afford them.",
        detailedText: "We will diversify funding through individual donations, corporate sponsorships, government contracts, and earned income from program fees for families who can afford them. We are also building an endowment fund for long-term sustainability.",
        category: "Most commonly used",
        sources: ["Sustainability Plan.pdf", "Fundraising Strategy.pdf"],
      },
      {
        title: "Institutional Integration",
        text: "We will integrate successful program components into existing school and community systems to ensure ongoing support and institutionalization.",
        detailedText: "We will integrate successful program components into existing school and community systems to ensure ongoing support and institutionalization. This includes training school staff and building capacity within partner organizations.",
        category: "Paraphrased",
        sources: ["Integration Strategy.pdf"],
      },
    ],
  },
  {
    id: "long-term-impact",
    title: "What long-term impact do you expect this project to have?",
    field: "long-term-impact",
    answers: [
      {
        title: "Educational and Economic Impact",
        text: "We expect increased high school graduation rates, higher college enrollment, improved career readiness, and stronger community engagement among participants and their families.",
        detailedText: "We expect increased high school graduation rates, higher college enrollment, improved career readiness, and stronger community engagement among participants and their families. This will contribute to reduced poverty and stronger community fabric.",
        category: "Most commonly used",
        sources: ["Impact Projections.pdf"],
      },
      {
        title: "Systemic Change",
        text: "We anticipate creating lasting changes in how schools and communities support youth development, leading to improved systems and policies.",
        detailedText: "We anticipate creating lasting changes in how schools and communities support youth development, leading to improved systems and policies that will benefit future generations of youth.",
        category: "Paraphrased",
        sources: ["Systems Change.pdf"],
      },
    ],
  },
  // Risk Management
  {
    id: "potential-challenges",
    title: "What challenges do you anticipate and how will you address them?",
    field: "potential-challenges",
    answers: [
      {
        title: "Staffing and Participation Challenges",
        text: "We anticipate challenges with staff recruitment and student attendance. We will address these through competitive compensation, flexible scheduling, and strong family engagement strategies.",
        detailedText: "We anticipate challenges with staff recruitment and student attendance. We will address these through competitive compensation, flexible scheduling, and strong family engagement strategies including transportation assistance and flexible program hours.",
        category: "Most commonly used",
        sources: ["Risk Management Plan.pdf"],
      },
      {
        title: "Partnership Coordination",
        text: "Coordinating multiple partners may be challenging. We will establish clear communication protocols, regular meetings, and shared accountability measures.",
        detailedText: "Coordinating multiple partners may be challenging. We will establish clear communication protocols, regular meetings, and shared accountability measures to ensure smooth collaboration.",
        category: "Paraphrased",
        sources: ["Partnership Management.pdf"],
      },
    ],
  },
  {
    id: "contingency-plans",
    title: "What contingency plans do you have in place?",
    field: "contingency-plans",
    answers: [
      {
        title: "Backup Strategies",
        text: "We have backup staff, alternative facilities, and flexible program models that can adapt to changing circumstances while maintaining program quality.",
        detailedText: "We have backup staff, alternative facilities, and flexible program models that can adapt to changing circumstances while maintaining program quality. We also maintain emergency funds for unexpected costs.",
        category: "Most commonly used",
        sources: ["Contingency Plans.pdf"],
      },
      {
        title: "Adaptive Programming",
        text: "Our program design allows for adaptation to different delivery methods (in-person, hybrid, virtual) based on community needs and circumstances.",
        detailedText: "Our program design allows for adaptation to different delivery methods (in-person, hybrid, virtual) based on community needs and circumstances. This flexibility ensures we can continue serving youth regardless of external challenges.",
        category: "Paraphrased",
        sources: ["Adaptive Design.pdf"],
      },
    ],
  },
  // Evaluation and Learning
  {
    id: "evaluation-approach",
    title: "How will you evaluate the success of this project?",
    field: "evaluation-approach",
    answers: [
      {
        title: "Comprehensive Evaluation",
        text: "We will use a mixed-methods approach including quantitative data collection, qualitative interviews, and participatory evaluation with youth and families.",
        detailedText: "We will use a mixed-methods approach including quantitative data collection, qualitative interviews, and participatory evaluation with youth and families. We will also conduct external evaluation to ensure objectivity.",
        category: "Most commonly used",
        sources: ["Evaluation Plan.pdf"],
      },
      {
        title: "Real-Time Learning",
        text: "We will implement continuous monitoring and feedback systems to learn and adapt throughout the project period.",
        detailedText: "We will implement continuous monitoring and feedback systems to learn and adapt throughout the project period. This includes regular check-ins with participants and partners to identify what's working and what needs adjustment.",
        category: "Paraphrased",
        sources: ["Learning Framework.pdf"],
      },
    ],
  },
  {
    id: "success-indicators",
    title: "What are your key success indicators?",
    field: "success-indicators",
    answers: [
      {
        title: "Quantitative and Qualitative Measures",
        text: "Key indicators include: 90% program attendance, 25% improvement in academic performance, 80% parent satisfaction, and 60% of participants reporting increased confidence and leadership skills.",
        detailedText: "Key indicators include: 90% program attendance, 25% improvement in academic performance, 80% parent satisfaction, and 60% of participants reporting increased confidence and leadership skills. We will also track long-term outcomes like high school graduation and college enrollment.",
        category: "Most commonly used",
        sources: ["Success Metrics.pdf"],
      },
      {
        title: "Holistic Development",
        text: "We will measure academic growth, social-emotional development, community engagement, and family strengthening as indicators of comprehensive youth development.",
        detailedText: "We will measure academic growth, social-emotional development, community engagement, and family strengthening as indicators of comprehensive youth development. These measures reflect our holistic approach to youth success.",
        category: "Paraphrased",
        sources: ["Holistic Metrics.pdf"],
      },
    ],
  },
]

const quickPolishPrompts = [
  "Make funder aligned",
  "Match word count",
  "Add concrete examples",
  "Make more persuasive",
]

const proactivePrompts = [
  "Should we include measurable outcomes or statistics?",
  "Would you prefer a more formal tone for this section?",
  "Can I help you strengthen the impact statement?",
  "Would you like me to emphasize community benefits more?",
  "Should we add information about your track record?",
]

// Pre-filled data from organization documents
const prefilledData = {
  "legal-name": "Community Youth Empowerment Center",
  ein: "45-6789012",
  "org-type": "nonprofit",
  "contact-name": "Sarah Johnson",
  "contact-title": "Executive Director",
  "contact-email": "director@cyec.org",
}

// Sample saved prompts
const initialSavedPrompts: SavedPrompt[] = [
  {
    id: "1",
    text: "Make this sound more compelling for foundation funders",
  },
  {
    id: "2",
    text: "Add specific data and metrics to strengthen this section",
  },
  {
    id: "3",
    text: "Rewrite this to emphasize community impact and outcomes",
  },
  {
    id: "4",
    text: "Make this more concise while keeping the key points",
  },
  {
    id: "5",
    text: "Adjust the language to be more formal and professional",
  },
]

const getDifferences = (original: string, revised: string) => {
  const differences = []

  // Length comparison
  if (revised.length < original.length * 0.8) {
    differences.push("Made more concise (reduced length)")
  } else if (revised.length > original.length * 1.2) {
    differences.push("Added more detail and context")
  }

  // Professional language detection
  if (revised.includes("organization") && !original.includes("organization")) {
    differences.push("Used more professional terminology")
  }

  // Metrics detection
  if (/\d+%|\d+\+|annually|serving \d+/.test(revised) && !/\d+%|\d+\+|annually|serving \d+/.test(original)) {
    differences.push("Added specific metrics and numbers")
  }

  // Tone changes
  if (revised.includes("evidence-based") || revised.includes("measurable outcomes")) {
    differences.push("Adjusted tone for grant reviewers")
  }

  // Examples detection
  if (revised.includes("including") || revised.includes("such as") || revised.includes("through")) {
    differences.push("Added concrete examples")
  }

  // Compelling language
  if (revised.includes("innovative") || revised.includes("transformative") || revised.includes("lasting impact")) {
    differences.push("Enhanced with more compelling language")
  }

  // Fallback if no specific changes detected
  if (differences.length === 0) {
    differences.push("Refined language and structure")
  }

  return differences
}

export default function GrantApplicationForm() {
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null)
  const [chatInput, setChatInput] = useState("")
  const [answerStates, setAnswerStates] = useState<{ [key: string]: boolean[] }>({})
  console.log('RENDER: grant-application-form.tsx, answerStates:', answerStates)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showPolishSuggestion, setShowPolishSuggestion] = useState<{ [key: string]: boolean }>({})
  const [formData, setFormData] = useState<{ [key: string]: string }>({
    "legal-name": "",
    ein: "",
    "org-type": "",
    mission: "", // Keep mission empty to focus on long-form content
    "contact-name": "",
    "contact-title": "",
    "contact-email": "",
    "is-501c3": "",
    "has-fiscal-sponsor": "",
    "year-founded": "",
    website: "",
    "programming-description": "",
    "project-name": "",
    "project-summary": "",
    "equity-definition": "",
    "metrics-used": "",
    "project-budget": "",
    "funding-request": "",
    "project-timeline": "",
    "implementation-phases": "",
    "key-partners": "",
    "partnership-roles": "",
    "sustainability-plan": "",
    "long-term-impact": "",
    "potential-challenges": "",
    "contingency-plans": "",
    "evaluation-approach": "",
    "success-indicators": "",
  })
  const [polishRequested, setPolishRequested] = useState<{ [key: string]: boolean }>({})
  const [snippetsExpanded, setSnippetsExpanded] = useState<{ [key: string]: boolean }>({})
  const [hasAddedFirstAnswer, setHasAddedFirstAnswer] = useState<{ [key: string]: boolean }>({})
  const [pinnedAnswer, setPinnedAnswer] = useState<AnswerSnippet | null>(null)
  const [quickPromptsUsed, setQuickPromptsUsed] = useState<{ [key: string]: boolean }>({})
  const [polishUsed, setPolishUsed] = useState<{ [key: string]: boolean }>({})
  const [showSourceMaterial, setShowSourceMaterial] = useState(false)
  const [showSavedPrompts, setShowSavedPrompts] = useState(false)
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>(initialSavedPrompts)
  const [isLoading, setIsLoading] = useState(true)
  const [currentlyFilling, setCurrentlyFilling] = useState<string | null>(null)
  const [visibleSnippets, setVisibleSnippets] = useState<number>(0)
  const [isPolishMode, setIsPolishMode] = useState(false)
  const [visitedQuestions, setVisitedQuestions] = useState<{ [id: string]: boolean }>({});
  const [loadingQuestions, setLoadingQuestions] = useState<{ [id: string]: boolean }>({});
  const [showAdvisorHeaderFade, setShowAdvisorHeaderFade] = useState(false);
  const advisorContentRef = useRef<HTMLDivElement>(null);
  // Add textarea ref
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 1. Add new state for added snippets
  const [addedSnippets, setAddedSnippets] = useState<{ [field: string]: Set<number> }>({});

  // 1. Add state for revision review and save prompt
  const [reviewingRevision, setReviewingRevision] = useState<{ revisedText: string, originalText: string } | null>(null);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [savedRevisions, setSavedRevisions] = useState<{ text: string, original: string }[]>([]);

  // 1. Add per-question mode state
  const [questionModes, setQuestionModes] = useState<{ [key: string]: 'snippets' | 'revise' | 'review' }>({});
  const [previousAnswers, setPreviousAnswers] = useState<{ [key: string]: string }>({});

  // 1. Add a stack for previous revisions per field
  const [revisionHistory, setRevisionHistory] = useState<{ [key: string]: string[] }>({});
  const [hasPendingRevision, setHasPendingRevision] = useState<{ [key: string]: boolean }>({});

  // 2. Inline diff function (simple word-level diff)
  function diffWords(oldStr: string, newStr: string) {
    const oldWords = oldStr.split(/(\s+)/);
    const newWords = newStr.split(/(\s+)/);
    let result: React.ReactNode[] = [];
    let i = 0, j = 0;
    while (i < oldWords.length || j < newWords.length) {
      if (oldWords[i] === newWords[j]) {
        result.push(oldWords[i]);
        i++; j++;
      } else if (newWords[j] && !oldWords.includes(newWords[j])) {
        // Subtle twilight highlight for additions/changes, but text color #333
        result.push(<span style={{ background: '#ede9fe', color: '#333', fontWeight: 500 }}>{newWords[j]}</span>);
        j++;
      } else if (oldWords[i] && !newWords.includes(oldWords[i])) {
        result.push(<span style={{ color: '#b91c1c', textDecoration: 'line-through' }}>{oldWords[i]}</span>);
        i++;
      } else {
        // modification
        result.push(<span style={{ background: '#ede9fe', color: '#333', fontWeight: 500 }}>{newWords[j] || ''}</span>);
        i++; j++;
      }
    }
    return result;
  }

  // Function to animate text rewriting with typewriter effect
  const animateTextRewrite = (fieldId: string, newText: string, originalText: string) => {
    const fieldElement = document.getElementById(fieldId) as HTMLInputElement | HTMLTextAreaElement;
    if (!fieldElement) return;
    const oldText = originalText;
    fieldElement.value = '';
    setFormData((prev) => ({ ...prev, [fieldId]: '' }));
    let currentIndex = 0;
    setHasPendingRevision((prev) => ({ ...prev, [fieldId]: true }));
    // Save previous revision to stack
    setRevisionHistory((prev) => ({
      ...prev,
      [fieldId]: [...(prev[fieldId] || []), originalText],
    }));
    const typeInterval = setInterval(() => {
      if (currentIndex < newText.length) {
        const currentChar = newText[currentIndex];
        const currentText = fieldElement.value + currentChar;
        fieldElement.value = currentText;
        setFormData((prev) => ({ ...prev, [fieldId]: currentText }));
        if (fieldElement.tagName === 'TEXTAREA') {
          fieldElement.style.height = 'auto';
          fieldElement.style.height = Math.min(fieldElement.scrollHeight, 600) + 'px';
        }
        // Animate new/changed text
        if (currentIndex >= oldText.length || currentChar !== oldText[currentIndex]) {
          fieldElement.style.backgroundColor = '#fef3c7';
          fieldElement.style.transition = 'background-color 0.1s, box-shadow 0.2s';
          fieldElement.style.boxShadow = '0 0 0 2px #fbbf24, 0 2px 8px #fde68a55';
        }
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          fieldElement.style.backgroundColor = '';
          fieldElement.style.boxShadow = '';
        }, 1000);
      }
    }, 3); // Faster animation
  };

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (advisorContentRef.current) {
      // Scroll to bottom with 32px offset from the bottom
      const scrollHeight = advisorContentRef.current.scrollHeight
      const clientHeight = advisorContentRef.current.clientHeight
      advisorContentRef.current.scrollTop = scrollHeight - clientHeight - 32
    }
  }

  // Initial scroll to bottom on mount
  useEffect(() => {
    setTimeout(() => {
      scrollToBottom()
    }, 100)
  }, [])

  useEffect(() => {
    console.log("Chat messages changed:", chatMessages)
    scrollToBottom()
  }, [chatMessages, activeQuestion])

  useEffect(() => {
    if (activeQuestion) {
      console.log('DEBUG: answerStates after update:', answerStates)
      console.log('DEBUG: current field:', activeQuestion.field)
    }
  }, [answerStates, activeQuestion])

  // Handler for scroll event
  const handleAdvisorScroll = () => {
    const el = advisorContentRef.current;
    if (!el) return;
    setShowAdvisorHeaderFade(el.scrollTop > 0);
  };

  // Update generateRevision to follow the quick prompt direction
  const generateRevision = (prompt: string, currentText: string, fieldType: string) => {
    switch (prompt) {
      case "Make funder aligned":
        return (
          currentText +
          " Our outcomes are measured in partnership with funders to ensure accountability and maximize impact. This aligns with funder priorities, as most funders seek clear, measurable results and evidence of effective use of resources."
        );
      case "Match word count":
        return (
          currentText.length > 100
            ? currentText.slice(0, 100) + "..."
            : currentText +
              " (Expanded to meet word count requirements by providing additional context and details about our programs and their impact.)"
        );
      case "Add concrete examples":
        return (
          currentText +
          " For example, last year we launched a STEM club, organized a youth leadership summit, and provided 1:1 mentorship to over 50 students."
        );
      case "Make more persuasive":
        return (
          "By supporting our mission, you are investing in the future of our community. " + currentText +
          " Join us in creating lasting change for generations to come."
        );
      default:
        return currentText;
    }
  };

  // Add header and question refs
  const headerRef = useRef<HTMLDivElement>(null);
  const questionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Add a ref for the snippet list container
  const snippetListRef = useRef<HTMLDivElement | null>(null);

  // Add a ref for the first snippet card
  const firstSnippetRef = useRef<HTMLDivElement | null>(null);

  // In handleFieldFocus, after rendering, scroll the first snippet into view with offset
  const handleFieldFocus = (fieldId: string) => {
    const question = advisorQuestions.find((q) => q.id === fieldId);
    if (!question) return;
    setActiveQuestion(question);
    setChatMessages([]);
    setIsPolishMode(false);
    setQuestionModes((prev) => ({ ...prev, [fieldId]: 'snippets' }));
    setTimeout(() => {
      const questionEl = questionRefs.current[fieldId];
      if (questionEl) {
        const rect = questionEl.getBoundingClientRect();
        const headerHeight = 80;
        const offset = rect.top + window.scrollY - headerHeight - 40;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
      if (snippetListRef.current) {
        snippetListRef.current.scrollTop = 0;
      }
    }, 100);
  };

  // 2. Update handleAnswerSelect to use addedSnippets
  const handleAnswerSelect = (field: string, answer: string, answerIndex: number) => {
    console.log('handleAnswerSelect called:', { field, answerIndex, activeQuestion: activeQuestion?.id })
    console.log('Current answerStates:', answerStates)
    
    // Add to form data (always append)
    const currentValue = formData[field as keyof typeof formData]
    const separator = field === "mission" ? " " : currentValue ? " " : ""
    setFormData((prev) => ({ ...prev, [field]: currentValue + separator + answer }))

    // Mark this snippet as added
    setAddedSnippets((prev) => {
      const prevSet = prev[field] ? new Set<number>(prev[field]) : new Set<number>();
      prevSet.add(answerIndex);
      return { ...prev, [field]: prevSet };
    });
    // Do NOT switch to 'review' mode here; stay in 'snippets' mode so user can keep adding snippets
    // setQuestionModes((prev) => ({ ...prev, [field]: 'review' }));

    // Show polish suggestion immediately on first answer added (only if not used before)
    if (!hasAddedFirstAnswer[field] && !polishUsed[field]) {
      setHasAddedFirstAnswer((prev) => ({ ...prev, [field]: true }))
      setTimeout(() => {
        setShowPolishSuggestion((prev) => ({ ...prev, [field]: true }))
      }, 500) // Short delay for smooth UX
    }

    if (field === 'mission') {
      setTimeout(() => resizeMissionTextarea(), 0);
    }
  }

  const handleAnswerRevise = (field: string, answer: string, answerIndex: number) => {
    if (!activeQuestion) return

    // Pin the answer being revised
    const answerToPin = activeQuestion.answers[answerIndex]
    setPinnedAnswer(answerToPin)

    // First add the answer
    handleAnswerSelect(field, answer, answerIndex)

    // Then immediately trigger polish mode
    setTimeout(() => {
      handlePolishRequest()
    }, 100)
  }

  const handlePolishRequest = () => {
    if (!activeQuestion) return

    // Mark polish as used for this field
    setPolishUsed((prev) => ({ ...prev, [activeQuestion.field]: true }))
    setIsPolishMode(true)

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      type: "assistant",
      content:
        "I'd be happy to help polish your response! You can use the quick options below or tell me specifically what you'd like to improve.",
      timestamp: Date.now(),
    }

    setChatMessages((prev) => [...prev, assistantMessage])
    setShowPolishSuggestion((prev) => ({ ...prev, [activeQuestion.field]: false }))
    setPolishRequested((prev) => ({ ...prev, [activeQuestion.field]: true }))
  }

  const handleQuickPolish = (prompt: string) => {
    if (!activeQuestion) return
    const currentValue = formData[activeQuestion.field as keyof typeof formData]
    const revisedText = generateRevision(prompt, currentValue, activeQuestion.field)

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: prompt,
      timestamp: Date.now(),
    }

    // Generate explanation of changes
    let changeExplanation = "";
    if (prompt === "Make funder aligned") {
      changeExplanation = "I've made your answer more professional and funder-aligned by using formal language and emphasizing measurable outcomes to demonstrate credibility.";
    } else if (prompt === "Match word count") {
      changeExplanation = "I've adjusted your answer to meet word count requirements while maintaining all key information and ensuring it fits within grant application constraints.";
    } else if (prompt === "Add concrete examples") {
      changeExplanation = "I've added specific examples and concrete details to make your answer more tangible and credible for grant reviewers.";
    } else if (prompt === "Make more persuasive") {
      changeExplanation = "I've made your answer more persuasive by adding compelling language and emphasizing the impact and benefits to convince grant reviewers.";
    }

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      type: "assistant",
      content: changeExplanation,
      timestamp: Date.now(),
    }

    setChatMessages((prev) => [...prev, userMessage, assistantMessage])

    // Animate the text rewrite
    animateTextRewrite(activeQuestion.field, revisedText, currentValue)

    // Mark quick prompts as used and add proactive follow-up
    setQuickPromptsUsed((prev) => ({ ...prev, [activeQuestion.field]: true }))

    // Add proactive follow-up after a delay
    setTimeout(() => {
      const randomProactivePrompt = proactivePrompts[Math.floor(Math.random() * proactivePrompts.length)]
      const proactiveMessage: ChatMessage = {
        id: `assistant-proactive-${Date.now()}`,
        type: "assistant",
        content: randomProactivePrompt,
        timestamp: Date.now(),
      }
      setChatMessages((prev) => [...prev, proactiveMessage])
    }, 1500)

    setHasPendingRevision((prev) => ({ ...prev, [activeQuestion.field]: true }))
  }

  const handleUseRevision = (revisedText: string) => {
    if (!activeQuestion) return
    
    // Update form data directly
    setFormData((prev) => ({ ...prev, [activeQuestion.field]: revisedText }))
    
    // Add a confirmation message to the chat
    const confirmationMessage: ChatMessage = {
      id: `assistant-confirmation-${Date.now()}`,
      type: "assistant",
      content: "✅ Revision applied! Your answer has been updated with the suggested changes.",
      timestamp: Date.now(),
    }
    
    setChatMessages((prev) => [...prev, confirmationMessage])
    
    // Scroll to bottom to show the confirmation
    setTimeout(() => scrollToBottom(), 100)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'mission') setTimeout(resizeMissionTextarea, 0);
  }

  const handleGeneralChatMessage = () => {
    console.log("Sending general message:", chatInput)
    if (!chatInput.trim()) {
      return
    }

    const userTimestamp = Date.now()
    const userMessage: ChatMessage = {
      id: `user-${userTimestamp}`,
      type: "user",
      content: chatInput,
      timestamp: userTimestamp,
    }

    // Add user message immediately
    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsTyping(true)

    // Simulate typing delay and generate response
    setTimeout(() => {
      setIsTyping(false)
      
      const userInput = chatInput.toLowerCase()
      let aiResponse = ""

      if (userInput.includes("help") || userInput.includes("what can you do")) {
        aiResponse = "I'm here to help you with your grant application! I can:\n\n• Help you revise and improve your answers\n• Suggest ways to make your responses more compelling\n• Add specific examples and details\n• Adjust the tone and style of your writing\n• Provide guidance on grant writing best practices\n\nClick on any question field to start working with me on that specific answer!"
      } else if (userInput.includes("question") || userInput.includes("field")) {
        aiResponse = "To work on a specific question, simply click on any input field in the form above. I'll open up an AI assistant panel where we can collaborate on improving your answer for that particular question."
      } else if (userInput.includes("snippet") || userInput.includes("answer")) {
        aiResponse = "The answer snippets you see are AI-generated suggestions based on your organization's documents. Click on any question field to see these suggestions and add them to your answers. I can also help you revise and improve them!"
      } else {
        aiResponse = "I'd be happy to help with your grant application! Click on any question field above to start working with me on improving your answers. I can help you revise, expand, or refine your responses to make them more compelling for grant reviewers."
      }

        const assistantMessage: ChatMessage = {
          id: `assistant-${userTimestamp + 1}`,
        type: "assistant",
          content: aiResponse,
          timestamp: userTimestamp + 1,
        }
      
      setChatMessages((prev) => [...prev, assistantMessage])
    }, 1500)
  }

  const handleSendMessage = () => {
    console.log("Sending message:", chatInput)
    if (!chatInput.trim() || !activeQuestion) {
      return
    }

    // Use form data directly
    const currentValue = formData[activeQuestion.field as keyof typeof formData] || ""

    const userTimestamp = Date.now()
    const userMessage: ChatMessage = {
      id: `user-${userTimestamp}`,
      type: "user",
      content: chatInput,
      timestamp: userTimestamp,
    }

    // Add user message immediately
    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsTyping(true)

    // Simulate typing delay and generate response
    setTimeout(() => {
      setIsTyping(false)
      
      // Analyze user input and generate appropriate response
      const userInput = chatInput.toLowerCase()
      let aiResponse = ""
      let revisedText = ""
      let shouldRevise = false

      // Always try to generate a revision based on user input
      if (userInput.includes("shorter") || userInput.includes("concise") || userInput.includes("brief")) {
        shouldRevise = true
        revisedText = generateRevision("Make it more concise", currentValue, activeQuestion.field)
        aiResponse = "I've made your answer more concise by removing unnecessary details and focusing on the key points. This helps make your response more impactful and easier for grant reviewers to digest quickly."
      } else if (userInput.includes("longer") || userInput.includes("expand") || userInput.includes("detailed")) {
        shouldRevise = true
        revisedText = generateRevision("Expand on this", currentValue, activeQuestion.field)
        aiResponse = "I've expanded your answer by adding more context, details, and comprehensive explanations to provide grant reviewers with a fuller picture of your organization's approach and capabilities."
      } else if (userInput.includes("professional") || userInput.includes("formal")) {
        shouldRevise = true
        revisedText = generateRevision("Make funder aligned", currentValue, activeQuestion.field)
        aiResponse = "I've made your answer more professional and funder-aligned by using formal language and emphasizing measurable outcomes to demonstrate your organization's credibility and accountability."
      } else if (userInput.includes("persuasive") || userInput.includes("compelling")) {
        shouldRevise = true
        revisedText = generateRevision("Make more persuasive", currentValue, activeQuestion.field)
        aiResponse = "I've made your answer more persuasive by adding compelling language and emphasizing the impact and benefits to convince grant reviewers of the value and importance of funding your project."
      } else if (userInput.includes("example") || userInput.includes("specific")) {
        shouldRevise = true
        revisedText = generateRevision("Add concrete examples", currentValue, activeQuestion.field)
        aiResponse = "I've added specific examples and concrete details to make your answer more tangible and credible for grant reviewers to understand exactly how your organization operates."
      } else if (userInput.includes("word count") || userInput.includes("length")) {
        shouldRevise = true
        revisedText = generateRevision("Match word count", currentValue, activeQuestion.field)
        aiResponse = "I've adjusted your answer to meet word count requirements while maintaining all key information and ensuring it fits within the grant application's constraints."
      } else if (userInput.includes("revise") || userInput.includes("change") || userInput.includes("edit") || userInput.includes("improve")) {
        shouldRevise = true
        revisedText = generateRevision("Expand on this", currentValue, activeQuestion.field)
        aiResponse = "I've revised your answer to improve clarity, flow, and overall effectiveness. The changes enhance readability and make your points more compelling to grant reviewers."
      } else if (userInput.includes("help") || userInput.includes("suggest") || userInput.includes("advice")) {
        // Provide helpful advice
        aiResponse = "I can help you improve your answer! Here are some ways I can assist:\n\n• Make it more concise or detailed\n• Add specific examples and concrete details\n• Make it more professional and funder-aligned\n• Make it more persuasive and compelling\n• Revise the tone or structure\n• Adjust for word count requirements\n\nWhat would you like me to focus on?"
      } else {
        // Default: treat as a revision request
        shouldRevise = true
        revisedText = generateRevision("Expand on this", currentValue, activeQuestion.field)
        aiResponse = "I've revised your answer to improve its overall quality and effectiveness. The changes enhance clarity and make your response more compelling for grant reviewers."
      }

      if (shouldRevise && revisedText) {
        animateTextRewrite(activeQuestion.field, revisedText, currentValue)
        setHasPendingRevision((prev) => ({ ...prev, [activeQuestion.field]: true }))
        
        const assistantMessage: ChatMessage = {
          id: `assistant-${userTimestamp + 1}`,
          type: "assistant",
          content: aiResponse,
          timestamp: userTimestamp + 1,
        }
        setChatMessages((prev) => [...prev, assistantMessage])
      } else {
        const assistantMessage: ChatMessage = {
          id: `assistant-${userTimestamp + 1}`,
          type: "assistant",
          content: aiResponse,
          timestamp: userTimestamp + 1,
        }
        setChatMessages((prev) => [...prev, assistantMessage])
      }
      
      // Scroll to bottom after adding assistant message
      setTimeout(() => scrollToBottom(), 100)
    }, 1500) // 1.5 second typing delay
  }

  const handleClearFocus = () => {
    setActiveQuestion(null)
    // Don't clear chat messages when clearing focus - keep them for general chat
    setPinnedAnswer(null)
    setVisibleSnippets(0)
    setIsPolishMode(false)
  }



  const handleDismissChanges = () => {
    setIsPolishMode(false)
  }

  const handleUnpinAnswer = () => {
    setPinnedAnswer(null)
  }

  const toggleSnippets = () => {
    if (!activeQuestion) return
    setSnippetsExpanded((prev) => ({ ...prev, [activeQuestion.id]: !prev[activeQuestion.id] }))
  }

  const toggleSourceMaterial = () => {
    setShowSourceMaterial(!showSourceMaterial)
    if (showSavedPrompts) {
      setShowSavedPrompts(false)
    }
  }

  const toggleSavedPrompts = () => {
    setShowSavedPrompts(!showSavedPrompts)
    if (showSourceMaterial) {
      setShowSourceMaterial(false)
    }
  }

  const handleUseSavedPrompt = (prompt: SavedPrompt) => {
    setChatInput(prompt.text)
    setShowSavedPrompts(false)
  }

  const handleSaveCurrentPrompt = () => {
    if (!chatInput.trim()) return

    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      text: chatInput,
    }

    setSavedPrompts((prev) => [newPrompt, ...prev])
  }

  // Update renderSourceTags to use gray background, icon, and hover state
  const renderSourceTags = (sources: string[]) => {
    if (sources.length > 2) {
      return (
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="relative group">
            <span className="inline-flex items-center rounded-full bg-gray-100 text-twilight font-medium px-3 py-1 text-xs mr-1 cursor-pointer border border-gray-200 hover:bg-gray-200 transition-colors">
              <FileText className="w-3 h-3 mr-1 text-twilight" />
              {sources.length} Sources
            </span>
            <div className="absolute left-0 z-20 mt-2 hidden group-hover:block bg-white border border-gray-200 rounded shadow-lg p-2 min-w-[160px]">
              {sources.map((source, idx) => (
                <div key={idx} className="flex items-center gap-1 py-1 text-twilight text-xs">
                  <FileText className="w-3 h-3 text-twilight" />
                  {source}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {sources.map((source, index) => (
          <span
            key={index}
            className="inline-flex items-center rounded-full bg-gray-100 text-twilight font-medium px-3 py-1 text-xs mr-1 border border-gray-200 hover:bg-gray-200 transition-colors"
          >
            <FileText className="w-3 h-3 mr-1 text-twilight" />
            {source}
          </span>
        ))}
      </div>
    );
  };

  const getAllSources = () => {
    const allSources = new Set<string>()
    advisorQuestions.forEach((question) => {
      question.answers.forEach((answer) => {
        answer.sources.forEach((source) => allSources.add(source))
      })
    })
    return Array.from(allSources)
  }

  const isFieldPrefilled = (fieldId: string) => {
    return fieldId in prefilledData && prefilledData[fieldId as keyof typeof prefilledData] !== ""
  }

  const hasUsedAnswers = activeQuestion ? answerStates[activeQuestion.field]?.some((used) => used) : false
  const areSnippetsExpanded = activeQuestion ? snippetsExpanded[activeQuestion.id] : false
  const currentFieldValue = activeQuestion ? formData[activeQuestion.field as keyof typeof formData] : ""
  const shouldShowQuickPrompts = activeQuestion && isPolishMode && !quickPromptsUsed[activeQuestion.field]

  const [messageInputFocused, setMessageInputFocused] = useState(false);
  const messageInputValue = chatInput || '';

  // 1. Add state for save animation
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);
  const [savingPromptText, setSavingPromptText] = useState<string | null>(null);

  // 1. Add click-outside logic for sources and saved prompts menus
  const sourcesMenuRef = useRef<HTMLDivElement>(null);
  const savedPromptsMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showSourceMaterial && sourcesMenuRef.current && !sourcesMenuRef.current.contains(event.target as Node)) {
        setShowSourceMaterial(false);
      }
      if (showSavedPrompts && savedPromptsMenuRef.current && !savedPromptsMenuRef.current.contains(event.target as Node)) {
        setShowSavedPrompts(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSourceMaterial, showSavedPrompts]);

  // 2. Add ability to add new sources in the source material menu
  const [newSource, setNewSource] = useState("");
  const [customSources, setCustomSources] = useState<string[]>([]);
  const allSources = [...getAllSources(), ...customSources];

  // Add state to track selected sources
  const [selectedSources, setSelectedSources] = useState<string[]>(allSources);

  // Add state for add source UI and staged sources
  const [showAddSourceInput, setShowAddSourceInput] = useState(false);
  const [stagedSelectedSources, setStagedSelectedSources] = useState<string[]>(selectedSources);
  const [sourcesChanged, setSourcesChanged] = useState(false);

  // Handler to toggle a source in staged selection
  const handleToggleSourceStaged = (source: string) => {
    setStagedSelectedSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
    setSourcesChanged(true);
  };

  // Handler to save staged sources
  const handleSaveSources = () => {
    setSelectedSources(stagedSelectedSources);
    setSourcesChanged(false);
    setShowSourceMaterial(false); // Close the menu after saving
  };

  // Handler to toggle a source
  const handleToggleSource = (source: string) => {
    setSelectedSources(prev =>
      prev.includes(source)
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  // 1. Extract question input rendering to a function
  function renderQuestionInput(q: Question, isActive: boolean) {
    return (
      <div key={q.id} ref={el => { 
        questionRefs.current[q.id] = el; 
      }}>
        <Label 
          htmlFor={q.field} 
          className="text-sm font-medium text-sblack mb-2 block lato-regular cursor-pointer"
          onClick={() => handleFieldFocus(q.field)}
        >
          {q.title}*
        </Label>
        {q.field === "legal-name" || q.field === "ein" || q.field === "contact-name" || q.field === "contact-title" || q.field === "contact-email" || q.field === "year-founded" || q.field === "website" || q.field === "project-name" || q.field === "project-budget" || q.field === "funding-request" || q.field === "project-timeline" ? (
          <Input
            id={q.field}
            value={formData[q.field] || ""}
            onChange={(e) => handleInputChange(q.field, e.target.value)}
            onFocus={() => handleFieldFocus(q.field)}
            onClick={() => handleFieldFocus(q.field)}
            className={cn(
              "w-full px-4 border rounded-xl focus:ring-0 transition-all duration-300 text-sm font-normal",
              isActive ? "border-2 border-twilight bg-gradient-to-br from-twilight-50 to-white shadow-lg" : "border-silver-200 focus:border-twilight"
            )}
            style={{
              height: '40px',
              lineHeight: '40px',
              paddingTop: 0,
              paddingBottom: 0
            }}
          />
        ) : q.field === "mission" ? (
          <Textarea
            ref={missionTextareaRef}
            id={q.field}
            value={formData[q.field] || ""}
            onChange={(e) => {
              handleInputChange(q.field, e.target.value);
              if (q.field === 'mission') resizeMissionTextarea();
            }}
            onFocus={() => handleFieldFocus(q.field)}
            onClick={() => handleFieldFocus(q.field)}
            className={cn(
              "w-full px-4 border rounded-xl focus:ring-0 transition-all duration-300 text-sm font-normal",
              isActive ? "border-2 border-twilight bg-gradient-to-br from-twilight-50 to-white shadow-lg" : "border-silver-200 focus:border-twilight"
            )}
            style={{
              height: 'auto',
              minHeight: '80px',
              maxHeight: '600px',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
              lineHeight: '1.4',
              resize: 'vertical',
              paddingTop: '12px',
              paddingBottom: '12px',
              overflowY: 'auto',
            }}
            onInput={() => resizeMissionTextarea()}
          />
        ) : q.field === "programming-description" || q.field === "project-summary" || q.field === "equity-definition" || q.field === "metrics-used" || q.field === "implementation-phases" || q.field === "key-partners" || q.field === "partnership-roles" || q.field === "sustainability-plan" || q.field === "long-term-impact" || q.field === "potential-challenges" || q.field === "contingency-plans" || q.field === "evaluation-approach" || q.field === "success-indicators" ? (
          <Textarea
            id={q.field}
            value={formData[q.field] || ""}
            onChange={(e) => handleInputChange(q.field, e.target.value)}
            onFocus={() => handleFieldFocus(q.field)}
            onClick={() => handleFieldFocus(q.field)}
            className={cn(
              "w-full px-4 border rounded-xl focus:ring-0 transition-all duration-300 text-sm font-normal",
              isActive ? "border-2 border-twilight bg-gradient-to-br from-twilight-50 to-white shadow-lg" : "border-silver-200 focus:border-twilight"
            )}
            style={{
              height: 'auto',
              minHeight: '80px',
              maxHeight: '400px',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
              lineHeight: '1.4',
              resize: 'vertical',
              paddingTop: '12px',
              paddingBottom: '12px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              const newHeight = Math.min(target.scrollHeight, 400);
              target.style.height = newHeight + 'px';
            }}
          />
        ) : q.field === "org-type" ? (
          <Select
            value={formData[q.field] || ""}
            onValueChange={(value) => handleInputChange(q.field, value)}
            onOpenChange={(open) => open && handleFieldFocus(q.field)}
          >
            <SelectTrigger
              className={cn(
                "w-full px-4 border rounded-xl focus:ring-0 transition-all duration-300",
                isActive ? "border-2 border-twilight bg-gradient-to-br from-twilight-50 to-white shadow-lg" : "border-silver-200 focus:border-twilight"
              )}
              style={{
                height: 'auto',
                minHeight: '48px',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                lineHeight: '1.5'
              }}
            >
              <SelectValue placeholder="Yes or No" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        ) : q.field === "is-501c3" || q.field === "has-fiscal-sponsor" ? (
          <Select
            value={formData[q.field] || ""}
            onValueChange={(value) => handleInputChange(q.field, value)}
            onOpenChange={(open) => open && handleFieldFocus(q.field)}
          >
            <SelectTrigger
              className={cn(
                "w-full px-4 border rounded-xl focus:ring-0 transition-all duration-300",
                isActive ? "border-2 border-twilight bg-gradient-to-br from-twilight-50 to-white shadow-lg" : "border-silver-200 focus:border-twilight"
              )}
              style={{
                height: 'auto',
                minHeight: '48px',
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                lineHeight: '1.5'
              }}
            >
              <SelectValue placeholder="Yes or No" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        ) : q.field === "year-founded" ? (
          <Input
            id={q.field}
            type="number"
            value={formData[q.field] || ""}
            onChange={(e) => handleInputChange(q.field, e.target.value)}
            onFocus={() => handleFieldFocus(q.field)}
            onClick={() => handleFieldFocus(q.field)}
            className={cn(
              "w-full px-4 border rounded-xl focus:ring-0 transition-all duration-300",
              isActive ? "border-2 border-twilight bg-gradient-to-br from-twilight-50 to-white shadow-lg" : "border-silver-200 focus:border-twilight"
            )}
            style={{
              height: 'auto',
              minHeight: '48px',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
              lineHeight: '1.5'
            }}
          />
        ) : q.field === "website" ? (
          <Textarea
            id={q.field}
            value={formData[q.field] || ""}
            onChange={(e) => handleInputChange(q.field, e.target.value)}
            onFocus={() => {
              console.log('URL input focused for field:', q.field);
              handleFieldFocus(q.field);
            }}
            onClick={() => {
              console.log('URL input clicked for field:', q.field);
              handleFieldFocus(q.field);
            }}
            className={cn(
              "w-full px-4 border rounded-xl focus:ring-0 transition-all duration-300 text-sm font-normal",
              isActive ? "border-2 border-twilight bg-gradient-to-br from-twilight-50 to-white shadow-lg" : "border-silver-200 focus:border-twilight"
            )}
            style={{
              height: 'auto',
              minHeight: '48px',
              maxHeight: '200px',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
              lineHeight: '1.4',
              resize: 'none',
              paddingTop: '8px',
              paddingBottom: '8px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              const newHeight = Math.min(target.scrollHeight, 200);
              target.style.height = newHeight + 'px';
            }}
          />
        ) : (
          <Textarea
            id={q.field}
            value={formData[q.field] || ""}
            onChange={(e) => handleInputChange(q.field, e.target.value)}
            onFocus={() => handleFieldFocus(q.field)}
            onClick={() => handleFieldFocus(q.field)}
            className={cn(
              "w-full px-4 border rounded-xl focus:ring-0 transition-all duration-300 text-sm font-normal",
              isActive ? "border-2 border-twilight bg-gradient-to-br from-twilight-50 to-white shadow-lg" : "border-silver-200 focus:border-twilight"
            )}
            style={{
              height: 'auto',
              minHeight: '40px',
              maxHeight: '200px',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              overflowWrap: 'break-word',
              lineHeight: '1',
              resize: 'none',
              paddingTop: '8px',
              paddingBottom: '8px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              const newHeight = Math.min(target.scrollHeight, 200);
              target.style.height = newHeight + 'px';
            }}
          />
        )}
      </div>
    );
  }

  const activeQuestionRef = useRef<HTMLDivElement>(null);

  const appContentRef = useRef<HTMLDivElement>(null); // blue area

  // Add handler for Revise button
  const handleReviseClick = (field: string) => {
    setPreviousAnswers((prev) => ({ ...prev, [field]: formData[field] }));
    setQuestionModes((prev) => ({ ...prev, [field]: 'revise' }));
    setIsPolishMode(true);
    setChatMessages([
      {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: 'How would you like to revise this answer?',
        timestamp: Date.now(),
      },
    ]);
  };

  // Add handler for Confirm & Save
  const handleConfirmSave = (field: string) => {
    setQuestionModes((prev) => ({ ...prev, [field]: 'review' }));
    setIsPolishMode(false);
    setHasPendingRevision((prev) => ({ ...prev, [field]: false }));
    setActiveQuestion(null); // Close the dropdown
  };

  // Add handler for Undo/Dismiss
  const handleUndoRevision = (field: string) => {
    setRevisionHistory((prev) => {
      const stack = prev[field] || [];
      if (stack.length === 0) return prev;
      const last = stack[stack.length - 1];
      setFormData((fprev) => ({ ...fprev, [field]: last }));
      setHasPendingRevision((hprev) => ({ ...hprev, [field]: true }));
      return { ...prev, [field]: stack.slice(0, -1) };
    });
  };

  // Add handler for View Snippets
  const handleViewSnippets = (field: string) => {
    setQuestionModes((prev) => ({ ...prev, [field]: 'snippets' }));
    setIsPolishMode(false);
  };

  // Add a ref for the mission textarea
  const missionTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Function to resize the mission textarea
  function resizeMissionTextarea() {
    const textarea = missionTextareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  // useEffect to resize mission textarea on mission value change
  useEffect(() => {
    resizeMissionTextarea();
  }, [formData['mission']]);

  // Add handleRemoveSnippet function
  const handleRemoveSnippet = (field: string, answerIndex: number, answerText: string) => {
    setAddedSnippets((prev) => {
      const prevSet = prev[field] ? new Set<number>(prev[field]) : new Set<number>();
      prevSet.delete(answerIndex);
      return { ...prev, [field]: prevSet };
    });
    // Remove the answer text from the form field (remove only this snippet's text)
    setFormData((prev) => {
      const currentValue = prev[field] || '';
      // Remove the answerText from the current value (handle both start, middle, end)
      const regex = new RegExp(`\\b${answerText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b[\s,;:]*`, 'g');
      const newValue = currentValue.replace(regex, '').replace(/\s+/g, ' ').trim();
      return { ...prev, [field]: newValue };
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">

      
      {/* Application Section - full width */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-5 flex-shrink-0 sticky top-0 bg-white z-10" ref={headerRef}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-twilight hover:bg-twilight-50 p-1">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-twilight font-medium">Opportunity</span>
                <span className="text-gray-400 text-sm">Saved 12s ago</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="text-sblack border-silver-200 hover:bg-silver-50 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
        {/* Form Content */}
        <div className="flex-1 overflow-y-auto" data-app-scroll ref={appContentRef}>
          <div className="max-w-4xl mx-auto px-8 py-8 pb-8">

            <div className="mb-8">
              {/* Application Title */}
              <h1 className="text-4xl font-bold text-sblack mb-4 leading-tight lato-bold pt-10">
                Foot Locker Foundation Community
                <br />
                Empowerment Program
              </h1>
              <p className="text-smoke-300 text-base leading-relaxed lato-regular">
                This application form captures information for organizations seeking grants and technical assistance.
                <br />
                Please answer all questions as completely as possible.
              </p>
              

            </div>
            {/* Dynamically render all questions grouped by section */}
            {(() => {
              // Define section groupings and their order
              const sectionOrder = [
                {
                  title: "Organizational Structure",
                  ids: ["legal-name", "ein", "org-type", "mission"],
                },
                {
                  title: "Organization's Point of Contact for this Grant Opportunity",
                  ids: ["contact-name", "contact-title", "contact-email"],
                },
                {
                  title: "Organization Profile",
                  ids: ["is-501c3", "has-fiscal-sponsor", "year-founded", "website"],
                },
                {
                  title: "Organization Programming",
                  ids: ["programming-description"],
                },
                {
                  title: "Program/Project Overview",
                  ids: ["project-name", "project-summary"],
                },
                {
                  title: "Equity/Metrics in Programming",
                  ids: ["equity-definition", "metrics-used"],
                },
                {
                  title: "Budget and Financial Information",
                  ids: ["project-budget", "funding-request"],
                },
                {
                  title: "Timeline and Implementation",
                  ids: ["project-timeline", "implementation-phases"],
                },
                {
                  title: "Partnerships and Collaboration",
                  ids: ["key-partners", "partnership-roles"],
                },
                {
                  title: "Sustainability and Impact",
                  ids: ["sustainability-plan", "long-term-impact"],
                },
                {
                  title: "Risk Management",
                  ids: ["potential-challenges", "contingency-plans"],
                },
                {
                  title: "Evaluation and Learning",
                  ids: ["evaluation-approach", "success-indicators"],
                },
              ];
              return (
                <>

                  
                  {sectionOrder.map((section) => (
                    <div className="mb-12" key={section.title}>
                      <h2 className="text-xl font-semibold text-sblack mb-8 lato-bold">{section.title}</h2>
                      <div className="space-y-8">
                        {section.ids.map((qid) => {
                          const q = advisorQuestions.find((q) => q.id === qid);
                          if (!q) {
                            console.log('Question not found for id:', qid);
                            return <div key={qid} className="text-red-500">Question not found: {qid}</div>;
                          }
                          const isActive = !!(activeQuestion && activeQuestion.id === q.id);
                          return (
                            <div key={q.id} ref={el => { questionRefs.current[q.id] = el; }}>
                              {renderQuestionInput(q, isActive)}
                                                            {/* Enhanced Active State with Highlighted Text Feel */}
                              {isActive && (
                                <div 
                                  className="mt-2 rounded-xl border border-twilight bg-gradient-to-br from-twilight-50 via-white to-white shadow-lg flex flex-col overflow-hidden transition-all duration-300 ease-out animate-in slide-in-from-top-2"
                                  style={{ minHeight: '320px', maxHeight: 'calc(100vh - 380px)', borderWidth: 1, marginTop: 8 }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {/* Header */}
                                  <div className="flex items-center justify-between px-4 py-3 border-b border-twilight-200 bg-gradient-to-r from-twilight-50 to-white z-10 flex-shrink-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-base font-bold text-sblack">
                                        {questionModes[q.id] === 'snippets' ? 'Choose a relevant snippet' : questionModes[q.id] === 'revise' ? 'Revise Your Answer' : 'Your Answer'}
                                    </span>
                                  </div>
                                    <div className="flex items-center gap-2">
                                      {/* Show Revise button in snippet/review mode if at least one snippet is added */}
                                      {(questionModes[q.id] === 'snippets' || questionModes[q.id] === 'review') && addedSnippets[q.field] && addedSnippets[q.field].size > 0 && (
                                        <>
                                          <Button className="bg-gradient-to-r from-twilight to-jazzy text-white shadow-lg hover:from-twilight-500 hover:to-jazzy-500 h-9 px-4" onClick={() => handleReviseClick(q.field)}>
                                            <Wand2 className="w-4 h-4 mr-2" /> Revise
                                              </Button>
                                          <Button variant="ghost" size="sm" className="text-smoke-300 hover:bg-gray-100 ml-2" onClick={handleClearFocus} title="Close">
                                            <X className="w-5 h-5" />
                                            </Button>
                                        </>
                                      )}
                                      {/* Show Confirm/Undo/View Snippets in revise mode */}
                                      {questionModes[q.id] === 'revise' && (
                                        <>
                                            <Button
                                              variant="outline"
                                            onClick={() => handleUndoRevision(q.field)}
                                            className="rounded-[8px] border-twilight-200 text-twilight hover:bg-twilight-50 transition-all duration-200 flex items-center justify-center"
                                            title="Previous Revision"
                                          >
                                            <CornerUpLeft className="w-4 h-4" />
                                            </Button>
                                              <Button
                                            variant="outline"
                                            onClick={() => handleViewSnippets(q.field)}
                                            className="rounded-[8px] border-twilight-200 text-twilight hover:bg-twilight-50 transition-all duration-200"
                                          >
                                            View Snippets
                                              </Button>
                                          {hasPendingRevision[q.field] && (
                                              <Button
                                              variant="default"
                                              className="bg-twilight text-white ml-2 rounded-[8px]"
                                              onClick={() => handleConfirmSave(q.field)}
                                            >
                                              Confirm & Save
                                              </Button>
                                            )}
                                          <Button variant="ghost" size="sm" className="text-smoke-300 hover:bg-gray-100 ml-2" onClick={handleClearFocus} title="Close">
                                            <X className="w-5 h-5" />
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  {/* Content */}
                                  <div className="flex-1 overflow-y-auto px-4 py-4" style={{ minHeight: 0 }} ref={advisorContentRef}>
                                    {questionModes[q.id] === 'snippets' && (
                                      <div ref={snippetListRef} style={{ maxHeight: 'calc(100vh - 380px)', overflowY: 'auto' }}>
                                          <div className="space-y-4">
                                            {q.answers.map((answer, index) => {
                                              const isUsed = addedSnippets[q.field]?.has(index) || false;
                                              return (
                                                <Card
                                                  key={index}
                                                ref={index === 0 ? firstSnippetRef : undefined}
                                                className={`transition-all duration-200 border hover:shadow-md transform hover:scale-[1.02] ${isUsed ? 'bg-green-50' : 'border-gray-200 hover:border-twilight-300 hover:bg-gray-50/50'}`}
                                                >
                                                  <CardContent className="p-4">
                                                    <div className="space-y-3">
                                                      <div className="flex justify-between items-start mb-2">
                                                        <div className="flex flex-col gap-0.5">
                                                          <h4 className="font-semibold text-gray-900" style={{ fontSize: '15px', lineHeight: '20px' }}>{answer.title}</h4>
                                                        </div>
                                                      <div className="flex gap-2 items-center">
                                                        <Button size="sm" variant={isUsed ? 'secondary' : 'outline'} onClick={() => isUsed ? handleRemoveSnippet(q.field, index, answer.text) : handleAnswerSelect(q.field, answer.text, index)} className="h-8 px-4 text-sm">
                                                          {isUsed ? <><X className="w-4 h-4 mr-1" />Remove</> : 'Add to answer'}
                                                        </Button>
                                                          <button className="p-1 rounded hover:bg-gray-100"><ThumbsUp className="w-4 h-4 text-gray-400" /></button>
                                                          <button className="p-1 rounded hover:bg-gray-100"><ThumbsDown className="w-4 h-4 text-gray-400" /></button>
                                                        </div>
                                                      </div>
                                                    <p className="text-sm text-gray-700 leading-relaxed transition-colors duration-200 mb-2 break-words whitespace-pre-line">{answer.detailedText}</p>
                                                      <div className="mb-2">{renderSourceTags(answer.sources)}</div>
                                                    </div>
                                                  </CardContent>
                                                </Card>
                                              );
                                            })}
                                          </div>
                                        </div>
                                    )}
                                    {questionModes[q.id] === 'review' && (
                                      <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2">
                                          <Button className="bg-gradient-to-r from-twilight to-jazzy text-white shadow-lg hover:from-twilight-500 hover:to-jazzy-500 h-9 px-4" onClick={() => handleReviseClick(q.field)}>
                                            <Wand2 className="w-4 h-4 mr-2" /> Revise
                                          </Button>
                                  </div>
                                            </div>
                                    )}
                                    {questionModes[q.id] === 'revise' && (
                                      <div className="flex flex-col gap-4">
                                        {/* Chat bubble and quick prompts */}
                                        <div className="flex flex-col gap-2 animate-in fade-in duration-300">
                                          {chatMessages.map((message) => (
                                            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                              <div className={`max-w-[85%] ${message.type === 'user' ? 'bg-[#F5F5F5] text-gray-900' : 'bg-[#F1F1F9] text-gray-900'} rounded-lg px-4 py-3`}>
                                                <p className="text-sm whitespace-pre-line">{message.content}</p>
                                          </div>
                                        </div>
                                          ))}
                                            </div>
                                        {/* Quick prompts row: gap-3 and mb-0 mt-0 for no gap */}
                                        <div className="flex flex-wrap gap-3 mb-0 mt-0 justify-start">
                                          {[...quickPolishPrompts, 'Merge'].map((prompt, idx) => (
                                                  <Button
                                              key={idx}
                                                    size="sm"
                                              variant="outline"
                                              onClick={() => handleQuickPolish(prompt)}
                                              className="h-8 px-3 text-xs border-twilight-200 text-twilight hover:bg-twilight-50 transition-all duration-200 rounded-full flex items-center gap-1 shadow-sm animate-in fade-in duration-300"
                                            >
                                              {prompt === 'Make funder aligned' && <Database className="w-3 h-3 mr-1" />}
                                              {prompt === 'Match word count' && <Edit3 className="w-3 h-3 mr-1" />}
                                              {prompt === 'Add concrete examples' && <Plus className="w-3 h-3 mr-1" />}
                                              {prompt === 'Make more persuasive' && <Sparkles className="w-3 h-3 mr-1" />}
                                              {prompt === 'Merge' && <Pin className="w-3 h-3 mr-1" />}
                                              {prompt}
                                                  </Button>
                                              ))}
                                            </div>
                                        {/* Message input container: remove mt-2 or any margin-top so it sits directly below quick prompts */}
                                        <div className="relative w-full">
                                      <textarea
                                        ref={textareaRef}
                                        id="advisor-message-input"
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                            onKeyPress={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                                            onInput={e => { const target = e.target as HTMLTextAreaElement; target.style.height = 'auto'; target.style.height = Math.min(target.scrollHeight, 160) + 'px'; }}
                                            placeholder="How would you like to revise this answer?"
                                        rows={2}
                                            className="w-full resize-none bg-white border border-gray-200 rounded-[8px] px-4 pt-4 pb-14 text-base focus:ring-2 focus:ring-twilight focus:border-twilight transition-all duration-200 min-h-[56px] max-h-[160px] text-sblack"
                                            style={{ zIndex: 1, height: 'auto', minHeight: '56px', maxHeight: '160px' }}
                                          />
                                          <div className="absolute left-4 right-4 bottom-4 flex flex-row items-end gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={toggleSourceMaterial}
                                              className="text-base font-medium flex items-center gap-1 h-8 px-3 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 rounded-[8px]"
                                              style={{ borderRadius: 8 }}
                                        >
                                          <FileText className="w-4 h-4 mr-1" /> Sources
                                        </Button>
                                            {/* Sources menu popover */}
                                            {showSourceMaterial && (
                                              <div ref={sourcesMenuRef} className="absolute z-50 left-0 bottom-12 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[220px]" style={{ minWidth: 220 }}>
                                                <div className="font-semibold mb-2">All Sources</div>
                                                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                                                  {allSources.map((source, idx) => (
                                                    <label key={idx} className="flex items-center gap-2 cursor-pointer">
                                                      <input
                                                        type="checkbox"
                                                        checked={stagedSelectedSources.includes(source)}
                                                        onChange={() => handleToggleSourceStaged(source)}
                                                        className="accent-twilight"
                                                      />
                                                      <span className="text-sm text-sblack">{source}</span>
                                                    </label>
                                                  ))}
                                                </div>
                                                <div className="flex gap-2 mt-4">
                                                  <Button size="sm" className="rounded-[8px]" onClick={handleSaveSources}>
                                                    Save
                                                  </Button>
                                                  <Button size="sm" variant="outline" className="rounded-[8px]" onClick={() => setShowSourceMaterial(false)}>
                                                    Cancel
                                                  </Button>
                                                </div>
                                              </div>
                                            )}
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={toggleSavedPrompts}
                                              className="text-base font-medium flex items-center gap-1 h-8 px-3 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 rounded-[8px]"
                                              style={{ borderRadius: 8 }}
                                        >
                                          <Sparkles className="w-4 h-4 mr-1" /> Prompts
                                        </Button>
                                            {/* Prompts menu popover */}
                                            {showSavedPrompts && (
                                              <div ref={savedPromptsMenuRef} className="absolute z-50 left-32 bottom-12 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[220px]" style={{ minWidth: 220 }}>
                                                <div className="font-semibold mb-2">Saved Prompts</div>
                                                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                                                  {savedPrompts.map((prompt, idx) => (
                                                    <Button key={prompt.id} variant="ghost" className="text-left w-full rounded-[8px]" onClick={() => handleUseSavedPrompt(prompt)}>
                                                      {prompt.text}
                                                    </Button>
                                                  ))}
                                                </div>
                                                <div className="flex gap-2 mt-4">
                                                  <Button size="sm" className="rounded-[8px]" onClick={() => setShowSavedPrompts(false)}>
                                                    Close
                                                  </Button>
                                                </div>
                                              </div>
                                            )}
                                            <div className="flex-1"></div>
                                        <Button
                                              className="bg-twilight text-white px-3 h-8 rounded-[8px] flex items-center justify-center"
                                              style={{ borderRadius: 8 }}
                                          onClick={handleSendMessage}
                                              disabled={!chatInput.trim()}
                                            >
                                              <Send className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </>
                          );
                        })()}
            
            {/* General Chat Area - only show when no question is focused */}
            {!activeQuestion && chatMessages.length > 0 && (
              <div className="mt-16 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-twilight" />
                      <span className="text-lg font-bold text-sblack">AI Assistant</span>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-twilight rounded-full animate-pulse"></div>
                        <span className="text-sm text-smoke-300">Ready to help</span>
                      </div>
                    </div>
                                  </div>
                  <div className="p-6 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] ${message.type === "user" ? "bg-[#F5F5F5] text-gray-900" : "bg-[#F1F1F9] text-gray-900"} rounded-lg px-4 py-3`}>
                            <p className="text-sm whitespace-pre-line">{message.content}</p>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                          </div>
                                          </div>
                                        </div>
                                            )}
                                          </div>
                                                        </div>
                                                        </div>
                                                      </div>
            )}

            {/* Additional content to ensure scrolling */}
            <div className="mt-16 space-y-8 mb-32">
              <div className="p-8 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-sblack mb-4">Additional Information</h3>
                <p className="text-smoke-300 mb-4">
                  This section provides additional context and information to help you complete your grant application successfully.
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded border">
                    <h4 className="font-medium text-sblack mb-2">Application Tips</h4>
                    <ul className="text-sm text-smoke-300 space-y-1">
                      <li>• Be specific and detailed in your responses</li>
                      <li>• Use concrete examples and data when possible</li>
                      <li>• Ensure all required fields are completed</li>
                      <li>• Review your application before submission</li>
                    </ul>
                                                    </div>
                  <div className="p-4 bg-white rounded border">
                    <h4 className="font-medium text-sblack mb-2">Required Documents</h4>
                    <ul className="text-sm text-smoke-300 space-y-1">
                      <li>• IRS Determination Letter (if applicable)</li>
                      <li>• Financial statements for the past 2 years</li>
                      <li>• Board of Directors list</li>
                      <li>• Program evaluation reports</li>
                    </ul>
                                          </div>
                                        </div>
                                  </div>
              
              <div className="p-8 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-sblack mb-4">Contact Information</h3>
                <p className="text-smoke-300 mb-4">
                  If you have questions about this application, please contact our grant team.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded border">
                    <h4 className="font-medium text-sblack mb-2">Grant Team</h4>
                    <p className="text-sm text-smoke-300">Email: grants@foundation.org</p>
                    <p className="text-sm text-smoke-300">Phone: (555) 123-4567</p>
                                            </div>
                  <div className="p-4 bg-white rounded border">
                    <h4 className="font-medium text-sblack mb-2">Technical Support</h4>
                    <p className="text-sm text-smoke-300">Email: support@foundation.org</p>
                    <p className="text-sm text-smoke-300">Phone: (555) 987-6543</p>
                                          </div>
                                        </div>
                                            </div>
                                                  </div>
                                                </div>
                                            </div>
                                          </div>
      {/* Docked Chat Input (full-width, always at bottom) - only show if no question is focused */}
      {!activeQuestion && (
        <div className="w-full bg-white border-t border-silver-200 p-6 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
                                      <textarea
                placeholder="Ask the AI advisor anything about your grant application..."
                className="flex-1 resize-none border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-twilight focus:border-transparent"
                rows={2}
                                        value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => {
                                          if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault()
                    handleGeneralChatMessage()
                  }
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
                style={{ 
                  height: 'auto',
                  minHeight: '40px',
                  maxHeight: '120px'
                }}
              />
                                        <Button
                className="bg-twilight text-white px-6 py-3"
                onClick={handleGeneralChatMessage}
              >
                <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                  </div>
        </div>
      )}
    </div>
  )
}
