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
} from "lucide-react"
import { cn } from "@/lib/utils"

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
    answers: [],
  },
  {
    id: "has-fiscal-sponsor",
    title: "If not, does your organization have a fiscal sponsor?",
    field: "has-fiscal-sponsor",
    answers: [],
  },
  {
    id: "year-founded",
    title: "Year organization was founded",
    field: "year-founded",
    answers: [],
  },
  {
    id: "website",
    title: "Organization website",
    field: "website",
    answers: [],
  },
  // Organization Programming
  {
    id: "programming-description",
    title: "Briefly describe your organization's primary programs and services",
    field: "programming-description",
    answers: [],
  },
  // Program/Project Overview
  {
    id: "project-name",
    title: "Program/project name",
    field: "project-name",
    answers: [],
  },
  {
    id: "project-summary",
    title: "Brief summary of the program/project",
    field: "project-summary",
    answers: [],
  },
  // Equity/Metrics in Programming
  {
    id: "equity-definition",
    title: "How does your organization define and measure equity in your programming?",
    field: "equity-definition",
    answers: [],
  },
  {
    id: "metrics-used",
    title: "What metrics do you use to track progress?",
    field: "metrics-used",
    answers: [],
  },
]

const quickPolishPrompts = [
  "Expand on this",
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

export default function Component() {
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
      case "Expand on this":
        return (
          currentText +
          " We also provide wraparound support, family engagement, and access to enrichment activities that foster holistic youth development."
        );
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

  // In handleFieldFocus, clear chat and advisor state on question click
  const handleFieldFocus = (fieldId: string) => {
    if (!visitedQuestions[fieldId]) {
      setLoadingQuestions((prev) => ({ ...prev, [fieldId]: true }));
      setTimeout(() => {
        setLoadingQuestions((prev) => ({ ...prev, [fieldId]: false }));
        setVisitedQuestions((prev) => ({ ...prev, [fieldId]: true }));
      }, 1000);
    }
    const question = advisorQuestions.find((q) => q.id === fieldId)
    if (!question) return

    setActiveQuestion(question)
    setChatMessages([]) // Clear chat when switching fields
    setPinnedAnswer(null) // Clear pinned answer
    setIsPolishMode(false)
    setShowPolishSuggestion({})
    setSnippetsExpanded({})
    setHasAddedFirstAnswer({})
    setQuickPromptsUsed({})
    setPolishUsed({})
    setAddedSnippets({}) // Clear added snippets on new field

    // Initialize answer states if not exists
    if (!answerStates[question.field]) {
      setAnswerStates((prev) => ({
        ...prev,
        [question.field]: new Array(question.answers.length).fill(false),
      }))
    }

    // Reset polish requested state for new field
    setPolishRequested((prev) => ({ ...prev, [fieldId]: false }))
  }

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

    // Show polish suggestion immediately on first answer added (only if not used before)
    if (!hasAddedFirstAnswer[field] && !polishUsed[field]) {
      setHasAddedFirstAnswer((prev) => ({ ...prev, [field]: true }))
      setTimeout(() => {
        setShowPolishSuggestion((prev) => ({ ...prev, [field]: true }))
      }, 500) // Short delay for smooth UX
    }
  }

  const handleAnswerRevise = (field: string, answer: string, answerIndex: number) => {
    if (!activeQuestion) return

    // Pin the answer being revised
    const answerToPin = activeQuestion.answers[answerIndex]
    setPinnedAnswer(answerToPin)

    // Do NOT add the answer to the field here
    // Only trigger polish mode
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

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      type: "revision",
      content: `Here's your revised response for "${prompt}":`,
      revisedText: revisedText,
      originalText: currentValue, // Add original text for comparison
      timestamp: Date.now(),
    }

    setChatMessages((prev) => [...prev, userMessage, assistantMessage])

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
  }

  const handleUseRevision = (revisedText: string) => {
    if (!activeQuestion) return
    setFormData((prev) => ({ ...prev, [activeQuestion.field]: revisedText }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSendMessage = () => {
    console.log("Sending message:", chatInput)
    if (!chatInput.trim()) {
      return
    }

    const currentValue = activeQuestion ? formData[activeQuestion.field as keyof typeof formData] : ""

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

    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false)
      
      // Generate contextual AI response
      let aiResponse = "I'd be happy to help with that! "

      if (activeQuestion && (chatInput.toLowerCase().includes("shorter") || chatInput.toLowerCase().includes("concise"))) {
        const revised = generateRevision("Make it more concise", currentValue, activeQuestion.field)
        aiResponse = "Here's a more concise version:"
        const assistantMessage: ChatMessage = {
          id: `assistant-${userTimestamp + 1}`,
          type: "revision",
          content: aiResponse,
          revisedText: revised,
          originalText: currentValue,
          timestamp: userTimestamp + 1,
        }
        console.log("Adding revision messages:", [assistantMessage])
        setChatMessages((prev) => {
          const newMessages = [...prev, assistantMessage]
          console.log("New chat messages state:", newMessages)
          return newMessages
        })
      } else if (activeQuestion && (chatInput.toLowerCase().includes("professional") || chatInput.toLowerCase().includes("formal"))) {
        const revised = generateRevision("Add more professional language", currentValue, activeQuestion.field)
        aiResponse = "Here's a more professional version:"
        const assistantMessage: ChatMessage = {
          id: `assistant-${userTimestamp + 1}`,
          type: "revision",
          content: aiResponse,
          revisedText: revised,
          originalText: currentValue,
          timestamp: userTimestamp + 1,
        }
        console.log("Adding professional revision messages:", [assistantMessage])
        setChatMessages((prev) => {
          const newMessages = [...prev, assistantMessage]
          console.log("New chat messages state:", newMessages)
          return newMessages
        })
      } else {
        if (!activeQuestion) {
          aiResponse = "I'd be happy to help with that!"
        } else {
          aiResponse += "Let me work on polishing your response based on your request."
        }
        const assistantMessage: ChatMessage = {
          id: `assistant-${userTimestamp + 1}`,
          type: "assistant",
          content: aiResponse,
          timestamp: userTimestamp + 1,
        }
        console.log("Adding regular messages:", [assistantMessage])
        setChatMessages((prev) => {
          const newMessages = [...prev, assistantMessage]
          console.log("New chat messages state:", newMessages)
          return newMessages
        })
      }
      
      // Scroll to bottom after adding assistant message
      setTimeout(() => scrollToBottom(), 100)
    }, 1500) // 1.5 second typing delay
  }

  const handleClearFocus = () => {
    setActiveQuestion(null)
    setChatMessages([])
    setPinnedAnswer(null)
    setVisibleSnippets(0)
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

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Application Section - 2/3 */}
      <div className="flex-1 flex flex-col" style={{ flexBasis: "66.666%" }}>
        {/* Header - Only spans application section */}
        <div className="border-b px-6 py-5 flex-shrink-0">
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
        <div className="flex-1 overflow-y-auto">
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
              ];
              return sectionOrder.map((section) => (
                <div className="mb-12" key={section.title}>
                  <h2 className="text-xl font-semibold text-sblack mb-8 lato-bold">{section.title}</h2>
                  <div className="space-y-8">
                    {section.ids.map((qid) => {
                      const q = advisorQuestions.find((q) => q.id === qid);
                      if (!q) return null;
                      const isActive = activeQuestion?.id === q.id;
                      // Outer highlight container for active question
                      return (
                        <div
                          key={q.id}
                          className={cn(
                            "transition-all duration-300",
                            isActive
                              ? "bg-twilight-50 rounded-xl p-2 -mx-2"
                              : ""
                          )}
                          style={{ position: "relative" }}
                        >
                          <Label htmlFor={q.field} className="text-sm font-medium text-sblack mb-2 block lato-regular">{q.title}*</Label>
                          {/* Render input type based on field, but remove highlight from input if active */}
                          {q.field === "org-type" ? (
                            <Select
                              value={formData[q.field] || ""}
                              onValueChange={(value) => handleInputChange(q.field, value)}
                              onOpenChange={(open) => open && handleFieldFocus(q.field)}
                            >
                              <SelectTrigger
                                className={cn(
                                  "w-full h-12 px-4 border rounded-xl focus:ring-0 transition-all duration-300",
                                  isActive
                                    ? "border-twilight bg-white shadow-none"
                                    : "border-silver-200 focus:border-twilight"
                                )}
                              >
                                <SelectValue placeholder="Please choose" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="nonprofit">Non-profit</SelectItem>
                                <SelectItem value="community">Community Organization</SelectItem>
                                <SelectItem value="school">School</SelectItem>
                                <SelectItem value="government">Government Agency</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : q.field === "mission" || q.field === "programming-description" || q.field === "project-summary" || q.field === "equity-definition" || q.field === "metrics-used" ? (
                            <Textarea
                              id={q.field}
                              value={formData[q.field] || ""}
                              onChange={(e) => handleInputChange(q.field, e.target.value)}
                              onFocus={() => handleFieldFocus(q.field)}
                              className={cn(
                                "w-full min-h-[140px] p-4 border rounded-xl focus:ring-0 resize-none transition-all duration-300 text-sm font-normal",
                                isActive
                                  ? "border-twilight bg-white shadow-none"
                                  : "border-silver-200 focus:border-twilight"
                              )}
                            />
                          ) : q.field === "is-501c3" || q.field === "has-fiscal-sponsor" ? (
                            <Select
                              value={formData[q.field] || ""}
                              onValueChange={(value) => handleInputChange(q.field, value)}
                              onOpenChange={(open) => open && handleFieldFocus(q.field)}
                            >
                              <SelectTrigger
                                className={cn(
                                  "w-full h-12 px-4 border rounded-xl focus:ring-0 transition-all duration-300",
                                  isActive
                                    ? "border-twilight bg-white shadow-none"
                                    : "border-silver-200 focus:border-twilight"
                                )}
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
                              className={cn(
                                isActive
                                  ? "border-twilight bg-white shadow-none"
                                  : "border-silver-200 focus:border-twilight"
                              )}
                            />
                          ) : q.field === "website" ? (
                            <Input
                              id={q.field}
                              type="url"
                              value={formData[q.field] || ""}
                              onChange={(e) => handleInputChange(q.field, e.target.value)}
                              onFocus={() => handleFieldFocus(q.field)}
                              className={cn(
                                isActive
                                  ? "border-twilight bg-white shadow-none"
                                  : "border-silver-200 focus:border-twilight"
                              )}
                            />
                          ) : (
                            <Input
                              id={q.field}
                              value={formData[q.field] || ""}
                              onChange={(e) => handleInputChange(q.field, e.target.value)}
                              onFocus={() => handleFieldFocus(q.field)}
                              className={cn(
                                isActive
                                  ? "border-twilight bg-white shadow-none"
                                  : "border-silver-200 focus:border-twilight"
                              )}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* Advisor Panel - 1/3 */}
      <div
        className={`advisor-active-panel border-l border-silver-200 flex flex-col h-full transition-all duration-500 ease-in-out ${
          !activeQuestion ? "advisor-inactive-panel" : ""
        }`}
        style={{ flexBasis: "33.333%" }}
      >
        {/* Panel Header */}
        <div
          className={"py-8 px-6 flex-shrink-0 relative"} // removed border-b
        >
          {/* Under 'Advisor', add a small silver tag if activeQuestion */}
          {activeQuestion && (
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-sblack lato-bold">Advisor</h3>
              </div>
              <div className="flex items-center gap-3">
                {(isPolishMode || hasUsedAnswers) && activeQuestion && (
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleSnippets}
                      className="text-xs text-gray-600 border-gray-200 hover:bg-gray-50 transition-all duration-200 bg-transparent"
                    >
                      <Sparkles className="w-3 h-3 mr-1 text-purple-500" />
                      {activeQuestion.answers.length} suggestions
                      {areSnippetsExpanded ? (
                        <ChevronUp className="w-3 h-3 ml-1" />
                      ) : (
                        <ChevronDown className="w-3 h-3 ml-1" />
                      )}
                    </Button>
                    {areSnippetsExpanded && (
                      <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded shadow-lg z-30 animate-in fade-in duration-200">
                        <div className="p-2">
                          {activeQuestion.answers.length === 0 && (
                            <div className="text-xs text-gray-400 p-2">No suggestions available.</div>
                          )}
                          {activeQuestion.answers.map((answer, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded hover:bg-twilight-50 cursor-pointer transition-colors duration-150"
                              onClick={() => handleAnswerSelect(activeQuestion.field, answer.text, idx)}
                            >
                              <div className="font-medium text-sm text-twilight mb-1">{answer.title}</div>
                              <div className="text-xs text-gray-600 line-clamp-2 mb-1">{answer.detailedText}</div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {answer.sources.map((source, sidx) => (
                                  <span key={sidx} className="inline-flex items-center rounded-full bg-gray-100 text-twilight font-medium px-2 py-0.5 text-[10px] border border-gray-200">{source}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {activeQuestion && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFocus}
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
          <p className="text-sm text-gray-600 text-left mt-0">
            {activeQuestion ? (
              <>
                Let's discuss: <span className="font-medium text-gray-900">{activeQuestion.title}</span>
              </>
            ) : (
              ""
            )}
          </p>
          {/* Fade shadow at bottom of header on scroll */}
          {showAdvisorHeaderFade && (
            <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-4 bg-gradient-to-b from-transparent to-twilight-100/60" />
          )}
        </div>

        {/* Content Area */}
        <div ref={advisorContentRef} onScroll={handleAdvisorScroll} className="flex-1 overflow-y-auto p-6 pt-0">
          {/* Pinned Answer */}
          {pinnedAnswer && (
            <div className="bg-twilight-50 border border-twilight-200 rounded-lg p-4 mb-4 animate-in slide-in-from-top-2 duration-300 text-sblack">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Pin className="w-4 h-4 text-twilight" />
                  <h4 className="font-semibold text-twilight text-sm">Revising: {pinnedAnswer.title}</h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUnpinAnswer}
                  className="text-twilight hover:text-twilight-700 p-1"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm text-twilight-900 leading-relaxed mb-2">{pinnedAnswer.text}</p>
              <div className="flex flex-wrap gap-1">{renderSourceTags(pinnedAnswer.sources)}</div>
            </div>
          )}

          {/* Chat Messages - Show in both general and question states */}
          {!activeQuestion && chatMessages.length === 0 && !isTyping && (
            <div className="flex flex-col items-start justify-center h-full py-12 animate-in fade-in duration-500">
              {/* Advisor Welcome */}
              <h2 className="text-base font-bold text-twilight mb-2 text-left" style={{ color: '#1A174B' }}>Nicole, Advisor is here to help.</h2>
              <p className="text-sm text-gray-600 mb-4 text-left max-w-md">
                Think ChatGPT, but trained on your organization's documents plus exclusive funder insights to help you write winning proposals.
              </p>
              <p className="text-sm text-twilight-700 text-left max-w-md">
                Click on any form field to get tailored suggestions, or ask me anything about the application process.
              </p>
            </div>
          )}
          {chatMessages.length > 0 && (
            <div className="space-y-4 pb-8 animate-in fade-in duration-500">
              {chatMessages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {message.type === "revision" ? (
                    <div className="max-w-[85%] p-4 rounded-lg bg-white text-gray-900 text-sm leading-relaxed border border-gray-200">
                      <p className="text-sm font-semibold mb-1">Original:</p>
                      <div className="text-sm leading-relaxed mb-3 whitespace-pre-line">{diffWords(message.originalText || '', message.originalText || '')}</div>
                      <p className="text-sm font-semibold mb-1">Revised (changes highlighted):</p>
                      <div className="text-sm leading-relaxed mb-3 whitespace-pre-line">{diffWords(message.originalText || '', message.revisedText || '')}</div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          onClick={() => {
                            handleUseRevision(message.revisedText || '');
                            setChatMessages(prev => [...prev, {
                              id: `save-prompt-${Date.now()}`,
                              type: 'save-prompt',
                              content: 'Would you like to save this version for later?',
                              revisedText: message.revisedText,
                              originalText: message.originalText,
                              timestamp: Date.now(),
                            }]);
                          }}
                          className="h-8 px-4 text-sm bg-twilight hover:bg-twilight-500 text-white"
                        >
                          Confirm changes and insert
                        </Button>
                      </div>
                      {message.content && message.content.toLowerCase().includes('funder aligned') && message.revisedText && message.revisedText.includes('This aligns with funder priorities') && (
                        <div className="mt-3 p-2 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                          <span className="font-semibold">Why funder aligned?</span> This aligns with Foot Locker Foundation's priorities—youth empowerment, measurable community impact, and alignment with their mission to support opportunities for underserved youth. Funders like Foot Locker Foundation look for clear outcomes and evidence that your work advances their specific goals.
                        </div>
                      )}
                    </div>
                  ) : message.type === 'save-prompt' ? (
                    <div className="w-full flex flex-col items-start">
                      <div className="max-w-[85%] p-4 rounded-lg bg-[#F0EFFF] text-gray-900 text-sm leading-relaxed mb-2">
                        <p className="mb-3">{message.content}</p>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <Button size="sm" variant="outline" className="h-10 px-4 text-sm border-twilight-200 text-twilight font-medium mr-2" onClick={() => {
                          setSavingPromptText(message.revisedText || '');
                          setIsSavingPrompt(true);
                          setTimeout(() => {
                            setSavedRevisions([...savedRevisions, { text: message.revisedText || '', original: message.originalText || '' }]);
                            setChatMessages(prev => [
                              ...prev.filter(m => m.id !== message.id),
                              {
                                id: `user-yes-${Date.now()}`,
                                type: 'user',
                                content: 'Yes',
                                timestamp: Date.now(),
                              },
                            ]);
                            setIsSavingPrompt(false);
                            setSavingPromptText(null);
                          }, 800); // Animation duration
                        }}>
                          Yes
                        </Button>
                        <Button size="sm" variant="outline" className="h-10 px-4 text-sm border-twilight-200 text-twilight font-medium" onClick={() => setChatMessages(prev => [
                          ...prev.filter(m => m.id !== message.id),
                          {
                            id: `user-no-${Date.now()}`,
                            type: 'user',
                            content: 'No',
                            timestamp: Date.now(),
                          },
                        ])}>No</Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] p-4 rounded-lg transition-all duration-200 ${
                        message.type === "user" ? "bg-silver-100 text-gray-900" : "text-gray-900"
                      }`}
                      style={{
                        backgroundColor: message.type === "user" ? undefined : "#F0EFFF"
                      }}
                    >
                      <p className="text-sm leading-tight whitespace-pre-line">{message.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
              <div 
                className="max-w-[85%] p-4 rounded-lg transition-all duration-200 text-gray-900"
                style={{ backgroundColor: "#F0EFFF" }}
              >
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          {activeQuestion ? (
            <div className="space-y-4">
              {/* Quick Polish Prompts - Show only once */}
              {shouldShowQuickPrompts && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="grid grid-cols-1 gap-3">
                    {quickPolishPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickPolish(prompt)}
                        className="h-10 px-4 text-sm border-twilight-200 text-twilight hover:bg-twilight-50 transition-all duration-200 animate-in fade-in duration-300 justify-start"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Welcome Message for Question */}
              {!hasUsedAnswers && chatMessages.length === 0 && !isPolishMode && (
                <div className="space-y-4">
                  {/* Animated Chat Message */}
                  {activeQuestion && loadingQuestions[activeQuestion.id] ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                      <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-500">
                        <div className="max-w-[85%] p-4 rounded-lg bg-twilight-100 text-gray-900 flex items-center gap-2">
                          <span className="text-sm leading-relaxed">Finding relevant answer snippets</span>
                          <span className="inline-flex ml-2">
                            <span className="dot bg-twilight animate-bounce mr-1" style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', animationDelay: '0ms' }}></span>
                            <span className="dot bg-twilight animate-bounce mr-1" style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', animationDelay: '150ms' }}></span>
                            <span className="dot bg-twilight animate-bounce" style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block', animationDelay: '300ms' }}></span>
                          </span>
                        </div>
                      </div>
                      <style jsx>{`
                        @keyframes bounce {
                          0%, 80%, 100% { transform: scale(1); }
                          40% { transform: scale(1.4); }
                        }
                        .dot {
                          animation: bounce 1s infinite;
                        }
                        .dot:nth-child(2) { animation-delay: 0.15s; }
                        .dot:nth-child(3) { animation-delay: 0.3s; }
                      `}</style>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-500">
                        <div className="max-w-[85%] p-4 rounded-lg bg-twilight-100 text-gray-900">
                          <p className="text-sm leading-relaxed">
                            {activeQuestion.id === "mission"
                              ? "Here's some suggestions on how you can answer this question. This is a key section based on your organization's documents:"
                              : isFieldPrefilled(activeQuestion.id)
                                ? "Here's some suggestions on how you can answer this question:"
                                : `Here's some suggestions on how you can answer this question about "${activeQuestion.title}":`}
                          </p>
                        </div>
                      </div>

                      {/* Animated Answer Cards */}
                      {activeQuestion && (!isPolishMode || areSnippetsExpanded) && (
                        <div className="space-y-4">
                          {activeQuestion.answers.slice(0, 4).map((answer, index) => {
                            // 3. Update rendering logic for 'Added' UI
                            const isUsed = addedSnippets[activeQuestion.field]?.has(index) || false;
                            if (index === 0) {
                              console.log('DEBUG: Rendering snippets for question', activeQuestion.id, 'answerStates keys:', Object.keys(answerStates))
                            }
                            console.log(`Rendering snippet ${index}, isUsed: ${isUsed}, answerStates for ${activeQuestion.field}:`, answerStates[activeQuestion.field])

                            // Map the answer.category to displayable title text
                            const categoryMap: { [key: string]: string } = {
                              'Most commonly used': 'Most commonly used',
                              'Paraphrased': 'Paraphrased',
                              'Concise': 'Concise',
                              'Funder aligned': 'Funder aligned',
                              '': '',
                              // fallback for legacy or other categories
                            };
                            let categoryTitle = categoryMap[answer.category] || answer.category;

                            return (
                              <Card
                                key={index}
                                className={`transition-all duration-300 border hover:shadow-lg animate-in slide-in-from-bottom-2 ${
                                  isUsed ? "border-green-200 bg-green-50" : "border-gray-200 hover:border-blue-200"
                                }`}
                                style={{ animationDelay: `${800 + index * 150}ms` }}
                              >
                                <CardContent className="p-4">
                                  <div className="space-y-3">
                                    {/* Top row: Category as Title, Subtitle (optional), and Thumbs */}
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex flex-col gap-0.5">
                                        <h4 className="font-semibold text-gray-900" style={{ fontSize: '15px', lineHeight: '20px' }}>{categoryTitle}</h4>
                                      </div>
                                      <div className="flex gap-2">
                                        <button className="p-1 rounded hover:bg-gray-100"><ThumbsUp className="w-4 h-4 text-gray-400" /></button>
                                        <button className="p-1 rounded hover:bg-gray-100"><ThumbsDown className="w-4 h-4 text-gray-400" /></button>
                                      </div>
                                    </div>
                                    {/* Content */}
                                    <p className="text-sm text-gray-700 leading-relaxed transition-colors duration-200 mb-2 break-words whitespace-pre-line">
                                      {answer.detailedText}
                                    </p>
                                    {/* Sources chip */}
                                    <div className="mb-2">{renderSourceTags(answer.sources)}</div>
                                    {/* Add/Revise buttons */}
                                    <div className="flex gap-2">
                                      {isUsed ? (
                                        <div className="flex items-center gap-1 text-green-600 text-sm font-medium animate-in fade-in duration-300">
                                          <Check className="w-4 h-4" />
                                          Added
                                        </div>
                                      ) : (
                                        <>
                                          <Button
                                            size="sm"
                                            onClick={() => handleAnswerSelect(activeQuestion.field, answer.text, index)}
                                            className="h-8 px-4 text-sm bg-twilight hover:bg-twilight-500 text-white transition-all duration-200"
                                          >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleAnswerRevise(activeQuestion.field, answer.text, index)}
                                            className="h-8 px-4 text-sm border-jazzy text-jazzy hover:bg-jazzy-50 transition-all duration-200"
                                          >
                                            <Edit3 className="w-4 h-4 mr-2" />
                                            Revise
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>

        {/* Polish Suggestion - Only show if not used before */}
        {activeQuestion && addedSnippets[activeQuestion.field]?.size > 0 && showPolishSuggestion[activeQuestion.field] && !polishUsed[activeQuestion.field] && !isPolishMode && (
          <div className="px-6 pb-3 animate-in slide-in-from-bottom-4 duration-500 ease-out">
            <Button
              onClick={handlePolishRequest}
              className="w-full bg-gradient-to-r from-twilight to-jazzy hover:from-twilight-500 hover:to-jazzy-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12"
            >
              <Wand2 className="w-5 h-5 mr-3" />
              Polish with AI
            </Button>
          </div>
        )}

        {/* Fixed Chat Input */}
        <div
          className={`p-6 flex-shrink-0`}
        >
          <div className="space-y-3">
            {/* Chat Input with Custom Layout */}
            <div className="relative w-full bg-white rounded-xl px-3 pt-2 pb-3 flex flex-col"
              style={{
                minHeight: '96px',
                border: messageInputFocused || messageInputValue.length > 0 ? '1.5px solid #5A56B3' : '1.5px solid #B3B2E6',
                transition: 'border-color 0.2s',
              }}
            >
              {/* Source Material Dropdown */}
              {showSourceMaterial && (
                <div ref={sourcesMenuRef} className="absolute bottom-16 left-3 border border-gray-200 rounded-lg bg-white shadow-sm animate-in slide-in-from-bottom-2 duration-300 z-10">
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900 mb-2 text-sm">Referenced Documents:</h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {allSources.map((source, index) => (
                        <label key={index} className="flex items-center gap-2 p-1 rounded hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={stagedSelectedSources.includes(source)}
                            onChange={() => handleToggleSourceStaged(source)}
                            className="accent-twilight"
                          />
                          <FileText className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-700">{source}</span>
                        </label>
                      ))}
                    </div>
                    {!showAddSourceInput ? (
                      <button
                        className="text-xs text-twilight font-medium mt-3 hover:underline"
                        onClick={() => setShowAddSourceInput(true)}
                      >
                        + Add source
                      </button>
                    ) : (
                      <form
                        className="flex gap-2 mt-3"
                        onSubmit={e => {
                          e.preventDefault();
                          if (newSource.trim()) {
                            setCustomSources(prev => [...prev, newSource.trim()]);
                            setNewSource("");
                            setShowAddSourceInput(false);
                            setSourcesChanged(true);
                          }
                        }}
                      >
                        <input
                          type="text"
                          value={newSource}
                          onChange={e => setNewSource(e.target.value)}
                          placeholder="Add new source..."
                          className="border border-gray-300 rounded px-2 py-1 text-xs flex-1"
                          autoFocus
                        />
                        <Button type="submit" size="sm" className="h-7 px-2 text-xs">Add</Button>
                      </form>
                    )}
                    {sourcesChanged && (
                      <Button onClick={handleSaveSources} size="sm" className="mt-3 w-full h-8 text-xs bg-twilight text-white hover:bg-twilight-500">Save</Button>
                    )}
                    <p className="text-sm text-gray-400 mt-2">Documents informing AI suggestions</p>
                  </div>
                </div>
              )}

              {/* Saved Prompts Dropdown */}
              {showSavedPrompts && (
                <div ref={savedPromptsMenuRef} className="absolute bottom-16 left-20 border border-gray-200 rounded-lg bg-white shadow-sm animate-in slide-in-from-bottom-2 duration-300 z-10">
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">Saved Prompts:</h4>
                      {chatInput.trim() && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSaveCurrentPrompt}
                          className="text-sm text-blue-600 hover:text-blue-700 h-5 px-1"
                        >
                          <BookmarkPlus className="w-3 h-3 mr-1" />
                          Save
                        </Button>
                      )}
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {savedPrompts.map((prompt) => (
                        <div
                          key={prompt.id}
                          className="flex items-start justify-between p-2 rounded hover:bg-gray-50 transition-colors duration-200 cursor-pointer group"
                          onClick={() => handleUseSavedPrompt(prompt)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">{prompt.text}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Click to use a saved prompt</p>
                  </div>
                </div>
              )}

              {/* Textarea input */}
              <textarea
                ref={textareaRef}
                id="advisor-message-input"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyPress={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Ask Advisor anything...."
                rows={2}
                className="w-full resize-none bg-transparent border-none outline-none text-base px-3 pt-4 pb-1 min-h-[40px] max-h-40 focus:ring-0 focus:outline-none transition-all rounded-xl"
                style={{ zIndex: 1 }}
                onFocus={() => setMessageInputFocused(true)}
                onBlur={() => setMessageInputFocused(false)}
              />
              {/* Button row */}
              <div className="flex flex-row items-end w-full gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSourceMaterial}
                  className="text-base font-medium flex items-center gap-1 h-9 px-3 border-gray-300 bg-white"
                >
                  <FileText className="w-4 h-4 mr-1" /> Sources
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSavedPrompts}
                  className="text-base font-medium flex items-center gap-1 h-9 px-3 border-gray-300 bg-white"
                >
                  <Sparkles className="w-4 h-4 mr-1" /> Prompts
                </Button>
                <div className="flex-1" />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSendMessage}
                  className={`h-9 w-12 p-0 flex items-center justify-center ${
                    chatInput.trim() 
                      ? "bg-twilight hover:bg-twilight-500 text-white" 
                      : "bg-gray-300 hover:bg-gray-400 text-white"
                  }`}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
