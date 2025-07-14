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
} from "lucide-react"

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
  type: "assistant" | "user" | "revision"
  content: string
  timestamp: number
  revisedText?: string
  originalText?: string // Add this field
}

interface SavedPrompt {
  id: string
  text: string
}

const advisorQuestions: Question[] = [
  {
    id: "legal-name",
    title: "Legal Name of Organization",
    field: "legal-name",
    answers: [
      {
        title: "Youth-Focused Community Center",
        text: "Community Youth Empowerment Center",
        detailedText:
          "Community Youth Empowerment Center - A comprehensive organization dedicated to providing educational, recreational, and developmental programs for young people in underserved communities. Established as a 501(c)(3) nonprofit with a focus on holistic youth development.",
        category: "Youth-Focused",
        sources: ["OrganizationProfile2024.pdf", "Articles of Incorporation.pdf"],
      },
      {
        title: "Neighborhood Development Foundation",
        text: "Neighborhood Development Foundation",
        detailedText:
          "Neighborhood Development Foundation - A grassroots organization committed to strengthening local communities through comprehensive support services, infrastructure development, and resident empowerment initiatives. Focuses on sustainable community growth and resident-led solutions.",
        category: "Community-Based",
        sources: ["Articles of Incorporation.pdf"],
      },
      {
        title: "Urban Social Change Alliance",
        text: "Urban Alliance for Social Change",
        detailedText:
          "Urban Alliance for Social Change - A coalition-based organization that advocates for systemic change in urban environments. Specializes in policy advocacy, community organizing, and collaborative partnerships to address social justice issues affecting metropolitan areas.",
        category: "Advocacy-Oriented",
        sources: ["Strategic Plan 2024.pdf", "Board Resolution 2024.pdf", "Grant History.pdf"],
      },
      {
        title: "Community Outreach Initiative",
        text: "Riverside Community Outreach Initiative",
        detailedText:
          "Riverside Community Outreach Initiative - A service-oriented organization providing direct assistance and support programs to families and individuals in the Riverside area. Known for innovative approaches to community engagement and culturally responsive programming.",
        category: "Service-Oriented",
        sources: ["Program Overview.pdf"],
      },
    ],
  },
  {
    id: "mission",
    title: "Organization Mission Statement",
    field: "mission",
    answers: [
      {
        title: "Youth Empowerment Through Education",
        text: "To empower underserved youth through education, mentorship, and community engagement programs that foster leadership development and create pathways to success.",
        category: "Youth Development",
        sources: ["Mission Statement.pdf", "Strategic Plan 2024.pdf"],
      },
      {
        title: "Comprehensive Family Support Services",
        text: "Our mission is to strengthen communities by providing comprehensive support services, educational opportunities, and advocacy for families in need.",
        category: "Family Services",
        sources: ["Board Resolution 2024.pdf"],
      },
      {
        title: "Breaking the Cycle of Poverty",
        text: "We are dedicated to breaking the cycle of poverty through innovative programs that address education, workforce development, and community wellness.",
        category: "Economic Development",
        sources: ["Grant History.pdf", "Program Evaluation 2024.pdf"],
      },
      {
        title: "Social Justice and Community Capacity",
        text: "To create lasting social change by building community capacity, promoting equity, and fostering collaborative partnerships that address systemic challenges.",
        category: "Social Justice",
        sources: ["Strategic Plan 2024.pdf", "Community Assessment.pdf", "Partnership Agreements.pdf"],
      },
    ],
  },
  {
    id: "org-type",
    title: "Type of Organization",
    field: "org-type",
    answers: [
      {
        title: "501(c)(3) Tax-Exempt Nonprofit",
        text: "501(c)(3) Non-profit Organization",
        detailedText:
          "501(c)(3) Non-profit Organization - Federally recognized tax-exempt charitable organization under Internal Revenue Code Section 501(c)(3). This designation allows for tax-deductible donations and grants eligibility while maintaining public benefit focus and operational transparency requirements.",
        category: "Tax-Exempt",
        sources: ["IRS Determination Letter.pdf"],
      },
      {
        title: "Community-Based Organization",
        text: "Community-based Organization",
        detailedText:
          "Community-based Organization (CBO) - A grassroots nonprofit organization that operates within and serves a specific geographic community or population. CBOs are characterized by local leadership, community-driven programming, and deep understanding of local needs and assets.",
        category: "Grassroots",
        sources: ["Registration Documents.pdf", "Community Charter.pdf"],
      },
      {
        title: "Faith-Based Organization",
        text: "Faith-based Organization",
        detailedText:
          "Faith-based Organization (FBO) - A nonprofit organization that derives its mission and values from religious or spiritual traditions while providing secular services to the broader community. Maintains religious identity while serving people of all backgrounds without discrimination.",
        category: "Religious",
        sources: ["Articles of Incorporation.pdf"],
      },
    ],
  },
  {
    id: "ein",
    title: "EIN (Employer Identification Number)",
    field: "ein",
    answers: [
      {
        title: "Standard EIN Format Example",
        text: "12-3456789",
        detailedText:
          "12-3456789 - Standard nine-digit Employer Identification Number (EIN) format as assigned by the Internal Revenue Service. This unique identifier is required for all tax-exempt organizations and is used for federal tax reporting, grant applications, and official correspondence.",
        category: "Format Example",
        sources: ["Tax Documents.pdf"],
      },
      {
        title: "Alternative EIN Format",
        text: "98-7654321",
        detailedText:
          "98-7654321 - Nine-digit federal tax identification number in standard XX-XXXXXXX format. Used for all official business transactions, banking, payroll, and grant reporting requirements as mandated by federal regulations.",
        category: "Format Example",
        sources: ["IRS Records.pdf"],
      },
      {
        title: "Organizational EIN Reference",
        text: "45-6789012",
        detailedText:
          "45-6789012 - Federal Employer Identification Number used for organizational identification in financial records, grant applications, and regulatory compliance. Essential for maintaining tax-exempt status and accessing federal funding opportunities.",
        category: "Format Example",
        sources: ["Financial Records.pdf"],
      },
    ],
  },
  {
    id: "contact-name",
    title: "Contact Name",
    field: "contact-name",
    answers: [
      {
        title: "Professional Leadership Contact",
        text: "Sarah Johnson",
        detailedText:
          "Sarah Johnson - Experienced nonprofit leader with over 15 years in community development and grant management. Holds Master's in Public Administration and has successfully managed over $2M in federal and foundation grants. Known for collaborative leadership style and community engagement expertise.",
        category: "Professional",
        sources: ["Staff Directory.pdf"],
      },
      {
        title: "Academic Leadership",
        text: "Dr. Michael Rodriguez",
        detailedText:
          "Dr. Michael Rodriguez - Academic leader with extensive background in social work and community psychology. PhD in Social Work from State University, with published research in community-based interventions and youth development. Brings both scholarly expertise and practical field experience.",
        category: "Academic",
        sources: ["Leadership Bios.pdf"],
      },
      {
        title: "Credentialed Social Work Professional",
        text: "Jennifer Chen, MSW",
        detailedText:
          "Jennifer Chen, MSW - Licensed clinical social worker with Master of Social Work degree and specialized training in community organizing and program evaluation. Certified in trauma-informed care and has extensive experience working with diverse populations in urban settings.",
        category: "Credentialed",
        sources: ["Staff Credentials.pdf"],
      },
      {
        title: "Generational Leadership",
        text: "David Thompson Jr.",
        detailedText:
          "David Thompson Jr. - Second-generation community leader continuing family legacy of service. Brings fresh perspective combined with deep community roots and understanding of local history. Active in multiple community coalitions and known for innovative approaches to traditional challenges.",
        category: "Generational",
        sources: ["Board Members.pdf"],
      },
    ],
  },
  {
    id: "contact-title",
    title: "Contact Title",
    field: "contact-title",
    answers: [
      {
        title: "Executive Leadership Position",
        text: "Executive Director",
        detailedText:
          "Executive Director - Chief executive officer responsible for overall organizational leadership, strategic planning, board relations, and external partnerships. Oversees all programmatic and administrative functions while ensuring mission alignment and organizational sustainability.",
        category: "Leadership",
        sources: ["Organizational Chart.pdf"],
      },
      {
        title: "Program Operations Management",
        text: "Program Manager",
        detailedText:
          "Program Manager - Mid-level management position responsible for day-to-day program operations, staff supervision, and program evaluation. Serves as liaison between executive leadership and direct service staff while ensuring program quality and compliance with funder requirements.",
        category: "Operations",
        sources: ["Job Descriptions.pdf"],
      },
      {
        title: "Development and Fundraising",
        text: "Development Coordinator",
        detailedText:
          "Development Coordinator - Specialized position focused on fundraising, grant writing, donor relations, and resource development. Responsible for identifying funding opportunities, managing grant applications, and maintaining relationships with foundations, government funders, and individual donors.",
        category: "Fundraising",
        sources: ["Staff Directory.pdf"],
      },
      {
        title: "Community Relations Leadership",
        text: "Community Outreach Director",
        detailedText:
          "Community Outreach Director - Senior position responsible for external community relations, partnership development, and public representation of the organization. Manages community engagement strategies, coalition participation, and serves as primary spokesperson for community initiatives.",
        category: "External Relations",
        sources: ["Program Structure.pdf"],
      },
    ],
  },
  {
    id: "contact-email",
    title: "Contact Email",
    field: "contact-email",
    answers: [
      {
        title: "Executive Leadership Email",
        text: "director@organization.org",
        detailedText:
          "director@organization.org - Primary executive contact email for organizational leadership communications, board correspondence, and high-level partnership discussions. Monitored by executive assistant with priority routing for urgent matters.",
        category: "Leadership",
        sources: ["Contact List.pdf"],
      },
      {
        title: "Program Department Contact",
        text: "programs@organization.org",
        detailedText:
          "programs@organization.org - Departmental email for program-related inquiries, participant communications, and operational coordination. Managed by program staff with established response protocols for different types of inquiries.",
        category: "Departmental",
        sources: ["Email Directory.pdf"],
      },
      {
        title: "Grant and Funding Contact",
        text: "grants@organization.org",
        detailedText:
          "grants@organization.org - Specialized contact for all grant-related communications, funding inquiries, and development activities. Monitored by development staff with expertise in funder relations and grant compliance requirements.",
        category: "Functional",
        sources: ["Grant Contacts.pdf"],
      },
    ],
  },
]

const quickPolishPrompts = [
  "Make it more concise",
  "Add more professional language",
  "Include specific metrics",
  "Adjust tone for grant reviewers",
  "Make it more compelling",
  "Add concrete examples",
]

const proactivePrompts = [
  "Would you like me to add more specific examples?",
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [showPolishSuggestion, setShowPolishSuggestion] = useState<{ [key: string]: boolean }>({})
  const [formData, setFormData] = useState({
    "legal-name": "",
    ein: "",
    "org-type": "",
    mission: "", // Keep mission empty to focus on long-form content
    "contact-name": "",
    "contact-title": "",
    "contact-email": "",
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

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, activeQuestion])

  const generateRevision = (prompt: string, currentText: string, fieldType: string) => {
    if (!currentText.trim()) {
      return "Please add some content first, then I can help you polish it!"
    }

    switch (prompt) {
      case "Make it more concise":
        if (fieldType === "mission") {
          return currentText.length > 100
            ? currentText.split(".")[0] + ". " + currentText.split(".").slice(1).join(".").substring(0, 50) + "..."
            : "Your text is already quite concise! Consider this version:\n\n" +
                currentText.substring(0, Math.max(50, currentText.length - 20)) +
                "."
        }
        return currentText.substring(0, Math.max(20, currentText.length * 0.7)) + (currentText.length > 20 ? "..." : "")

      case "Add more professional language":
        if (fieldType === "mission") {
          return currentText
            .replace(/help/g, "support")
            .replace(/kids/g, "youth")
            .replace(/get/g, "obtain")
            .replace(/make/g, "create")
            .replace(/good/g, "effective")
            .replace(/We want to/g, "Our organization is committed to")
            .replace(/We /g, "The organization ")
        }
        return currentText.replace(/help/g, "assist").replace(/get/g, "obtain").replace(/make/g, "facilitate")

      case "Include specific metrics":
        if (fieldType === "mission") {
          const metrics = [
            "serving over 500 youth annually",
            "with a 85% program completion rate",
            "reaching 12 underserved communities",
            "through evidence-based programming",
          ]
          const randomMetric = metrics[Math.floor(Math.random() * metrics.length)]
          return currentText + " " + randomMetric + "."
        }
        return currentText + " (established 2018, serving 300+ community members annually)"

      case "Adjust tone for grant reviewers":
        if (fieldType === "mission") {
          return (
            currentText
              .replace(/We are/g, "This organization is")
              .replace(/Our mission/g, "The organizational mission")
              .replace(/we /g, "the organization ")
              .replace(/community/g, "target population") +
            " This mission aligns with evidence-based practices and measurable outcomes."
          )
        }
        return "As documented in our organizational charter, " + currentText.toLowerCase()

      case "Make it more compelling":
        if (fieldType === "mission") {
          const compelling = [
            "Through innovative, community-driven solutions, ",
            "With unwavering commitment to social justice, ",
            "By addressing root causes of inequality, ",
            "Through transformative programming, ",
          ]
          const randomStart = compelling[Math.floor(Math.random() * compelling.length)]
          return (
            randomStart +
            currentText.toLowerCase() +
            " Our work creates lasting, measurable impact in the communities we serve."
          )
        }
        return "Dedicated to excellence, " + currentText.toLowerCase() + " - making a measurable difference every day."

      case "Add concrete examples":
        if (fieldType === "mission") {
          const examples = [
            "including after-school tutoring, mentorship programs, and career readiness workshops",
            "such as financial literacy training, job placement services, and educational scholarships",
            "through community gardens, health screenings, and family support services",
            "via leadership development, civic engagement training, and advocacy initiatives",
          ]
          const randomExample = examples[Math.floor(Math.random() * examples.length)]
          return currentText + " " + randomExample + "."
        }
        return (
          currentText + " Examples include community outreach, educational workshops, and direct service provision."
        )

      default:
        return currentText + " [Enhanced with AI assistance]"
    }
  }

  const handleFieldFocus = (fieldId: string) => {
    const question = advisorQuestions.find((q) => q.id === fieldId)
    if (!question) return

    setActiveQuestion(question)
    setChatMessages([]) // Clear chat when switching fields
    setPinnedAnswer(null) // Clear pinned answer

    // Initialize answer states if not exists
    if (!answerStates[fieldId]) {
      setAnswerStates((prev) => ({
        ...prev,
        [fieldId]: new Array(question.answers.length).fill(false),
      }))
    }

    // Reset polish requested state for new field
    setPolishRequested((prev) => ({ ...prev, [fieldId]: false }))
    setSnippetsExpanded((prev) => ({ ...prev, [fieldId]: false }))
  }

  const handleAnswerSelect = (field: string, answer: string, answerIndex: number) => {
    // Add to form data (always append)
    const currentValue = formData[field as keyof typeof formData]
    const separator = field === "mission" ? " " : currentValue ? " " : ""
    setFormData((prev) => ({ ...prev, [field]: currentValue + separator + answer }))

    // Update the answer state to show it's been used
    setAnswerStates((prev) => ({
      ...prev,
      [field]: prev[field]?.map((used, index) => (index === answerIndex ? true : used)) || [],
    }))

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
    setPolishUsed((prev) => ({ ...prev, [activeQuestion.id]: true }))
    setIsPolishMode(true)

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: "Polish with AI",
      timestamp: Date.now(),
    }

    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      type: "assistant",
      content:
        "I'd be happy to help polish your response! You can use the quick options below or tell me specifically what you'd like to improve.",
      timestamp: Date.now(),
    }

    setChatMessages((prev) => [...prev, userMessage, assistantMessage])
    setShowPolishSuggestion((prev) => ({ ...prev, [activeQuestion.id]: false }))
    setPolishRequested((prev) => ({ ...prev, [activeQuestion.id]: true }))
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
      content: `Here's your revised response:`,
      revisedText: revisedText,
      originalText: currentValue, // Add original text for comparison
      timestamp: Date.now(),
    }

    setChatMessages((prev) => [...prev, userMessage, assistantMessage])

    // Mark quick prompts as used and add proactive follow-up
    setQuickPromptsUsed((prev) => ({ ...prev, [activeQuestion.id]: true }))

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
    if (!chatInput.trim()) return

    const currentValue = activeQuestion ? formData[activeQuestion.field as keyof typeof formData] : ""

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: chatInput,
      timestamp: Date.now(),
    }

    // Generate contextual AI response
    let aiResponse = "I'd be happy to help with that! "

    if (
      (activeQuestion && chatInput.toLowerCase().includes("shorter")) ||
      chatInput.toLowerCase().includes("concise")
    ) {
      const revised = generateRevision("Make it more concise", currentValue, activeQuestion.field)
      aiResponse = "Here's a more concise version:"
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: "revision",
        content: aiResponse,
        revisedText: revised,
        originalText: currentValue, // Add this line
        timestamp: Date.now(),
      }
      setChatMessages((prev) => [...prev, userMessage, assistantMessage])
    } else if (
      (activeQuestion && chatInput.toLowerCase().includes("professional")) ||
      chatInput.toLowerCase().includes("formal")
    ) {
      const revised = generateRevision("Add more professional language", currentValue, activeQuestion.field)
      aiResponse = "Here's a more professional version:"
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: "revision",
        content: aiResponse,
        revisedText: revised,
        originalText: currentValue, // Add this line
        timestamp: Date.now(),
      }
      setChatMessages((prev) => [...prev, userMessage, assistantMessage])
    } else {
      if (!activeQuestion) {
        aiResponse =
          "I can help you with your grant application! You can ask me about:\n\n• Best practices for grant writing\n• Tips for specific sections\n• How to make your application more compelling\n• General guidance on the application process\n\nWhat would you like to know?"
      } else {
        aiResponse += "Let me work on polishing your response based on your request."
      }
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: aiResponse,
        timestamp: Date.now(),
      }
      setChatMessages((prev) => [...prev, userMessage, assistantMessage])
    }

    setChatInput("")
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
  }

  const toggleSavedPrompts = () => {
    setShowSavedPrompts(!showSavedPrompts)
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

  const renderSourceTags = (sources: string[]) => {
    if (sources.length <= 2) {
      return sources.map((source, index) => (
        <Badge key={index} variant="outline" className="text-xs">
          {source.replace(".pdf", "")}
        </Badge>
      ))
    } else {
      return (
        <>
          <Badge variant="outline" className="text-xs">
            {sources[0].replace(".pdf", "")}
          </Badge>
          <Badge variant="outline" className="text-xs">
            +{sources.length - 1} sources
          </Badge>
        </>
      )
    }
  }

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

  const hasUsedAnswers = activeQuestion && answerStates[activeQuestion.id]?.some((used) => used)
  const areSnippetsExpanded = activeQuestion && snippetsExpanded[activeQuestion.id]
  const currentFieldValue = activeQuestion ? formData[activeQuestion.field as keyof typeof formData] : ""
  const shouldShowQuickPrompts = activeQuestion && isPolishMode && !quickPromptsUsed[activeQuestion.id]

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Application Section - 2/3 */}
      <div className="flex-1 flex flex-col" style={{ flexBasis: "66.666%" }}>
        {/* Header - Only spans application section */}
        <div className="border-b px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 p-1">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-medium">Opportunity</span>
                <span className="text-gray-400 text-sm">Saved 12s ago</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="text-gray-600 bg-transparent">
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
              <h1 className="text-4xl font-bold text-indigo-800 mb-4 leading-tight">
                Foot Locker Foundation Community
                <br />
                Empowerment Program
              </h1>
              <p className="text-gray-600 text-base leading-relaxed">
                This application form captures information for organizations seeking grants and technical assistance.
                <br />
                Please answer all questions as completely as possible.
              </p>
            </div>

            {/* Organizational Structure Section */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-8">Organizational Structure</h2>

              <div className="space-y-8">
                <div
                  className={`transition-all duration-300 ${
                    activeQuestion && activeQuestion.id !== "legal-name" ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <Label htmlFor="legal-name" className="text-sm font-medium text-gray-800 mb-2 block">
                    Legal Name of Organization*
                  </Label>
                  <Input
                    id="legal-name"
                    value={formData["legal-name"]}
                    onChange={(e) => handleInputChange("legal-name", e.target.value)}
                    onFocus={() => handleFieldFocus("legal-name")}
                    className={`w-full h-12 px-4 border-2 rounded-lg focus:ring-0 transition-all duration-300 ${
                      activeQuestion?.id === "legal-name"
                        ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div
                  className={`transition-all duration-300 ${
                    activeQuestion && activeQuestion.id !== "ein" ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <Label htmlFor="ein" className="text-sm font-medium text-gray-800 mb-2 block">
                    EIN (Employer Identification Number)*
                  </Label>
                  <Input
                    id="ein"
                    value={formData.ein}
                    onChange={(e) => handleInputChange("ein", e.target.value)}
                    onFocus={() => handleFieldFocus("ein")}
                    className={`w-full h-12 px-4 border-2 rounded-lg focus:ring-0 transition-all duration-300 ${
                      activeQuestion?.id === "ein"
                        ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div
                  className={`transition-all duration-300 ${
                    activeQuestion && activeQuestion.id !== "org-type" ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <Label htmlFor="org-type" className="text-sm font-medium text-gray-800 mb-2 block">
                    Type of Organization*
                  </Label>
                  <Select
                    value={formData["org-type"]}
                    onValueChange={(value) => handleInputChange("org-type", value)}
                    onOpenChange={(open) => open && handleFieldFocus("org-type")}
                  >
                    <SelectTrigger
                      className={`w-full h-12 px-4 border-2 rounded-lg focus:ring-0 transition-all duration-300 ${
                        activeQuestion?.id === "org-type"
                          ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
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
                </div>

                <div
                  className={`transition-all duration-300 ${
                    activeQuestion && activeQuestion.id !== "mission" ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <Label htmlFor="mission" className="text-sm font-medium text-gray-800 mb-2 block">
                    Organization Mission Statement*
                    <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Focus area
                    </Badge>
                  </Label>
                  <Textarea
                    id="mission"
                    value={formData.mission}
                    onChange={(e) => handleInputChange("mission", e.target.value)}
                    onFocus={() => handleFieldFocus("mission")}
                    placeholder="Click here to get AI-powered suggestions for your mission statement..."
                    className={`w-full min-h-[140px] p-4 border-2 rounded-lg focus:ring-0 resize-none transition-all duration-300 ${
                      activeQuestion?.id === "mission"
                        ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Point of Contact Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-8">
                Organization's Point of Contact for this Grant Opportunity
              </h2>

              <div className="space-y-8">
                <div
                  className={`transition-all duration-300 ${
                    activeQuestion && activeQuestion.id !== "contact-name" ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <Label htmlFor="contact-name" className="text-sm font-medium text-gray-800 mb-2 block">
                    Name*
                  </Label>
                  <Input
                    id="contact-name"
                    value={formData["contact-name"]}
                    onChange={(e) => handleInputChange("contact-name", e.target.value)}
                    onFocus={() => handleFieldFocus("contact-name")}
                    className={`w-full h-12 px-4 border-2 rounded-lg focus:ring-0 transition-all duration-300 ${
                      activeQuestion?.id === "contact-name"
                        ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div
                  className={`transition-all duration-300 ${
                    activeQuestion && activeQuestion.id !== "contact-title" ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <Label htmlFor="contact-title" className="text-sm font-medium text-gray-800 mb-2 block">
                    Title*
                  </Label>
                  <Input
                    id="contact-title"
                    value={formData["contact-title"]}
                    onChange={(e) => handleInputChange("contact-title", e.target.value)}
                    onFocus={() => handleFieldFocus("contact-title")}
                    className={`w-full h-12 px-4 border-2 rounded-lg focus:ring-0 transition-all duration-300 ${
                      activeQuestion?.id === "contact-title"
                        ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                </div>

                <div
                  className={`transition-all duration-300 ${
                    activeQuestion && activeQuestion.id !== "contact-email" ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <Label htmlFor="contact-email" className="text-sm font-medium text-gray-800 mb-2 block">
                    Email*
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={formData["contact-email"]}
                    onChange={(e) => handleInputChange("contact-email", e.target.value)}
                    onFocus={() => handleFieldFocus("contact-email")}
                    className={`w-full h-12 px-4 border-2 rounded-lg focus:ring-0 transition-all duration-300 ${
                      activeQuestion?.id === "contact-email"
                        ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-100"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advisor Panel - 1/3 */}
      <div
        className={`border-l border-gray-200 flex flex-col h-full ${
          activeQuestion
            ? "bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30"
            : "bg-gradient-to-br from-gray-50/40 via-slate-50/30 to-gray-100/40"
        } transition-all duration-500 ease-in-out`}
        style={{ flexBasis: "33.333%" }}
      >
        {/* Panel Header */}
        <div
          className={`border-b border-gray-200 p-6 flex-shrink-0 ${
            activeQuestion ? "bg-white/80 backdrop-blur-sm" : "bg-white/60 backdrop-blur-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Advisor</h3>
            </div>
            <div className="flex items-center gap-3">
              {/* Available Suggestions in Header */}
              {isPolishMode && activeQuestion && (
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
          <p className="text-sm text-gray-600">
            {activeQuestion ? (
              <>
                Let's discuss: <span className="font-medium text-gray-900">{activeQuestion.title}</span>
              </>
            ) : (
              "General application assistance"
            )}
          </p>

          {/* Expanded Suggestions Dropdown */}
          {isPolishMode && areSnippetsExpanded && activeQuestion && (
            <div className="mt-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-in slide-in-from-top-2 duration-300">
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                {activeQuestion.answers.map((answer, index) => {
                  const isUsed = answerStates[activeQuestion.id]?.[index] || false
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded text-sm border transition-all duration-200 hover:shadow-sm animate-in fade-in duration-200 ${
                        isUsed ? "border-green-200 bg-green-50 opacity-60" : "border-gray-200 hover:border-blue-200"
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">{answer.title}</h4>
                      <p className="text-gray-700 mb-3 leading-relaxed text-sm line-clamp-2">{answer.text}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">{renderSourceTags(answer.sources)}</div>
                        {isUsed ? (
                          <span className="text-green-600 text-sm animate-in fade-in duration-200">Added</span>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAnswerSelect(activeQuestion.field, answer.text, index)}
                              className="h-6 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200"
                            >
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAnswerRevise(activeQuestion.field, answer.text, index)}
                              className="h-6 px-3 text-xs border-purple-200 text-purple-700 hover:bg-purple-50 transition-all duration-200"
                            >
                              Revise
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeQuestion ? (
            <div className="space-y-4">
              {/* Pinned Answer */}
              {pinnedAnswer && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Pin className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-blue-900 text-sm">Revising: {pinnedAnswer.title}</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleUnpinAnswer}
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed mb-2">{pinnedAnswer.text}</p>
                  <div className="flex flex-wrap gap-1">{renderSourceTags(pinnedAnswer.sources)}</div>
                </div>
              )}

              {/* Chat Messages */}
              {chatMessages.length > 0 && (
                <div className="space-y-4 animate-in fade-in duration-500">
                  {chatMessages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {message.type === "revision" ? (
                        <div className="max-w-[95%] space-y-3">
                          <div className="bg-gray-100 text-gray-900 p-4 rounded-lg">
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>

                          {/* Show differences if both texts exist */}
                          {message.originalText && message.revisedText && (
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                              <h4 className="text-sm font-medium text-amber-800 mb-2">Key Changes:</h4>
                              <div className="text-xs text-amber-700 space-y-1">
                                {getDifferences(message.originalText, message.revisedText).map((diff, index) => (
                                  <div key={index} className="flex items-start gap-2">
                                    <span className="text-amber-600">•</span>
                                    <span>{diff}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Side-by-side comparison */}
                          {message.originalText && message.revisedText && (
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                              <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b">
                                <h4 className="text-sm font-medium text-gray-700">Compare Versions</h4>
                                <div className="flex gap-2">
                                  <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                    Original
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-green-50 text-green-700 border-green-200"
                                  >
                                    Revised
                                  </Badge>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 divide-x">
                                {/* Original Text */}
                                <div className="p-4 bg-red-50/30">
                                  <h5 className="text-xs font-medium text-red-700 mb-2 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    Original
                                  </h5>
                                  <p className="text-sm text-gray-700 leading-relaxed">{message.originalText}</p>
                                </div>
                                {/* Revised Text */}
                                <div className="p-4 bg-green-50/30">
                                  <h5 className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    Revised
                                  </h5>
                                  <p className="text-sm text-gray-700 leading-relaxed">{message.revisedText}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <p className="text-sm text-gray-700 leading-relaxed mb-3">{message.revisedText}</p>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUseRevision(message.revisedText || "")}
                                className="h-8 px-4 text-sm bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Copy className="w-3 h-3 mr-2" />
                                Use This Version
                              </Button>
                              {message.originalText && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUseRevision(message.originalText || "")}
                                  className="h-8 px-4 text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                  Keep Original
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`max-w-[85%] p-4 rounded-lg transition-all duration-200 ${
                            message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Polish Prompts - Show only once */}
              {shouldShowQuickPrompts && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <p className="text-sm text-gray-600 font-medium">Quick polish options:</p>
                  <div className="grid grid-cols-1 gap-3">
                    {quickPolishPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuickPolish(prompt)}
                        className="h-10 px-4 text-sm border-blue-200 text-blue-700 hover:bg-blue-50 transition-all duration-200 hover:scale-105 animate-in fade-in duration-300 justify-start"
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
                  <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-500">
                    <div className="max-w-[85%] p-4 rounded-lg bg-gray-100 text-gray-900">
                      <p className="text-sm leading-relaxed">
                        {activeQuestion.id === "mission"
                          ? "Here's some suggestions on how you can answer this question. This is a key section based on your organization's documents:"
                          : isFieldPrefilled(activeQuestion.id)
                            ? "Here's some suggestions on how you can answer this question. This field was auto-filled from your documents, but you can explore alternatives:"
                            : `Here's some suggestions on how you can answer this question about "${activeQuestion.title}":`}
                      </p>
                    </div>
                  </div>

                  {/* Animated Answer Cards */}
                  <div className="space-y-4">
                    {activeQuestion.answers.map((answer, index) => {
                      const isUsed = answerStates[activeQuestion.id]?.[index] || false

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
                              {/* Title */}
                              <h4 className="font-semibold text-gray-900 text-sm">{answer.title}</h4>

                              {/* Answer Text */}
                              <p className="text-sm text-gray-700 leading-relaxed transition-colors duration-200">
                                {answer.detailedText}
                              </p>

                              {/* Source Tags */}
                              <div className="flex flex-wrap gap-1">{renderSourceTags(answer.sources)}</div>

                              {/* Action Buttons */}
                              <div className="flex justify-end gap-2">
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
                                      className="h-8 px-4 text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200 hover:scale-105 hover:shadow-md"
                                    >
                                      <Plus className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:rotate-90" />
                                      Add
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleAnswerRevise(activeQuestion.field, answer.text, index)}
                                      className="h-8 px-4 text-sm border-purple-200 text-purple-700 hover:bg-purple-50 transition-all duration-200 hover:scale-105 hover:shadow-md"
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
                </div>
              )}

              {/* Full Answer Snippet Cards - Only show if NOT in polish mode and there are used answers or chat messages */}
              {!isPolishMode && (hasUsedAnswers || chatMessages.length > 0) && (
                <div className="space-y-4 animate-in fade-in duration-500">
                  {activeQuestion.answers.map((answer, index) => {
                    const isUsed = answerStates[activeQuestion.id]?.[index] || false

                    return (
                      <Card
                        key={index}
                        className={`transition-all duration-300 border hover:shadow-lg animate-in slide-in-from-bottom-2 ${
                          isUsed ? "border-green-200 bg-green-50" : "border-gray-200 hover:border-blue-200"
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Title */}
                            <h4 className="font-semibold text-gray-900 text-sm">{answer.title}</h4>

                            {/* Answer Text */}
                            <p className="text-sm text-gray-700 leading-relaxed transition-colors duration-200">
                              {answer.detailedText}
                            </p>

                            {/* Source Tags */}
                            <div className="flex flex-wrap gap-1">{renderSourceTags(answer.sources)}</div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2">
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
                                    className="h-8 px-4 text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200 hover:scale-105 hover:shadow-md"
                                  >
                                    <Plus className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:rotate-90" />
                                    Add
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleAnswerRevise(activeQuestion.field, answer.text, index)}
                                    className="h-8 px-4 text-sm border-purple-200 text-purple-700 hover:bg-purple-50 transition-all duration-200 hover:scale-105 hover:shadow-md"
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
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500 relative">
                {/* Subtle background gradient for general state */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 rounded-2xl opacity-60 -z-10"></div>
                <div className="relative z-10 p-8">
                  <MessageCircle className="w-16 h-16 mx-auto mb-6 text-gray-300" />
                  <p className="text-base leading-relaxed">
                    Morning Nicole 👋
                    <br />
                    <br />
                    I've pre-filled the basic information from your organization's documents. Let's focus on crafting
                    compelling long-form responses like your mission statement.
                    <br />
                    <br />
                    Click on any form field to get tailored suggestions, or ask me anything about the application
                    process.
                  </p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Polish Suggestion - Only show if not used before */}
        {activeQuestion && showPolishSuggestion[activeQuestion.id] && !polishUsed[activeQuestion.id] && (
          <div className="px-6 pb-3 animate-in slide-in-from-bottom-4 duration-500 ease-out">
            <Button
              onClick={handlePolishRequest}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] transform h-12"
            >
              <Wand2 className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:rotate-12" />
              Polish with AI
            </Button>
          </div>
        )}

        {/* Fixed Chat Input */}
        <div
          className={`border-t border-gray-200 p-6 flex-shrink-0 ${
            activeQuestion ? "bg-white/80 backdrop-blur-sm" : "bg-white/60 backdrop-blur-sm"
          }`}
        >
          <div className="space-y-3">
            {/* Minimized Source Material and Saved Prompts Buttons */}
            <div className="flex justify-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSourceMaterial}
                className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 h-6 px-2"
              >
                <Database className="w-3 h-3 mr-1" />
                Sources
                {showSourceMaterial ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSavedPrompts}
                className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 h-6 px-2"
              >
                <Bookmark className="w-3 h-3 mr-1" />
                Prompts
                {showSavedPrompts ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
              </Button>
            </div>

            {/* Source Material Dropdown */}
            {showSourceMaterial && (
              <div className="border border-gray-200 rounded-lg bg-white shadow-sm animate-in slide-in-from-top-2 duration-300">
                <div className="p-3">
                  <h4 className="font-medium text-gray-900 mb-2 text-xs">Referenced Documents:</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {getAllSources().map((source, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-1 rounded hover:bg-gray-50 transition-colors duration-200"
                      >
                        <FileText className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-700">{source}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Documents informing AI suggestions</p>
                </div>
              </div>
            )}

            {/* Saved Prompts Dropdown */}
            {showSavedPrompts && (
              <div className="border border-gray-200 rounded-lg bg-white shadow-sm animate-in slide-in-from-top-2 duration-300">
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-xs">Saved Prompts:</h4>
                    {chatInput.trim() && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSaveCurrentPrompt}
                        className="text-xs text-blue-600 hover:text-blue-700 h-5 px-1"
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
                          <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{prompt.text}</p>
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
                  <p className="text-xs text-gray-400 mt-2">Click to use a saved prompt</p>
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="relative">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={activeQuestion ? "Ask Co-Pilot anything..." : "Ask about the application..."}
                className="w-full h-12 pr-12 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-0 text-base shadow-sm"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSendMessage}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-blue-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
