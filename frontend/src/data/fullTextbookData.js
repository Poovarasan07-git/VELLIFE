// src/data/fullTextbookData.js

export const TEXTBOOK_COURSES = {
  "fullstack-dev": {
    id: "fullstack-dev",
    title: "Full Stack Development",
    category: "Full Stack Development",
    level: "Intermediate",
    estimatedDuration: "160 Hours (16 Weeks)",
    icon: "🌐",
    bannerGradient: "linear-gradient(135deg, #312e81 0%, #4338ca 50%, #065f46 100%)",
    shortDescription: "Complete in-house full stack digital textbook covering Web Fundamentals, HTML5, CSS3, JavaScript, React, Angular, Python, FastAPI, Java, and SQL.",
    fullDescription: "Learn Full Stack Development from scratch to advanced production engineering. This comprehensive in-house learning portal provides deep explanations, syntax guides, line-by-line code breakdowns, real-world scenarios, common mistakes, practice exercises, quizzes, module tests, and capstone SaaS projects.",
    skillsCovered: ["HTML5", "CSS3/Tailwind", "JavaScript (ES6+)", "React.js", "Angular", "Python/FastAPI", "Java", "SQL/PostgreSQL", "REST APIs", "Git/Docker"],
    careerOpportunities: ["Full Stack Engineer", "Frontend Developer", "Backend Developer", "React/Angular Developer", "API Architect"],
    sections: [
      {
        id: "sec-web-fund",
        title: "Section 1: Web Fundamentals & Architecture",
        description: "Master client-server mechanics, HTTP/HTTPS protocols, DNS, URL anatomy, REST APIs, JSON, Cookies, and Sessions.",
        modules: [
          {
            id: "mod-web-1",
            title: "Module 1.1 — How the Internet & Web Work",
            description: "Understand the underlying networking and browser infrastructure that powers modern websites.",
            lessons: [
              {
                id: "les-web-1-1",
                title: "Client-Server Architecture & HTTP Request Lifecycle",
                duration: "25 min",
                overview: "Understand how web browsers communicate with backend servers over HTTP/HTTPS protocols.",
                explanation: `The World Wide Web operates on a Client-Server computing model. A client (typically a web browser like Chrome or Firefox) initiates requests for resources, while a server (a remote computer running software like NGINX, Express, or FastAPI) listens for requests, processes business logic, and returns responses.

When a user enters a Web URL (e.g., https://velfire.com/courses), the following steps occur:
1. **DNS Lookup**: The browser contacts a Domain Name System (DNS) server to translate the human-readable domain name (velfire.com) into a machine IP address (e.g., 192.0.2.1).
2. **TCP/TLS Handshake**: The browser establishes a secure Transmission Control Protocol (TCP) connection and executes a TLS handshake for HTTPS encryption.
3. **HTTP Request**: The client sends an HTTP GET request containing headers (User-Agent, Authorization, Accept) and payload.
4. **Server Processing**: The backend server receives the request, queries databases if needed, and formulates an HTTP response.
5. **HTTP Response**: The server sends back a status code (e.g., 200 OK), response headers (Content-Type: application/json), and payload body (HTML/CSS/JS or JSON).
6. **Browser Rendering**: The browser parses the HTML markup, builds the Document Object Model (DOM), fetches linked CSS/JS assets, and renders the visual interface.`,
                whyWeUseIt: "Understanding the request-response lifecycle allows developers to optimize network performance, implement secure authentication, debug API errors, and select proper architectural patterns.",
                syntax: `// Standard HTTP Request Structure:\nGET /api/v1/courses HTTP/1.1\nHost: api.velfire.com\nUser-Agent: Mozilla/5.0\nAccept: application/json\n\n// Standard HTTP Response Structure:\nHTTP/1.1 200 OK\nContent-Type: application/json\nCache-Control: max-age=3600\n\n{"status": "success", "data": []}`,
                codeExample: `// Fetching data from a REST API endpoint using Modern Async JavaScript\nasync function fetchCoursePayload() {\n  try {\n    const response = await fetch('https://api.velfire.com/v1/courses', {\n      method: 'GET',\n      headers: {\n        'Content-Type': 'application/json',\n        'Authorization': 'Bearer token_secret_123'\n      }\n    });\n    \n    if (!response.ok) {\n      throw new Error(\`HTTP Error! Status: \${response.status}\`);\n    }\n    \n    const data = await response.json();\n    console.log("Successfully retrieved courses:", data);\n    return data;\n  } catch (error) {\n    console.error("Failed to fetch courses:", error.message);\n  }\n}\n\nfetchCoursePayload();`,
                lineByLineExplanation: [
                  "async function fetchCoursePayload(): Declares an asynchronous function that handles non-blocking network operations.",
                  "await fetch(...): Initiates an HTTP GET request to the specified API endpoint and waits for network response headers.",
                  "headers: { 'Authorization': 'Bearer ...' }: Sends a secure JWT authentication token to authorize the client request.",
                  "if (!response.ok): Checks whether the HTTP response status code is outside the 200-299 success range.",
                  "await response.json(): Parses the raw JSON response payload into a JavaScript object.",
                  "catch (error): Catches network failures or status code exceptions without crashing the application execution."
                ],
                realWorldUseCase: "E-commerce checkout portals send HTTP POST requests containing cart items and tokenized payment info to payment gateway servers, receiving instant confirmation responses.",
                commonMistakes: [
                  "Forgetting to check response.ok before parsing JSON (parsing a 500 Server Error HTML page as JSON throws a syntax crash).",
                  "Exposing secret API keys or private database passwords in client-side HTTP requests.",
                  "Hardcoding localhost URLs in production build builds instead of using environment variables."
                ],
                bestPractices: [
                  "Always use HTTPS instead of HTTP for encrypted data transmission.",
                  "Set appropriate HTTP status codes (200 for Success, 201 for Created, 400 for Bad Request, 401 for Unauthorized, 404 for Not Found, 500 for Internal Server Error).",
                  "Implement proper CORS headers on backend servers to restrict unauthorized domain requests."
                ],
                practiceTask: {
                  title: "HTTP Status Code Identifier Task",
                  instruction: "Write a JavaScript function that evaluates an HTTP status code integer and returns 'Success' for 200-299, 'Client Error' for 400-499, and 'Server Error' for 500-599.",
                  hint: "Use conditional logic: code >= 200 && code < 300.",
                  starterCode: `function checkStatus(code) {\n  // Write your status evaluation logic here\n  return "";\n}\n\nconsole.log(checkStatus(200)); // Should return 'Success'`,
                  solutionCode: `function checkStatus(code) {\n  if (code >= 200 && code < 300) return "Success";\n  if (code >= 400 && code < 500) return "Client Error";\n  if (code >= 500 && code < 600) return "Server Error";\n  return "Unknown Status";\n}`
                },
                quiz: [
                  {
                    id: "q1",
                    question: "Which HTTP method is specifically designed to submit data to be processed to a specified resource?",
                    options: ["GET", "POST", "DELETE", "HEAD"],
                    correctAnswer: 1,
                    explanation: "POST sends data in the HTTP request body to create or process resources on the server."
                  },
                  {
                    id: "q2",
                    question: "What system translates human-readable domain names (like google.com) into numerical IP addresses?",
                    options: ["DNS (Domain Name System)", "HTTP (HyperText Transfer Protocol)", "DOM (Document Object Model)", "CSS (Cascading Style Sheets)"],
                    correctAnswer: 0,
                    explanation: "DNS acts as the internet's phonebook, mapping domain hostnames to IP addresses."
                  }
                ]
              },
              {
                id: "les-web-1-2",
                title: "REST APIs, JSON Data & Cookies vs Sessions",
                duration: "30 min",
                overview: "Understand Representational State Transfer (REST) conventions, JSON formatting, and session persistence strategies.",
                explanation: `REST (Representational State Transfer) is an architectural style for designing networked applications. A RESTful API exposes endpoints using standard HTTP methods mapped to CRUD (Create, Read, Update, Delete) database operations:

- **GET /api/users**: Read all users
- **GET /api/users/42**: Read user with ID 42
- **POST /api/users**: Create a new user
- **PUT /api/users/42**: Update entire user 42
- **PATCH /api/users/42**: Update specific fields of user 42
- **DELETE /api/users/42**: Delete user 42

### JSON (JavaScript Object Notation)
JSON is the lightweight text format used for API data exchange. It consists of Key-Value pairs wrapped in double quotes:
\`\`\`json
{
  "id": 101,
  "name": "Priya Sharma",
  "isEnrolled": true,
  "skills": ["JavaScript", "Python", "SQL"]
}
\`\`\`

### Cookies vs LocalStorage vs Sessions
- **Cookies**: Small data strings stored by browser, automatically attached to every outgoing HTTP request. Used for session identifiers and auth tokens.
- **LocalStorage**: Client-side key-value storage (5-10MB limit) that persists even after closing the browser tab.
- **SessionStorage**: Cleared automatically when the browser tab is closed.`,
                whyWeUseIt: "REST APIs decouple frontend user interfaces from backend database servers, enabling iOS, Android, and Web clients to consume a single backend server API.",
                syntax: `// Standard RESTful JSON Payload Response:\n{\n  "status": "success",\n  "count": 2,\n  "data": [\n    { "id": 1, "title": "HTML5 & Web Architecture" },\n    { "id": 2, "title": "Modern CSS & Flexbox" }\n  ]\n}`,
                codeExample: `// Working with JSON parsing and LocalStorage persistence\nconst userSession = {\n  username: "Alex_Dev",\n  role: "Student",\n  token: "jwt_signed_secret_xyz"\n};\n\n// 1. Serialize object to JSON string & save to LocalStorage\nlocalStorage.setItem("velfire_session", JSON.stringify(userSession));\n\n// 2. Retrieve JSON string & parse back to JavaScript Object\nconst savedSessionString = localStorage.getItem("velfire_session");\nif (savedSessionString) {\n  const parsedSession = JSON.parse(savedSessionString);\n  console.log("Logged in user:", parsedSession.username);\n}`,
                lineByLineExplanation: [
                  "JSON.stringify(userSession): Converts a live JavaScript object into a formatted JSON string for storage.",
                  "localStorage.setItem(key, value): Persists the string key-value pair in browser storage.",
                  "localStorage.getItem(key): Reads the stored string value from browser storage.",
                  "JSON.parse(savedSessionString): Deserializes the JSON string back into a functional JavaScript object."
                ],
                realWorldUseCase: "Streaming platforms store user viewing preferences and active authentication tokens in LocalStorage/Cookies to maintain uninterrupted login across browser restarts.",
                commonMistakes: [
                  "Attempting to store raw JavaScript objects directly in LocalStorage without applying JSON.stringify().",
                  "Storing sensitive unencrypted passwords or credit card numbers in LocalStorage (vulnerable to XSS attacks)."
                ],
                bestPractices: [
                  "Use HTTP-only cookies for sensitive authentication JWT tokens to protect against Cross-Site Scripting (XSS).",
                  "Maintain strict JSON key naming conventions (camelCase or snake_case consistently)."
                ],
                practiceTask: {
                  title: "JSON Serialization Exercise",
                  instruction: "Write a function that converts an array of course titles into a JSON string, saves it to LocalStorage under 'my_courses', and parses it back.",
                  hint: "Use JSON.stringify() to save and JSON.parse() to read.",
                  starterCode: `function saveCourses(courseArray) {\n  // Serialize and store\n}\n\nfunction loadCourses() {\n  // Read and deserialize\n  return [];\n}`,
                  solutionCode: `function saveCourses(courseArray) {\n  localStorage.setItem("my_courses", JSON.stringify(courseArray));\n}\n\nfunction loadCourses() {\n  const data = localStorage.getItem("my_courses");\n  return data ? JSON.parse(data) : [];\n}`
                },
                quiz: [
                  {
                    id: "q1",
                    question: "Which HTTP verb corresponds to deleting a record in REST API conventions?",
                    options: ["GET", "POST", "DELETE", "UPDATE"],
                    correctAnswer: 2,
                    explanation: "DELETE specifies resource removal in RESTful URL standards."
                  }
                ]
              }
            ],
            moduleTest: {
              title: "Module 1 Test: Web Architecture & REST Principles",
              questions: [
                {
                  id: "mt-1",
                  question: "What happens during a DNS lookup?",
                  options: [
                    "Domain hostname is translated to IP address",
                    "CSS styles are downloaded",
                    "Database passwords are encrypted",
                    "Cookies are deleted"
                  ],
                  correctAnswer: 0,
                  explanation: "DNS translates hostnames (velfire.com) into numerical IP addresses."
                },
                {
                  id: "mt-2",
                  question: "What is the key difference between LocalStorage and SessionStorage?",
                  options: [
                    "LocalStorage persists across browser tab closes; SessionStorage clears when tab closes",
                    "LocalStorage can only hold numbers",
                    "SessionStorage holds 100GB of data",
                    "LocalStorage sends data to backend automatically"
                  ],
                  correctAnswer: 0,
                  explanation: "SessionStorage data is tied to the current browser tab lifecycle, while LocalStorage persists long-term."
                }
              ]
            }
          }
        ]
      },
      {
        id: "sec-html",
        title: "Section 2: HTML5 Digital Textbook",
        description: "Complete in-house HTML5 course covering document structure, text formatting, links, images, tables, forms, semantic HTML, and ARIA accessibility.",
        modules: [
          {
            id: "mod-html-1",
            title: "Module 2.1 — HTML Fundamentals & Text Formatting",
            description: "Learn HTML tag syntax, DOCTYPE declarations, semantic document trees, headings, paragraphs, and inline formatting tags.",
            lessons: [
              {
                id: "les-html-1-1",
                title: "HTML Document Structure & Headings",
                duration: "25 min",
                overview: "Master <!DOCTYPE html>, <html>, <head>, <body> tags and heading hierarchy (h1 to h6).",
                explanation: `HTML (HyperText Markup Language) is the standard markup language used to structure web documents. HTML uses "tags" enclosed in angle brackets (< >) to define elements on a web page.

### HTML5 Document Blueprint
Every valid HTML5 web document begins with a DOCTYPE declaration followed by nested structural tags:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First HTML Page</title>
</head>
<body>
  <h1>Main Page Heading</h1>
  <p>This is a paragraph of text in HTML5.</p>
</body>
</html>
\`\`\`

### Key Structural Elements:
- **<!DOCTYPE html>**: Tells the browser to parse the document as HTML5 specification.
- **<html lang="en">**: The root element of the HTML page. The \`lang\` attribute specifies the language for accessibility screen readers.
- **<head>**: Contains document metadata (charset, viewport, page title, linked CSS stylesheets) not directly displayed on the canvas.
- **<body>**: Contains all visible content (headings, paragraphs, images, tables, forms).
- **<h1> to <h6>**: Heading tags representing hierarchical outline levels. \`<h1>\` is the primary topic heading (use only once per page for SEO).`,
                whyWeUseIt: "HTML provides the raw structural foundation for web browsers to render content. Without clean HTML, search engines cannot index your site and screen readers cannot read content to visually impaired users.",
                syntax: `<h1>Primary Page Heading (h1)</h1>\n<h2>Section Subheading (h2)</h2>\n<h3>Subsection Heading (h3)</h3>\n<p>Paragraph element wrapping detailed body text.</p>`,
                codeExample: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>VELFIRE HTML Textbook</title>\n</head>\n<body>\n  <header>\n    <h1>Welcome to Full Stack Web Development</h1>\n    <p>Build real production web applications from scratch.</p>\n  </header>\n  \n  <main>\n    <section>\n      <h2>Module 1: Web Fundamentals</h2>\n      <p>Understand browsers, DNS, and HTTP protocols.</p>\n    </section>\n  </main>\n</body>\n</html>`,
                lineByLineExplanation: [
                  "<!DOCTYPE html>: Signals modern HTML5 parsing engine.",
                  "<head>: Contains non-visual metadata, title, and CSS link imports.",
                  "<h1>: Establishes the main page title for SEO search engines.",
                  "<section>: Group related content logically inside the main page body."
                ],
                realWorldUseCase: "News portals use h1 for headline articles, h2 for section topics, and p tags for story body text to optimize SEO indexing and user readability.",
                commonMistakes: [
                  "Using multiple <h1> tags on a single page (hurts SEO ranking).",
                  "Skipping heading levels (e.g. jumping directly from <h1> to <h4>).",
                  "Forgetting the <meta viewport> tag (causes mobile pages to render zoomed out)."
                ],
                bestPractices: [
                  "Maintain strict single <h1> per page rule.",
                  "Always specify character encoding <meta charset='UTF-8'>.",
                  "Close all non-void HTML elements explicitly with closing tags."
                ],
                practiceTask: {
                  title: "HTML Heading Hierarchy Task",
                  instruction: "Create a simple HTML document structure containing an h1 main title, an h2 section title, and a paragraph tag.",
                  hint: "Wrap content inside <body> tags.",
                  starterCode: `<!-- Write your HTML structure below -->\n`,
                  solutionCode: `<!DOCTYPE html>\n<html>\n<body>\n  <h1>Full Stack Engineering</h1>\n  <h2>HTML5 Basics</h2>\n  <p>Learning HTML elements.</p>\n</body>\n</html>`
                },
                quiz: [
                  {
                    id: "qh1",
                    question: "Which HTML tag represents the highest level main heading on a web page?",
                    options: ["<h6>", "<h1>", "<heading>", "<head>"],
                    correctAnswer: 1,
                    explanation: "<h1> is the top-level heading tag in HTML document hierarchy."
                  }
                ]
              },
              {
                id: "les-html-1-2",
                title: "HTML Links, Images, Lists & Tables",
                duration: "30 min",
                overview: "Learn anchor <a> tags, <img> tags with alt text, <ul>/<ol> lists, and <table> data grids.",
                explanation: `Hyperlinks, media assets, structured lists, and tabular data form the core elements of rich web documents.

### 1. Anchor Tags (Links)
Hyperlinks connect web documents using the \`<a>\` tag and \`href\` attribute:
\`\`\`html
<!-- External Link (opens in new tab) -->
<a href="https://velfire.com" target="_blank" rel="noopener noreferrer">Visit VELFIRE</a>

<!-- Internal Page Link -->
<a href="/courses.html">View Courses</a>

<!-- Email Link -->
<a href="mailto:support@velfire.com">Contact Support</a>
\`\`\`

### 2. Images
Images are embedded using the self-closing \`<img>\` tag. The \`alt\` attribute is mandatory for accessibility screen readers and image fallback:
\`\`\`html
<img src="logo.png" alt="VELFIRE Platform Logo" width="200" height="60" />
\`\`\`

### 3. Lists
- **Unordered List (<ul>)**: Bulleted items.
- **Ordered List (<ol>)**: Numbered items.
- **List Item (<li>)**: Individual item inside list.

### 4. Tables
Tables display structured data grids using \`<table>\`, \`<tr>\` (row), \`<th>\` (header cell), and \`<td>\` (data cell):
\`\`\`html
<table>
  <caption>Student Module Scores</caption>
  <thead>
    <tr>
      <th>Student</th>
      <th>Module</th>
      <th>Score</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Priya</td>
      <td>HTML5</td>
      <td>95%</td>
    </tr>
  </tbody>
</table>
\`\`\``,
                whyWeUseIt: "Links provide navigation across web pages, images add visual context, lists group related data points, and tables display grid data cleanly.",
                syntax: `<a href="url">Link Text</a>\n<img src="path" alt="description" />\n<ul><li>Item 1</li></ul>\n<table><tr><td>Cell Data</td></tr></table>`,
                codeExample: `<article>\n  <h2>Course Overview</h2>\n  <img src="course-banner.jpg" alt="Full Stack Web Development Banner" width="600" />\n  \n  <h3>Prerequisites:</h3>\n  <ul>\n    <li>Basic computer operation</li>\n    <li>Logical thinking</li>\n  </ul>\n  \n  <p>Ready to start? <a href="/enroll">Enroll in Course</a></p>\n</article>`,
                lineByLineExplanation: [
                  "alt='Full Stack...': Provides screen reader accessibility text if image fails to load.",
                  "<ul> / <li>: Renders a clean bulleted list of prerequisite items.",
                  "<a href='/enroll'>: Creates a clickable hyperlink navigating the user to the enrollment route."
                ],
                realWorldUseCase: "E-commerce product pages feature product image galleries, bulleted feature specifications, customer review tables, and 'Buy Now' anchor buttons.",
                commonMistakes: [
                  "Omitting the alt attribute on <img> tags (breaks web accessibility standards).",
                  "Using target='_blank' without rel='noopener noreferrer' (security vulnerability).",
                  "Using tables for general page layout instead of CSS Grid/Flexbox."
                ],
                bestPractices: [
                  "Always provide descriptive alt text for images.",
                  "Use target='_blank' with rel='noopener' for external links.",
                  "Use semantic <thead>, <tbody>, and <th> tags inside tables."
                ],
                practiceTask: {
                  title: "HTML List & Link Task",
                  instruction: "Create an unordered list containing 3 technology names, where each item contains a working link.",
                  hint: "Nest <a> tags inside <li> tags.",
                  starterCode: `<ul>\n  <!-- Add list items with links -->\n</ul>`,
                  solutionCode: `<ul>\n  <li><a href="https://react.dev">React</a></li>\n  <li><a href="https://python.org">Python</a></li>\n  <li><a href="https://postgresql.org">PostgreSQL</a></li>\n</ul>`
                },
                quiz: [
                  {
                    id: "ql1",
                    question: "Which HTML attribute specifies the image file path in an <img> tag?",
                    options: ["href", "src", "link", "path"],
                    correctAnswer: 1,
                    explanation: "src (source) specifies the URL or file path of the image asset."
                  }
                ]
              },
              {
                id: "les-html-1-3",
                title: "HTML Forms, Inputs & Semantic Layouts",
                duration: "35 min",
                overview: "Master <form>, <input> types, <select>, <textarea>, form validation, and HTML5 semantic tags (<header>, <nav>, <main>, <article>, <footer>).",
                explanation: `Forms allow users to submit interactive data (logins, searches, registrations) to backend web servers.

### 1. HTML5 Form Controls
- **<form action="/api/submit" method="POST">**: Wrapper container.
- **<label for="email">**: Clickable label bound to input via ID matching.
- **<input type="text | email | password | number | date | checkbox | radio">**: User input control.
- **<select> & <option>**: Dropdown selector.
- **<textarea>**: Multi-line text input field.
- **<button type="submit">**: Triggers form submission.

\`\`\`html
<form action="/login" method="POST">
  <div>
    <label for="user-email">Email Address:</label>
    <input type="email" id="user-email" name="email" required placeholder="name@velfire.com" />
  </div>
  
  <div>
    <label for="user-pass">Password:</label>
    <input type="password" id="user-pass" name="password" required minlength="8" />
  </div>
  
  <button type="submit">Log In</button>
</form>
\`\`\`

### 2. Semantic HTML5 Layout Structure
Semantic tags explicitly declare the meaning of page sections:
- **<header>**: Page or section header (navigation, title logo).
- **<nav>**: Navigation links block.
- **<main>**: Primary unique page content container.
- **<article>**: Self-contained standalone item (blog post, product card).
- **<section>**: Grouping of related thematic content.
- **<aside>**: Sidebar content supplementary to main flow.
- **<footer>**: Page footer (copyright, policy links).`,
                whyWeUseIt: "Semantic tags improve Search Engine Optimization (SEO) ranking significantly and allow screen reader software to navigate page structures effortlessly.",
                syntax: `<form action="url" method="POST">\n  <label for="id">Name:</label>\n  <input type="text" id="id" required />\n  <button type="submit">Submit</button>\n</form>`,
                codeExample: `<!DOCTYPE html>\n<html lang="en">\n<head><title>Registration</title></head>\n<body>\n  <header>\n    <nav><a href="/">Home</a> | <a href="/courses">Courses</a></nav>\n  </header>\n  \n  <main>\n    <section>\n      <h2>Student Registration</h2>\n      <form action="/api/register" method="POST">\n        <label for="fullname">Full Name:</label>\n        <input type="text" id="fullname" name="fullname" required />\n        \n        <label for="domain">Career Domain:</label>\n        <select id="domain" name="domain">\n          <option value="fullstack">Full Stack Development</option>\n          <option value="data">Data Analytics</option>\n        </select>\n        \n        <button type="submit">Complete Registration</button>\n      </form>\n    </section>\n  </main>\n  \n  <footer><p>&copy; 2026 VELFIRE Platform</p></footer>\n</body>\n</html>`,
                lineByLineExplanation: [
                  "<label for='fullname'>: Binds label text to input id='fullname' so clicking label focuses the input field.",
                  "<select id='domain'>: Creates a native dropdown options menu.",
                  "<main> / <section>: Encapsulates primary page flow inside semantic HTML5 containers."
                ],
                realWorldUseCase: "User authentication portals and application checkout forms rely on HTML5 form validation to catch missing fields before submitting data to APIs.",
                commonMistakes: [
                  "Omitting <label> tags and relying solely on input placeholders (placeholders disappear when user types).",
                  "Using generic <div> elements everywhere instead of semantic <main>, <header>, and <section> tags."
                ],
                bestPractices: [
                  "Always pair every <input> with a corresponding <label for='...'>.",
                  "Use specific input types (type='email', type='number') for automatic mobile keyboard optimization.",
                  "Enforce required fields using built-in HTML5 attributes (required, minlength, pattern)."
                ],
                practiceTask: {
                  title: "HTML Form Creation Task",
                  instruction: "Create a login form containing an email input, password input, and submit button, complete with associated label elements.",
                  hint: "Ensure label for='...' matches input id='...'.",
                  starterCode: `<form>\n  <!-- Write form inputs here -->\n</form>`,
                  solutionCode: `<form action="/login" method="POST">\n  <label for="email">Email:</label>\n  <input type="email" id="email" required />\n  <label for="pass">Password:</label>\n  <input type="password" id="pass" required />\n  <button type="submit">Submit</button>\n</form>`
                },
                quiz: [
                  {
                    id: "qf1",
                    question: "Which HTML5 semantic tag represents the primary unique content container of a web page?",
                    options: ["<header>", "<main>", "<section>", "<div>"],
                    correctAnswer: 1,
                    explanation: "<main> designates the dominant unique content area of a document."
                  }
                ]
              }
            ],
            moduleTest: {
              title: "Module 2.1 Test: HTML5 Fundamentals & Forms",
              questions: [
                {
                  id: "html-mt1",
                  question: "What attribute connects an HTML <label> to an <input> element?",
                  options: ["name", "for (matching input id)", "class", "value"],
                  correctAnswer: 1,
                  explanation: "The 'for' attribute on a label must match the 'id' attribute of its target input."
                }
              ]
            }
          }
        ]
      },
      {
        id: "sec-css",
        title: "Section 3: CSS3 & Responsive Layouts",
        description: "Master CSS selectors, Box Model, Flexbox, Grid, Media Queries, Transitions, Keyframe Animations, and Tailwind CSS.",
        modules: [
          {
            id: "mod-css-1",
            title: "Module 3.1 — CSS Fundamentals, Box Model & Layouts",
            description: "Understand CSS syntax, specificity, Box Model (content, padding, border, margin), Flexbox, and Grid layout engines.",
            lessons: [
              {
                id: "les-css-1-1",
                title: "CSS Box Model & Flexbox Layout Engine",
                duration: "35 min",
                overview: "Master CSS Box Model sizing rules and 1D Flexbox container alignment.",
                explanation: `CSS (Cascading Style Sheets) controls the visual presentation, styling, and layout of HTML documents.

### 1. The CSS Box Model
Every element rendered on a web page is treated as a rectangular box comprising four concentric layers:
1. **Content**: The actual text, image, or child element.
2. **Padding**: Transparent space inside the element, between content and border.
3. **Border**: The outline surrounding the padding.
4. **Margin**: Transparent space outside the element, pushing away adjacent elements.

\`\`\`css
/* Standard Box Sizing Reset */
*, *::before, *::after {
  box-sizing: border-box; /* Includes padding and border in element's total width */
}

.card {
  width: 300px;
  padding: 20px;
  border: 2px solid #10b981;
  margin: 16px;
}
\`\`\`

### 2. Flexbox (Flexible Box Layout)
Flexbox is a 1-dimensional layout engine used to align items horizontally along a row or vertically down a column:

\`\`\`css
.flex-container {
  display: flex;
  flex-direction: row;          /* Main axis direction: row | column */
  justify-content: space-between; /* Alignment along main axis */
  align-items: center;           /* Alignment along cross axis */
  gap: 16px;                     /* Spacing between flex items */
}
\`\`\``,
                whyWeUseIt: "Flexbox eliminates legacy float hacks, providing fluid item distribution, centering, and responsive scaling across mobile and desktop screens.",
                syntax: `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 20px;\n}`,
                codeExample: `/* CSS Glassmorphism Card Component */\n.course-card {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n  width: 320px;\n  padding: 24px;\n  background: rgba(30, 41, 59, 0.8);\n  border: 1px solid rgba(52, 211, 153, 0.3);\n  border-radius: 16px;\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);\n}\n\n.card-actions {\n  display: flex;\n  gap: 12px;\n  margin-top: 20px;\n}`,
                lineByLineExplanation: [
                  "display: flex: Activates Flexbox layout mode on the parent container.",
                  "flex-direction: column: Stacks child elements vertically along the column axis.",
                  "justify-content: space-between: Distributes child elements evenly, pushing top and bottom items to edges.",
                  "box-sizing: border-box: Ensures padding and border dimensions do not expand element width beyond 320px."
                ],
                realWorldUseCase: "Navigation header bars use Flexbox (justify-content: space-between) to push company logos to the left and navigation menu links to the right.",
                commonMistakes: [
                  "Forgetting to set box-sizing: border-box, causing elements with 100% width and padding to overflow containers.",
                  "Confusing justify-content (main axis) with align-items (cross axis)."
                ],
                bestPractices: [
                  "Apply universal box-sizing reset (* { box-sizing: border-box; }) in your CSS reset file.",
                  "Use CSS gap property instead of adding margins to individual flex children."
                ],
                practiceTask: {
                  title: "Flexbox Centering Challenge",
                  instruction: "Write CSS rules to perfectly center a child div horizontally and vertically inside a full screen container using Flexbox.",
                  hint: "Use display: flex; justify-content: center; align-items: center; min-height: 100vh.",
                  starterCode: `.hero-wrapper {\n  /* Add Flexbox centering styles */\n}`,
                  solutionCode: `.hero-wrapper {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}`
                },
                quiz: [
                  {
                    id: "qcss1",
                    question: "Which CSS Flexbox property aligns items along the main axis?",
                    options: ["align-items", "justify-content", "flex-wrap", "align-content"],
                    correctAnswer: 1,
                    explanation: "justify-content controls alignment along the main axis (horizontal in row mode)."
                  }
                ]
              }
            ],
            moduleTest: {
              title: "Module 3.1 Test: CSS Box Model & Flexbox",
              questions: [
                {
                  id: "css-mt1",
                  question: "What layer of the CSS Box Model sits directly between content and border?",
                  options: ["Margin", "Padding", "Outline", "Box Sizing"],
                  correctAnswer: 1,
                  explanation: "Padding provides space inside the element between content and border."
                }
              ]
            }
          }
        ]
      },
      {
        id: "sec-js",
        title: "Section 4: JavaScript & ES6+ Digital Textbook",
        description: "Complete JavaScript curriculum covering variables, control flow, functions, arrays, objects, DOM manipulation, async/await, and LocalStorage.",
        modules: [
          {
            id: "mod-js-1",
            title: "Module 4.1 — Modern JS Fundamentals & Functions",
            description: "Master let vs const, arrow functions, template literals, array methods (map, filter, reduce), and DOM events.",
            lessons: [
              {
                id: "les-js-1-1",
                title: "ES6+ Arrow Functions & Array Transformations (map, filter, reduce)",
                duration: "40 min",
                overview: "Master functional JavaScript array methods: .map(), .filter(), and .reduce().",
                explanation: `Modern JavaScript (ES6+) introduced concise arrow function syntax and functional array iteration methods.

### 1. Arrow Functions
Arrow functions provide compact syntax for writing function expressions:
\`\`\`js
// Traditional Function Expression:
function multiply(a, b) {
  return a * b;
}

// ES6 Arrow Function:
const multiply = (a, b) => a * b;
\`\`\`

### 2. Functional Array Iteration Methods
- **.map(callback)**: Transforms every array element and returns a brand new transformed array.
- **.filter(callback)**: Evaluates a condition on each element and returns a new array containing only elements that return \`true\`.
- **.reduce(callback, initialValue)**: Accumulates array elements into a single output value (sum, object, tally).

\`\`\`js
const scores = [65, 80, 92, 45, 88];

// Filter passing scores (>= 70)
const passingScores = scores.filter(s => s >= 70); // [80, 92, 88]

// Map to formatted string labels
const labels = passingScores.map(s => \`Score: \${s}%\`);

// Reduce to calculate class average
const totalSum = scores.reduce((sum, current) => sum + current, 0);
const average = totalSum / scores.length; // 74
\`\`\``,
                whyWeUseIt: "Functional array methods avoid error-prone manual \`for\` loop counters, keeping code declarative, readable, and immutable.",
                syntax: `const newArray = array.map(item => item * 2);\nconst filtered = array.filter(item => item > 10);\nconst sum = array.reduce((acc, curr) => acc + curr, 0);`,
                codeExample: `// Processing Student Enrollment Data\nconst students = [\n  { name: "Priya", domain: "Data Analytics", score: 92 },\n  { name: "Arun", domain: "Full Stack", score: 68 },\n  { name: "Elena", domain: "Full Stack", score: 85 }\n];\n\n// 1. Filter Full Stack students\nconst fullStackStudents = students.filter(st => st.domain === "Full Stack");\n\n// 2. Map student names to uppercase\nconst studentNames = fullStackStudents.map(st => st.name.toUpperCase());\nconsole.log(studentNames); // ["ARUN", "ELENA"]\n\n// 3. Compute domain average score\nconst totalDomainScore = fullStackStudents.reduce((acc, st) => acc + st.score, 0);\nconst avgScore = totalDomainScore / fullStackStudents.length;\nconsole.log(\`Full Stack Average Score: \${avgScore}\`); // 76.5`,
                lineByLineExplanation: [
                  "students.filter(st => st.domain === 'Full Stack'): Filters array returning only objects matching the domain condition.",
                  "fullStackStudents.map(st => st.name.toUpperCase()): Extracts name property and converts string to uppercase.",
                  "reduce((acc, st) => acc + st.score, 0): Accumulates numeric score values starting from initial accumulator value 0."
                ],
                realWorldUseCase: "Web dashboards filter raw backend transaction arrays by date ranges and map numeric amounts into formatted currency strings for financial summaries.",
                commonMistakes: [
                  "Mutating the original array inside .map() instead of returning a new value.",
                  "Forgetting to supply an initialValue parameter to .reduce() (causes errors on empty arrays)."
                ],
                bestPractices: [
                  "Use const for array declarations to enforce reference immutability.",
                  "Chain array methods cleanly (.filter().map()) for concise data pipelines."
                ],
                practiceTask: {
                  title: "Array Filter & Map Exercise",
                  instruction: "Given an array of numbers [12, 45, 8, 23, 56], filter out numbers less than 20 and return an array with remaining numbers multiplied by 2.",
                  hint: "Use .filter(n => n >= 20).map(n => n * 2).",
                  starterCode: `const numbers = [12, 45, 8, 23, 56];\nfunction transformNumbers(arr) {\n  // Write filter and map logic\n  return [];\n}`,
                  solutionCode: `const numbers = [12, 45, 8, 23, 56];\nfunction transformNumbers(arr) {\n  return arr.filter(n => n >= 20).map(n => n * 2);\n}`
                },
                quiz: [
                  {
                    id: "qjs1",
                    question: "Which JavaScript array method returns a brand new array with transformed elements?",
                    options: [".forEach()", ".map()", ".push()", ".find()"],
                    correctAnswer: 1,
                    explanation: ".map() iterates through an array and returns a new transformed array without modifying the original."
                  }
                ]
              }
            ],
            moduleTest: {
              title: "Module 4.1 Test: JavaScript Fundamentals",
              questions: [
                {
                  id: "js-mt1",
                  question: "What value is returned by arr.filter() if no items satisfy the test condition?",
                  options: ["null", "undefined", "An empty array []", "false"],
                  correctAnswer: 2,
                  explanation: "filter() always returns an array; if no elements match, it returns an empty array []."
                }
              ]
            }
          }
        ]
      }
    ],
    projects: [
      {
        id: "proj-fs-saas",
        title: "Full Stack AI Learning Management System (LMS)",
        difficulty: "Advanced",
        skillsUsed: ["React", "Node.js", "Express", "PostgreSQL", "Tailwind CSS", "JWT"],
        problemStatement: "Build a complete multi-user learning management platform allowing students to browse courses, read digital textbooks, track progress, attempt quizzes, and generate PDF certificates.",
        requirements: [
          "Implement JWT user registration & authentication flow",
          "Create dynamic course syllabus reader interface with LocalStorage fallback",
          "Build interactive quiz engine with instant score calculations",
          "Design responsive dashboard with completion progress metrics"
        ],
        expectedOutput: "Production web application hosted on Vercel/Render with continuous integration pipeline.",
        stepByStepTasks: [
          "Initialize React frontend with CSS design tokens",
          "Create Express REST API routes for /api/courses and /api/quiz",
          "Set up PostgreSQL database schema for users and course progress",
          "Connect frontend state hooks to REST endpoints",
          "Deploy client to Vercel and server to Render"
        ]
      }
    ],
    finalAssessment: {
      title: "Full Stack Development Final Comprehensive Certification Exam",
      totalQuestions: 10,
      passPercentage: 80,
      questions: [
        {
          id: "fa-1",
          question: "Which HTTP status code signifies a resource was successfully created on the server?",
          options: ["200 OK", "201 Created", "400 Bad Request", "500 Internal Error"],
          correctAnswer: 1,
          explanation: "HTTP 201 Created indicates successful server-side resource creation."
        },
        {
          id: "fa-2",
          question: "What CSS property ensures padding and border dimensions are included inside an element's specified width?",
          options: ["box-sizing: border-box", "display: flex", "position: absolute", "overflow: hidden"],
          correctAnswer: 0,
          explanation: "box-sizing: border-box prevents element width expansion when padding or borders are added."
        }
      ]
    }
  },

  "data-analytics": {
    id: "data-analytics",
    title: "Data Analytics",
    category: "Data Analytics",
    level: "Beginner",
    estimatedDuration: "140 Hours (14 Weeks)",
    icon: "📊",
    bannerGradient: "linear-gradient(135deg, #065f46 0%, #059669 50%, #0284c7 100%)",
    shortDescription: "Complete in-house Data Analytics textbook covering Excel, XLOOKUP, Pivot Tables, Business Statistics, SQL, Python (Pandas/NumPy), Data Viz & Power BI DAX.",
    fullDescription: "Master Data Analytics from business problem framing to executive dashboard design. Includes detailed written textbook modules, formulas, SQL query breakdowns, Pandas data manipulation, DAX calculations, quizzes, and real-world case study projects.",
    skillsCovered: ["Excel Formulas", "XLOOKUP/Pivot", "Business Statistics", "SQL Querying", "Python", "Pandas & NumPy", "Matplotlib & Seaborn", "Power BI", "DAX"],
    careerOpportunities: ["Data Analyst", "Business Intelligence Analyst", "Analytics Specialist", "Reporting Analyst"],
    sections: [
      {
        id: "sec-excel",
        title: "Section 1: Advanced Excel for Data Analytics",
        description: "Master cell referencing, logical formulas (IF, SUMIFS, COUNTIFS), lookup functions (XLOOKUP, INDEX/MATCH), Pivot Tables, Slicers, and Dynamic Dashboards.",
        modules: [
          {
            id: "mod-excel-1",
            title: "Module 1.1 — Excel Formulas, XLOOKUP & Pivot Tables",
            description: "Detailed textbook guide to writing lookup formulas and building summary pivot tables.",
            lessons: [
              {
                id: "les-ex-1-1",
                title: "Mastering XLOOKUP & Conditional Aggregations (SUMIFS/COUNTIFS)",
                duration: "35 min",
                overview: "Learn how to match data vertically and calculate criteria-based aggregations in Microsoft Excel.",
                explanation: `Excel is the foundational data manipulation tool used across global business enterprises.

### 1. Conditional Aggregation Formulas
- **SUMIFS(sum_range, criteria_range1, criteria1, ...)**: Sums values in cells that meet multiple specified criteria.
- **COUNTIFS(criteria_range1, criteria1, ...)**: Counts the number of cells that satisfy multiple conditions.

\`\`\`excel
=SUMIFS(Sales[Revenue], Sales[Region], "North", Sales[Year], 2026)
\`\`\`

### 2. XLOOKUP (The Modern VLOOKUP Replacement)
XLOOKUP searches a range or array and returns an item corresponding to the first match found:

\`\`\`excel
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode])

Example:
=XLOOKUP(A2, Employees[ID], Employees[Department], "Employee Not Found")
\`\`\`

### Why XLOOKUP Beats VLOOKUP:
1. Searches both left and right (VLOOKUP can only search columns to the right of lookup column).
2. Defaults to exact match (eliminates VLOOKUP False match errors).
3. Does not break when columns are inserted or deleted in source tables.`,
                whyWeUseIt: "XLOOKUP automates table merging across multiple sheets without manual copy-paste errors.",
                syntax: `=XLOOKUP(Lookup_Val, Lookup_Range, Return_Range, "Not Found")\n=SUMIFS(Sum_Range, Criteria_Range, "Criteria")`,
                codeExample: `// Formula Example in Excel Grid Sheet:\nCell B2 (Customer ID): 1045\nCell C2 (Formula): =XLOOKUP(B2, Customers[ID], Customers[Email], "No Email Found")\nResult: priya.sharma@velfire.com\n\nCell D2 (Total Spend Formula): =SUMIFS(Orders[Amount], Orders[CustomerID], B2, Orders[Status], "Completed")\nResult: \$4,250.00`,
                lineByLineExplanation: [
                  "B2: Lookup customer ID value to match.",
                  "Customers[ID]: Array range containing customer keys.",
                  "Customers[Email]: Return array range containing emails.",
                  "'No Email Found': Default fallback text if key is missing."
                ],
                realWorldUseCase: "Financial analysts combine regional sales sheets with master customer lists using XLOOKUP to generate monthly executive commission reports.",
                commonMistakes: [
                  "Mismatched array range sizes in XLOOKUP (e.g. lookup array has 100 rows while return array has 90 rows throws #VALUE! error).",
                  "Forgetting absolute cell locks ($A$1) when dragging formulas across grid cells."
                ],
                bestPractices: [
                  "Format data grids as official Excel Tables (Ctrl + T) to enable structured column referencing.",
                  "Always supply the optional [if_not_found] parameter in XLOOKUP."
                ],
                practiceTask: {
                  title: "XLOOKUP Formula Writing Task",
                  instruction: "Write an Excel formula using XLOOKUP to find the Salary of an employee with ID 502 from a lookup table where IDs are in column A and Salaries are in column D.",
                  hint: "=XLOOKUP(502, A:A, D:D).",
                  starterCode: `=XLOOKUP(...)`,
                  solutionCode: `=XLOOKUP(502, A:A, D:D, "Not Found")`
                },
                quiz: [
                  {
                    id: "qex1",
                    question: "What happens by default in XLOOKUP if a match is not found and no 'if_not_found' text is supplied?",
                    options: ["Returns #N/A error", "Returns 0", "Returns blank", "Deletes cell"],
                    correctAnswer: 0,
                    explanation: "Without supplying an explicit 'if_not_found' fallback parameter, XLOOKUP defaults to returning #N/A."
                  }
                ]
              }
            ],
            moduleTest: {
              title: "Module 1.1 Test: Excel Analytics Formulas",
              questions: [
                {
                  id: "ex-mt1",
                  question: "Which formula sums sales values in Range B for rows where Region in Range A is 'West'?",
                  options: [
                    "=SUMIFS(B:B, A:A, 'West')",
                    "=VLOOKUP('West', A:B, 2)",
                    "=COUNTIF(A:A, 'West')",
                    "=AVERAGE(B:B)"
                  ],
                  correctAnswer: 0,
                  explanation: "=SUMIFS(sum_range, criteria_range, criteria) sums B:B where A:A equals 'West'."
                }
              ]
            }
          }
        ]
      }
    ],
    projects: [
      {
        id: "proj-da-dash",
        title: "Executive Retail Sales & Retention Analytics Dashboard",
        difficulty: "Intermediate",
        skillsUsed: ["Excel", "SQL", "Python Pandas", "Power BI", "DAX"],
        problemStatement: "Analyze 50,000 retail transaction records to identify top revenue regional markets, customer churn rates, and seasonal product trends.",
        requirements: [
          "Query SQL transaction database to aggregate monthly sales data",
          "Clean missing values and remove duplicates using Python Pandas",
          "Build Power BI Star Schema data model connecting Orders, Customers, and Products",
          "Write DAX measures for Year-over-Year (YoY) growth percentage"
        ],
        expectedOutput: "Interactive Power BI dashboard report with executive KPI summary cards.",
        stepByStepTasks: [
          "Run SQL data extraction script",
          "Execute Pandas cleaning script",
          "Import cleaned tables to Power BI Desktop",
          "Create DAX measures",
          "Publish report"
        ]
      }
    ],
    finalAssessment: {
      title: "Data Analytics Final Professional Certification Exam",
      totalQuestions: 5,
      passPercentage: 80,
      questions: [
        {
          id: "da-fa1",
          question: "Which chart is best suited for visual correlation analysis between two continuous numerical variables?",
          options: ["Scatter Plot", "Pie Chart", "Donut Chart", "Treemap"],
          correctAnswer: 0,
          explanation: "Scatter plots visualize relationships and linear correlation between two continuous numeric variables."
        }
      ]
    }
  }
};
