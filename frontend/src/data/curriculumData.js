// src/data/curriculumData.js

export const CURRICULUM_CATEGORIES = [
  "All",
  "Full Stack Development",
  "Data Analytics",
  "AI & Machine Learning",
  "Cloud & DevOps",
  "Cybersecurity",
  "UI/UX Design",
  "Software Testing",
  "Business Analysis",
  "Digital Marketing",
  "SAP",
  "Professional Skills"
];

export const DIFFICULTY_LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

export const PROFESSIONAL_SKILLS_LIST = [
  { id: "sk-comm", name: "Communication Skills", icon: "🗣️", desc: "Master clear, confident verbal and written workplace communication." },
  { id: "sk-eng", name: "English Communication", icon: "🌐", desc: "Fluency, vocabulary, and professional grammar for global business." },
  { id: "sk-pres", name: "Presentation Skills", icon: "📊", desc: "Deliver persuasive slide decks and technical presentations to stakeholders." },
  { id: "sk-ps", name: "Problem Solving", icon: "🧩", desc: "Structured analytical frameworks (MECE, 5 Whys) for complex engineering issues." },
  { id: "sk-ct", name: "Critical Thinking", icon: "💡", desc: "Evaluate assumptions, data validity, and logical decision-making." },
  { id: "sk-tm", name: "Time Management", icon: "⏱️", desc: "Prioritize workloads using Pomodoro, Eisenhower Matrix, and Agile sprints." },
  { id: "sk-tw", name: "Teamwork & Collaboration", icon: "🤝", desc: "Cross-functional team alignment, active listening, and conflict resolution." },
  { id: "sk-lead", name: "Leadership Fundamentals", icon: "👑", desc: "Inspire teams, delegate responsibilities, and drive project velocity." },
  { id: "sk-res", name: "Resume Building", icon: "📄", desc: "Build ATS-friendly technical resumes with high impact bullet points." },
  { id: "sk-lin", name: "LinkedIn Profile Optimization", icon: "💼", desc: "Position your personal brand to attract recruiters and industry peers." },
  { id: "sk-prep", name: "Interview Preparation", icon: "🎤", desc: "Master behavioral (STAR method) and technical interview loops." },
  { id: "sk-apt", name: "Aptitude & Logical Reasoning", icon: "🧮", desc: "Quantitative aptitude, data interpretation, and speed math for placement tests." },
  { id: "sk-gd", name: "Group Discussion (GD)", icon: "💬", desc: "Lead GD topics, initiate discussions, and articulate balanced viewpoints." },
  { id: "sk-mock", name: "Mock Interviews & Feedback", icon: "⚡", desc: "Simulated 1-on-1 interview practice with real-time scoring reports." }
];

export const CURRICULUM_DATA = [
  {
    id: "fullstack-dev",
    title: "Full Stack Development",
    category: "Full Stack Development",
    level: "Intermediate",
    estimatedDuration: "16 Weeks (120 Hours)",
    shortDescription: "Complete end-to-end web engineering path covering Web Fundamentals, CSS, JS, React, Node.js, FastAPI, Databases, DevOps & Full Stack Projects.",
    fullDescription: "Master front-end interfaces, back-end web servers, relational databases, and cloud DevOps pipelines. Designed to take you from web basics to architecting production-grade SaaS applications.",
    careerOpportunities: ["Full Stack Engineer", "Frontend Developer", "Backend Developer", "Node.js Architect", "React Specialist"],
    prerequisites: ["Basic Computer Literacy", "Logical Problem Solving"],
    instructor: { name: "Elena Rostova", title: "Principal Full Stack Architect", avatar: "👩‍💻" },
    icon: "🌐",
    bannerGradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    skillsCovered: ["HTML5", "CSS3/Tailwind", "JavaScript (ES6+)", "Git/GitHub", "React.js", "Node.js/Express", "FastAPI", "PostgreSQL", "Docker", "CI/CD"],
    modules: [
      {
        id: "fs-m1",
        title: "Module 1 — Web Fundamentals",
        description: "Master client-server architecture, HTTP protocols, HTML5 semantics, forms, tables, and accessibility.",
        topics: [
          {
            id: "fs-m1-t1",
            title: "How the Web Works & HTTP/DNS",
            duration: "30 min",
            explanation: "The Web operates on a Client-Server model. When you type a URL, DNS translates the hostname into an IP address, opening a TCP connection to fetch HTTP resources.",
            objectives: ["Understand Client-Server requests", "Learn HTTP verbs (GET, POST, PUT, DELETE)", "Analyze DNS lookup resolution"],
            subtopics: ["How the Web Works", "Internet Basics", "HTTP / HTTPS", "Client and Server", "DNS", "Browser Architecture"],
            example: {
              description: "Standard HTTP Request-Response payload format:",
              codeSnippet: `GET /api/v1/courses HTTP/1.1\nHost: api.vellife.com\nAccept: application/json\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n\n[{"id": 1, "name": "Full Stack"}]`
            },
            practicalExercise: {
              title: "HTTP Inspection Task",
              task: "Open Chrome Developer Tools -> Network tab. Inspect the HTTP status code, request headers, and response payload of a web page fetch.",
              hint: "Filter network requests by 'Fetch/XHR' to view API payloads.",
              solution: "Observed status 200 OK with application/json header payload."
            },
            miniQuiz: {
              question: "Which HTTP status code indicates a successful resource fetch?",
              options: ["200 OK", "404 Not Found", "500 Internal Server Error", "301 Moved Permanently"],
              correctAnswer: 0,
              explanation: "Status code 200 OK indicates the request succeeded and the payload was returned."
            },
            resources: [{ title: "MDN: How the Web Works", url: "https://developer.mozilla.org" }]
          },
          {
            id: "fs-m1-t2",
            title: "HTML5 & Semantic Structure",
            duration: "45 min",
            explanation: "Semantic HTML uses meaningful elements (<header>, <nav>, <main>, <section>, <footer>) to structure pages for search engine crawlers and screen readers.",
            objectives: ["Build accessible HTML documents", "Use semantic sectioning tags", "Design accessible forms with labels"],
            subtopics: ["HTML", "Semantic HTML", "Forms", "Tables", "Accessibility Basics"],
            example: {
              description: "Accessible, semantic HTML form snippet:",
              codeSnippet: `<main>\n  <form aria-label="Course Enrollment">\n    <label for="name">Full Name:</label>\n    <input type="text" id="name" required />\n    <button type="submit">Enroll Now</button>\n  </form>\n</main>`
            },
            practicalExercise: {
              title: "Semantic Form Build",
              task: "Create a semantic HTML form containing text inputs, email inputs, radio buttons, and a submit button with explicit label elements.",
              hint: "Ensure every <input> has a corresponding <label for='...'> matching its id.",
              solution: "Form built with accessible labeling tags."
            },
            miniQuiz: {
              question: "Why should semantic HTML tags be used instead of plain <div> elements?",
              options: [
                "Semantic tags automatically add CSS animations",
                "Improves SEO, accessibility for screen readers, and code maintainability",
                "Semantic tags prevent backend database errors",
                "Div tags are deprecated in HTML5"
              ],
              correctAnswer: 1,
              explanation: "Semantic tags give structural meaning to web document content for search engines and assistive devices."
            },
            resources: [{ title: "W3C Accessibility Guidelines", url: "https://w3.org/WAI" }]
          }
        ]
      },
      {
        id: "fs-m2",
        title: "Module 2 — CSS & Responsive Design",
        description: "Master CSS selectors, Box Model, Flexbox, Grid, Media Queries, Animations, and Tailwind CSS.",
        topics: [
          {
            id: "fs-m2-t1",
            title: "Flexbox & CSS Grid Layout Engines",
            duration: "60 min",
            explanation: "Flexbox manages 1-dimensional item alignment along rows or columns, while CSS Grid manages 2-dimensional multi-column layouts.",
            objectives: ["Master display: flex property", "Build responsive CSS Grid layouts", "Create fluid media query breakpoints"],
            subtopics: ["CSS Fundamentals", "Selectors", "Box Model", "Display", "Positioning", "Flexbox", "CSS Grid", "Responsive Design", "Media Queries", "Animations", "Transitions", "Modern CSS", "Tailwind CSS"],
            example: {
              description: "Responsive 3-column CSS Grid container:",
              codeSnippet: `.grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 24px;\n}`
            },
            practicalExercise: {
              title: "Card Grid Challenge",
              task: "Design a responsive course card layout that automatically adjusts from 3 columns on desktop to 1 column on mobile devices.",
              hint: "Use grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)).",
              solution: "Grid layout resizes fluidly without breaking container boundaries."
            },
            miniQuiz: {
              question: "Which CSS property defines flex item alignment along the cross axis?",
              options: ["justify-content", "align-items", "flex-direction", "grid-gap"],
              correctAnswer: 1,
              explanation: "align-items aligns flex items along the cross axis (vertical when flex-direction is row)."
            },
            resources: [{ title: "CSS Tricks Complete Flexbox Guide", url: "https://css-tricks.com" }]
          }
        ]
      },
      {
        id: "fs-m3",
        title: "Module 3 — JavaScript Programming",
        description: "Master core JS, DOM manipulation, ES6+, Async/Await, Promises, and API fetching.",
        topics: [
          {
            id: "fs-m3-t1",
            title: "Async JavaScript, Promises & Fetch API",
            duration: "60 min",
            explanation: "Asynchronous JavaScript executes non-blocking network calls using Promises and async/await syntax to fetch backend JSON payloads.",
            objectives: ["Understand event loop execution", "Write async/await functions", "Handle fetch HTTP errors using try/catch"],
            subtopics: ["JavaScript Fundamentals", "Variables", "Data Types", "Operators", "Conditions", "Loops", "Functions", "Arrays", "Objects", "DOM", "Events", "ES6+", "Destructuring", "Spread / Rest", "Modules", "Promises", "Async/Await", "Fetch API", "Error Handling"],
            example: {
              description: "Fetching JSON data asynchronously with error handling:",
              codeSnippet: `async function loadCourses() {\n  try {\n    const res = await fetch('/api/courses');\n    if (!res.ok) throw new Error('API Failure');\n    const data = await res.json();\n    console.log(data);\n  } catch (err) {\n    console.error('Error fetching courses:', err);\n  }\n}`
            },
            practicalExercise: {
              title: "Async Data Fetcher",
              task: "Write an async function that fetches a list of users from 'https://jsonplaceholder.typicode.com/users' and renders user names to the DOM.",
              hint: "Remember to await both response.json() and fetch().",
              solution: "Fetched and rendered 10 users successfully."
            },
            miniQuiz: {
              question: "What does the 'await' keyword do when placed before a Promise function?",
              options: [
                "Cancels the Promise execution",
                "Pauses async function execution until the Promise resolves or rejects",
                "Converts a JavaScript object to a JSON string",
                "Triggers an immediate browser reload"
              ],
              correctAnswer: 1,
              explanation: "'await' pauses execution inside an async function until the Promise resolves, returning the result value."
            },
            resources: [{ title: "JS Info Async/Await Guide", url: "https://javascript.info" }]
          }
        ]
      },
      {
        id: "fs-m4",
        title: "Module 4 — Git & GitHub Version Control",
        description: "Repositories, branching strategies, pull requests, merge conflict resolution, and deployment.",
        topics: [
          {
            id: "fs-m4-t1",
            title: "Git Workflow & Team Collaboration",
            duration: "45 min",
            explanation: "Git tracks historical code changes across local commits, while GitHub hosts remote repositories enabling pull request code reviews.",
            objectives: ["Master git add, commit, push, pull commands", "Create and merge feature branches", "Resolve merge conflicts"],
            subtopics: ["Git Basics", "Repository", "Commit", "Branch", "Merge", "Pull Request", "GitHub", "Collaboration", "GitHub Projects", "Deployment"],
            example: {
              description: "Standard feature branch workflow:",
              codeSnippet: `git checkout -b feature/auth-system\ngit add .\ngit commit -m "Add JWT login logic"\ngit push origin feature/auth-system`
            },
            practicalExercise: {
              title: "Branching Challenge",
              task: "Create a new branch named 'feature/profile', make a code edit, commit it, and merge it back into main branch.",
              hint: "Use 'git checkout -b' to branch and 'git merge' to combine.",
              solution: "Branch created and merged cleanly."
            },
            miniQuiz: {
              question: "Which command creates and switches to a new Git branch simultaneously?",
              options: ["git branch <name>", "git checkout -b <name>", "git commit -m <name>", "git push -u <name>"],
              correctAnswer: 1,
              explanation: "'git checkout -b <name>' creates the new branch and immediately checks it out."
            },
            resources: [{ title: "Pro Git Book", url: "https://git-scm.com/book" }]
          }
        ]
      },
      {
        id: "fs-m5",
        title: "Module 5 — React.js Frontend Framework",
        description: "Components, JSX, props, useState, useEffect, useContext, React Router, and state management.",
        topics: [
          {
            id: "fs-m5-t1",
            title: "React Hooks & State Architecture",
            duration: "60 min",
            explanation: "React components re-render automatically when state hooks (useState) change. useEffect handles side-effects like API data fetching.",
            objectives: ["Manage local component state", "Execute side-effects with useEffect", "Navigate single page apps with React Router"],
            subtopics: ["React Fundamentals", "Components", "JSX", "Props", "State", "Events", "Hooks", "useState", "useEffect", "useContext", "Forms", "React Router", "API Integration", "Authentication", "State Management"],
            example: {
              description: "React functional component with useState and useEffect:",
              codeSnippet: `import { useState, useEffect } from 'react';\n\nfunction CourseList() {\n  const [courses, setCourses] = useState([]);\n  useEffect(() => {\n    fetch('/api/courses').then(res => res.json()).then(data => setCourses(data));\n  }, []);\n  return <div>{courses.map(c => <p key={c.id}>{c.title}</p>)}</div>;\n}`
            },
            practicalExercise: {
              title: "React State Toggle Task",
              task: "Build a React component with a button that toggles a card between expanded and collapsed state.",
              hint: "Use const [expanded, setExpanded] = useState(false).",
              solution: "Card toggle functionality verified."
            },
            miniQuiz: {
              question: "What array should be passed as the second argument to useEffect to execute it only once when component mounts?",
              options: ["An empty array []", "An array with all state variables", "No second argument", "An array containing [true]"],
              correctAnswer: 0,
              explanation: "Passing an empty dependency array [] ensures the effect runs only once after the initial render."
            },
            resources: [{ title: "Official React Documentation", url: "https://react.dev" }]
          }
        ]
      },
      {
        id: "fs-m6",
        title: "Module 6 — Backend Development (Node & Python)",
        description: "REST API architecture, Node.js/Express, Python FastAPI, JWT authentication, and API security.",
        topics: [
          {
            id: "fs-m6-t1",
            title: "Building REST APIs with Express & FastAPI",
            duration: "60 min",
            explanation: "Backend web frameworks expose API endpoints that validate HTTP payloads, perform database CRUD operations, and return HTTP status responses.",
            objectives: ["Design RESTful URL paths", "Implement JWT token authentication", "Hash user passwords securely with bcrypt"],
            subtopics: ["Backend Fundamentals", "REST APIs", "HTTP Methods", "API Architecture", "Python", "FastAPI", "Node.js", "Express.js", "Authentication", "Authorization", "JWT", "Password Hashing", "Validation", "Error Handling", "File Upload", "API Security"],
            example: {
              description: "Express.js POST authentication endpoint with JWT:",
              codeSnippet: `app.post('/api/login', async (req, res) => {\n  const { email, password } = req.body;\n  const user = await findUser(email);\n  if (user && await bcrypt.compare(password, user.hash)) {\n    const token = jwt.sign({ id: user.id }, SECRET);\n    return res.json({ token });\n  }\n  res.status(401).json({ error: 'Invalid credentials' });\n});`
            },
            practicalExercise: {
              title: "Express API Route",
              task: "Create a POST endpoint '/api/tasks' that accepts task JSON input and saves it to an in-memory array.",
              hint: "Use app.use(express.json()) middleware to parse request bodies.",
              solution: "POST endpoint returns 201 Created with saved task object."
            },
            miniQuiz: {
              question: "Which HTTP method should be used when updating an existing database record?",
              options: ["GET", "POST", "PUT / PATCH", "DELETE"],
              correctAnswer: 2,
              explanation: "PUT or PATCH HTTP methods are standard for updating existing resources."
            },
            resources: [{ title: "Express.js Official Guide", url: "https://expressjs.com" }]
          }
        ]
      },
      {
        id: "fs-m7",
        title: "Module 7 — Relational Databases & SQL",
        description: "Database design, PostgreSQL, MySQL, table relationships, JOINs, CTEs, and normalization.",
        topics: [
          {
            id: "fs-m7-t1",
            title: "Relational Schema & Complex JOIN Queries",
            duration: "60 min",
            explanation: "Relational databases structure data into normalized tables linked via Primary and Foreign keys, queried using SQL SELECT statement JOINs.",
            objectives: ["Write 3NF normalized database schemas", "Execute INNER and LEFT JOIN queries", "Use database indexes for fast query speeds"],
            subtopics: ["Database Fundamentals", "SQL", "MySQL", "PostgreSQL", "Tables", "Relationships", "Primary Key", "Foreign Key", "Joins", "CRUD", "Indexes", "Transactions", "Normalization"],
            example: {
              description: "SQL JOIN query retrieving student enrollments:",
              codeSnippet: `SELECT s.name, c.title, e.progress_pct\nFROM enrollments e\nJOIN students s ON e.student_id = s.id\nJOIN courses c ON e.course_id = c.id\nWHERE e.progress_pct >= 80;`
            },
            practicalExercise: {
              title: "SQL Schema Design",
              task: "Write DDL statements creating a 'users' table and an 'orders' table linked by foreign key.",
              hint: "FOREIGN KEY (user_id) REFERENCES users(id).",
              solution: "Tables created with foreign key constraints."
            },
            miniQuiz: {
              question: "What is the primary function of a database Index?",
              options: [
                "Encrypts data stored on disk",
                "Speeds up data retrieval queries at the cost of slight write overhead",
                "Automatically backs up database tables every hour",
                "Formats SQL query text nicely"
              ],
              correctAnswer: 1,
              explanation: "Indexes create lookup trees that drastically accelerate SELECT query speed."
            },
            resources: [{ title: "PostgreSQL Tutorial", url: "https://postgresqltutorial.com" }]
          }
        ]
      },
      {
        id: "fs-m8",
        title: "Module 8 — DevOps & Cloud Deployment",
        description: "Environment variables, Linux, Docker, Dockerfile, CI/CD with GitHub Actions, Vercel, and AWS.",
        topics: [
          {
            id: "fs-m8-t1",
            title: "Docker Containerization & GitHub Actions CI/CD",
            duration: "60 min",
            explanation: "Docker packages code and dependencies into portable containers. GitHub Actions automates testing and deployment pipelines.",
            objectives: ["Write custom Dockerfiles", "Configure GitHub Actions workflows", "Deploy apps to Vercel and Render"],
            subtopics: ["Environment Variables", "Linux Basics", "Docker", "Dockerfile", "Docker Compose", "CI/CD", "GitHub Actions", "Cloud Deployment", "Vercel", "Render", "AWS basics"],
            example: {
              description: "Dockerfile for Node.js Express application:",
              codeSnippet: `FROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 5000\nCMD ["npm", "start"]`
            },
            practicalExercise: {
              title: "Dockerfile Challenge",
              task: "Write a Dockerfile that sets up a Python environment and executes 'python app.py'.",
              hint: "Start FROM python:3.11-slim and use CMD ['python', 'app.py'].",
              solution: "Dockerfile validated."
            },
            miniQuiz: {
              question: "What is the key advantage of containerizing an app with Docker?",
              options: [
                "Guarantees the app will run identically across all development and production servers",
                "Eliminates the need to write backend code",
                "Increases internet connection bandwidth",
                "Automatically designs user interface mockups"
              ],
              correctAnswer: 0,
              explanation: "Docker containers package code with all dependencies, ensuring consistent runtime behavior across all OS environments."
            },
            resources: [{ title: "Docker Docs", url: "https://docs.docker.com" }]
          }
        ]
      },
      {
        id: "fs-m9",
        title: "Module 9 — Full Stack Projects",
        description: "Build portfolio-ready projects ranging from beginner auth systems to advanced AI-powered SaaS platforms.",
        topics: [
          {
            id: "fs-m9-t1",
            title: "Capstone Full Stack SaaS Application",
            duration: "90 min",
            explanation: "Synthesize all Full Stack skills by building an end-to-end production web application featuring React, Express/FastAPI, PostgreSQL, and authentication.",
            objectives: ["Architect production application schema", "Build responsive React UI", "Deploy on cloud infrastructure"],
            subtopics: ["Authentication System", "Task Management App", "E-commerce Application", "Job Portal", "Learning Management System", "AI-powered Full Stack Application"],
            example: {
              description: "SaaS architecture overview:",
              codeSnippet: `React Client -> REST API Server (Express/FastAPI) -> PostgreSQL Database\n                                            -> OpenAI / AI Microservice`
            },
            practicalExercise: {
              title: "Full Stack Deployment Verification",
              task: "Verify that your client application fetches live data from your backend API database deployment.",
              hint: "Check CORS settings on your backend server to allow frontend origins.",
              solution: "Full Stack communication verified."
            },
            miniQuiz: {
              question: "What header setting must backend servers configure to allow requests from cross-origin React clients?",
              options: ["CORS (Access-Control-Allow-Origin)", "Content-Type", "User-Agent", "Cache-Control"],
              correctAnswer: 0,
              explanation: "CORS headers instruct browsers to permit cross-origin HTTP requests between client and server domains."
            },
            resources: [{ title: "Vercel Full Stack Guides", url: "https://vercel.com/docs" }]
          }
        ]
      }
    ],
    projects: [
      {
        id: "fs-proj-1",
        title: "Authentication & User Portal",
        difficulty: "Beginner",
        skillsUsed: ["HTML/CSS", "JavaScript", "Express.js", "JWT", "Bcrypt"],
        requirements: ["Secure registration & login form", "Password hashing", "JWT token generation", "Protected dashboard view"],
        expectedOutput: "Functional user login system with session persistence.",
        stepByStepTasks: ["Set up Express server", "Add bcrypt hashing", "Generate JWT on login", "Create protected frontend route"]
      },
      {
        id: "fs-proj-2",
        title: "AI-Powered SaaS Learning Platform",
        difficulty: "Advanced",
        skillsUsed: ["React", "FastAPI/Node", "PostgreSQL", "Tailwind CSS", "Docker", "Vercel"],
        requirements: ["Course management dashboard", "Interactive lesson reader", "AI resume analyzer endpoint", "Progress tracking"],
        expectedOutput: "Production-ready web application hosted on cloud infrastructure.",
        stepByStepTasks: ["Design Database Schema", "Build React UI components", "Connect FastAPI microservice", "Deploy on Vercel/Render"]
      }
    ]
  },

  {
    id: "data-analytics",
    title: "Data Analytics",
    category: "Data Analytics",
    level: "Beginner",
    estimatedDuration: "14 Weeks (100 Hours)",
    shortDescription: "Complete path covering Analytics Fundamentals, Excel, Statistics, SQL, Python (Pandas/NumPy), Data Viz & Power BI.",
    fullDescription: "Transform raw transactional data into actionable business intelligence. Learn data cleaning, statistical modeling, database querying, and executive dashboard design.",
    careerOpportunities: ["Data Analyst", "Business Intelligence Analyst", "Data Operations Specialist", "Analytics Consultant"],
    prerequisites: ["Basic Math Skills", "Familiarity with Spreadsheets"],
    instructor: { name: "Sarah Jenkins", title: "Senior Data Analytics Lead", avatar: "👩‍💼" },
    icon: "📊",
    bannerGradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    skillsCovered: ["Excel", "XLOOKUP/Pivot", "Statistics", "SQL", "Python", "Pandas/NumPy", "Matplotlib/Seaborn", "Power BI", "DAX"],
    modules: [
      {
        id: "da-m1",
        title: "Module 1 — Analytics Fundamentals",
        description: "Data collection, cleaning, transformation, types of analytics (Descriptive, Diagnostic, Predictive), and storytelling.",
        topics: [
          {
            id: "da-m1-t1",
            title: "Data Analytics Lifecycle & Cleaning",
            duration: "45 min",
            explanation: "Data Analytics converts raw observations into strategic business decisions through structured data cleaning and visual storytelling.",
            objectives: ["Differentiate Descriptive vs Diagnostic analytics", "Clean missing and duplicate rows", "Frame business hypotheses"],
            subtopics: ["What is Data Analytics?", "Types of Analytics", "Data Analyst Role", "Data Collection", "Data Cleaning", "Data Transformation", "Data Visualization", "Data Storytelling"],
            example: {
              description: "Data cleaning process checklist:",
              codeSnippet: `Raw Data -> Remove Duplicates -> Impute Missing Values -> Normalize Formatting -> Analytics Insights`
            },
            practicalExercise: {
              title: "Dataset Audit Task",
              task: "Inspect a raw CSV file and identify missing data cells, improper date formats, and duplicate records.",
              hint: "Look for null values and mismatched text capitalization.",
              solution: "Identified 12 missing values and 3 duplicate records."
            },
            miniQuiz: {
              question: "Which type of analytics answers the question 'Why did sales drop last month?'",
              options: ["Descriptive Analytics", "Diagnostic Analytics", "Predictive Analytics", "Prescriptive Analytics"],
              correctAnswer: 1,
              explanation: "Diagnostic Analytics investigates root causes to explain why past events occurred."
            },
            resources: [{ title: "Google Data Analytics Certificate Guide", url: "https://coursera.org" }]
          }
        ]
      },
      {
        id: "da-m2",
        title: "Module 2 — Advanced Excel for Analytics",
        description: "Master XLOOKUP, INDEX/MATCH, SUMIFS, Pivot Tables, Slicers, and Dynamic Formatting.",
        topics: [
          {
            id: "da-m2-t1",
            title: "XLOOKUP & Pivot Table Analytics",
            duration: "60 min",
            explanation: "Excel remains the universal tool for fast financial modeling, XLOOKUP data matching, and Pivot Table aggregations.",
            objectives: ["Write error-free XLOOKUP lookup formulas", "Build interactive Pivot Tables with Slicers", "Format executive charts"],
            subtopics: ["Excel Interface", "Data Entry", "Formatting", "Sorting", "Filtering", "Formulas", "Functions", "IF", "SUMIF", "COUNTIF", "VLOOKUP", "XLOOKUP", "INDEX/MATCH", "Pivot Tables", "Pivot Charts", "Conditional Formatting", "Data Cleaning"],
            example: {
              description: "XLOOKUP formula syntax:",
              codeSnippet: `=XLOOKUP(Lookup_Value, Lookup_Array, Return_Array, "Not Found")`
            },
            practicalExercise: {
              title: "XLOOKUP Task",
              task: "Write an XLOOKUP formula to retrieve employee department names matching employee ID numbers.",
              hint: "=XLOOKUP(A2, Employees!A:A, Employees!C:C).",
              solution: "Formula returns correct department names."
            },
            miniQuiz: {
              question: "Why is XLOOKUP preferred over traditional VLOOKUP?",
              options: [
                "XLOOKUP can look up data both left and right, defaults to exact match, and does not break when columns are inserted",
                "XLOOKUP requires no arguments",
                "XLOOKUP only works on mobile phones",
                "VLOOKUP cannot handle numbers"
              ],
              correctAnswer: 0,
              explanation: "XLOOKUP overcomes VLOOKUP's column index limitations and handles exact matching cleanly."
            },
            resources: [{ title: "Microsoft Excel Documentation", url: "https://support.microsoft.com/excel" }]
          }
        ]
      },
      {
        id: "da-m3",
        title: "Module 3 — Business Statistics",
        description: "Mean, Median, Standard Deviation, Probability, Correlations, and Regression.",
        topics: [
          {
            id: "da-m3-t1",
            title: "Descriptive & Inferential Statistics",
            duration: "45 min",
            explanation: "Statistics measures data central tendency, spread (variance, standard deviation), and relationships (correlation coefficient).",
            objectives: ["Calculate mean vs median for skewed distributions", "Interpret standard deviation", "Evaluate correlation vs causation"],
            subtopics: ["Mean", "Median", "Mode", "Range", "Variance", "Standard Deviation", "Probability", "Correlation", "Regression Basics", "Descriptive Statistics", "Inferential Statistics"],
            example: {
              description: "Standard Deviation calculation formula:",
              codeSnippet: `σ = sqrt( Σ(x_i - μ)^2 / N )`
            },
            practicalExercise: {
              title: "Salary Skewness Analysis",
              task: "Given a dataset with extreme high earners, explain why Median is a better metric than Mean.",
              hint: "Mean is sensitive to extreme outliers.",
              solution: "Median reflects typical earnings accurately."
            },
            miniQuiz: {
              question: "What metric best describes data spread around the arithmetic mean?",
              options: ["Mode", "Standard Deviation", "Median", "Percentile"],
              correctAnswer: 1,
              explanation: "Standard Deviation quantifies the amount of variation or dispersion of values relative to the mean."
            },
            resources: [{ title: "Khan Academy Statistics", url: "https://khanacademy.org" }]
          }
        ]
      },
      {
        id: "da-m4",
        title: "Module 4 — SQL Data Querying",
        description: "SELECT, GROUP BY, HAVING, JOINs, Subqueries, CTEs, Window Functions, and Data Cleaning.",
        topics: [
          {
            id: "da-m4-t1",
            title: "Advanced SQL CTEs & Window Functions",
            duration: "60 min",
            explanation: "Window functions (ROW_NUMBER, DENSE_RANK, OVER) compute rankings and running totals without collapsing rows.",
            objectives: ["Write Common Table Expressions (WITH clause)", "Rank items using DENSE_RANK() OVER()", "Clean text data in SQL"],
            subtopics: ["SQL Fundamentals", "SELECT", "WHERE", "ORDER BY", "GROUP BY", "HAVING", "JOIN", "Subqueries", "CTE", "CASE", "Window Functions", "Aggregations", "Data Cleaning using SQL"],
            example: {
              description: "Ranking sales reps per region using DENSE_RANK():",
              codeSnippet: `SELECT rep_name, region, revenue,\n       DENSE_RANK() OVER (PARTITION BY region ORDER BY revenue DESC) AS regional_rank\nFROM sales_data;`
            },
            practicalExercise: {
              title: "CTE & Ranking Query",
              task: "Write a SQL query using a CTE to aggregate total customer orders and select top 3 customers.",
              hint: "Use WITH customer_orders AS (...) SELECT ... ORDER BY total DESC LIMIT 3.",
              solution: "Top 3 customers extracted successfully."
            },
            miniQuiz: {
              question: "What is the key difference between GROUP BY and Window Functions (OVER clause)?",
              options: [
                "GROUP BY collapses rows into summary rows; Window Functions preserve original individual rows while adding computed values",
                "Window Functions can only be used on strings",
                "GROUP BY cannot perform SUM calculations",
                "They are identical syntax"
              ],
              correctAnswer: 0,
              explanation: "Window Functions calculate aggregated metrics across row windows while preserving every original row in the output."
            },
            resources: [{ title: "SQLBolt Interactive Lessons", url: "https://sqlbolt.com" }]
          }
        ]
      },
      {
        id: "da-m5",
        title: "Module 5 — Python for Data Analytics",
        description: "Python fundamentals, NumPy arrays, Pandas DataFrames, and data transformation pipelines.",
        topics: [
          {
            id: "da-m5-t1",
            title: "Pandas DataFrames & Data Manipulation",
            duration: "60 min",
            explanation: "Pandas provides high-performance data structures (DataFrames) to clean, merge, pivot, and filter tabular datasets programmatically.",
            objectives: ["Load CSV/Excel files into Pandas", "Handle missing data with fillna()/dropna()", "Perform groupby() aggregation"],
            subtopics: ["Python Fundamentals", "Variables", "Data Types", "Lists", "Tuples", "Dictionaries", "Functions", "Loops", "NumPy", "Pandas", "Data Cleaning", "Data Transformation"],
            example: {
              description: "Pandas data cleaning and grouping workflow:",
              codeSnippet: `import pandas as pd\ndf = pd.read_csv('sales.csv')\ndf['Sales'].fillna(df['Sales'].median(), inplace=True)\nsummary = df.groupby('Category')['Sales'].sum()\nprint(summary)`
            },
            practicalExercise: {
              title: "Pandas GroupBy Task",
              task: "Load a sample dataset and compute the average age and total revenue per customer segment.",
              hint: "Use df.groupby('Segment').agg({'Age': 'mean', 'Revenue': 'sum'}).",
              solution: "Grouped statistics generated."
            },
            miniQuiz: {
              question: "Which Pandas method removes duplicate rows from a DataFrame?",
              options: ["df.remove_duplicates()", "df.drop_duplicates()", "df.clean_duplicates()", "df.strip()"],
              correctAnswer: 1,
              explanation: "df.drop_duplicates() identifies and removes duplicate rows from a Pandas DataFrame."
            },
            resources: [{ title: "Pandas User Guide", url: "https://pandas.pydata.org" }]
          }
        ]
      },
      {
        id: "da-m6",
        title: "Module 6 — Data Visualization (Matplotlib & Seaborn)",
        description: "Matplotlib, Seaborn, charting best practices, visual hierarchy, and dashboard principles.",
        topics: [
          {
            id: "da-m6-t1",
            title: "Exploratory Visuals with Seaborn",
            duration: "45 min",
            explanation: "Seaborn simplifies statistical data visualization, producing clear heatmaps, distribution plots, and correlation matrices.",
            objectives: ["Build bar charts and scatter plots", "Plot correlation heatmaps", "Apply clean visual design principles"],
            subtopics: ["Matplotlib", "Seaborn", "Charts", "Graphs", "Dashboard Principles", "Storytelling with Data"],
            example: {
              description: "Seaborn correlation heatmap snippet:",
              codeSnippet: `import seaborn as sns\nimport matplotlib.pyplot as plt\nsns.heatmap(df.corr(), annot=True, cmap='Blues')\nplt.title('Correlation Matrix')\nplt.show()`
            },
            practicalExercise: {
              title: "Heatmap Visualization",
              task: "Generate a Seaborn correlation heatmap showing relationships between numerical dataset features.",
              hint: "Use sns.heatmap(df.corr(), annot=True).",
              solution: "Correlation heatmap plotted."
            },
            miniQuiz: {
              question: "Which chart type is best suited to display correlation between two continuous numeric variables?",
              options: ["Pie Chart", "Scatter Plot", "Bar Chart", "Donut Chart"],
              correctAnswer: 1,
              explanation: "Scatter Plots display continuous data pairs on X-Y coordinates, revealing linear or non-linear correlation patterns."
            },
            resources: [{ title: "Seaborn Documentation", url: "https://seaborn.pydata.org" }]
          }
        ]
      },
      {
        id: "da-m7",
        title: "Module 7 — Power BI for Business Intelligence",
        description: "Power Query, Data Modeling, Star Schema, DAX measures, calculated columns, and dashboard publishing.",
        topics: [
          {
            id: "da-m7-t1",
            title: "Power BI Data Modeling & DAX Measures",
            duration: "60 min",
            explanation: "Power BI transforms multi-source enterprise data into interactive cloud dashboards powered by DAX calculation expressions.",
            objectives: ["Build 1-to-many Star Schema models", "Write DAX measures using CALCULATE()", "Design visual KPI report layouts"],
            subtopics: ["Power BI Interface", "Data Import", "Power Query", "Data Cleaning", "Data Modeling", "Relationships", "DAX", "Measures", "Calculated Columns", "Visualizations", "Dashboards", "Reports"],
            example: {
              description: "DAX measure evaluating dynamic sales revenue:",
              codeSnippet: `TotalSales = SUM(Sales[Revenue])\nYoYGrowth = DIVIDE([TotalSales] - [PriorYearSales], [PriorYearSales])`
            },
            practicalExercise: {
              title: "DAX Measure Challenge",
              task: "Create a DAX measure in Power BI calculating Total Order Volume for active accounts.",
              hint: "Use CALCULATE(COUNT(Orders[ID]), Status[State] = 'Active').",
              solution: "DAX measure verified."
            },
            miniQuiz: {
              question: "What is the primary function of Power Query inside Power BI?",
              options: [
                "Performs Extract, Transform, and Load (ETL) operations to clean data before loading into the model",
                "Sends automated email alerts to users",
                "Designs mobile app icons",
                "Formats text font styles"
              ],
              correctAnswer: 0,
              explanation: "Power Query is the ETL engine in Power BI used to clean, shape, and transform raw data sources."
            },
            resources: [{ title: "Microsoft Power BI Guided Learning", url: "https://learn.microsoft.com/power-bi" }]
          }
        ]
      },
      {
        id: "da-m8",
        title: "Module 8 — Analytics Projects & Case Studies",
        description: "Execute end-to-end data analytics projects: Sales Dashboard, Customer Churn Analysis, and Financial Analytics.",
        topics: [
          {
            id: "da-m8-t1",
            title: "Executive Business Dashboard Capstone",
            duration: "90 min",
            explanation: "Deliver an end-to-end analytics centerpiece combining SQL data extraction, Python cleaning, and Power BI interactive storytelling.",
            objectives: ["Synthesize analytics pipeline", "Publish interactive dashboard", "Present executive recommendations"],
            subtopics: ["Sales Dashboard", "Customer Analysis", "HR Analytics", "E-commerce Analytics", "Financial Analytics"],
            example: {
              description: "Analytics capstone workflow:",
              codeSnippet: `SQL Database -> Pandas Cleaning -> DAX Modeling -> Power BI Dashboard Presentation`
            },
            practicalExercise: {
              title: "Executive Dashboard Audit",
              task: "Assemble 3 core KPI cards, 2 trend charts, and 1 sliceable visual into a clean executive report layout.",
              hint: "Ensure visual hierarchy leads with top metrics at upper left.",
              solution: "Executive dashboard verified."
            },
            miniQuiz: {
              question: "Where should the most critical top-level KPI metrics be positioned on an executive dashboard layout?",
              options: ["Top left region", "Hidden at the bottom", "In the footer", "Spread randomly"],
              correctAnswer: 0,
              explanation: "Users read dashboards top-to-left first; place top-level KPI summary cards in the upper-left quadrant."
            },
            resources: [{ title: "Kaggle Analytics Datasets", url: "https://kaggle.com" }]
          }
        ]
      }
    ],
    projects: [
      {
        id: "da-proj-1",
        title: "E-Commerce Customer Retention Dashboard",
        difficulty: "Intermediate",
        skillsUsed: ["SQL", "Excel", "Power BI", "DAX"],
        requirements: ["Extract orders data via SQL", "Calculate LTV and Churn", "Build dynamic Power BI dashboard"],
        expectedOutput: "Interactive Power BI report showing retention trends across user cohorts.",
        stepByStepTasks: ["Write SQL CTEs", "Load model to Power BI", "Add DAX measures", "Format visual layout"]
      }
    ]
  },

  {
    id: "ai-ml-engineering",
    title: "AI & Machine Learning Engineering",
    category: "AI & Machine Learning",
    level: "Advanced",
    estimatedDuration: "20 Weeks (150 Hours)",
    shortDescription: "Complete AI path covering Python, Math/Stats, Supervised/Unsupervised ML, Deep Learning, NLP, GenAI, LLMs, RAG & AI Agents.",
    fullDescription: "Architect state-of-the-art Artificial Intelligence models. Master classical Machine Learning, Deep Neural Networks, Large Language Models (LLMs), RAG pipelines, and autonomous AI Agent systems.",
    careerOpportunities: ["AI/ML Engineer", "Data Scientist", "NLP Engineer", "LLM Application Developer", "AI Research Scientist"],
    prerequisites: ["Python Proficiency", "Linear Algebra & Calculus Basics"],
    instructor: { name: "Dr. Aris Thorne", title: "Senior AI Research Engineer", avatar: "👨‍🏫" },
    icon: "🤖",
    bannerGradient: "linear-gradient(135deg, #6b21a8 0%, #a855f7 100%)",
    skillsCovered: ["Python", "NumPy/Pandas", "Scikit-Learn", "PyTorch", "Transformers", "LLMs", "LangChain", "RAG", "Vector DBs", "AI Agents"],
    modules: [
      { id: "aiml-m1", title: "Module 1 — AI Fundamentals", description: "AI paradigms, expert systems, search algorithms, and intelligent agent frameworks.", topics: [{ id: "aiml-m1-t1", title: "AI Landscape & Intelligent Agents", duration: "45 min", explanation: "Artificial Intelligence spans rule-based expert systems to statistical machine learning and generative artificial general intelligence.", objectives: ["Understand AI history", "Classify agent environments"], subtopics: ["AI Fundamentals"], example: { description: "Agent loop:", codeSnippet: `Environment -> Perception -> Agent Logic -> Action` }, practicalExercise: { title: "Agent Loop Task", task: "Diagram an autonomous agent feedback loop.", hint: "Sensors -> State -> Actuators.", solution: "Loop diagram created." }, miniQuiz: { question: "What distinguishes AI from traditional deterministic software?", options: ["Ability to learn patterns from data and generalize to unseen inputs", "Runs only on phones", "Requires no CPU", "Has no code"], correctAnswer: 0, explanation: "AI algorithms infer decision rules automatically from data patterns." }, resources: [] }] },
      { id: "aiml-m2", title: "Module 2 — Python for AI", description: "NumPy vectorization, matrix algebra, and Pandas feature processing.", topics: [{ id: "aiml-m2-t1", title: "Vectorized Computations with NumPy", duration: "45 min", explanation: "NumPy performs SIMD vectorized array computations essential for matrix multiplication in neural networks.", objectives: ["Broadcast arrays", "Perform dot products"], subtopics: ["Python for AI"], example: { description: "NumPy matrix multiplication:", codeSnippet: `import numpy as np\nA = np.array([[1, 2], [3, 4]])\nB = np.array([[5, 6], [7, 8]])\nC = np.dot(A, B)` }, practicalExercise: { title: "Dot Product Task", task: "Compute dot product of weight vector and input features.", hint: "np.dot(w, x).", solution: "Dot product computed." }, miniQuiz: { question: "Why is NumPy array multiplication faster than standard Python list loops?", options: ["Uses compiled C-C++ contiguous memory operations", "Uses magic", "It is slower", "Deletes data"], correctAnswer: 0, explanation: "NumPy executes C-level contiguous memory operations across vectorized arrays." }, resources: [] }] },
      { id: "aiml-m3", title: "Module 3 — Mathematics for ML", description: "Linear algebra, matrix decomposition, derivatives, and gradient descent.", topics: [{ id: "aiml-m3-t1", title: "Calculus & Gradient Descent", duration: "60 min", explanation: "Gradient descent uses partial derivatives of a loss function to iteratively adjust model weights toward global minima.", objectives: ["Calculate partial derivatives", "Understand learning rates"], subtopics: ["Mathematics for ML"], example: { description: "Weight update step:", codeSnippet: `w_new = w_old - learning_rate * gradient` }, practicalExercise: { title: "Gradient Step Task", task: "Calculate next weight given w=2.0, lr=0.1, grad=0.5.", hint: "2.0 - (0.1 * 0.5) = 1.95.", solution: "w_new = 1.95." }, miniQuiz: { question: "What happens if the gradient descent learning rate is set too high?", options: ["Model converges instantly", "Loss value may overshoot the minimum and diverge", "GPU stops working", "Code deletes itself"], correctAnswer: 1, explanation: "Excessively high learning rates cause weight updates to overshoot loss minima." }, resources: [] }] },
      { id: "aiml-m4", title: "Module 4 — Statistics & Probability", description: "Probability distributions, Bayes' Theorem, hypothesis testing, and maximum likelihood estimation.", topics: [{ id: "aiml-m4-t1", title: "Bayesian Probability & Estimations", duration: "45 min", explanation: "Bayes' Theorem computes posterior probability given prior belief and likelihood evidence.", objectives: ["Apply Bayes' Theorem", "Understand Normal distributions"], subtopics: ["Statistics"], example: { description: "Bayes Theorem formula:", codeSnippet: `P(A|B) = P(B|A) * P(A) / P(B)` }, practicalExercise: { title: "Bayesian Task", task: "Compute posterior probability given P(A)=0.1, P(B|A)=0.8, P(B)=0.2.", hint: "(0.8 * 0.1) / 0.2 = 0.4.", solution: "P(A|B) = 0.4." }, miniQuiz: { question: "What does P(A|B) represent in probability notation?", options: ["Probability of A given B has occurred", "Probability of A plus B", "Probability of A times B", "Power of A"], correctAnswer: 0, explanation: "P(A|B) denotes conditional probability of event A occurring given B is true." }, resources: [] }] },
      { id: "aiml-m5", title: "Module 5 — Machine Learning Fundamentals", description: "Supervised vs Unsupervised learning, feature engineering, and model evaluation metrics.", topics: [{ id: "aiml-m5-t1", title: "Model Overfitting & Train-Test Split", duration: "45 min", explanation: "Prevent overfitting by splitting datasets into training, validation, and testing sets while applying cross-validation.", objectives: ["Perform train_test_split", "Evaluate F1 score"], subtopics: ["Machine Learning"], example: { description: "Scikit-learn split:", codeSnippet: `from sklearn.model_selection import train_test_split\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2)` }, practicalExercise: { title: "Split Task", task: "Split dataset with 80% train and 20% test ratio.", hint: "test_size=0.2.", solution: "Split completed." }, miniQuiz: { question: "What indicates a machine learning model is overfitting?", options: ["High accuracy on training set but poor accuracy on unseen testing set", "High accuracy on test set", "Low training loss", "Fast speed"], correctAnswer: 0, explanation: "Overfitting occurs when a model memorizes training noise and fails to generalize." }, resources: [] }] },
      { id: "aiml-m6", title: "Module 6 — Supervised Learning", description: "Linear Regression, Logistic Regression, Decision Trees, Random Forests, and SVMs.", topics: [{ id: "aiml-m6-t1", title: "Ensemble Learning with Random Forests", duration: "60 min", explanation: "Random Forest combines predictions from multiple decision trees trained on bootstrapped data subsets.", objectives: ["Train RandomForestClassifier", "Extract feature importances"], subtopics: ["Supervised Learning"], example: { description: "Random Forest training:", codeSnippet: `from sklearn.ensemble import RandomForestClassifier\nclf = RandomForestClassifier(n_estimators=100)\nclf.fit(X_train, y_train)` }, practicalExercise: { title: "Classifier Task", task: "Train a Random Forest classifier and output accuracy score.", hint: "clf.score(X_test, y_test).", solution: "Classifier trained." }, miniQuiz: { question: "Why are Random Forests resistant to overfitting compared to single Decision Trees?", options: ["Averages predictions across diverse bootstrapped decision trees", "Runs faster", "Uses no trees", "Has no hyperparameters"], correctAnswer: 0, explanation: "Ensemble averaging reduces overall variance and dampens individual tree overfitting." }, resources: [] }] },
      { id: "aiml-m7", title: "Module 7 — Unsupervised Learning", description: "K-Means Clustering, Hierarchical Clustering, and PCA Dimension Reduction.", topics: [{ id: "aiml-m7-t1", title: "Principal Component Analysis (PCA)", duration: "45 min", explanation: "PCA reduces dataset feature dimensionality by projecting data onto orthogonal principal components of maximum variance.", objectives: ["Apply PCA dimensionality reduction", "Plot elbow curves"], subtopics: ["Unsupervised Learning"], example: { description: "PCA reduction:", codeSnippet: `from sklearn.decomposition import PCA\npca = PCA(n_components=2)\nX_reduced = pca.fit_transform(X)` }, practicalExercise: { title: "PCA Task", task: "Reduce 10 features down to 2 principal components.", hint: "PCA(n_components=2).", solution: "Features reduced to 2D." }, miniQuiz: { question: "What is the main goal of Unsupervised Learning algorithms like K-Means?", options: ["Discover hidden patterns and clusters without target output labels", "Predict stock prices with labels", "Translate English to Spanish", "Format code"], correctAnswer: 0, explanation: "Unsupervised learning finds intrinsic structural patterns in unlabeled data." }, resources: [] }] },
      { id: "aiml-m8", title: "Module 8 — Deep Learning & PyTorch", description: "Perceptrons, Multilayer Perceptrons (MLPs), Backpropagation, Activation functions, and PyTorch tensors.", topics: [{ id: "aiml-m8-t1", title: "Building Neural Networks with PyTorch", duration: "60 min", explanation: "PyTorch provides dynamic computation graphs for training Deep Neural Networks via automatic differentiation (autograd).", objectives: ["Define PyTorch nn.Module", "Implement forward pass & loss.backward()"], subtopics: ["Deep Learning"], example: { description: "PyTorch neural network layer:", codeSnippet: `import torch.nn as nn\nclass Net(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.fc1 = nn.Linear(784, 128)\n        self.relu = nn.ReLU()\n    def forward(self, x):\n        return self.relu(self.fc1(x))` }, practicalExercise: { title: "PyTorch Net Task", task: "Define a 2-layer PyTorch neural network class.", hint: "Inherit from nn.Module and override forward().", solution: "PyTorch model defined." }, miniQuiz: { question: "What PyTorch method computes gradients during backpropagation?", options: ["loss.backward()", "optimizer.zero_grad()", "model.eval()", "torch.save()"], correctAnswer: 0, explanation: "loss.backward() computes partial gradients of the loss with respect to model parameters." }, resources: [] }] },
      { id: "aiml-m9", title: "Module 9 — Natural Language Processing (NLP)", description: "Tokenization, Word Embeddings (Word2Vec), RNNs, LSTMs, and Self-Attention Mechanism.", topics: [{ id: "aiml-m9-t1", title: "Word Embeddings & Attention Mechanism", duration: "60 min", explanation: "Transformers use Self-Attention to calculate context relationships between words in parallel across sequences.", objectives: ["Understand Word2Vec vector spaces", "Learn Self-Attention formula Q*K^T/sqrt(d_k)"], subtopics: ["NLP"], example: { description: "Attention Score formula:", codeSnippet: `Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V` }, practicalExercise: { title: "Tokenization Task", task: "Tokenize a sentence into numerical word IDs.", hint: "Split text into tokens and map to dictionary IDs.", solution: "Text tokenized." }, miniQuiz: { question: "What breakthrough mechanism allowed Transformers to replace RNNs in NLP?", options: ["Parallelizable Self-Attention mechanism", "Using smaller files", "Removing code", "Static rules"], correctAnswer: 0, explanation: "Self-Attention processes entire text sequences in parallel without sequential RNN recurrence bottlenecks." }, resources: [] }] },
      { id: "aiml-m10", title: "Module 10 — Generative AI & Transformer Models", description: "Encoder-Decoder architecture, GPT, BERT, Diffusion Models, and VAEs.", topics: [{ id: "aiml-m10-t1", title: "Transformer Architecture & Generative Models", duration: "60 min", explanation: "Generative AI leverages pretrained Transformer architectures to generate high-fidelity text, code, images, and audio.", objectives: ["Understand GPT autoregressive decoding", "Learn Masked Language Modeling (BERT)"], subtopics: ["Generative AI"], example: { description: "Autoregressive generation:", codeSnippet: `P(w_1, w_2, ..., w_T) = ∏ P(w_t | w_1, ..., w_{t-1})` }, practicalExercise: { title: "Prompt Output Task", task: "Describe autoregressive token prediction in 2 sentences.", hint: "Each token is predicted based on preceding context.", solution: "Autoregressive concept explained." }, miniQuiz: { question: "What type of model is GPT (Generative Pretrained Transformer)?", options: ["Autoregressive Decoder-only Transformer", "CNN Image filter", "Linear Regression", "SQL query"], correctAnswer: 0, explanation: "GPT uses a Decoder-only Transformer architecture predicting the next token autoregressively." }, resources: [] }] },
      { id: "aiml-m11", title: "Module 11 — Large Language Models (LLMs)", description: "Pre-training, Fine-Tuning (LoRA, QLoRA), RLHF, and Tokenizer vocabularies.", topics: [{ id: "aiml-m11-t1", title: "LLM Fine-Tuning with LoRA", duration: "60 min", explanation: "Low-Rank Adaptation (LoRA) fine-tunes LLMs efficiently by freezing base model weights and injecting trainable rank-decomposition matrices.", objectives: ["Understand Parameter-Efficient Fine-Tuning (PEFT)", "Apply LoRA matrix adaptation"], subtopics: ["LLMs"], example: { description: "LoRA parameter update:", codeSnippet: `W_updated = W_frozen + (Matrix_A * Matrix_B)` }, practicalExercise: { title: "LoRA Task", task: "Calculate trainable parameters saved when using LoRA rank r=8.", hint: "LoRA reduces trainable params by >99%.", solution: "Parameter reduction verified." }, miniQuiz: { question: "Why is LoRA preferred for fine-tuning Large Language Models?", options: ["Drastically reduces memory requirements by updating only low-rank matrices", "Deletes model weights", "Increases model size 10x", "Requires no GPUs"], correctAnswer: 0, explanation: "LoRA allows fine-tuning multi-billion parameter LLMs on consumer GPUs by reducing trainable weights." }, resources: [] }] },
      { id: "aiml-m12", title: "Module 12 — Prompt Engineering", description: "Zero-Shot, Few-Shot, Chain-of-Thought (CoT), System Prompts, and Structured JSON outputs.", topics: [{ id: "aiml-m12-t1", title: "Chain-of-Thought Prompting Tactics", duration: "45 min", explanation: "Chain-of-Thought (CoT) prompting instructs LLMs to output intermediate step-by-step reasoning before delivering final answers.", objectives: ["Write Few-Shot prompts", "Enforce JSON output schemas"], subtopics: ["Prompt Engineering"], example: { description: "Chain-of-Thought prompt structure:", codeSnippet: `Question: ...\nLet's think step by step:\nStep 1: ...\nStep 2: ...\nFinal Answer: ...` }, practicalExercise: { title: "CoT Prompt Task", task: "Craft a System Prompt forcing an LLM to return valid JSON with step-by-step reasoning keys.", hint: "Include an explicit JSON schema example in the prompt.", solution: "Structured JSON prompt created." }, miniQuiz: { question: "What technique improves LLM reasoning performance on complex math/logic tasks?", options: ["Chain-of-Thought (CoT) step-by-step prompting", "ALL CAPS typing", "Deleting system prompts", "Repeating the question 100 times"], correctAnswer: 0, explanation: "Chain-of-Thought prompting guides LLMs through intermediate logical steps, reducing reasoning errors." }, resources: [] }] },
      { id: "aiml-m13", title: "Module 13 — Retrieval-Augmented Generation (RAG)", description: "Vector Databases (Pinecone, ChromaDB), Embeddings, Semantic Search, Chunking, and Context Synthesis.", topics: [{ id: "aiml-m13-t1", title: "Building Production RAG Pipelines", duration: "60 min", explanation: "RAG connects LLMs to enterprise knowledge stores by embedding documents into Vector DBs and retrieving relevant chunks as context.", objectives: ["Chunk text with recursive splitters", "Query Vector DBs via Cosine Similarity", "Inject retrieved context into LLM prompts"], subtopics: ["RAG"], example: { description: "RAG Query pipeline:", codeSnippet: `User Query -> Embeddings -> Vector Search -> Top 3 Chunks -> LLM Prompt -> Answer` }, practicalExercise: { title: "Vector Search Task", task: "Query a vector database with a similarity search threshold of 0.8.", hint: "db.similarity_search_with_score(query, k=3).", solution: "Top 3 relevant document chunks retrieved." }, miniQuiz: { question: "What primary problem of LLMs does RAG solve?", options: ["Eliminates hallucinations and grounds LLM responses in private data without retraining", "Makes LLM fonts larger", "Speeds up internet bandwidth", "Deletes vector databases"], correctAnswer: 0, explanation: "RAG grounds LLM outputs in verified real-time internal document context, preventing hallucinations." }, resources: [] }] },
      { id: "aiml-m14", title: "Module 14 — Autonomous AI Agents", description: "LangChain, AutoGPT, ReAct framework, Tool use, Function Calling, and Multi-Agent Orchestration.", topics: [{ id: "aiml-m14-t1", title: "The ReAct (Reason + Action) Agent Loop", duration: "60 min", explanation: "ReAct Agents combine Reasoning traces with Action tool calls (Web Search, Code Execution, SQL Querying) to autonomously solve complex goals.", objectives: ["Implement LangChain Agent Executors", "Bind custom Python functions as tools"], subtopics: ["AI Agents"], example: { description: "ReAct Agent loop trace:", codeSnippet: `Thought: Need to fetch user score.\nAction: Query_DB("user_123")\nObservation: Score = 95\nThought: High score detected.\nFinal Answer: User has passed.` }, practicalExercise: { title: "Custom Agent Tool", task: "Write a custom Python function tool that fetches weather data and bind it to an AI Agent.", hint: "Use @tool decorator in LangChain.", solution: "Agent tool bound successfully." }, miniQuiz: { question: "What core loop enables AI Agents to solve multi-step tasks autonomously?", options: ["Thought -> Action -> Observation (ReAct Loop)", "Infinite static loop", "Manual user typing", "CSS transition"], correctAnswer: 0, explanation: "The ReAct loop enables agents to reason about intermediate observations and select appropriate tools." }, resources: [] }] },
      { id: "aiml-m15", title: "Module 15 — AI Capstone Projects", description: "Build state-of-the-art AI applications: RAG Document Search, Autonomous AI Coding Assistant, and Multi-Agent System.", topics: [{ id: "aiml-m15-t1", title: "Production AI Agent SaaS Platform", duration: "90 min", content: "Assemble a multi-agent AI system featuring RAG knowledge search, function calling, vector database storage, and a FastAPI backend.", objectives: ["Deploy production RAG agent", "Serve microservices via FastAPI"], subtopics: ["AI Projects"], example: { description: "Production AI Stack:", codeSnippet: `FastAPI Server -> LangChain ReAct Agent -> ChromaDB Vector Store -> OpenAI/Claude LLM` }, practicalExercise: { title: "AI System Audit", task: "Deploy an AI agent microservice endpoint and verify context retrieval latency under 500ms.", hint: "Benchmark vector retrieval and LLM streaming times.", solution: "AI system deployed." }, miniQuiz: { question: "Which metric evaluates semantic vector search accuracy?", options: ["Cosine Similarity", "HTML tag count", "CPU clock speed", "File size"], correctAnswer: 0, explanation: "Cosine Similarity measures the cosine angle between two high-dimensional embedding vectors." }, resources: [] }] }
    ],
    projects: [
      { id: "aiml-proj-1", title: "Enterprise RAG Document Intelligence System", difficulty: "Advanced", skillsUsed: ["Python", "FastAPI", "LangChain", "ChromaDB", "LLMs"], requirements: ["PDF Document ingestion", "Vector DB similarity search", "Hallucination-free QA", "FastAPI endpoint"], expectedOutput: "Production RAG engine indexing enterprise policy PDFs.", stepByStepTasks: ["Parse PDFs", "Create Vector Store", "Build LangChain RAG pipeline", "Wrap in FastAPI server"] }
    ]
  },

  {
    id: "cloud-devops",
    title: "Cloud & DevOps Engineering",
    category: "Cloud & DevOps",
    level: "Intermediate",
    estimatedDuration: "16 Weeks (110 Hours)",
    shortDescription: "Complete infrastructure path covering Cloud Fundamentals, Linux, Networking, AWS, Azure, Docker, Kubernetes, CI/CD & Terraform.",
    fullDescription: "Architect scalable, fault-tolerant cloud infrastructure. Master Linux administration, AWS cloud services, container orchestration with Kubernetes, Infrastructure as Code (Terraform), and CI/CD pipelines.",
    careerOpportunities: ["DevOps Engineer", "Cloud Infrastructure Architect", "Site Reliability Engineer (SRE)", "Kubernetes Administrator"],
    prerequisites: ["Linux Command Line Basics", "Networking Fundamentals"],
    instructor: { name: "Marcus Vance", title: "Lead DevOps Architect", avatar: "👨‍💻" },
    icon: "☁️",
    bannerGradient: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
    skillsCovered: ["Linux", "AWS (EC2/S3/VPC)", "Azure", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Prometheus/Grafana", "CI/CD"],
    modules: [
      { id: "cd-m1", title: "Module 1 — Cloud Fundamentals & AWS Core", description: "IaaS/PaaS/SaaS models, AWS EC2, S3, IAM security policies, and Virtual Private Clouds (VPC).", topics: [{ id: "cd-m1-t1", title: "AWS Compute, Storage & IAM", duration: "60 min", explanation: "AWS provisions virtual servers (EC2), object storage (S3), and network isolation (VPC) secured by IAM roles.", objectives: ["Launch EC2 instances", "Configure S3 buckets"], subtopics: ["Cloud Fundamentals", "AWS"], example: { description: "AWS CLI command:", codeSnippet: `aws ec2 run-instances --image-id ami-12345 --count 1 --instance-type t3.micro` }, practicalExercise: { title: "EC2 Launch Task", task: "Write an AWS CLI command to launch a t3.micro Ubuntu instance.", hint: "Use aws ec2 run-instances.", solution: "Instance launched." }, miniQuiz: { question: "Which AWS service provides resizable virtual compute instances in the cloud?", options: ["AWS EC2", "AWS S3", "AWS IAM", "AWS CloudFront"], correctAnswer: 0, explanation: "Amazon EC2 (Elastic Compute Cloud) provisions virtual compute servers." }, resources: [] }] },
      { id: "cd-m2", title: "Module 2 — Linux Administration & Shell Scripting", description: "File permissions, SSH keys, process management, bash scripting, and systemd services.", topics: [{ id: "cd-m2-t1", title: "Linux Permissions & Bash Automation", duration: "60 min", explanation: "Mastering Linux shell commands, file permissions (chmod/chown), and bash automation scripts.", objectives: ["Manage Linux permissions", "Write bash automation scripts"], subtopics: ["Linux"], example: { description: "Bash backup script:", codeSnippet: `#!/bin/bash\ntar -czf backup.tar.gz /var/www/html` }, practicalExercise: { title: "chmod Task", task: "Set file permissions to read/write for owner, read for group (chmod 640).", hint: "chmod 640 myfile.txt.", solution: "Permissions updated." }, miniQuiz: { question: "What numeric code represents read/write permission for owner and read-only for group/others?", options: ["644", "777", "700", "400"], correctAnswer: 0, explanation: "chmod 644 grants owner rw- (6), group r-- (4), and others r-- (4)." }, resources: [] }] },
      { id: "cd-m3", title: "Module 3 — Docker & Kubernetes Orchestration", description: "Containers, Docker Compose, Kubernetes Pods, Deployments, Services, Ingress, and Helm charts.", topics: [{ id: "cd-m3-t1", title: "Kubernetes Deployments & Service Routing", duration: "60 min", explanation: "Kubernetes orchestrates containerized workloads across node clusters, managing auto-healing, rolling updates, and service load balancing.", objectives: ["Write K8s Deployment manifests", "Expose Pods via ClusterIP and NodePort"], subtopics: ["Docker", "Kubernetes"], example: { description: "Kubernetes Deployment YAML:", codeSnippet: `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web-app\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: web` }, practicalExercise: { title: "K8s Manifest Task", task: "Write a Kubernetes Deployment manifest maintaining 3 replicas of an NGINX image.", hint: "Set replicas: 3 and image: nginx:latest.", solution: "K8s manifest created." }, miniQuiz: { question: "What Kubernetes object ensures a specified number of Pod replicas remain running at all times?", options: ["Deployment / ReplicaSet", "Secret", "ConfigMap", "Volume"], correctAnswer: 0, explanation: "Deployments and ReplicaSets maintain the desired count of active Pod replicas automatically." }, resources: [] }] },
      { id: "cd-m4", title: "Module 4 — CI/CD & GitHub Actions Automation", description: "Build pipelines, automated testing, container registry pushing, and automated cloud deployment.", topics: [{ id: "cd-m4-t1", title: "Automated Deployment Workflows", duration: "60 min", explanation: "CI/CD pipelines test code commits automatically, build Docker images, and deploy to cloud clusters on git push.", objectives: ["Build GitHub Actions workflow YAML", "Automate Docker image tags"], subtopics: ["CI/CD", "GitHub Actions"], example: { description: "GitHub Actions workflow YAML:", codeSnippet: `name: CI Pipeline\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v3\n    - run: npm test` }, practicalExercise: { title: "CI Pipeline Task", task: "Create a GitHub Actions step running 'npm test' on every pull request.", hint: "Use on: [pull_request].", solution: "CI workflow created." }, miniQuiz: { question: "What is the primary benefit of Continuous Integration (CI)?", options: ["Automatically verifies every code commit with automated tests to catch bugs early", "Deletes old code", "Changes font colors", "Stops git repositories"], correctAnswer: 0, explanation: "Continuous Integration automatically tests code changes upon commit, catching integration bugs immediately." }, resources: [] }] }
    ],
    projects: [
      { id: "cd-proj-1", title: "Automated Multi-Region Kubernetes Deployment", difficulty: "Advanced", skillsUsed: ["Docker", "Kubernetes", "AWS EKS", "Terraform", "GitHub Actions"], requirements: ["Terraform VPC provisioning", "AWS EKS Cluster setup", "GitHub Actions auto-deploy pipeline", "Ingress Load Balancing"], expectedOutput: "Auto-scaled Kubernetes application cluster running on AWS.", stepByStepTasks: ["Provision VPC with Terraform", "Launch EKS cluster", "Deploy app via K8s manifests", "Setup CI/CD pipeline"] }
    ]
  },

  {
    id: "cybersecurity-sec",
    title: "Cybersecurity & Ethical Hacking",
    category: "Cybersecurity",
    level: "Intermediate",
    estimatedDuration: "14 Weeks (100 Hours)",
    shortDescription: "Complete path covering Networking, Linux, Cryptography, OWASP Web Security, Vulnerability Assessment, SOC, SIEM & Penetration Testing.",
    fullDescription: "Defend enterprise systems against malicious digital cyber threats. Learn network protocol analysis, ethical hacking methodologies, web application vulnerability patching, and Security Operations Center (SOC) incident response.",
    careerOpportunities: ["Cybersecurity Specialist", "Penetration Tester / Ethical Hacker", "SOC Analyst", "Information Security Officer"],
    prerequisites: ["Computer Networking Basics", "Linux Command Line Basics"],
    instructor: { name: "Marcus Vance", title: "Senior Cybersecurity Architect", avatar: "🛡️" },
    icon: "🛡️",
    bannerGradient: "linear-gradient(135deg, #991b1b 0%, #dc2626 100%)",
    skillsCovered: ["Networking (TCP/IP)", "Linux Security", "Cryptography (RSA/AES)", "OWASP Top 10", "SQLi/XSS Mitigation", "Nmap/Wireshark", "SOC/SIEM", "Incident Response"],
    modules: [
      { id: "sec-m1", title: "Module 1 — Security Principles & Cryptography", description: "CIA Triad, symmetric vs asymmetric encryption (AES, RSA), hashing (SHA-256), and digital signatures.", topics: [{ id: "sec-m1-t1", title: "Cryptography & Public Key Infrastructure", duration: "45 min", explanation: "Asymmetric cryptography utilizes public keys for encryption and private keys for decryption, securing HTTPS web traffic.", objectives: ["Understand AES vs RSA", "Hash values with SHA-256"], subtopics: ["Cybersecurity Fundamentals", "Cryptography"], example: { description: "SHA-256 Hashing:", codeSnippet: `echo -n "Password123" | sha256sum\n# Output: 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8` }, practicalExercise: { title: "Hash Verification Task", task: "Generate a SHA-256 checksum of a file and verify its integrity.", hint: "Use sha256sum <filename>.", solution: "Checksum verified." }, miniQuiz: { question: "Why must passwords be stored as salted hashes rather than plain text or reversible encryption?", options: ["Salted hashes prevent reverse lookup rainbow table attacks even if the database is leaked", "Makes passwords shorter", "Speeds up login", "It is required by web browsers"], correctAnswer: 0, explanation: "Salting adds unique random strings to passwords before hashing, neutralizing pre-computed rainbow table attacks." }, resources: [] }] },
      { id: "sec-m2", title: "Module 2 — Web Security & OWASP Top 10", description: "Identify and patch SQL Injection, Cross-Site Scripting (XSS), CSRF, and broken access controls.", topics: [{ id: "sec-m2-t1", title: "SQL Injection & XSS Defense", duration: "60 min", explanation: "SQL Injection occurs when untrusted input alters backend queries. Parameterized queries eliminate this threat entirely.", objectives: ["Neutralize SQL Injection", "Sanitize user inputs to prevent XSS"], subtopics: ["Web Security", "OWASP"], example: { description: "Vulnerable vs Secure SQL query:", codeSnippet: `// Vulnerable: "SELECT * FROM users WHERE name = '" + input + "'"\n// Secure: db.query("SELECT * FROM users WHERE name = $1", [input])` }, practicalExercise: { title: "Parameterized SQL Task", task: "Refactor a vulnerable string concatenation SQL query into a secure parameterized query.", hint: "Use placeholdered parameters ($1 or ?).", solution: "Query secured." }, miniQuiz: { question: "What is the single most effective countermeasure against SQL Injection vulnerabilities?", options: ["Using parameterized SQL queries (Prepared Statements)", "Using uppercase SQL keywords", "Blocking internet access", "Deleting database indexes"], correctAnswer: 0, explanation: "Parameterized queries separate SQL code logic from data input parameters, preventing injection execution." }, resources: [] }] }
    ],
    projects: [
      { id: "sec-proj-1", title: "Web Application Vulnerability Audit & Patching", difficulty: "Intermediate", skillsUsed: ["Linux", "Nmap", "OWASP ZAP", "SQL", "Web Security"], requirements: ["Scan target app for OWASP vulnerabilities", "Document SQLi and XSS security flaws", "Issue remediation code patches"], expectedOutput: "Comprehensive penetration testing report with verified security patches.", stepByStepTasks: ["Conduct Nmap port scan", "Execute OWASP ZAP vulnerability scan", "Patch vulnerable backend queries", "Verify fix"] }
    ]
  },

  {
    id: "uiux-design",
    title: "UI/UX Design & Product Strategy",
    category: "UI/UX Design",
    level: "Beginner",
    estimatedDuration: "12 Weeks (90 Hours)",
    shortDescription: "Complete design path covering Design Fundamentals, UX Research, Personas, Wireframing, Figma Prototyping & Design Systems.",
    fullDescription: "Design intuitive, engaging user experiences for mobile and web products. Master user research, wireframing, interactive prototyping in Figma, visual hierarchy, and scalable design systems.",
    careerOpportunities: ["UI/UX Designer", "Product Designer", "UX Researcher", "Interaction Designer"],
    prerequisites: ["Visual Sensitivity", "Empathy for User Experience"],
    instructor: { name: "Alex Rivera", title: "Lead Product Designer", avatar: "👨‍🎨" },
    icon: "🎨",
    bannerGradient: "linear-gradient(135deg, #db2777 0%, #e11d48 100%)",
    skillsCovered: ["UX Research", "User Personas", "Wireframing", "Figma Auto Layout", "Design Systems", "Interactive Prototyping", "Usability Testing"],
    modules: [
      { id: "uiux-m1", title: "Module 1 — Design Thinking & UX Research", description: "Design thinking phases (Empathize, Define, Ideate, Prototype, Test), user interviews, and persona creation.", topics: [{ id: "uiux-m1-t1", title: "User Personas & Journey Mapping", duration: "45 min", explanation: "User personas synthesize qualitative research into representative user profiles detailing goals, frustrations, and motivations.", objectives: ["Conduct user interviews", "Build detailed User Personas"], subtopics: ["Design Fundamentals", "UX Research", "User Personas", "User Journey"], example: { description: "Persona Structure:", codeSnippet: `Name: Priya | Goal: Learn Python at night | Frustration: Cluttered complex web layouts` }, practicalExercise: { title: "Persona Creation Task", task: "Create a user persona for a busy college student using an online learning platform.", hint: "Include background, core goals, and key friction points.", solution: "Persona created." }, miniQuiz: { question: "What is the primary purpose of constructing User Personas in UX design?", options: ["To ground design decisions in real user needs rather than designer assumptions", "To make pretty graphics", "To pick background colors", "To code CSS animations"], correctAnswer: 0, explanation: "Personas keep product design focused on authentic user goals and real-world pain points." }, resources: [] }] },
      { id: "uiux-m2", title: "Module 2 — Figma Prototyping & Design Systems", description: "Auto Layout, component variants, design tokens, interactive prototyping, and usability testing.", topics: [{ id: "uiux-m2-t1", title: "Figma Auto Layout & Interactive Prototypes", duration: "60 min", explanation: "Figma Auto Layout creates responsive UI components that expand fluidly when content changes, mirroring CSS Flexbox.", objectives: ["Master Figma Auto Layout", "Build interactive component variants"], subtopics: ["Information Architecture", "Wireframing", "Prototyping", "UI Design", "Design Systems", "Figma", "Usability Testing", "UX Case Studies"], example: { description: "Auto Layout setup:", codeSnippet: `Direction: Vertical | Spacing: 16px | Padding: 20px | Resizing: Hug Content` }, practicalExercise: { title: "Figma Button Component", task: "Build a responsive button component set in Figma with Hover and Active variant states.", hint: "Use Auto Layout and set constraints to Hug Content.", solution: "Figma button component set created." }, miniQuiz: { question: "Which Figma feature mirrors CSS Flexbox layout behavior?", options: ["Auto Layout", "Smart Animate", "Masking", "Pen Tool"], correctAnswer: 0, explanation: "Figma Auto Layout organizes UI frames automatically with padding and direction rules matching CSS Flexbox." }, resources: [] }] }
    ],
    projects: [
      { id: "uiux-proj-1", title: "Mobile EdTech App UI/UX Case Study", difficulty: "Intermediate", skillsUsed: ["Figma", "UX Research", "Wireframing", "Auto Layout", "Interactive Prototype"], requirements: ["Conduct 3 user interviews", "Build low-fi wireframes", "Design high-fi Figma prototype", "Conduct usability test"], expectedOutput: "Complete portfolio-ready UI/UX design case study.", stepByStepTasks: ["Interview users", "Draft Wireframes", "Build Figma Prototype", "Write UX Case Study"] }
    ]
  },

  {
    id: "software-testing",
    title: "Software Testing & Quality Assurance",
    category: "Software Testing",
    level: "Beginner",
    estimatedDuration: "12 Weeks (80 Hours)",
    shortDescription: "Complete QA path covering SDLC, STLC, Manual Testing, Test Cases, Jira Bug Tracking, Postman API Testing & Selenium/Playwright Automation.",
    fullDescription: "Ensure software reliability and quality. Master manual test execution, writing precise test cases, bug tracking in Jira, REST API testing with Postman, and automated browser testing using Selenium and Playwright.",
    careerOpportunities: ["QA Automation Engineer", "Software Test Analyst", "Manual QA Specialist", "SDET (Software Development Engineer in Test)"],
    prerequisites: ["Attention to Detail", "Basic Computer Literacy"],
    instructor: { name: "Sarah Jenkins", title: "Lead QA Automation Engineer", avatar: "👩‍💼" },
    icon: "🧪",
    bannerGradient: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
    skillsCovered: ["Manual Testing", "SDLC/STLC", "Test Cases", "Jira", "Postman API Testing", "SQL for QA", "Selenium", "Playwright", "Automation Pipelines"],
    modules: [
      { id: "st-m1", title: "Module 1 — Manual Testing & STLC", description: "Software Testing Life Cycle (STLC), writing test cases, bug lifecycles, and Jira bug tracking.", topics: [{ id: "st-m1-t1", title: "Writing Effective Test Cases & Jira Defect Tracking", duration: "45 min", explanation: "Test cases define step-by-step actions, preconditions, and expected outputs to verify feature behavior systematically.", objectives: ["Write structured test cases", "Log bug reports in Jira with clear reproduction steps"], subtopics: ["Testing Fundamentals", "SDLC", "STLC", "Manual Testing", "Test Cases", "Bug Reporting", "Jira"], example: { description: "Test Case Structure:", codeSnippet: `ID: TC_LOGIN_01 | Action: Enter valid email/password & click Submit | Expected: Redirected to Dashboard` }, practicalExercise: { title: "Bug Report Task", task: "Write a defect report in Jira format for a shopping cart checkout failure.", hint: "Include Environment, Steps to Reproduce, Expected Result, and Actual Result.", solution: "Jira defect report logged." }, miniQuiz: { question: "What document details the exact steps, test data, and expected results for verifying a feature?", options: ["Test Case", "Source Code", "User Story", "Database Index"], correctAnswer: 0, explanation: "Test Cases specify step-by-step inputs, execution steps, and expected results for verification." }, resources: [] }] },
      { id: "st-m2", title: "Module 2 — API Testing & Automation (Postman & Playwright)", description: "REST API testing with Postman, assertion scripts, and automated E2E browser testing with Playwright.", topics: [{ id: "st-m2-t1", title: "Postman API & Playwright Automation", duration: "60 min", explanation: "Automated test suites run regression tests on web pages (Playwright) and API endpoints (Postman) on every build.", objectives: ["Write Postman API test assertions", "Automate E2E browser scripts with Playwright"], subtopics: ["API Testing", "Postman", "SQL for Testing", "Automation Testing", "Selenium", "Playwright"], example: { description: "Playwright test script snippet:", codeSnippet: `import { test, expect } from '@playwright/test';\ntest('homepage has title', async ({ page }) => {\n  await page.goto('https://vellife.com');\n  await expect(page).toHaveTitle(/VELLIFE/);\n});` }, practicalExercise: { title: "Playwright Automation Task", task: "Write a Playwright test script that navigates to a login page and asserts the submit button is enabled.", hint: "await expect(page.locator('button[type=\"submit\"]')).toBeEnabled().", solution: "Playwright test script verified." }, miniQuiz: { question: "What is the primary advantage of automated regression testing over manual testing?", options: ["Executes repetitive test suites in seconds without human fatigue on every build", "Fixes bugs automatically", "Eliminates all code", "Designs web graphics"], correctAnswer: 0, explanation: "Automated testing executes repetitive regression suites instantly, ensuring existing features don't break." }, resources: [] }] }
    ],
    projects: [
      { id: "st-proj-1", title: "E-Commerce Automated Test Suite & API Validation", difficulty: "Intermediate", skillsUsed: ["Postman", "Playwright", "JavaScript", "Jira", "CI/CD"], requirements: ["Create 20 manual test cases", "Automate API assertions in Postman", "Build E2E Playwright test suite"], expectedOutput: "Automated testing repository executing on CI build pipelines.", stepByStepTasks: ["Draft Test Plan", "Build Postman Collection", "Write Playwright E2E scripts", "Integrate with GitHub Actions"] }
    ]
  },

  {
    id: "business-analysis",
    title: "Business Analysis & Agile Frameworks",
    category: "Business Analysis",
    level: "Beginner",
    estimatedDuration: "12 Weeks (80 Hours)",
    shortDescription: "Complete path covering Requirement Gathering, BRD/SRS Documentation, Process Mapping (BPMN), Agile/Scrum, Jira, Power BI & Data Analysis.",
    fullDescription: "Bridge the gap between enterprise business stakeholders and technical development teams. Master requirement elicitation, BRD documentation, process modeling (BPMN), Scrum sprint management, and data visualization.",
    careerOpportunities: ["Business Analyst", "Product Owner", "Agile Scrum Master", "Systems Analyst"],
    prerequisites: ["Strong Communication", "Analytical Mindset"],
    instructor: { name: "Sarah Jenkins", title: "Lead Business Analyst", avatar: "👩‍💼" },
    icon: "📈",
    bannerGradient: "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)",
    skillsCovered: ["Requirement Gathering", "BRD/SRS Writing", "Process Mapping (BPMN)", "Agile/Scrum", "Jira & Confluence", "SQL", "Power BI", "Stakeholder Mgmt"],
    modules: [
      { id: "ba-m1", title: "Module 1 — Business Analysis & Requirement Gathering", description: "BA role, stakeholder management, requirement elicitation techniques (Interviews, Workshops, Surveys), and GAP Analysis.", topics: [{ id: "ba-m1-t1", title: "Elicitation Techniques & GAP Analysis", duration: "45 min", explanation: "Business Analysts conduct stakeholder workshops and gap analysis to evaluate current AS-IS processes against target TO-BE goals.", objectives: ["Elicit requirements via interviews", "Perform AS-IS vs TO-BE Gap Analysis"], subtopics: ["Business Analysis Fundamentals", "Requirement Gathering", "Requirement Validation"], example: { description: "GAP Analysis matrix:", codeSnippet: `Current AS-IS: Manual Paper Orders -> Target TO-BE: Automated Web Portal -> Gap: Real-time Database API` }, practicalExercise: { title: "Gap Analysis Matrix Task", task: "Map an AS-IS manual workflow to a TO-BE automated digital solution.", hint: "Identify specific manual steps to automate.", solution: "Gap Analysis matrix mapped." }, miniQuiz: { question: "What is the primary role of a Business Analyst in a software project?", options: ["To elicit, analyze, and translate business needs into precise technical requirements", "To write C++ code", "To fix computer hardware", "To manage office payroll"], correctAnswer: 0, explanation: "Business Analysts bridge business goals and technical development by translating needs into clear requirements." }, resources: [] }] },
      { id: "ba-m2", title: "Module 2 — Documentation & Agile Scrum (BRD, FRD, User Stories)", description: "Writing Business Requirement Documents (BRDs), User Stories with Acceptance Criteria, BPMN process mapping, and Jira/Confluence tools.", topics: [{ id: "ba-m2-t1", title: "Writing User Stories & Acceptance Criteria", duration: "60 min", explanation: "User Stories define user requirements in Agile: 'As a <role>, I want <feature>, so that <benefit>'.", objectives: ["Write Agile User Stories", "Define clear Acceptance Criteria"], subtopics: ["Requirements Documentation", "BRD", "FRD", "SRS", "User Stories", "Acceptance Criteria", "Business Process Analysis", "Agile & Scrum", "Jira", "Confluence", "Draw.io"], example: { description: "User Story with Given-When-Then Acceptance Criteria:", codeSnippet: `User Story: As a student, I want to export course certificates as PDF so that I can share them on LinkedIn.\nAcceptance Criteria:\nGiven I completed 100% of course lessons\nWhen I click "Download Certificate"\nThen a signed PDF document is generated within 3 seconds.` }, practicalExercise: { title: "User Story Task", task: "Write a user story with 2 acceptance criteria for a password reset feature.", hint: "Follow the 'As a... I want... So that...' format.", solution: "User story and criteria created." }, miniQuiz: { question: "What format standardizes Agile User Story requirements writing?", options: ["As a [role], I want [feature], so that [benefit]", "Select * From Table", "If/Else block", "Plain paragraph"], correctAnswer: 0, explanation: "The standard Agile User Story template captures role, goal, and business benefit cleanly." }, resources: [] }] }
    ],
    projects: [
      { id: "ba-proj-1", title: "Enterprise E-Commerce Platform Business Requirement Document (BRD)", difficulty: "Intermediate", skillsUsed: ["BRD Writing", "BPMN Process Mapping", "Jira", "User Stories", "Wireframing"], requirements: ["Draft complete BRD document", "Map AS-IS to TO-BE BPMN workflow", "Create 15 User Stories with acceptance criteria"], expectedOutput: "Comprehensive Business Requirement Document portfolio centerpiece.", stepByStepTasks: ["Define Business Problem", "Map BPMN Process", "Draft User Stories", "Finalize BRD"] }
    ]
  },

  {
    id: "digital-marketing",
    title: "Digital Marketing & Growth Strategy",
    category: "Digital Marketing",
    level: "Beginner",
    estimatedDuration: "10 Weeks (70 Hours)",
    shortDescription: "Complete path covering Digital Marketing Fundamentals, SEO, Content Strategy, Social Media, Paid Ads (Google/Meta), Email Automation & Analytics.",
    fullDescription: "Drive customer acquisition, organic traffic, and revenue growth. Master Search Engine Optimization (SEO), content marketing, paid Google/Meta ad campaigns, funnel analytics, and conversion rate optimization.",
    careerOpportunities: ["Digital Marketing Manager", "SEO Specialist", "Performance Marketing Analyst", "Growth Hacker"],
    prerequisites: ["Creative Copywriting Interest", "Basic Analytical Understanding"],
    instructor: { name: "Alex Rivera", title: "Growth Marketing Director", avatar: "👨‍💼" },
    icon: "📣",
    bannerGradient: "linear-gradient(135deg, #c026d3 0%, #701a75 100%)",
    skillsCovered: ["Digital Marketing Funnel", "SEO (On-page/Off-page)", "Content Strategy", "Social Media Ads", "Google Ads", "Meta Ads", "Google Analytics (GA4)", "ROAS/CAC Optimization"],
    modules: [
      { id: "dm-m1", title: "Module 1 — Marketing Funnel & SEO Optimization", description: "Marketing funnel (TOFU/MOFU/BOFU), buyer personas, keyword research, On-page SEO, Technical SEO, and link building.", topics: [{ id: "dm-m1-t1", title: "Keyword Research & On-Page SEO", duration: "45 min", explanation: "Search Engine Optimization aligns website content with user search intent using strategic keyword placement and technical meta tags.", objectives: ["Conduct keyword intent research", "Optimize page title tags and meta descriptions"], subtopics: ["Digital Marketing Fundamentals", "SEO", "Google Search Console", "Google Analytics"], example: { description: "Optimized HTML Meta Tags:", codeSnippet: `<title>Full Stack Web Development Course | VELLIFE</title>\n<meta name="description" content="Master React, Node.js, and SQL with hands-on projects." />` }, practicalExercise: { title: "Meta Tag Optimization Task", task: "Write an optimized Title Tag and Meta Description for a Data Analytics course page targeting keywords.", hint: "Keep Title under 60 characters and Description under 155 characters.", solution: "Meta tags optimized." }, miniQuiz: { question: "What is the primary objective of On-Page SEO?", options: ["Optimizing content, HTML tags, and internal links directly on your website to rank higher in search engines", "Paying Google for every click", "Sending email spam", "Designing print flyers"], correctAnswer: 0, explanation: "On-Page SEO optimizes elements directly on your web pages to improve organic search visibility." }, resources: [] }] },
      { id: "dm-m2", title: "Module 2 — Paid Advertising & Funnel Analytics (Google/Meta)", description: "Google Search Ads, Meta Facebook/Instagram Ads, A/B testing, pixel tracking, ROAS, CPA, and GA4 analytics.", topics: [{ id: "dm-m2-t1", title: "Meta Ads Targeting & ROAS Calculation", duration: "60 min", explanation: "Paid advertising delivers immediate targeted traffic. Track Return on Ad Spend (ROAS = Revenue / Ad Spend) to scale profitable campaigns.", objectives: ["Structure Meta Ad Campaigns", "Calculate ROAS and Customer Acquisition Cost (CAC)"], subtopics: ["Content Marketing", "Social Media Marketing", "Paid Advertising", "Google Ads", "Meta Ads", "Email Marketing", "Analytics", "Google Analytics", "ROAS", "CPA"], example: { description: "ROAS Calculation formula:", codeSnippet: `ROAS = Generated Ad Revenue / Total Ad Campaign Spend\nExample: \$5,000 Revenue / \$1,000 Spend = 5.0 (5x ROAS)` }, practicalExercise: { title: "ROAS Calculation Task", task: "Calculate ROAS given \$3,000 ad spend generating \$12,000 in course sales.", hint: "\$12,000 / \$3,000 = 4.0x.", solution: "ROAS = 4.0x (400%)." }, miniQuiz: { question: "What does a Return on Ad Spend (ROAS) metric of 4.0 mean?", options: ["The ad campaign generated \$4.00 in revenue for every \$1.00 spent on advertising", "The ad failed", "The ad received 4 clicks", "The campaign lasted 4 days"], correctAnswer: 0, explanation: "A 4.0 ROAS means the campaign produced 4 dollars in gross revenue per 1 dollar of ad spend." }, resources: [] }] }
    ],
    projects: [
      { id: "dm-proj-1", title: "Complete Digital Marketing & Performance Campaign Strategy", difficulty: "Intermediate", skillsUsed: ["SEO Audit", "Google Ads", "Meta Ads", "Google Analytics GA4", "Copywriting"], requirements: ["Conduct technical SEO audit", "Build 3-stage marketing funnel strategy", "Create Google Search Ad campaigns with targeted keyword groups"], expectedOutput: "Comprehensive marketing strategy and campaign execution plan.", stepByStepTasks: ["Perform SEO Audit", "Map Marketing Funnel", "Design Ad Creatives", "Setup GA4 Conversion Tracking"] }
    ]
  },

  {
    id: "sap-enterprise",
    title: "SAP S/4HANA Enterprise Systems",
    category: "SAP",
    level: "Beginner",
    estimatedDuration: "14 Weeks (100 Hours)",
    shortDescription: "Complete enterprise ERP path covering SAP Fundamentals, SAP PP, SAP MM, SAP SD, SAP QM & SAP FICO modules.",
    fullDescription: "Master the world's leading enterprise resource planning software. Learn core business process integration across SAP S/4HANA, procurement (MM), sales (SD), production (PP), quality (QM), and financial accounting (FICO).",
    careerOpportunities: ["SAP Functional Consultant", "SAP ERP Analyst", "SAP Business Process Specialist", "SAP Project Manager"],
    prerequisites: ["Understanding of Core Business Functions"],
    instructor: { name: "Sarah Jenkins", title: "SAP Solutions Consultant", avatar: "👩‍💼" },
    icon: "💼",
    bannerGradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    skillsCovered: ["SAP S/4HANA", "SAP Fiori", "SAP MM (Procurement)", "SAP SD (Sales)", "SAP PP (Production)", "SAP QM (Quality)", "SAP FICO (Finance)"],
    modules: [
      { id: "sap-m1", title: "Module 1 — SAP Overview & S/4HANA Architecture", description: "ERP fundamentals, SAP S/4HANA in-memory database architecture, SAP GUI transaction codes (T-Codes), and SAP Fiori UI.", topics: [{ id: "sap-m1-t1", title: "SAP Fiori Launchpad & S/4HANA Basics", duration: "45 min", explanation: "SAP S/4HANA unifies business operations on an in-memory database accessed via role-based Fiori launchpad tiles.", objectives: ["Navigate SAP Fiori Launchpad", "Understand T-Codes (/nME21N, /nVA01)"], subtopics: ["ERP Basics", "SAP Overview", "SAP Architecture", "SAP S/4HANA", "SAP GUI", "SAP Fiori"], example: { description: "Common SAP Transaction Codes:", codeSnippet: `/nME21N - Create Purchase Order (MM)\n/nVA01  - Create Sales Order (SD)\n/nFB50  - Enter G/L Account Document (FICO)` }, practicalExercise: { title: "T-Code Mapping Task", task: "Map 3 standard SAP transaction codes to their respective business functional modules.", hint: "ME21N = MM, VA01 = SD, FB50 = FICO.", solution: "T-Codes mapped." }, miniQuiz: { question: "What is the primary technological advantage of SAP S/4HANA over legacy ERP systems?", options: ["Runs on an in-memory columnar database enabling real-time analytics without data redundancy", "Requires no database", "It is only a mobile game", "Has no transaction codes"], correctAnswer: 0, explanation: "S/4HANA's in-memory computing processes transactional and analytical data instantly." }, resources: [] }] },
      { id: "sap-m2", title: "Module 2 — SAP MM (Materials Management & Procurement)", description: "Procure-to-Pay (P2P) cycle: Material Master, Purchase Requisitions, Purchase Orders, Goods Receipt, and Invoice Verification.", topics: [{ id: "sap-m2-t1", title: "Procure-to-Pay (P2P) Cycle Execution", duration: "60 min", explanation: "The P2P cycle tracks procurement from initial purchase requisition to purchase order issuance, warehouse goods receipt, and vendor invoice 3-way match.", objectives: ["Execute P2P procurement steps", "Perform 3-way invoice matching"], subtopics: ["Procurement", "Material Management", "Purchase Requisition", "Purchase Order", "Goods Receipt", "Invoice Verification", "Inventory Management"], example: { description: "Procure-to-Pay Flow:", codeSnippet: `Requisition (ME51N) -> Purchase Order (ME21N) -> Goods Receipt (MIGO) -> Invoice Verification (MIRO)` }, practicalExercise: { title: "P2P Workflow Trace Task", task: "Diagram the 4 key steps of the SAP Procure-to-Pay workflow.", hint: "Requisition -> PO -> Goods Receipt -> Invoice.", solution: "P2P workflow diagrammed." }, miniQuiz: { question: "What 3 documents are compared in SAP 3-Way Invoice Matching before approving payment?", options: ["Purchase Order, Goods Receipt document, and Vendor Invoice", "Resume, ID, Email", "HTML, CSS, JS", "Sales Order, Delivery, Billing"], correctAnswer: 0, explanation: "3-Way Matching verifies consistency between PO terms, Goods Receipt quantities, and Vendor Invoice charges." }, resources: [] }] },
      { id: "sap-m3", title: "Module 3 — SAP SD (Sales & Distribution)", description: "Order-to-Cash (O2C) cycle: Customer Master, Sales Orders, Outbound Delivery, Shipping, and Customer Billing.", topics: [{ id: "sap-m3-t1", title: "Order-to-Cash (O2C) Process Flow", duration: "60 min", explanation: "The O2C cycle processes customer orders from inquiry through sales order creation, warehouse delivery, shipping, and customer billing document generation.", objectives: ["Execute O2C sales workflow", "Generate customer billing documents"], subtopics: ["Sales Process", "Customer Master", "Sales Order", "Delivery", "Billing", "Pricing"], example: { description: "Order-to-Cash Flow:", codeSnippet: `Sales Order (VA01) -> Outbound Delivery (VL01N) -> Goods Issue (PGI) -> Billing Document (VF01)` }, practicalExercise: { title: "O2C Process Task", task: "Trace a customer order from creation (VA01) to billing document (VF01).", hint: "Order -> Delivery -> Goods Issue -> Billing.", solution: "O2C process verified." }, miniQuiz: { question: "Which SAP SD transaction creates a new Sales Order?", options: ["/nVA01", "/nME21N", "/nFB50", "/nMIGO"], correctAnswer: 0, explanation: "/nVA01 is the standard SAP transaction code to create a Sales Order." }, resources: [] }] },
      { id: "sap-m4", title: "Module 4 — SAP PP, QM & FICO Modules Overview", description: "Production Planning (BOM, MRP), Quality Management (Inspection), and Financial Accounting (General Ledger, AP/AR, Cost Center).", topics: [{ id: "sap-m4-t1", title: "SAP Production, Quality & Financial Integration", duration: "60 min", explanation: "SAP integrates manufacturing production plans (PP) with quality inspection checks (QM) and real-time financial ledger accounting (FICO).", objectives: ["Understand Bill of Materials (BOM) & MRP", "Track Financial G/L postings"], subtopics: ["Production Planning", "Master Data", "Material Master", "BOM", "Work Center", "Routing", "Demand Management", "MRP", "Production Orders", "Capacity Planning", "Quality Management", "Inspection", "Quality Planning", "Quality Control", "Quality Notifications", "Financial Accounting", "Controlling", "General Ledger", "Accounts Payable", "Accounts Receivable", "Cost Center"], example: { description: "Financial Posting Integration:", codeSnippet: `Goods Receipt (MIGO) -> Automatic Financial Ledger Debit (Inventory) / Credit (Unbilled Liability)` }, practicalExercise: { title: "FICO Integration Task", task: "Explain how a warehouse Goods Receipt automatically updates the General Ledger in SAP FICO.", hint: "Material movement triggers automatic posting rules.", solution: "Automatic financial posting explained." }, miniQuiz: { question: "What does a Bill of Materials (BOM) define in SAP Production Planning (PP)?", options: ["The complete list of raw materials, components, and quantities needed to manufacture a finished product", "A customer bill", "A tax form", "A password list"], correctAnswer: 0, explanation: "A BOM lists all raw materials and sub-assemblies required to manufacture a finished product." }, resources: [] }] }
    ],
    projects: [
      { id: "sap-proj-1", title: "Global Manufacturing SAP S/4HANA Process Integration", difficulty: "Intermediate", skillsUsed: ["SAP S/4HANA", "SAP MM", "SAP SD", "SAP FICO"], requirements: ["Execute Procure-to-Pay workflow", "Execute Order-to-Cash workflow", "Verify automatic G/L financial postings"], expectedOutput: "Integrated SAP business process execution report.", stepByStepTasks: ["Create Purchase Order", "Post Goods Receipt", "Create Sales Order", "Post Billing Document & verify G/L"] }
    ]
  },

  {
    id: "professional-skills",
    title: "Professional & Career Skills",
    category: "Professional Skills",
    level: "Beginner",
    estimatedDuration: "8 Weeks (50 Hours)",
    shortDescription: "Essential workplace path covering Communication, Presentation, Problem Solving, Resume Building, LinkedIn, Interview Prep & Mock Loop Practice.",
    fullDescription: "Equip yourself with the soft skills and interview mastery required to crack technical hiring loops and excel in enterprise team environments. Covers resume ATS optimization, LinkedIn personal branding, logical aptitude, and mock interviews.",
    careerOpportunities: ["Job-Ready Graduate", "Corporate Professional", "Team Lead"],
    prerequisites: ["Eagerness to Learn and Grow"],
    instructor: { name: "Sarah Jenkins", title: "Career Placement Director", avatar: "👩‍🏫" },
    icon: "🌟",
    bannerGradient: "linear-gradient(135deg, #0d9488 0%, #059669 100%)",
    skillsCovered: ["Communication", "Presentation Skills", "Problem Solving", "Time Management", "ATS Resume", "LinkedIn", "Interview Prep (STAR)", "Quantitative Aptitude", "Mock Interviews"],
    modules: [
      { id: "ps-m1", title: "Module 1 — Workplace Communication & Presentation Skills", description: "Verbal clarity, executive presentation decks, structured problem solving, and time management.", topics: [{ id: "ps-m1-t1", title: "Executive Presentation & Communication", duration: "45 min", explanation: "Effective workplace communication combines active listening, clear slide deck presentation structure, and concise status reporting.", objectives: ["Master Pyramid Principle presentation structure", "Structure daily standup updates"], subtopics: ["Communication", "English Communication", "Presentation Skills", "Problem Solving", "Critical Thinking", "Time Management", "Teamwork", "Leadership"], example: { description: "Daily Standup Update format:", codeSnippet: `Yesterday: Completed JWT Auth API -> Today: Building React Login Form -> Blockers: None` }, practicalExercise: { title: "Standup Update Task", task: "Write a 3-sentence daily standup status update for a project task.", hint: "Yesterday, Today, Blockers format.", solution: "Standup update written." }, miniQuiz: { question: "What is the recommended structure for technical daily standup updates?", options: ["Yesterday's progress, Today's focus, and current Blockers", "Long 30-minute story", "Silent nod", "Complaint list"], correctAnswer: 0, explanation: "Daily standup updates focus strictly on Yesterday's achievements, Today's goals, and any Blockers." }, resources: [] }] },
      { id: "ps-m2", title: "Module 2 — Job Hunt Mastery (Resume, LinkedIn & Interviews)", description: "Build ATS resumes, optimize LinkedIn profiles, master STAR behavioral interviews, aptitude, GD, and mock interviews.", topics: [{ id: "ps-m2-t1", title: "ATS Resume Building & STAR Behavioral Interviews", duration: "60 min", explanation: "ATS resumes use action verbs and impact metrics. The STAR method (Situation, Task, Action, Result) structures behavioral interview answers.", objectives: ["Format ATS-friendly technical resume", "Structure STAR method interview answers"], subtopics: ["Resume Building", "LinkedIn Profile", "Interview Preparation", "Aptitude", "Group Discussion", "Mock Interviews"], example: { description: "STAR Method answer template:", codeSnippet: `Situation: App latency was 3s.\nTask: Reduce latency under 500ms.\nAction: Added Redis caching and indexed SQL tables.\nResult: Reduced latency by 85% to 450ms.` }, practicalExercise: { title: "STAR Response Task", task: "Frame a STAR behavioral response describing a time you resolved a technical challenge.", hint: "Emphasize quantifiable results in the Result phase.", solution: "STAR answer drafted." }, miniQuiz: { question: "What does the STAR acronym stand for in behavioral interview answers?", options: ["Situation, Task, Action, Result", "Speed, Testing, Code, Review", "System, Technology, API, Response", "Start, Try, Ask, Repeat"], correctAnswer: 0, explanation: "STAR stands for Situation, Task, Action, and Result — the gold standard behavioral answer framework." }, resources: [] }] }
    ],
    projects: [
      { id: "ps-proj-1", title: "Complete Job-Search Mastery Portfolio Package", difficulty: "Beginner", skillsUsed: ["Resume Writing", "LinkedIn Optimization", "STAR Interview", "Mock Interview"], requirements: ["Build 1-page ATS technical resume", "Optimize LinkedIn headline and summary", "Record 2 STAR method behavioral answer responses"], expectedOutput: "Complete recruiter-ready job application portfolio.", stepByStepTasks: ["Build ATS Resume", "Optimize LinkedIn Profile", "Draft STAR Answers", "Complete Mock Interview"] }
    ]
  }
];
