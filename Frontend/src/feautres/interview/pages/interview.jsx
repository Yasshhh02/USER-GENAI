import React, { useState , useEffect} from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate,useParams } from "react-router";
import { generateResumePdf } from "../services/interview.api.js";

const interviewData = {
  matchScore: 96,

  technicalQuestions: [
    {
      question:
        "How do you handle user authentication and authorization securely in a MERN stack application, specifically using JWT and cookies?",
      intention:
        "To assess the candidate's practical knowledge of security, JWTs, and HTTP-only cookies based on their projects.",
      answer:
        "JWTs should be stored in HTTP-only cookies rather than localStorage to mitigate XSS attacks. In Express, a custom middleware verifies the token from the cookie, decodes the user payload, and attaches it to the request object to protect routes.",
    },
    {
      question:
        "Explain the difference between state management in React using local state or Context API versus Redux, and when would you use Redux?",
      intention:
        "To test the candidate's understanding of state management tools listed in their resume.",
      answer:
        "Local state is component-specific, while Context API is ideal for low-frequency global updates like theme or user sessions. Redux is useful for large applications with complex global state, high-frequency updates, and middleware requirements.",
    },
    {
      question:
        "In your Real-Time Chat Application, how does Socket.io differ from standard HTTP REST APIs, and how do you handle connection events?",
      intention:
        "To evaluate the candidate's understanding of real-time protocols and WebSocket libraries.",
      answer:
        "HTTP follows a stateless request-response pattern. Socket.io creates persistent bi-directional communication between the client and server. The server listens for connection events and can emit messages to individual users or rooms instantly.",
    },
    {
      question:
        "How do you optimize MongoDB queries and ensure data integrity using Mongoose schemas?",
      intention:
        "To test the candidate's database optimization and validation skills.",
      answer:
        "Data integrity is maintained using schema validation, required fields, custom validation, enums, and defaults. Performance can be improved using indexes, lean queries for read-only operations, and avoiding unnecessary population.",
    },
    {
      question:
        "How did you integrate the Gemini AI API in your AI Interview Preparation Platform, and how do you handle API errors or rate limits?",
      intention:
        "To assess the candidate's integration capabilities with modern AI APIs.",
      answer:
        "The Gemini API can be integrated using the Google GenAI SDK with API keys stored securely in environment variables. Requests should use try-catch blocks, proper error responses, retry mechanisms, and exponential backoff for rate limits.",
    },
  ],

  behavioralQuestions: [
    {
      question:
        "Can you describe a challenge you faced while developing your AI Interview Prep Platform and how you overcame it?",
      intention:
        "Evaluate problem-solving capabilities, technical resilience, and project management skills.",
      answer:
        "A challenge was handling API latency. This was improved by optimizing prompts, showing loading states to users, and handling API failures gracefully.",
    },
    {
      question:
        "How did you collaborate with other developers and manage version control during your internship?",
      intention:
        "Assess the candidate's team collaboration and understanding of Git workflows.",
      answer:
        "I used feature branches, created pull requests, participated in code reviews, resolved merge conflicts, and regularly synchronized my branch with the main branch.",
    },
    {
      question:
        "As a recent graduate, how do you prioritize tasks when working under tight deadlines?",
      intention:
        "Determine time management and self-organization strategies.",
      answer:
        "I identify critical tasks first and focus on core functionality before moving to smaller improvements. I break large tasks into smaller deliverables and track progress.",
    },
    {
      question:
        "Tell me about a time you had to learn a new technology quickly for a project.",
      intention:
        "Evaluate adaptability and continuous learning.",
      answer:
        "While building a real-time chat application, I needed to learn Socket.io. I first built a small prototype, understood the basic events, and then integrated it into the larger application.",
    },
    {
      question:
        "How do you respond when you receive critical feedback about your work?",
      intention:
        "Evaluate maturity, teamwork, and willingness to improve.",
      answer:
        "I listen carefully to the feedback, understand the reason behind it, and use it to improve my implementation. Constructive feedback helps me become a better developer.",
    },
  ],

  skillGaps: [
    {
      skill: "Full-Stack Application Deployment",
      severity: "medium",
    },
    {
      skill: "Unit and Integration Testing",
      severity: "low",
    },
    {
      skill: "System Design",
      severity: "medium",
    },
  ],

  preprationPlan: [
    {
      day: 1,
      focus: "Core JavaScript and ES6+",
      tasks: [
        "Practice closures, promises, async/await.",
        "Review JavaScript array methods.",
      ],
    },
    {
      day: 2,
      focus: "Frontend Development & React.js",
      tasks: [
        "Review hooks and component lifecycle.",
        "Practice state management.",
      ],
    },
    {
      day: 3,
      focus: "Backend Development with Node.js & Express",
      tasks: [
        "Build REST APIs.",
        "Practice middleware and error handling.",
      ],
    },
    {
      day: 4,
      focus: "MongoDB and Database Design",
      tasks: [
        "Practice schema design.",
        "Learn indexing and query optimization.",
      ],
    },
    {
      day: 5,
      focus: "Authentication & Security",
      tasks: [
        "Review JWT authentication.",
        "Practice protected routes.",
      ],
    },
    {
      day: 6,
      focus: "Projects & Problem Solving",
      tasks: [
        "Improve existing projects.",
        "Practice debugging challenges.",
      ],
    },
    {
      day: 7,
      focus: "Mock Interview & Review",
      tasks: [
        "Conduct a mock interview.",
        "Review weak areas.",
      ],
    },
  ],
};

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const [openQuestion, setOpenQuestion] = useState(null);
  const{ report,getReportById ,loading , getResumePdf} = useInterview()
  const { interviewId } = useParams()

  useEffect(() => {
    if (interviewId){
        getReportById(interviewId)
    }
  },[ interviewId])

  const questions =
    activeSection === "technical"
      ? interviewData.technicalQuestions
      : interviewData.behavioralQuestions;

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);

    if(loading || !report){
        return(
            <main className="loading-screen">
                <h1>Loading your interview plan...</h1>
            </main>
        )
    }
  };

  return (
    <main className="interview-page">
      <div className="interview-layout">

        {/* LEFT SIDEBAR */}

        <aside className="interview-sidebar">
          <p className="sidebar-title">SECTIONS</p>

          <button
            className={`sidebar-item ${
              activeSection === "technical" ? "active" : ""
            }`}
            onClick={() => {
              setActiveSection("technical");
              setOpenQuestion(null);
            }}
          >
            <span>⌘</span>
            Technical Questions
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "behavioral" ? "active" : ""
            }`}
            onClick={() => {
              setActiveSection("behavioral");
              setOpenQuestion(null);
            }}
        
          >
            <span>□</span>
            Behavioral Questions
          </button>

          <button
            className={`sidebar-item ${
              activeSection === "roadmap" ? "active" : ""
            }`}
            onClick={() => {
              setActiveSection("roadmap");
              setOpenQuestion(null);
            }}
          >
            <span>➤</span>
            Road Map
          </button>
          <button
          onClick={() => getResumePdf(interviewId)}
          className="button primary-button download-resume-btn"
          disabled={loading}
          >
            {loading ? (
            <>
            <span className="spinner"></span>
            Downloading...
            </>
            ) : (
            <>
            ⬇️ Download Resume
            </>
        )}
        </button>
        </aside>


        {/* CENTER CONTENT */}

        <section className="interview-content">

          {activeSection !== "roadmap" && (
            <>
              <div className="content-header">
                <div>
                  <h1>
                    {activeSection === "technical"
                      ? "Technical Questions"
                      : "Behavioral Questions"}
                  </h1>

                  <p>
                    Practice these questions to prepare for your upcoming
                    interview.
                  </p>
                </div>

                <span className="question-count">
                  {questions.length} Questions
                </span>
              </div>


              <div className="questions-container">
                {questions.map((item, index) => {
                  const isOpen = openQuestion === index;

                  return (
                    <div
                      className={`question-card ${
                        isOpen ? "question-open" : ""
                      }`}
                      key={index}
                    >
                      <button
                        className="question-header"
                        onClick={() => toggleQuestion(index)}
                      >
                        <span className="question-number">
                          {index + 1}
                        </span>

                        <span className="question-text">
                          {item.question}
                        </span>

                        <span className="arrow">
                          {isOpen ? "⌃" : "⌄"}
                        </span>
                      </button>


                      {isOpen && (
                        <div className="question-details">

                          <div className="detail-block">
                            <h4>◎ Interviewer's Intention</h4>
                            <p>{item.intention}</p>
                          </div>

                          <div className="detail-block">
                            <h4>▣ Suggested Answer</h4>
                            <p>{item.answer}</p>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}


          {/* ROADMAP */}

          {activeSection === "roadmap" && (
            <div className="roadmap-section">
              <div className="content-header">
                <div>
                  <h1>Preparation Road Map</h1>
                  <p>
                    Follow this day-wise plan to prepare for your interview.
                  </p>
                </div>

                <span className="question-count">
                  7 Day Plan
                </span>
              </div>


              <div className="roadmap-container">
                {interviewData.preprationPlan.map((plan) => (
                  <div className="roadmap-item" key={plan.day}>

                    <div className="roadmap-dot"></div>

                    <div className="roadmap-content">
                      <div className="roadmap-heading">
                        <span>Day {plan.day}</span>
                        <h3>{plan.focus}</h3>
                      </div>

                      <ul>
                        {plan.tasks.map((task, index) => (
                          <li key={index}>{task}</li>
                        ))}
                      </ul>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}
        </section>


        {/* RIGHT SIDEBAR */}

        <aside className="interview-summary">

          <div className="match-section">
            <p className="summary-title">MATCH SCORE</p>

            <div className="score-circle">
              {interviewData.matchScore}
              <span>/100</span>
            </div>

            <p className="match-text">
              Strong match for this role
            </p>
          </div>


          <div className="summary-divider"></div>


          <div className="skill-section">
            <p className="summary-title">SKILL GAPS</p>

            <div className="skill-list">
              {interviewData.skillGaps.map((gap, index) => (
                <div
                  key={index}
                  className={`skill-card ${gap.severity}`}
                >
                  <span>{gap.skill}</span>

                  <small>{gap.severity}</small>
                </div>
              ))}
            </div>
          </div>


          <div className="summary-divider"></div>


          <div className="plan-section">
            <p className="summary-title">
              PREPARATION PLAN
            </p>

            <div className="mini-plan-list">
              {interviewData.preprationPlan.map((plan) => (
                <div className="mini-plan" key={plan.day}>
                  <span>Day {plan.day}</span>

                  <p>{plan.focus}</p>
                </div>
              ))}
            </div>
          </div>

        </aside>
      </div>
    </main>
  );
};

export default Interview;