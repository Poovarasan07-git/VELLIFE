// src/data/coursesData.js

export const COURSE_CATEGORIES = [
  "All",
  "Full Stack Development",
  "Data Analytics",
  "Artificial Intelligence & Machine Learning",
  "Python",
  "SQL",
  "Cloud Computing",
  "Cybersecurity",
  "UI/UX Design",
  "Business Analytics",
  "SAP"
];

export const DIFFICULTY_LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

export const CAREER_COURSE_RECOMMENDATIONS = {
  "Full Stack Development": ["fullstack-web", "react-js", "fastapi-python", "sql-analytics", "python-prog"],
  "Data Analyst": ["excel-analytics", "sql-analytics", "python-prog", "power-bi", "business-analytics"],
  "Data Science": ["python-prog", "sql-analytics", "ml-fundamentals", "excel-analytics", "power-bi"],
  "AI/ML Engineering": ["python-prog", "ml-fundamentals", "fastapi-python", "sql-analytics", "cloud-fundamentals"],
  "Backend Development": ["fastapi-python", "python-prog", "sql-analytics", "fullstack-web", "cloud-fundamentals"],
  "Cloud Engineering": ["cloud-fundamentals", "cybersecurity-fundamentals", "python-prog", "fastapi-python"],
  "Cybersecurity": ["cybersecurity-fundamentals", "cloud-fundamentals", "python-prog", "sql-analytics"],
  "UI/UX Design": ["uiux-design", "fullstack-web", "react-js", "business-analytics"],
  "SAP Consultant": ["sap-fundamentals", "business-analytics", "sql-analytics", "excel-analytics"],
  "Business Analyst": ["business-analytics", "excel-analytics", "sql-analytics", "power-bi", "python-prog"]
};

export const COURSES_DATA = [
  {
    id: "python-prog",
    title: "Python Programming",
    category: "Python",
    level: "Beginner",
    estimatedDuration: "10 Hours",
    shortDescription: "Master Python fundamentals from variables to OOP and file handling with hands-on projects.",
    fullDescription: "Python is the most versatile and beginner-friendly programming language in the world. Used extensively in Web Development, Data Science, AI, and Automation, this course takes you from zero programming experience to building functional Python applications.",
    instructor: {
      name: "Dr. Aris Thorne",
      title: "Senior AI Engineer & Educator",
      avatar: "👨‍🏫"
    },
    icon: "🐍",
    bannerGradient: "linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)",
    learningObjectives: [
      "Understand core Python syntax, indentation, and variable assignment",
      "Work fluently with strings, numbers, Booleans, and type conversion",
      "Master conditional logic (if/elif/else) and control flow",
      "Iterate over data structures with for and while loops",
      "Organize data using Lists, Tuples, Sets, and Dictionaries",
      "Write clean, modular, and reusable Python functions",
      "Understand Object-Oriented Programming (OOP) concepts like Classes and Inheritance",
      "Handle files and handle exceptions gracefully using try-except",
      "Build a complete interactive CLI application from scratch"
    ],
    skills: ["Python 3", "Data Structures", "OOP", "Debugging", "File I/O", "Algorithm Design"],
    modules: [
      {
        id: "py-m1",
        title: "Module 1 – Introduction to Python",
        description: "Get started with Python syntax, execution model, and writing your first script.",
        lessons: [
          {
            id: "py-m1-l1",
            title: "What is Python?",
            duration: "10 min",
            content: "Python is an interpreted, high-level, general-purpose programming language. Created by Guido van Rossum and released in 1991, Python emphasizes code readability with its distinctive use of significant whitespace.",
            realWorldExample: "Tech giants like Google, Instagram, Netflix, and Spotify rely on Python for data analysis, streaming recommendation engines, and backend microservices.",
            codeSnippet: `# Welcome to Python!\nprint("Hello, WILDFIRE Learner!")\nprint("Python makes programming readable and powerful.")`,
            keyPoints: [
              "Python is interpreted — code executes line-by-line without explicit compilation.",
              "Dynamically typed — variables take types automatically based on assigned values.",
              "Huge ecosystem of third-party libraries (PyPI)."
            ],
            practiceTask: "Write a Python statement that prints your name and your career target to the console."
          },
          {
            id: "py-m1-l2",
            title: "Installing Python & Environment Setup",
            duration: "15 min",
            content: "To run Python on your computer, you install the Python 3 interpreter and an Integrated Development Environment (IDE) like VS Code or PyCharm.",
            realWorldExample: "Setting up virtual environments (venv) ensures your project dependencies don't conflict with system packages.",
            codeSnippet: `# Check Python version in terminal:\n# python --version\n\n# Create a virtual environment:\n# python -m venv venv`,
            keyPoints: [
              "Always use Python 3.x (Python 2 is obsolete).",
              "Use virtual environments to isolate dependencies.",
              "VS Code with the Python Extension provides auto-completion and linting."
            ],
            practiceTask: "Create a project folder named 'my_first_python' and verify your Python environment."
          },
          {
            id: "py-m1-l3",
            title: "Python Syntax & Indentation Rules",
            duration: "15 min",
            content: "Unlike C++ or Java which use curly braces {} to define code blocks, Python uses whitespace indentation. Consistent 4-space indentation is required.",
            realWorldExample: "Clean indentation forces developers to write readable code that team members can inspect effortlessly.",
            codeSnippet: `if True:\n    print("Indented block 1")\n    if 5 > 2:\n        print("Nested indented block 2")`,
            keyPoints: [
              "Standard indentation is 4 spaces (do not mix tabs and spaces).",
              "Colons (:) indicate the start of an indented block.",
              "Comments start with the '#' symbol."
            ],
            practiceTask: "Fix an IndentationError by aligning nested print statements properly."
          },
          {
            id: "py-m1-l4",
            title: "Your First Python Program",
            duration: "20 min",
            content: "Let's combine input and output to build an interactive command-line greeting script.",
            realWorldExample: "Interactive CLI tools gather user parameters before executing automation tasks.",
            codeSnippet: `user_name = input("Enter your name: ")\nprint("Welcome to VELFIRE Courses, " + user_name + "!")`,
            keyPoints: [
              "input() reads string data from user input.",
              "print() outputs values to standard output.",
              "Strings can be concatenated with the + operator."
            ],
            practiceTask: "Prompt the user for their favorite technology and print a personalized motivation sentence."
          }
        ]
      },
      {
        id: "py-m2",
        title: "Module 2 – Variables & Data Types",
        description: "Understand variables, primitive types (String, Int, Float, Bool), and type conversion.",
        lessons: [
          {
            id: "py-m2-l1",
            title: "Variables in Python",
            duration: "15 min",
            content: "Variables are named containers used to store data in memory. Python variables do not require explicit type declarations.",
            realWorldExample: "Storing user session tokens, cart items, or score tallies in memory while an application runs.",
            codeSnippet: `age = 22\nuser_score = 98.5\nis_enrolled = True\nstudent_name = "Alex"`,
            keyPoints: [
              "Variable names should use snake_case in Python (e.g., student_name).",
              "Variable names are case-sensitive (Score != score).",
              "Variables are assigned using the single equals sign '='."
            ],
            practiceTask: "Declare variables for item name, quantity, price per unit, and calculate total cost."
          },
          {
            id: "py-m2-l2",
            title: "Strings & String Manipulation",
            duration: "20 min",
            content: "Strings are sequences of characters wrapped in single or double quotes. Python provides rich string formatting methods like f-strings.",
            realWorldExample: "Dynamic UI message rendering and formatting email notifications.",
            codeSnippet: `course = "Python Programming"\nprint(course.upper())\nprint(f"Enrolled in: {course} - Total modules: 10")`,
            keyPoints: [
              "Use f-strings (f'...') for readable string interpolation.",
              "Methods like .upper(), .lower(), .strip(), .replace() make string operations simple.",
              "Strings are immutable in Python."
            ],
            practiceTask: "Take a raw input string with extra spaces and format it into clean Title Case."
          },
          {
            id: "py-m2-l3",
            title: "Numbers & Mathematical Operations",
            duration: "15 min",
            content: "Python supports integers (int), floating-point numbers (float), and complex numbers, along with built-in math capabilities.",
            realWorldExample: "Calculating order totals, discounts, financial metrics, and statistics.",
            codeSnippet: `price = 199.99\ndiscount_pct = 0.15\nfinal_price = price * (1 - discount_pct)\nprint(f"Final Price: \${final_price:.2f}")`,
            keyPoints: [
              "int represents whole numbers; float represents decimals.",
              "Use round(value, decimals) to round float results.",
              "Python handles arbitrarily large integers automatically without overflow."
            ],
            practiceTask: "Calculate compound interest for a principal amount over 3 years."
          },
          {
            id: "py-m2-l4",
            title: "Booleans & Type Conversion",
            duration: "15 min",
            content: "Booleans represent truth values (True or False). Type casting functions (int(), float(), str(), bool()) convert between data types.",
            realWorldExample: "Parsing string input from web forms into numbers for backend calculation.",
            codeSnippet: `str_num = "42"\nint_num = int(str_num)\nprint(type(int_num)) # Output: <class 'int'>`,
            keyPoints: [
              "Always convert string input() values to int() or float() before mathematical operations.",
              "Empty strings, 0, None, and empty lists evaluate to False in boolean context.",
              "Non-empty values evaluate to True."
            ],
            practiceTask: "Prompt the user for their birth year as string, convert it to integer, and compute current age."
          }
        ]
      },
      {
        id: "py-m3",
        title: "Module 3 – Operators",
        description: "Master arithmetic, comparison, logical, and assignment operators.",
        lessons: [
          {
            id: "py-m3-l1",
            title: "Arithmetic & Assignment Operators",
            duration: "15 min",
            content: "Operators perform operations on variables and values. Common arithmetic operators include +, -, *, /, // (floor division), % (modulo), and ** (exponentiation).",
            realWorldExample: "Modulo (%) is used to check even/odd numbers or cycle through dashboard pages.",
            codeSnippet: `x = 10\nx += 5 # Assignment operator (x = x + 5)\nremainder = 17 % 5 # Output: 2\npower = 2 ** 3 # Output: 8`,
            keyPoints: [
              "/ always returns a float (10 / 2 = 5.0).",
              "// performs floor division (10 // 3 = 3).",
              "Operators follow standard PEMDAS precedence."
            ],
            practiceTask: "Compute exponentiation of 5 to the power 4 and check the remainder of 45 divided by 7."
          },
          {
            id: "py-m3-l2",
            title: "Comparison & Logical Operators",
            duration: "15 min",
            content: "Comparison operators (==, !=, >, <, >=, <=) evaluate expressions to Booleans. Logical operators (and, or, not) combine multiple conditions.",
            realWorldExample: "Checking if a user is logged in AND has premium subscription status before granting access.",
            codeSnippet: `score = 85\nhas_passed = score >= 80 and score <= 100\nprint(f"Passed Gate: {has_passed}")`,
            keyPoints: [
              "Use '==' for equality comparison ('=' is for assignment).",
              "'and' requires both conditions to be True.",
              "'or' requires at least one condition to be True."
            ],
            practiceTask: "Write a condition checking if age >= 18 and has_id is True."
          }
        ]
      },
      {
        id: "py-m4",
        title: "Module 4 – Conditional Statements",
        description: "Branching execution flow using if, elif, else, and nested logic.",
        lessons: [
          {
            id: "py-m4-l1",
            title: "The if, elif, and else Structure",
            duration: "20 min",
            content: "Conditional statements execute specific code blocks depending on whether boolean expressions evaluate to True or False.",
            realWorldExample: "Assigning letter grades (A, B, C, D, F) based on student numerical exam scores.",
            codeSnippet: `score = 88\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelif score >= 70:\n    grade = "C"\nelse:\n    grade = "F"\nprint(f"Grade: {grade}")`,
            keyPoints: [
              "Conditions are evaluated top to bottom; execution stops at the first True branch.",
              "elif (short for else if) handles multiple exclusive options.",
              "else catches all remaining unhandled cases."
            ],
            practiceTask: "Write a weather indicator script that recommends clothing based on temperature."
          },
          {
            id: "py-m4-l2",
            title: "Nested Conditions & Ternary Operators",
            duration: "15 min",
            content: "Conditions can be nested inside other conditions, or written in concise single-line ternary expressions.",
            realWorldExample: "Verifying user credentials first, then checking account permission levels.",
            codeSnippet: `status = "Approved" if score >= 80 else "Pending Retake"\nprint(status)`,
            keyPoints: [
              "Ternary format: value_if_true if condition else value_if_false.",
              "Avoid nesting more than 2-3 levels deep to maintain readable code."
            ],
            practiceTask: "Rewrite an if-else check using a single-line ternary statement."
          }
        ]
      },
      {
        id: "py-m5",
        title: "Module 5 – Loops",
        description: "Iterate efficiently over datasets using for loops, while loops, break, and continue.",
        lessons: [
          {
            id: "py-m5-l1",
            title: "The for Loop & range() Function",
            duration: "20 min",
            content: "The for loop iterates over a sequence (such as a list, string, or range of numbers).",
            realWorldExample: "Processing rows in a spreadsheet or batch emailing course certificates.",
            codeSnippet: `for i in range(1, 6):\n    print(f"Module {i} Completed ✓")`,
            keyPoints: [
              "range(start, stop, step) generates sequence of numbers up to stop-1.",
              "Iterates through elements directly without explicit indexing.",
              "Enables simple repetitive task automation."
            ],
            practiceTask: "Write a for loop that calculates the sum of all numbers from 1 to 50."
          },
          {
            id: "py-m5-l2",
            title: "The while Loop & Control Keywords",
            duration: "20 min",
            content: "while loops continue running as long as a condition remains True. Use 'break' to exit early and 'continue' to skip iterations.",
            realWorldExample: "Keeping an interactive CLI program running until the user explicitly selects 'Quit'.",
            codeSnippet: `attempts = 0\nwhile attempts < 3:\n    attempts += 1\n    print(f"Attempt {attempts}")\n    if attempts == 2:\n        print("Target reached early!")\n        break`,
            keyPoints: [
              "Ensure the while condition eventually becomes False to prevent infinite loops.",
              "'break' immediately terminates the loop.",
              "'continue' skips remaining lines in current iteration and moves to next loop cycle."
            ],
            practiceTask: "Create a loop that asks the user to guess a secret number between 1 and 10."
          }
        ]
      },
      {
        id: "py-m6",
        title: "Module 6 – Collections",
        description: "Organize data using Lists, Tuples, Sets, and Dictionaries.",
        lessons: [
          {
            id: "py-m6-l1",
            title: "Lists & List Operations",
            duration: "25 min",
            content: "Lists are ordered, mutable collections of items. You can add, remove, slice, and sort elements effortlessly.",
            realWorldExample: "Storing user tasks, course module titles, or active order items.",
            codeSnippet: `skills = ["Python", "SQL", "React"]\nskills.append("FastAPI")\nskills.sort()\nprint(skills[0]) # First skill`,
            keyPoints: [
              "Lists use square brackets [].",
              "Zero-indexed: first element is list[0].",
              "Methods: .append(), .pop(), .remove(), .sort(), .reverse()."
            ],
            practiceTask: "Create a list of 5 course names, add a 6th course, remove the 2nd course, and sort alphabetically."
          },
          {
            id: "py-m6-l2",
            title: "Tuples & Sets",
            duration: "15 min",
            content: "Tuples are immutable (read-only) ordered sequences. Sets are unordered collections of unique elements with fast lookup.",
            realWorldExample: "Using sets to deduplicate a list of email addresses.",
            codeSnippet: `coordinates = (12.9716, 77.5946) # Tuple\nunique_tags = {"python", "sql", "python"} # Set -> {"python", "sql"}`,
            keyPoints: [
              "Tuples use parentheses (); values cannot be changed after creation.",
              "Sets use curly braces {}; automatically strip duplicate values.",
              "Set operations include union (|), intersection (&), and difference (-)."
            ],
            practiceTask: "Remove duplicates from a list containing ['Python', 'Java', 'Python', 'C++', 'SQL']."
          },
          {
            id: "py-m6-l3",
            title: "Dictionaries & Key-Value Pairs",
            duration: "25 min",
            content: "Dictionaries store data in key-value pairs. They provide extremely fast lookup by key.",
            realWorldExample: "Representing JSON user profiles, course data, and config settings.",
            codeSnippet: `student = {\n    "name": "Priya",\n    "domain": "Data Analytics",\n    "completed_modules": 4\n}\nprint(student["name"])\nstudent["completed_modules"] += 1`,
            keyPoints: [
              "Dictionaries use curly braces with key: value pairs.",
              "Keys must be unique and immutable (strings, numbers).",
              "Access values safely using student.get('key', default_value)."
            ],
            practiceTask: "Create a dictionary storing course details (title, modules, level, duration) and print formatted attributes."
          }
        ]
      },
      {
        id: "py-m7",
        title: "Module 7 – Functions",
        description: "Write modular code with parameters, return values, scope, and docstrings.",
        lessons: [
          {
            id: "py-m7-l1",
            title: "Defining & Calling Functions",
            duration: "20 min",
            content: "Functions are reusable blocks of code that execute when called. Defined using the 'def' keyword.",
            realWorldExample: "Encapsulating discount calculations or score grading into reusable utilities.",
            codeSnippet: `def calculate_progress(completed, total):\n    \"\"\"Calculate completion percentage.\"\"\"\n    percentage = (completed / total) * 100\n    return round(percentage, 1)\n\nprog = calculate_progress(7, 10)\nprint(f"Course Progress: {prog}%")`,
            keyPoints: [
              "Use descriptive function names in snake_case.",
              "'return' sends the output value back to caller.",
              "Use triple-quoted docstrings to document function purpose."
            ],
            practiceTask: "Write a function 'format_user_name' that takes first and last name and returns 'Lastname, Firstname'."
          },
          {
            id: "py-m7-l2",
            title: "Parameters, Default Args & Scope",
            duration: "20 min",
            content: "Functions accept arguments, default values, and operate within local versus global scope.",
            realWorldExample: "Configuring default HTTP timeouts or default pagination limits.",
            codeSnippet: `def greet_learner(name, platform="WILDFIRE"):\n    return f"Welcome {name} to {platform}!"\n\nprint(greet_learner("Arun"))`,
            keyPoints: [
              "Default arguments allow functions to be called with fewer arguments.",
              "Variables created inside a function exist only in local scope.",
              "Avoid mutating global variables directly inside functions."
            ],
            practiceTask: "Create a function that calculates total bill amount with a default tax rate parameter of 18%."
          }
        ]
      },
      {
        id: "py-m8",
        title: "Module 8 – Object-Oriented Programming",
        description: "Master OOP principles: Classes, Objects, Constructors, Methods, and Inheritance.",
        lessons: [
          {
            id: "py-m8-l1",
            title: "Classes, Objects & __init__",
            duration: "25 min",
            content: "OOP models real-world entities into objects containing data (attributes) and behavior (methods).",
            realWorldExample: "Designing user accounts, shopping carts, or course models in enterprise backend platforms.",
            codeSnippet: `class Course:\n    def __init__(self, title, modules):\n        self.title = title\n        self.modules = modules\n        self.completed = 0\n\n    def mark_module_done(self):\n        if self.completed < self.modules:\n            self.completed += 1\n\npy_course = Course("Python Programming", 10)\npy_course.mark_module_done()\nprint(py_course.completed) # 1`,
            keyPoints: [
              "A Class is a blueprint; an Object is an instance of that blueprint.",
              "__init__ is the constructor method initialized on object creation.",
              "'self' refers to the current instance of the class."
            ],
            practiceTask: "Define a Student class with attributes (name, age, domain) and a method 'get_summary()'."
          },
          {
            id: "py-m8-l2",
            title: "Inheritance & Polymorphism",
            duration: "20 min",
            content: "Inheritance allows a child class to inherit attributes and methods from a parent class, promoting code reuse.",
            realWorldExample: "Creating specialized User classes (e.g. AdminUser, InstructorUser, StudentUser) inheriting from BaseUser.",
            codeSnippet: `class PremiumCourse(Course):\n    def __init__(self, title, modules, certificate_included=True):\n        super().__init__(title, modules)\n        self.certificate_included = certificate_included`,
            keyPoints: [
              "Use super().__init__() to call parent class initialization.",
              "Child classes can override parent methods to customize behavior.",
              "Polymorphism allows different objects to respond to the same method call."
            ],
            practiceTask: "Create a parent class 'Vehicle' and a child class 'ElectricCar' with extra battery attribute."
          }
        ]
      },
      {
        id: "py-m9",
        title: "Module 9 – File Handling & Error Handling",
        description: "Read/write local files and handle runtime exceptions cleanly.",
        lessons: [
          {
            id: "py-m9-l1",
            title: "Reading & Writing Files",
            duration: "20 min",
            content: "Python provides built-in functions to open, read, write, and append text/JSON files on disk.",
            realWorldExample: "Exporting analytics report logs or loading saved user configuration files.",
            codeSnippet: `with open("log.txt", "w") as file:\n    file.write("User completed Python Module 9\\n")\n\nwith open("log.txt", "r") as file:\n    content = file.read()\n    print(content)`,
            keyPoints: [
              "Use the 'with open(...) as f:' pattern — it automatically closes files after operations finish.",
              "File modes: 'r' (read), 'w' (write/overwrite), 'a' (append).",
              "JSON data can be converted with json.loads() and json.dumps()."
            ],
            practiceTask: "Write a script that appends user action logs with timestamps into a local text file."
          },
          {
            id: "py-m9-l2",
            title: "Exception Handling with try-except",
            duration: "20 min",
            content: "Exception handling prevents application crashes when unexpected errors occur during execution.",
            realWorldExample: "Catching invalid numerical inputs or handling network connection drops gracefully.",
            codeSnippet: `try:\n    val = int(input("Enter number: "))\n    result = 100 / val\n    print(f"Result: {result}")\nexcept ValueError:\n    print("Error: Please enter a valid integer.")\nexcept ZeroDivisionError:\n    print("Error: Cannot divide by zero.")\nfinally:\n    print("Execution attempt finished.")`,
            keyPoints: [
              "Wrap error-prone operations inside 'try' blocks.",
              "Catch specific exception types (ValueError, ZeroDivisionError, FileNotFoundError).",
              "'finally' block executes regardless of whether an exception occurred."
            ],
            practiceTask: "Write a input prompt that catches invalid numeric age inputs and asks the user to try again."
          }
        ]
      },
      {
        id: "py-m10",
        title: "Module 10 – Capstone Mini Project",
        description: "Combine everything you learned to build an interactive CLI Expense & Progress Tracker.",
        lessons: [
          {
            id: "py-m10-l1",
            title: "Project Architecture & Requirements",
            duration: "30 min",
            content: "Build a complete command-line task manager application that stores user progress, logs items, calculates completion metrics, and saves data to disk.",
            realWorldExample: "Building practical automation scripts and micro-utilities for software development workflows.",
            codeSnippet: `class TaskTracker:\n    def __init__(self):\n        self.tasks = []\n\n    def add_task(self, name):\n        self.tasks.append({"name": name, "done": False})\n        print(f"Added task: {name}")\n\n    def show_tasks(self):\n        for idx, t in enumerate(self.tasks, 1):\n            status = "✓" if t["done"] else "✗"\n            print(f"{idx}. [{status}] {t['name']}")\n\ntracker = TaskTracker()\ntracker.add_task("Complete Python Capstone")\ntracker.show_tasks()`,
            keyPoints: [
              "Integrates variables, lists, dictionaries, loops, functions, OOP, and file I/O.",
              "Clean separation of data storage and user interaction loop.",
              "Serves as a portfolio-ready beginner Python project."
            ],
            practiceTask: "Extend the TaskTracker class to include a 'mark_completed(index)' method and write tasks to a JSON file."
          }
        ]
      }
    ]
  },
  {
    id: "sql-analytics",
    title: "SQL for Data Analytics",
    category: "SQL",
    level: "Beginner",
    estimatedDuration: "8 Hours",
    shortDescription: "Master relational database querying, SELECT, JOINs, Group By, Subqueries, and Window Functions.",
    fullDescription: "SQL is the universal language of data. Every Data Analyst, Business Analyst, and Software Engineer uses SQL to extract actionable business insights from relational databases like PostgreSQL, MySQL, and Snowflake.",
    instructor: {
      name: "Marcus Vance",
      title: "Lead Data Architect",
      avatar: "👨‍💻"
    },
    icon: "🗄️",
    bannerGradient: "linear-gradient(135deg, #065f46 0%, #059669 100%)",
    learningObjectives: [
      "Understand relational database structures, tables, rows, and columns",
      "Write SELECT queries with filtering (WHERE, LIKE, IN, BETWEEN)",
      "Aggregate metrics using COUNT, SUM, AVG, MIN, MAX and GROUP BY",
      "Combine data from multiple tables using INNER, LEFT, RIGHT, and FULL JOINs",
      "Write complex subqueries, Common Table Expressions (CTEs), and Window functions",
      "Solve real-world business analytics case studies"
    ],
    skills: ["SQL", "PostgreSQL", "Database Design", "Data Aggregation", "Joins", "CTEs"],
    modules: [
      {
        id: "sql-m1",
        title: "Module 1 – Introduction to SQL & Relational Databases",
        description: "Understand RDBMS concepts, tables, schemas, and basic SELECT queries.",
        lessons: [
          {
            id: "sql-m1-l1",
            title: "What is SQL & RDBMS?",
            duration: "15 min",
            content: "SQL (Structured Query Language) is used to communicate with Relational Database Management Systems (RDBMS). Data is structured into tables containing rows and columns with defined relationships.",
            realWorldExample: "E-commerce stores maintain connected tables for Users, Products, Orders, and Payments.",
            codeSnippet: `-- Query all columns from the users table\nSELECT * FROM users;`,
            keyPoints: ["Data is organized into tables.", "SQL keywords are case-insensitive by convention.", "Queries end with semicolons."],
            practiceTask: "Write a query to retrieve all fields from a table named 'courses'."
          }
        ]
      },
      {
        id: "sql-m2",
        title: "Module 2 – Filtering Data with WHERE",
        description: "Filter data using operators (=, !=, >, <, BETWEEN, IN, LIKE).",
        lessons: [
          {
            id: "sql-m2-l1",
            title: "WHERE Clause & Pattern Matching",
            duration: "20 min",
            content: "The WHERE clause filters query results to return only rows that satisfy specified criteria.",
            realWorldExample: "Finding active users from India who signed up in the last 30 days.",
            codeSnippet: `SELECT user_name, email, domain \nFROM students \nWHERE domain = 'Data Analytics' AND status = 'Active';`,
            keyPoints: ["Use LIKE '%pattern%' for wildcard text search.", "Use IN ('val1', 'val2') for multiple discrete matches.", "Combine conditions with AND / OR."],
            practiceTask: "Select all courses with level 'Beginner' and duration containing 'Hours'."
          }
        ]
      },
      {
        id: "sql-m3",
        title: "Module 3 – Aggregations & GROUP BY",
        description: "Summarize metrics using aggregate functions and GROUP BY / HAVING.",
        lessons: [
          {
            id: "sql-m3-l1",
            title: "COUNT, SUM, AVG & GROUP BY",
            duration: "25 min",
            content: "Aggregate functions compute single summary values across groups of rows.",
            realWorldExample: "Calculating total revenue per product category or average exam score per domain.",
            codeSnippet: `SELECT category, COUNT(*) AS total_courses, AVG(modules) AS avg_modules\nFROM courses\nGROUP BY category\nHAVING COUNT(*) >= 1;`,
            keyPoints: ["GROUP BY groups rows sharing common values.", "HAVING filters aggregated groups (WHERE filters individual rows).", "Use AS to alias column names."],
            practiceTask: "Find total number of students enrolled per career domain."
          }
        ]
      },
      {
        id: "sql-m4",
        title: "Module 4 – Combining Tables with JOINs",
        description: "Master INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.",
        lessons: [
          {
            id: "sql-m4-l1",
            title: "INNER JOIN & LEFT JOIN Fundamentals",
            duration: "25 min",
            content: "JOINs combine columns from two or more tables based on a related key column.",
            realWorldExample: "Linking customer profiles with their order history to generate invoice statements.",
            codeSnippet: `SELECT s.name, c.title, e.progress_pct\nFROM enrollments e\nJOIN students s ON e.student_id = s.id\nJOIN courses c ON e.course_id = c.id;`,
            keyPoints: ["INNER JOIN returns matching rows in both tables.", "LEFT JOIN returns all left table rows + matched right rows.", "Always specify clear join ON conditions."],
            practiceTask: "Write a LEFT JOIN query linking students to their active course certificates."
          }
        ]
      },
      {
        id: "sql-m5",
        title: "Module 5 – Subqueries & CTEs",
        description: "Write modular subqueries and Common Table Expressions (WITH clause).",
        lessons: [
          {
            id: "sql-m5-l1",
            title: "CTEs (WITH Clause)",
            duration: "20 min",
            content: "Common Table Expressions create temporary named result sets that make complex queries easy to read and debug.",
            realWorldExample: "Pre-aggregating monthly sales before computing month-over-month growth.",
            codeSnippet: `WITH HighProgressStudents AS (\n  SELECT student_id, AVG(progress) AS avg_prog\n  FROM enrollments\n  GROUP BY student_id\n)\nSELECT * FROM HighProgressStudents WHERE avg_prog >= 80;`,
            keyPoints: ["CTEs start with the WITH keyword.", "Improves query readability over deeply nested subqueries."],
            practiceTask: "Create a CTE that computes average course progress and select top-performing students."
          }
        ]
      },
      {
        id: "sql-m6",
        title: "Module 6 – String & Date Functions",
        description: "Transform text and calculate date intervals.",
        lessons: [
          {
            id: "sql-m6-l1",
            title: "Date Functions & Text Clean Up",
            duration: "20 min",
            content: "Extract years/months, calculate date differences, and format raw text strings.",
            realWorldExample: "Calculating days elapsed since student registration date.",
            codeSnippet: `SELECT student_name, DATE_PART('year', join_date) AS join_year\nFROM students;`,
            keyPoints: ["Functions like NOW(), DATE_TRUNC(), and DATE_PART().", "UPPER(), LOWER(), TRIM(), CONCAT() for string manipulation."],
            practiceTask: "Format student registration dates into 'YYYY-MM' format."
          }
        ]
      },
      {
        id: "sql-m7",
        title: "Module 7 – Window Functions",
        description: "Calculate running totals, rankings (RANK, DENSE_RANK), and lead/lag analytics.",
        lessons: [
          {
            id: "sql-m7-l1",
            title: "OVER() & ROW_NUMBER()",
            duration: "25 min",
            content: "Window functions perform calculations across a set of table rows related to the current row without collapsing the rows.",
            realWorldExample: "Ranking top students within each domain or calculating 7-day moving averages.",
            codeSnippet: `SELECT student_name, domain, score,\n       DENSE_RANK() OVER (PARTITION BY domain ORDER BY score DESC) AS domain_rank\nFROM mock_interviews;`,
            keyPoints: ["PARTITION BY divides rows into groups.", "ORDER BY specifies ranking order.", "Does not collapse individual rows like GROUP BY."],
            practiceTask: "Rank courses by number of enrolled students within each category."
          }
        ]
      },
      {
        id: "sql-m8",
        title: "Module 8 – Capstone SQL Case Study",
        description: "Solve a complete analytics case study querying enterprise database schema.",
        lessons: [
          {
            id: "sql-m8-l1",
            title: "Enterprise Learning Analytics Case Study",
            duration: "30 min",
            content: "Execute a multi-stage analytics script analyzing course retention, domain transition, and interview pass rates.",
            realWorldExample: "Delivering executive business dashboards from raw transactional databases.",
            codeSnippet: `-- Capstone Query\nSELECT c.category, COUNT(DISTINCT e.student_id) AS active_learners\nFROM courses c\nJOIN enrollments e ON c.id = e.course_id\nWHERE e.last_active >= NOW() - INTERVAL '30 days'\nGROUP BY c.category;`,
            keyPoints: ["Combines CTEs, JOINs, Window Functions, and GROUP BY.", "Portfolio centerpiece for Data Analytics interviews."],
            practiceTask: "Write a comprehensive SQL query summarizing category popularity and completion metrics."
          }
        ]
      }
    ]
  },
  {
    id: "excel-analytics",
    title: "Excel for Data Analytics",
    category: "Data Analytics",
    level: "Beginner",
    estimatedDuration: "7 Hours",
    shortDescription: "Master Excel data cleaning, XLOOKUP, Pivot Tables, Dynamic Charts, and Financial Dashboards.",
    fullDescription: "Microsoft Excel remains the fundamental tool for data manipulation, quick calculations, business reporting, and financial modeling in top companies worldwide.",
    instructor: {
      name: "Sarah Jenkins",
      title: "Senior Financial Analyst",
      avatar: "👩‍💼"
    },
    icon: "📊",
    bannerGradient: "linear-gradient(135deg, #15803d 0%, #16a34a 100%)",
    learningObjectives: [
      "Navigate advanced Excel shortcuts and ribbon features",
      "Clean raw datasets (Remove duplicates, TEXTSPLIT, TRIM)",
      "Master VLOOKUP, XLOOKUP, INDEX & MATCH lookup formulas",
      "Summarize complex data using Pivot Tables and Slicers",
      "Build dynamic interactive business dashboards with visual KPI cards"
    ],
    skills: ["Excel", "XLOOKUP", "Pivot Tables", "Data Viz", "Dashboards", "Data Cleaning"],
    modules: [
      {
        id: "ex-m1",
        title: "Module 1 – Excel Basics & Data Entry",
        description: "Cell references, formatting, and essential keyboard shortcuts.",
        lessons: [
          { id: "ex-m1-l1", title: "Ribbon & Cell References", duration: "15 min", content: "Master absolute ($A$1) and relative (A1) cell references.", realWorldExample: "Locking tax rate cells when calculating product pricing tables.", codeSnippet: `=A2 * $B$1`, keyPoints: ["F4 toggles absolute cell locking.", "Ctrl + Arrow keys for fast grid navigation."], practiceTask: "Create a formula that locks a commission percentage cell." }
        ]
      },
      {
        id: "ex-m2",
        title: "Module 2 – Formulas & Logical Functions",
        description: "IF, AND, OR, SUMIFS, COUNTIFS, AVERAGEIFS.",
        lessons: [
          { id: "ex-m2-l1", title: "Conditional Formulas (SUMIFS/COUNTIFS)", duration: "20 min", content: "Calculate conditional metrics across large tabular data.", realWorldExample: "Counting enrolled students who achieved over 80% score.", codeSnippet: `=SUMIFS(Revenue_Col, Region_Col, "North", Year_Col, 2026)`, keyPoints: ["SUMIFS syntax: range, criteria_range1, criteria1."], practiceTask: "Write a COUNTIFS formula counting completed courses in Python category." }
        ]
      },
      {
        id: "ex-m3",
        title: "Module 3 – Modern Lookup Functions (XLOOKUP & INDEX/MATCH)",
        description: "Replace legacy VLOOKUP with powerful XLOOKUP.",
        lessons: [
          { id: "ex-m3-l1", title: "XLOOKUP Fundamentals", duration: "20 min", content: "Look up values vertically or horizontally without column index constraints.", realWorldExample: "Pulling student names based on student IDs.", codeSnippet: `=XLOOKUP(Lookup_Value, Lookup_Array, Return_Array, "Not Found")`, keyPoints: ["XLOOKUP defaults to exact match.", "Can look up to the left of the lookup column."], practiceTask: "Write an XLOOKUP retrieving course duration using course ID." }
        ]
      },
      {
        id: "ex-m4",
        title: "Module 4 – Data Cleaning & Preparation",
        description: "Text tools, FLASH FILL, TRIM, CLEAN, and removing duplicates.",
        lessons: [
          { id: "ex-m4-l1", title: "Cleaning Unstructured Text", duration: "15 min", content: "Split combined names and clean messy spacing.", realWorldExample: "Standardizing email domain lists downloaded from web forms.", codeSnippet: `=TRIM(PROPER(A2))`, keyPoints: ["TRIM removes extra leading/trailing spaces.", "Flash Fill (Ctrl+E) detects text patterns automatically."], practiceTask: "Use Flash Fill to split full names into first and last name columns." }
        ]
      },
      {
        id: "ex-m5",
        title: "Module 5 – Pivot Tables & Slicers",
        description: "Create summary pivot tables and interactive visual slicers.",
        lessons: [
          { id: "ex-m5-l1", title: "Building Pivot Tables", duration: "25 min", content: "Drag and drop fields to analyze multi-dimensional sales datasets.", realWorldExample: "Grouping regional sales by product sub-category and month.", codeSnippet: `Pivot Fields: Rows = Category, Values = Sum of Sales, Columns = Quarter`, keyPoints: ["Refresh pivot tables when source data updates.", "Add Slicers for one-click visual filtering."], practiceTask: "Build a Pivot Table summarizing average course progress by domain." }
        ]
      },
      {
        id: "ex-m6",
        title: "Module 6 – Charts & Visualization",
        description: "Column charts, line trends, combo charts, and KPI cards.",
        lessons: [
          { id: "ex-m6-l1", title: "Professional Excel Visuals", duration: "20 min", content: "Design clean executive charts following data visualization best practices.", realWorldExample: "Presenting monthly retention trends to stakeholders.", codeSnippet: `Chart Type: Combo (Bar for Sales, Line for Growth % on Secondary Axis)`, keyPoints: ["Remove clutter (excess gridlines, redundant legends).", "Highlight key data points with callout colors."], practiceTask: "Create a clean bar chart highlighting top 5 most enrolled courses." }
        ]
      },
      {
        id: "ex-m7",
        title: "Module 7 – Dynamic Dashboard Capstone",
        description: "Assemble a fully interactive executive Excel dashboard.",
        lessons: [
          { id: "ex-m7-l1", title: "Building Executive KPI Dashboard", duration: "30 min", content: "Combine pivot tables, linked KPI cards, slicers, and custom formatting into a polished dashboard sheet.", realWorldExample: "Presenting monthly business health metrics in executive meetings.", codeSnippet: `=KPI Card Value Linked to Pivot Summary Cell`, keyPoints: ["Hide gridlines on dashboard sheet for a software look.", "Lock layout structure."], practiceTask: "Build an interactive Excel dashboard with 3 KPI cards and 2 sliced charts." }
        ]
      }
    ]
  },
  {
    id: "power-bi",
    title: "Power BI for Business Intelligence",
    category: "Data Analytics",
    level: "Intermediate",
    estimatedDuration: "8 Hours",
    shortDescription: "Connect data sources, build Power Query ETL pipelines, write DAX measures, and design interactive dashboards.",
    fullDescription: "Power BI is Microsoft's premier Business Intelligence platform. Learn to transform raw data into interactive, real-time reporting dashboards deployed on the cloud.",
    instructor: {
      name: "David Kim",
      title: "BI Solutions Architect",
      avatar: "👨‍💻"
    },
    icon: "📈",
    bannerGradient: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
    learningObjectives: [
      "Connect Power BI Desktop to SQL databases, Excel, and Web APIs",
      "Transform & clean data using Power Query Editor",
      "Build Star Schema data models with 1-to-many relationships",
      "Write DAX measures (CALCULATE, SUMX, YTD, Time Intelligence)",
      "Design interactive report pages with drillthrough and bookmarks"
    ],
    skills: ["Power BI", "DAX", "Power Query", "Data Modeling", "ETL", "Business Dashboards"],
    modules: [
      {
        id: "pbi-m1",
        title: "Module 1 – Power BI Desktop Overview",
        description: "Interface, building blocks, and connecting data sources.",
        lessons: [
          { id: "pbi-m1-l1", title: "Getting Started with Power BI", duration: "15 min", content: "Understand the Power BI ecosystem: Desktop, Service, and Mobile.", realWorldExample: "Enterprise reporting workflow from local data modeling to cloud distribution.", codeSnippet: `Connect -> Get Data -> Excel / SQL Server`, keyPoints: ["Power BI Desktop is free for local development.", "Three main views: Report, Data, Model."], practiceTask: "Import a sample CSV dataset into Power BI Desktop." }
        ]
      },
      {
        id: "pbi-m2",
        title: "Module 2 – Power Query & ETL",
        description: "Transforming, pivoting, and merging data streams.",
        lessons: [
          { id: "pbi-m2-l1", title: "Data Transformation Steps", duration: "20 min", content: "Clean column types, unpivot tables, and merge queries using M code.", realWorldExample: "Unpivoting monthly budget columns into normalized rows.", codeSnippet: `Table.UnpivotOtherColumns(Source, {"CategoryID"}, "Attribute", "Value")`, keyPoints: ["Every step is saved in the Applied Steps pane.", "Non-destructive transformations."], practiceTask: "Unpivot a wide quarterly sales table in Power Query Editor." }
        ]
      },
      {
        id: "pbi-m3",
        title: "Module 3 – Data Modeling & Star Schema",
        description: "Designing dimension and fact tables with relationships.",
        lessons: [
          { id: "pbi-m3-l1", title: "Star Schema Design", duration: "25 min", content: "Organize data into Fact tables (transactions) and Dimension tables (lookup metadata).", realWorldExample: "Connecting Fact_Orders to Dim_Customers and Dim_Date.", codeSnippet: `Relationship: Dim_Student[Student_ID] 1 -> * Fact_Enrollment[Student_ID]`, keyPoints: ["Prefer 1-to-Many single-direction filter relationships.", "Avoid Many-to-Many relationships where possible."], practiceTask: "Build a Star Schema connecting 3 dimension tables to 1 fact table." }
        ]
      },
      {
        id: "pbi-m4",
        title: "Module 4 – Introduction to DAX",
        description: "Calculated columns vs DAX Measures (SUM, AVERAGE, COUNTROWS).",
        lessons: [
          { id: "pbi-m4-l1", title: "Writing Your First DAX Measure", duration: "20 min", content: "DAX (Data Analysis Expressions) computes dynamic aggregations evaluated at filter runtime.", realWorldExample: "Calculating Total Enrolled Learners dynamically based on selected date filters.", codeSnippet: `TotalLearners = COUNTROWS(Enrollments)`, keyPoints: ["Measures save memory compared to calculated columns.", "Evaluated dynamically in filter context."], practiceTask: "Create a measure calculating Total Completed Modules." }
        ]
      },
      {
        id: "pbi-m5",
        title: "Module 5 – Advanced DAX (CALCULATE & Time Intelligence)",
        description: "Modifying filter context with CALCULATE and SAMEPERIODLASTYEAR.",
        lessons: [
          { id: "pbi-m5-l1", title: "The CALCULATE Function", duration: "25 min", content: "CALCULATE evaluates an expression in a context modified by filters.", realWorldExample: "Computing Year-over-Year (YoY) revenue growth %.", codeSnippet: `ActiveStudents = CALCULATE([TotalLearners], Dim_Status[Status] = "Active")`, keyPoints: ["CALCULATE is the most powerful function in DAX.", "Can override existing visual filters."], practiceTask: "Write a DAX measure computing course enrollments for the current year." }
        ]
      },
      {
        id: "pbi-m6",
        title: "Module 6 – Interactive Visualizations & Custom Formatting",
        description: "Bar charts, line trends, matrix visuals, tooltips, and slicers.",
        lessons: [
          { id: "pbi-m6-l1", title: "Designing Intuitive Visual Reports", duration: "20 min", content: "Configure visual interaction settings, cross-filtering, and customized tooltips.", realWorldExample: "Hovering over a domain bar chart to see instant top student breakdown.", codeSnippet: `Report Element: Custom Tooltip Page linked via Hover`, keyPoints: ["Maintain consistent color schemes across visuals.", "Use KPI cards for top-level business figures."], practiceTask: "Design a visual page featuring 3 KPI cards and 2 interactive slicers." }
        ]
      },
      {
        id: "pbi-m7",
        title: "Module 7 – Bookmarks, Buttons & Navigation",
        description: "Create app-like navigation experiences inside Power BI.",
        lessons: [
          { id: "pbi-m7-l1", title: "Creating Interactive Page Bookmarks", duration: "20 min", content: "Save visual states with bookmarks to create tabbed navigation within a single report page.", realWorldExample: "Toggling between Chart view and Detailed Table view with sleek buttons.", codeSnippet: `Bookmark Action: Select Visuals -> Assign to Button On Click`, keyPoints: ["Reduces clutter on report canvas.", "Delivers a modern web-app dashboard feel."], practiceTask: "Create a button that toggles between dark and light chart themes." }
        ]
      },
      {
        id: "pbi-m8",
        title: "Module 8 – Capstone BI Dashboard Project",
        description: "Build and publish an end-to-end Power BI report.",
        lessons: [
          { id: "pbi-m8-l1", title: "Publishing & Cloud Collaboration", duration: "30 min", content: "Publish report to Power BI Service, create automated refresh schedules, and export PDF summaries.", realWorldExample: "Automating weekly executive status emails sent to company leadership.", codeSnippet: `Power BI Service -> Workspace -> Schedule Refresh (Gateway)`, keyPoints: ["Automates manual reporting workloads.", "Enforces role-based security (RLS)."], practiceTask: "Assemble a multi-page Power BI dashboard portfolio project." }
        ]
      }
    ]
  },
  {
    id: "fullstack-web",
    title: "Full Stack Web Development (Enterprise & B.Tech R20 Curriculum)",
    category: "Full Stack Development",
    level: "Intermediate",
    estimatedDuration: "28 Hours",
    shortDescription: "Complete university-accredited & enterprise curriculum covering HTML5, CSS3, UNIX CLI, Git/GitHub, JavaScript OOP, Memory Management, AJAX/jQuery, React.js, Redux, Java Spring MVC, Maven, SQL Normalization, Spring JDBC, and Cloud Deployment.",
    fullDescription: "Master end-to-end full stack software engineering mapped to the official B.Tech Computer Science / Computational Intelligence curriculum (R20A0516) and modern enterprise industry standards. From web fundamentals and client-side programming to enterprise Java Spring backend architectures, database schemas, and cloud deployment pipelines.",
    instructor: {
      name: "Prof. Elena Rostova & Dr. Aris Thorne",
      title: "Principal Full Stack Architect & Academic Lead",
      avatar: "👩‍🏫"
    },
    icon: "🌐",
    bannerGradient: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    learningObjectives: [
      "Understand 2-tier and 3-tier web architectures, HTTP protocols, and client-server workflows",
      "Master semantic HTML5 documents, void/nested elements, tables, lists, and advanced validated forms",
      "Style responsive web applications using CSS selectors, the box model, flexbox, border effects, and buttons",
      "Navigate server shells via UNIX CLI commands and manage version control with Git & GitHub",
      "Master JavaScript core semantics, variable scoping, OOP with ES6 classes, and memory lifecycle/garbage collection",
      "Implement asynchronous data exchanges using AJAX (XMLHttpRequest), jQuery events, and JSON payloads",
      "Build single-page web applications using React components, Virtual DOM, React Router, and controlled forms",
      "Manage application-wide global state using Redux, actions, reducers, and async client-server communication",
      "Architect enterprise Java backend applications using Model View Controller (MVC) pattern and Spring Framework",
      "Design and consume RESTful APIs using Spring Boot and manage dependencies with Apache Maven",
      "Model relational database schemas, apply normalization (1NF-3NF/BCNF), and persist data with Spring JDBC",
      "Apply Agile/Scrum engineering principles and package/deploy applications to cloud environments"
    ],
    skills: [
      "HTML5 & Web Semantics",
      "CSS3 & Box Model",
      "UNIX CLI & Shell",
      "Git & GitHub",
      "JavaScript (ES6+) & OOP",
      "Memory Management",
      "AJAX, jQuery & JSON",
      "React.js & Virtual DOM",
      "React Router & SPAs",
      "Redux State Architecture",
      "Java & Spring MVC",
      "RESTful APIs & Maven",
      "SQL & Normalization",
      "Spring JDBC Persistence",
      "Agile & Cloud Deployment"
    ],
    modules: [
      {
        id: "fs-m1",
        title: "Module 1 – Unit I: Web Development Basics & HTML5 Architecture",
        description: "Two-tier/Three-tier web architectures, Tim Berners-Lee hypertext fundamentals, HTML document structure, and semantic elements.",
        lessons: [
          {
            id: "fs-m1-l1",
            title: "Web Architecture & HTML5 Document Structure",
            duration: "20 min",
            content: "HTML (HyperText Markup Language) was created by physicist Tim Berners-Lee at CERN in 1989. In modern two-tier and three-tier web architectures, HTML structures the client view layer. An HTML document consists of <!DOCTYPE html>, <html>, <head> (metadata, title, stylesheet links), and <body> (visible content). Elements are either block-level (taking full width, starting on a new line like <div>, <p>, <h1>-<h6>) or inline (taking only content width like <span>, <a>, <img>). Void elements (<br>, <hr>, <img>, <input>) do not require closing tags.",
            realWorldExample: "Constructing the primary layout skeleton for an enterprise dashboard like VELFIRE.",
            codeSnippet: `<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>VELFIRE Dashboard - B.Tech Portal</title>\n</head>\n<body>\n  <header>\n    <h1>VELFIRE Career OS</h1>\n  </header>\n  <main>\n    <p>Welcome to Full Stack Web Development (R20A0516).</p>\n  </main>\n</body>\n</html>`,
            keyPoints: [
              "HTML documents are rendered top-to-bottom and left-to-right by browser layout engines.",
              "Block-level elements structure layout; inline elements format text segments.",
              "Void/empty elements (<br>, <hr>) do not have closing tags or inner text."
            ],
            practiceTask: "Create an HTML5 document containing proper DOCTYPE, metadata, header, main, and footer sections with nested heading and paragraph tags."
          },
          {
            id: "fs-m1-l2",
            title: "HTML Formatting, Tables, Lists & Media",
            duration: "25 min",
            content: "HTML provides physical tags for visual styling (<b>, <i>, <u>) and logical/semantic tags (<strong>, <em>, <mark>, <del>, <ins>, <sub>, <sup>) that inform search engines and assistive screen readers. Tables are defined using <table>, <tr> (table row), <th> (table header), and <td> (table data cell). Lists organize information as Ordered Lists (<ol> with type='1|I|i|A|a' and start attribute), Unordered Lists (<ul> with bullets), and Description/Definition Lists (<dl>, <dt> term, <dd> description). Images are embedded using <img src='...' alt='...'> with compulsory alternative text for accessibility.",
            realWorldExample: "Displaying student grades and course schedules in a clean tabular view.",
            codeSnippet: `<!-- Academic Course Modules Table -->\n<table border=\"1\" cellpadding=\"8\">\n  <thead>\n    <tr>\n      <th>Unit</th>\n      <th>Topic Name</th>\n      <th>Hours</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Unit I</td>\n      <td>HTML, CSS, Shell & Git</td>\n      <td>12</td>\n    </tr>\n    <tr>\n      <td>Unit II</td>\n      <td>JavaScript, OOP, AJAX & jQuery</td>\n      <td>14</td>\n    </tr>\n  </tbody>\n</table>`,
            keyPoints: [
              "Semantic tags like <strong> and <em> add logical importance over physical tags <b> and <i>.",
              "Ordered lists support type ('1', 'A', 'a', 'I', 'i') and start attributes.",
              "Tables require <thead>, <tbody>, <tr>, <th>, and <td> for structural correctness."
            ],
            practiceTask: "Write an HTML table representing an academic semester syllabus with Unit number, Subject title, and Marks weightage."
          }
        ]
      },
      {
        id: "fs-m2",
        title: "Module 2 – Unit I: Advanced HTML5 Forms & Input Controls",
        description: "Interactive form controls, input types, GET/POST submission methods, enctype, and HTML5 client-side validation.",
        lessons: [
          {
            id: "fs-m2-l1",
            title: "HTML Forms Architecture & Submission Methods",
            duration: "25 min",
            content: "An HTML form (<form>) facilitates user data collection and transmission to web servers. Key form attributes include: 'action' (URL of the backend endpoint processing data), 'method' (GET appends data into the query string visible in the URL; POST transmits data securely inside the HTTP request body for passwords and sensitive information), 'target' (_self or _blank), 'autocomplete' (on/off), 'enctype' (application/x-www-form-urlencoded default, or multipart/form-data for file uploads), and 'novalidate' (bypasses browser validation). Form fields are logically grouped using <fieldset> with a <legend> caption.",
            realWorldExample: "Student course registration and login forms transmitting credentials to a backend server.",
            codeSnippet: `<form action=\"/api/register\" method=\"POST\" enctype=\"multipart/form-data\">\n  <fieldset>\n    <legend>Student Registration (B.Tech R20)</legend>\n    \n    <label for=\"stu-name\">Full Name:</label>\n    <input type=\"text\" id=\"stu-name\" name=\"name\" required placeholder=\"Enter student name\">\n    \n    <label for=\"stu-email\">Email Address:</label>\n    <input type=\"email\" id=\"stu-email\" name=\"email\" required>\n    \n    <label for=\"stu-pwd\">Password:</label>\n    <input type=\"password\" id=\"stu-pwd\" name=\"password\" required minlength=\"8\">\n    \n    <input type=\"submit\" value=\"Register Student\">\n  </fieldset>\n</form>`,
            keyPoints: [
              "Always use method='POST' when sending passwords, tokens, or large payloads.",
              "Use enctype='multipart/form-data' whenever the form contains <input type='file'>.",
              "Always pair input controls with <label for='...'> matching the input's id."
            ],
            practiceTask: "Build an HTML registration form with Name, Email, Password, Gender radio buttons, Hobbies checkboxes, and a Profile Photo file upload."
          },
          {
            id: "fs-m2-l2",
            title: "HTML5 Modern Input Types & Validation Controls",
            duration: "20 min",
            content: "HTML5 introduced rich semantic input types including: 'email', 'date', 'datetime-local', 'month', 'color', 'number', 'tel', 'url', and 'search'. Form controls also include multi-line textareas (<textarea rows='4' cols='50'>), single/multiple selection dropdowns (<select> with <option>), and push buttons (<button type='button|submit|reset'>). Validation attributes like 'required', 'pattern', 'min', 'max', 'autofocus', and 'placeholder' allow instant browser-native input verification before submitting to the backend.",
            realWorldExample: "Filtering student course catalogs by date of registration, grade range, and category.",
            codeSnippet: `<!-- HTML5 Specialized Inputs -->\n<div class=\"form-group\">\n  <label for=\"dob\">Date of Birth:</label>\n  <input type=\"date\" id=\"dob\" name=\"dob\" required>\n</div>\n\n<div class=\"form-group\">\n  <label for=\"branch\">Select Department:</label>\n  <select id=\"branch\" name=\"department\">\n    <option value=\"cse-aiml\">CSE (AIML)</option>\n    <option value=\"aids\">AI & Data Science</option>\n    <option value=\"it\">Information Technology</option>\n  </select>\n</div>`,
            keyPoints: [
              "HTML5 types like email and date trigger automatic device-optimized keyboards on mobile browsers.",
              "Input elements without a 'name' attribute are excluded from form submissions.",
              "Use 'placeholder' for instructional hints and 'required' to prevent empty submissions."
            ],
            practiceTask: "Create an interactive feedback form utilizing 'date', 'number', 'range', and dropdown select options with native HTML5 validation."
          }
        ]
      },
      {
        id: "fs-m3",
        title: "Module 3 – Unit I: CSS Styling, Box Model & Visual Layouts",
        description: "Three methods of applying CSS, selector specificity, CSS box model, borders, margin/padding shorthand, and display mechanisms.",
        lessons: [
          {
            id: "fs-m3-l1",
            title: "CSS Integration Methods & Specificity Selectors",
            duration: "25 min",
            content: "CSS (Cascading Style Sheets) separates visual presentation from HTML markup. There are three ways to insert CSS: 1. Inline CSS (style attribute in HTML tag; hardest to maintain), 2. Internal/Embedded CSS (<style> block in <head>), and 3. External CSS (linked .css file via <link rel='stylesheet' href='style.css'>; recommended for modularity and browser caching). CSS Selectors target elements: Element Selector ('p', 'h1'), ID Selector ('#header', unique per page), Class Selector ('.card', reusable), Universal Selector ('*'), and Grouping Selector ('h1, h2, p' to eliminate redundant declarations).",
            realWorldExample: "Establishing a consistent design system and color palette across all web pages of an application.",
            codeSnippet: `/* External Style Sheet: style.css */\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\n/* Element & Class Selectors */\nbody {\n  font-family: 'Space Grotesk', sans-serif;\n  background-color: #f7fafb;\n  color: #090a0b;\n}\n\n.card {\n  background: #ffffff;\n  border-radius: 12px;\n  padding: 24px;\n}\n\n/* Grouping Selector */\nh1, h2, h3 {\n  font-family: 'Oswald', sans-serif;\n  letter-spacing: -0.5px;\n}`,
            keyPoints: [
              "External CSS is the industry standard because browsers cache the file, reducing bandwidth.",
              "Specificity hierarchy: Inline Styles > ID (#) > Class (.) > Element (tag).",
              "Group selectors with commas (h1, h2, p) to avoid code duplication."
            ],
            practiceTask: "Build an external stylesheet with element, class, ID, and grouping selectors styling an academic article layout."
          },
          {
            id: "fs-m3-l2",
            title: "CSS Box Model, Spacing & Display Properties",
            duration: "25 min",
            content: "Every element on a web page is rendered as a rectangular box comprising four concentric layers: Content, Padding (inner space between content and border), Border (thickness, style like solid/dashed/double, and color), and Margin (outer transparent clearance around the element). Margin shorthand supports 1 to 4 values (top right bottom left). Display properties dictate formatting: 'display: block' (takes full width, breaks line), 'display: inline' (takes only text width, ignores top/bottom margin), 'display: inline-block' (inline flow with configurable width and height), 'display: none' (removes element from document layout), and 'display: flex' (modern multi-axis flexbox).",
            realWorldExample: "Creating interactive call-to-action buttons with hover elevation, box-shadows, and rounded borders.",
            codeSnippet: `/* Interactive Box Model Button */\n.btn-primary {\n  display: inline-block;\n  padding: 12px 28px; /* Vertical / Horizontal */\n  margin: 10px 0;\n  background-color: #047857;\n  color: #ffffff;\n  border: 2px solid #10b981;\n  border-radius: 8px;\n  cursor: pointer;\n  box-shadow: 0 4px 14px rgba(4, 120, 87, 0.3);\n  transition: all 0.25s ease;\n}\n\n.btn-primary:hover {\n  background-color: #065f46;\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px rgba(4, 120, 87, 0.45);\n}`,
            keyPoints: [
              "Box Model order from inside to outside: Content -> Padding -> Border -> Margin.",
              "display: inline-block permits setting width, height, margin-top, and margin-bottom.",
              "Use border-collapse: collapse and border-spacing on tables to manage cell spacing."
            ],
            practiceTask: "Implement a card component demonstrating margin, padding, border-radius, box-shadow, and a button with smooth hover transition."
          }
        ]
      },
      {
        id: "fs-m4",
        title: "Module 4 – Unit I: Web Servers Shell, UNIX CLI & Git/GitHub",
        description: "Server shell command-line navigation, process management, Git version control workflow, branching, and GitHub collaboration.",
        lessons: [
          {
            id: "fs-m4-l1",
            title: "UNIX/Linux Server Shell & Process Commands",
            duration: "20 min",
            content: "Production web applications run on UNIX/Linux web servers. Developers must navigate through the command-line shell (CLI). Essential file commands: 'pwd' (print working directory), 'ls -al' (list all files with permissions), 'cd dirName' (change directory), 'mkdir dir' (create directory), 'touch file' (create empty file), 'cp -r src dst' (copy), 'mv src dst' (move/rename), 'rm -f file' (remove file), 'cat > file' (write standard input to file), 'head -n 10 file' and 'tail -n 10 file'. Process management commands: 'ps' (running processes), 'top' (real-time resource monitor), 'kill pid' (terminate process), 'killall name', 'bg' and 'fg' (background/foreground control). System info: 'df' (disk space), 'free' (memory/RAM), 'uname -a' (kernel info), and 'whoami'.",
            realWorldExample: "Deploying and managing background Node.js/Python server daemons on an Ubuntu cloud server.",
            codeSnippet: `# Linux Terminal Workflow Example\npwd                      # /var/www/velfire-app\nmkdir -p backend/logs    # Create directory structure\ntouch backend/server.py  # Create server entrypoint\nps -aux | grep python    # Check running python web server\nkill -9 18452            # Terminate hanging process by PID\nfree -h                  # Verify available system RAM`,
            keyPoints: [
              "ls -al displays hidden configuration files (.env, .git) with read/write permissions.",
              "Use 'ps' and 'kill' to monitor and manage rogue server processes on production machines.",
              "Use 'free' and 'df' to inspect server memory and disk space before deploying new builds."
            ],
            practiceTask: "Practice creating a nested project directory, touching 3 files, copying one, and checking system info using UNIX CLI commands."
          },
          {
            id: "fs-m4-l2",
            title: "Version Control with Git, Branching & GitHub Pages",
            duration: "25 min",
            content: "Git is a distributed version control system developed by Linus Torvalds in 2005. Git manages repositories across three tiers: Working Directory (modified files), Staging Area ('git add' / 'git add --all'), and Repository Commits ('git commit -m \"message\"'). Workflow commands: 'git init' (initialize repo), 'git status' (track modified files), 'git log' (commit history), and 'git diff'. For remote collaboration with GitHub: 'git remote add origin <url>', 'git push origin master', 'git fetch' (download commits), 'git merge', and 'git pull' (fetch + merge). Branching enables isolated feature development: 'git checkout -b <branch>', 'git checkout <branch>', pull requests (PR) for peer reviews, and hosting static apps on GitHub Pages (.github.io).",
            realWorldExample: "Managing multi-developer team feature branches on GitHub with Pull Request reviews.",
            codeSnippet: `# Complete Git Lifecycle\ngit init\ngit config --global user.name \"Poovarasan\"\ngit config --global user.email \"velfire07@gmail.com\"\ngit add .\ngit commit -m \"feat: initialize full stack enterprise app\"\ngit branch -M main\ngit remote add origin https://github.com/poovarasan/velfire.git\ngit push -u origin main\n\n# Feature Branching Workflow\ngit checkout -b feature/auth-system\n# Make edits...\ngit commit -am \"feat: implement JWT token authentication\"\ngit push origin feature/auth-system`,
            keyPoints: [
              "Git tracks snapshots of file changes rather than storing entire file duplicates.",
              "The staging area ('git add') allows selective commits of logical change units.",
              "Pull requests on GitHub facilitate code inspection, automated tests, and safe branch merging."
            ],
            practiceTask: "Initialize a local Git repository, create a README.md, stage and commit with a descriptive message, and create a feature branch."
          }
        ]
      },
      {
        id: "fs-m5",
        title: "Module 5 – Unit II: JavaScript Fundamentals & Memory Management",
        description: "JavaScript translation engine, variables, lexical and global scoping, memory lifecycle, and garbage collection mechanisms.",
        lessons: [
          {
            id: "fs-m5-l1",
            title: "JavaScript Core, Variable Scoping & Window Object",
            duration: "20 min",
            content: "JavaScript was created in 1995 by Brendan Eich at Netscape. It is an interpreted, lightweight, object-based scripting language translated by the browser's embedded JS engine. JS code can be placed inside <body>, <head>, or external .js files (enabling browser caching and code reusability). Variable declarations: 'var' (function-scoped, hoisted), 'let' (block-scoped), and 'const' (immutable binding). Local variables declared inside functions are isolated, whereas global variables declared outside functions automatically attach to the global 'window' object in browsers.",
            realWorldExample: "Handling secure token storage and user sessions without polluting the global window scope.",
            codeSnippet: `// Local vs Global Scope & Window Object\nvar globalAppName = \"VELFIRE OS\"; // Attached to window.globalAppName\nlet sessionToken = \"xyz_987654\";\n\nfunction calculateScore(completedUnits) {\n  let unitWeight = 20; // Local variable: inaccessible outside\n  var finalScore = completedUnits * unitWeight;\n  return finalScore;\n}\n\nconsole.log(calculateScore(4)); // 80\nconsole.log(window.globalAppName); // \"VELFIRE OS\"`,
            keyPoints: [
              "External .js files improve page load speeds due to browser caching.",
              "Use 'let' and 'const' instead of 'var' to prevent variable hoisting bugs and accidental global pollution.",
              "Variables declared outside functions in non-module scripts attach to the browser 'window' object."
            ],
            practiceTask: "Write a JavaScript script demonstrating local variable scoping inside a function and verifying that local variables cannot be accessed from global scope."
          },
          {
            id: "fs-m5-l2",
            title: "Memory Management Lifecycle & Garbage Collection",
            duration: "25 min",
            content: "Memory management in JavaScript consists of three phases: 1. Allocation (automatic assignment upon variable, object, or function creation), 2. Utilization (reading or writing values), and 3. Deallocation/Release (freeing unreferenced memory). JavaScript employs an automated Garbage Collector (Mark-and-Sweep algorithm) that identifies and frees memory that is no longer reachable from the root object. For dynamically allocated object properties, the 'delete' keyword can remove properties manually ('delete student.temporaryData') to release memory references.",
            realWorldExample: "Cleaning up unmounted DOM elements, event listeners, and cached payloads to prevent browser memory leaks.",
            codeSnippet: `// JavaScript Memory Allocation & Deallocation\nlet activeSession = {\n  sessionId: \"sess_12345\",\n  userData: { name: \"Poovarasan\", role: \"Developer\" },\n  temporaryCache: new Array(100000).fill(\"temp_data\")\n};\n\n// Manually free memory allocated to heavy cache\ndelete activeSession.temporaryCache;\n\n// Nullify reference so Garbage Collector reclaims entire object\nactiveSession = null;`,
            keyPoints: [
              "Memory lifecycle: Allocate -> Use -> Release.",
              "JavaScript's Garbage Collector automatically reclaims objects that have zero reachable references.",
              "Dangling event listeners and un-cleared intervals cause memory leaks if not explicitly cleaned up."
            ],
            practiceTask: "Write a demonstration script that allocates a large array in memory, processes it, and deletes/nullifies the reference for garbage collection."
          }
        ]
      },
      {
        id: "fs-m6",
        title: "Module 6 – Unit II: Object-Oriented JavaScript (OOP & ES6 Classes)",
        description: "Object creation patterns, ES6 class syntax, constructors, encapsulation, methods, and prototypal inheritance.",
        lessons: [
          {
            id: "fs-m6-l1",
            title: "Object Creation Patterns & ES6 Classes",
            duration: "25 min",
            content: "In Object-Oriented Programming (OOP), problems are organized into entities called objects that bind data (properties) with functions (methods). In JavaScript, objects can be created via: 1. Object Literal syntax ('const obj = { key: value };'), 2. 'new Object()', 3. Constructor Functions ('function Student(name) { this.name = name; }'), and 4. ES6 Class syntax. Introduced in ECMAScript 2015 (ES6), classes provide clean syntax for defining constructor methods and shared member functions.",
            realWorldExample: "Modeling Student, Course, and Enrollment entities in an EdTech platform.",
            codeSnippet: `// ES6 Class Definition\nclass Student {\n  constructor(name, rollNo, branch) {\n    this.name = name;\n    this.rollNo = rollNo;\n    this.branch = branch;\n    this.courses = [];\n  }\n\n  enrollCourse(courseName) {\n    this.courses.push(courseName);\n    return \`\${this.name} enrolled in \${courseName}\`;\n  }\n\n  getDetails() {\n    return \`Roll: \${this.rollNo} | Name: \${this.name} | Branch: \${this.branch}\`;\n  }\n}\n\nconst student1 = new Student(\"Karthik\", \"20A0516\", \"CSE-AIML\");\nconsole.log(student1.enrollCourse(\"Full Stack Development\"));\nconsole.log(student1.getDetails());`,
            keyPoints: [
              "ES6 classes are syntactic sugar over JavaScript's prototype-based inheritance model.",
              "The 'constructor' method executes automatically when instantiating a new object via 'new'.",
              "Methods declared inside classes are attached to the prototype, saving memory across instances."
            ],
            practiceTask: "Create an ES6 class 'Course' with properties (courseCode, title, credits) and methods to calculate grade points and print details."
          },
          {
            id: "fs-m6-l2",
            title: "Encapsulation & Hierarchical Class Inheritance",
            duration: "20 min",
            content: "Encapsulation is the wrapping of data and manipulating functions into a single unit, hiding internal state from unauthorized external tampering. Inheritance allows derived child classes to inherit attributes and methods from parent classes using the 'extends' keyword and 'super()' constructor call, facilitating code reusability and hierarchical classification.",
            realWorldExample: "Deriving specialized 'AdminUser' and 'StudentUser' classes from a base 'User' class.",
            codeSnippet: `// Base Class\nclass User {\n  constructor(username, email) {\n    this.username = username;\n    this.email = email;\n  }\n\n  getProfile() {\n    return \`User: \${this.username} (\${this.email})\`;\n  }\n}\n\n// Derived Child Class (Inheritance)\nclass Instructor extends User {\n  constructor(username, email, subjectTaught) {\n    super(username, email); // Call parent constructor\n    this.subjectTaught = subjectTaught;\n  }\n\n  teach() {\n    return \`\${this.username} is lecturing on \${this.subjectTaught}.\`;\n  }\n}\n\nconst prof = new Instructor(\"Dr. Thorne\", \"thorne@velfire.edu\", \"Spring MVC & Databases\");\nconsole.log(prof.getProfile());\nconsole.log(prof.teach());`,
            keyPoints: [
              "Inheritance promotes the DRY (Don't Repeat Yourself) principle through code reusability.",
              "Child classes must call 'super()' before referencing 'this' in their constructor.",
              "Child classes can override parent methods to provide specialized behavior (Polymorphism)."
            ],
            practiceTask: "Implement a parent class 'Vehicle' and a derived child class 'Car' demonstrating inheritance and method overriding."
          }
        ]
      },
      {
        id: "fs-m7",
        title: "Module 7 – Unit II: Asynchronous Communication, AJAX & jQuery",
        description: "AJAX data exchange, XMLHttpRequest lifecycle (readyState 0-4), HTTP response headers, jQuery events, and JSON data serialization.",
        lessons: [
          {
            id: "fs-m7-l1",
            title: "AJAX & XMLHttpRequest Lifecycle",
            duration: "25 min",
            content: "AJAX (Asynchronous JavaScript and XML) enables web applications to send and retrieve data from a web server asynchronously in the background without reloading the page. The core mechanism is the 'XMLHttpRequest' (XHR) object. Key methods: 'open(method, url, async)' and 'send(data)'. The request progresses through 5 readyState phases: 0 (Unsent), 1 (Opened), 2 (Headers Received), 3 (Loading), and 4 (Finished/Done). Once readyState == 4 and status == 200 (OK), data is extracted via 'responseText' (plain text/JSON) or 'responseXML' (XML document).",
            realWorldExample: "Fetching course search recommendations and live notification counts without page reloads.",
            codeSnippet: `// Asynchronous AJAX Request Implementation\nfunction fetchCourseData(courseId) {\n  const xhr = new XMLHttpRequest();\n  \n  xhr.onreadystatechange = function() {\n    // Check if request completed and status is 200 OK\n    if (xhr.readyState === 4) {\n      if (xhr.status === 200) {\n        const course = JSON.parse(xhr.responseText);\n        console.log(\"Fetched Course:\", course);\n      } else {\n        console.error(\"AJAX Request Failed with status:\", xhr.status);\n      }\n    }\n  };\n\n  xhr.open(\"GET\", \`/api/courses/\${courseId}\`, true);\n  xhr.setRequestHeader(\"Accept\", \"application/json\");\n  xhr.send();\n}`,
            keyPoints: [
              "readyState 4 indicates the response is fully received; status 200 indicates HTTP OK.",
              "AJAX dramatically improves user experience by eliminating full page refreshes.",
              "JSON is preferred over XML due to smaller payload sizes and native JS object compatibility."
            ],
            practiceTask: "Implement an XMLHttpRequest function that fetches JSON data from an endpoint and prints response headers and parsed payload."
          },
          {
            id: "fs-m7-l2",
            title: "jQuery Events & JSON Data Format Serialization",
            duration: "25 min",
            content: "jQuery is a fast, lightweight JavaScript library designed to simplify DOM traversal, event handling, and animation using CSS-style selectors ($('p').click()). jQuery categorizes events into: Mouse Events (click, dblclick, mouseenter), Keyboard Events (keyup, keydown), Form Events (submit, change, focus, blur), and Document/Window Events (load, scroll, resize). JSON (JavaScript Object Notation) is a lightweight text-based data-interchange format. Built-in methods: 'JSON.stringify(obj)' converts in-memory JS objects into strings for network transmission, and 'JSON.parse(str)' deserializes strings back into JS objects.",
            realWorldExample: "Submitting user review forms using jQuery and parsing incoming JSON responses from an API.",
            codeSnippet: `// jQuery Event Handling & JSON Serialization\n$(document).ready(function() {\n  $(\"#btn-submit-review\").click(function(event) {\n    event.preventDefault();\n    \n    // Create JS payload object\n    const reviewData = {\n      courseId: \"fullstack-web\",\n      rating: 5,\n      comment: \"Outstanding Full Stack R20 notes!\"\n    };\n\n    // Serialize to JSON string\n    const jsonPayload = JSON.stringify(reviewData);\n    console.log(\"Serialized JSON:\", jsonPayload);\n\n    // Post via AJAX\n    $.ajax({\n      url: \"/api/reviews\",\n      type: \"POST\",\n      contentType: \"application/json\",\n      data: jsonPayload,\n      success: function(response) {\n        $(\"#status-msg\").text(\"Review submitted successfully!\");\n      }\n    });\n  });\n});`,
            keyPoints: [
              "$(document).ready() guarantees code executes only after the full DOM tree is loaded.",
              "JSON.stringify() converts JS objects to strings; JSON.parse() parses strings to objects.",
              "jQuery events provide cross-browser normalized event behavior."
            ],
            practiceTask: "Write a jQuery script that listens for a form submission, serializes form data into JSON, and displays it on the web page."
          }
        ]
      },
      {
        id: "fs-m8",
        title: "Module 8 – Unit III: React.js Fundamentals & Virtual DOM",
        description: "Component-based architecture, in-memory Virtual DOM reconciliation, JSX, props, and useState/useEffect hooks.",
        lessons: [
          {
            id: "fs-m8-l1",
            title: "React Architecture, Virtual DOM & Component Reusability",
            duration: "25 min",
            content: "ReactJS is an open-source, component-based frontend library created by Jordan Walke at Facebook in 2011 (released publicly in 2013). In MVC architectures, React acts as the 'V' (View layer). Traditional DOM updates are computationally expensive because browsers reconstruct layout trees on changes. React solves this by operating on an in-memory Virtual DOM. When state changes occur, React compares the new Virtual DOM with a previous snapshot (Diffing algorithm) and updates only the specific changed nodes in the real browser DOM (Reconciliation). React components are reusable, composable functions outputting JSX (JavaScript XML).",
            realWorldExample: "Rendering thousands of dynamic course cards in an interactive grid without browser stutter.",
            codeSnippet: `// Reusable Composable React Component\nimport React from 'react';\n\nfunction CourseBadge({ title, hours, isBTechCertified }) {\n  return (\n    <div className=\"course-card-badge\">\n      <h4>{title}</h4>\n      <p>Duration: {hours} Hours</p>\n      {isBTechCertified && (\n        <span className=\"badge-certified\">✓ R20 Accredited</span>\n      )}\n    </div>\n  );\n}\n\nexport default CourseBadge;`,
            keyPoints: [
              "Virtual DOM resides in memory and updates 10x faster than direct browser DOM manipulation.",
              "React components must return a single root JSX element or Fragment (<>...</>).",
              "Props are read-only inputs passed from parent components to child components."
            ],
            practiceTask: "Create a reusable React functional component that accepts props (title, unitNumber, topicsCount) and renders a formatted syllabus card."
          },
          {
            id: "fs-m8-l2",
            title: "State Management with React Hooks (useState & useEffect)",
            duration: "25 min",
            content: "While props pass immutable data downward, 'state' represents mutable data that changes over time based on user interactions. The 'useState' hook allows functional components to store and update internal state, triggering an automated UI re-render on setter calls. The 'useEffect' hook handles asynchronous side effects such as fetching API data, setting timers, and managing browser event subscriptions.",
            realWorldExample: "Tracking completed quiz answers and fetching course progress percentages from a backend API.",
            codeSnippet: `import React, { useState, useEffect } from 'react';\n\nfunction CourseProgressTracker({ courseId }) {\n  const [completedCount, setCompletedCount] = useState(0);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    // Simulate fetching progress from backend API\n    fetch(\`/api/progress/\${courseId}\`)\n      .then(res => res.json())\n      .then(data => {\n        setCompletedCount(data.completed);\n        setLoading(false);\n      });\n  }, [courseId]); // Re-run effect only when courseId changes\n\n  return (\n    <div className=\"tracker-card\">\n      {loading ? <p>Loading Progress...</p> : (\n        <div>\n          <h3>Completed Lessons: {completedCount}</h3>\n          <button onClick={() => setCompletedCount(c => c + 1)}>\n            Mark Next Lesson Done\n          </button>\n        </div>\n      )}\n    </div>\n  );\n}`,
            keyPoints: [
              "Never mutate state directly (e.g. count = 5); always use setter functions (setCount(5)).",
              "Pass an empty dependency array [] to useEffect to run an effect strictly on mount.",
              "React enforces unidirectional (one-way) data flow: Parent -> Child via props."
            ],
            practiceTask: "Build a counter component featuring Increment, Decrement, and Reset buttons using useState."
          }
        ]
      },
      {
        id: "fs-m9",
        title: "Module 9 – Unit III: React Router & Controlled Form Architecture",
        description: "Single Page Application (SPA) navigation, Route matching, animated page transitions, and controlled component forms.",
        lessons: [
          {
            id: "fs-m9-l1",
            title: "React Router & Single Page Application (SPA) Architecture",
            duration: "25 min",
            content: "Traditional multi-page websites request new HTML documents on every link click. Single Page Applications (SPAs) load a single HTML document once and dynamically update the view as users navigate without page reloads. 'react-router-dom' provides components: <BrowserRouter> (HTML5 pushState history), <HashRouter> (hash-based routing), <Routes> / <Switch> (matches current URL path), <Route path='...' element={...}>, and <Link to='...'> (client-side navigation without refresh). Page transitions can be animated smoothly using 'react-transition-group'.",
            realWorldExample: "Switching between Home, Courses, Dashboard, and Chatbot in VELFIRE without reloading the page.",
            codeSnippet: `import React from 'react';\nimport { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';\nimport Home from './Home';\nimport Curriculum from './Curriculum';\nimport About from './About';\n\nfunction AppNavigation() {\n  return (\n    <Router>\n      <nav className=\"navbar\">\n        <Link to=\"/\">Home</Link>\n        <Link to=\"/curriculum\">Syllabus</Link>\n        <Link to=\"/about\">About VELFIRE</Link>\n      </nav>\n\n      <Routes>\n        <Route path=\"/\" element={<Home />} />\n        <Route path=\"/curriculum\" element={<Curriculum />} />\n        <Route path=\"/about\" element={<About />} />\n      </Routes>\n    </Router>\n  );\n}`,
            keyPoints: [
              "SPAs eliminate full-page reload latency, yielding instant desktop-like transitions.",
              "<Link> and <NavLink> prevent the default browser GET request and update history via pushState.",
              "Use dynamic route parameters (/course/:id) to render detail views for specific courses."
            ],
            practiceTask: "Set up a React Router configuration with 3 distinct pages (Home, CourseDetails, About) and navigation links."
          },
          {
            id: "fs-m9-l2",
            title: "Controlled Form Components & Validation in React",
            duration: "20 min",
            content: "In plain HTML, form controls maintain their own internal state. In React, 'controlled components' ensure that form input values are strictly controlled by React component state. The React state acts as the 'single source of truth'. Input tags bind their 'value' prop to state and update state on the 'onChange' event handler, enabling real-time validation, dynamic error messaging, and conditional submission button states.",
            realWorldExample: "Validating student roll number, email, and password complexity in real time as the user types.",
            codeSnippet: `import React, { useState } from 'react';\n\nfunction StudentLoginForm() {\n  const [formData, setFormData] = useState({ rollNo: '', password: '' });\n  const [error, setError] = useState('');\n\n  const handleChange = (e) => {\n    const { name, value } = e.target;\n    setFormData(prev => ({ ...prev, [name]: value }));\n  };\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    if (!formData.rollNo.startsWith('20A')) {\n      setError('Invalid Roll Number: Must start with R20 code (20A...)');\n      return;\n    }\n    setError('');\n    alert(\`Authenticated: \${formData.rollNo}\`);\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input\n        name=\"rollNo\"\n        value={formData.rollNo}\n        onChange={handleChange}\n        placeholder=\"Roll No (e.g. 20A0516)\"\n      />\n      <input\n        type=\"password\"\n        name=\"password\"\n        value={formData.password}\n        onChange={handleChange}\n        placeholder=\"Password\"\n      />\n      {error && <p className=\"error-text\">{error}</p>}\n      <button type=\"submit\">Login</button>\n    </form>\n  );\n}`,
            keyPoints: [
              "In controlled components, the React component state is the single source of truth.",
              "Use computed property names [name]: value to manage multiple inputs with a single handler.",
              "Prevent default form submission reload using e.preventDefault() in onSubmit."
            ],
            practiceTask: "Create a controlled form with Name, Email, and Course dropdown with real-time error validation."
          }
        ]
      },
      {
        id: "fs-m10",
        title: "Module 10 – Unit III: Flow Architecture & Redux State Management",
        description: "Predictable state containers, Redux Store, Action creators, pure Reducers, Dispatch, and asynchronous middleware (Redux Thunk).",
        lessons: [
          {
            id: "fs-m10-l1",
            title: "Redux Architecture (Store, Actions, Reducers & Dispatch)",
            duration: "25 min",
            content: "When applications grow large with deeply nested component hierarchies, passing props down through multiple intermediary components (prop drilling) becomes unmaintainable. Redux implements a unidirectional Flow Architecture centered around a single centralized global state container called the 'Store'. Redux follows three core principles: 1. Single source of truth (the entire state lives in one store object tree), 2. State is read-only (state can only be changed by dispatching an Action object), and 3. Changes are made with pure Reducer functions ('(previousState, action) => newState') without mutations.",
            realWorldExample: "Managing global logged-in user profile, theme preferences, and active course progress across all application tabs.",
            codeSnippet: `// 1. Action Types & Creators\nconst ENROLL_COURSE = 'courses/ENROLL';\nconst enrollCourse = (courseId) => ({\n  type: ENROLL_COURSE,\n  payload: courseId\n});\n\n// 2. Initial State\nconst initialState = { enrolledCourseIds: [] };\n\n// 3. Pure Reducer Function (No mutations!)\nfunction courseReducer(state = initialState, action) {\n  switch (action.type) {\n    case ENROLL_COURSE:\n      return {\n        ...state,\n        enrolledCourseIds: [...state.enrolledCourseIds, action.payload]\n      };\n    default:\n      return state;\n  }\n}\n\n// Store dispatch: store.dispatch(enrollCourse('fullstack-web'));`,
            keyPoints: [
              "Redux state is immutable — reducers must always return fresh state copies using object spread {...state}.",
              "Actions must have a 'type' property describing what happened, along with optional 'payload' data.",
              "Unidirectional data flow: Action -> Dispatcher -> Reducer -> Store -> View."
            ],
            practiceTask: "Write a Redux action creator and pure reducer to toggle bookmarking a curriculum lesson."
          },
          {
            id: "fs-m10-l2",
            title: "Advanced Redux & Asynchronous Server Communication",
            duration: "25 min",
            content: "Reducers must be strictly pure functions with zero side effects. To perform asynchronous network requests (fetching API data from backends), Redux utilizes middleware such as 'Redux Thunk'. A Thunk is a function that wraps an expression to delay its evaluation. Async thunks allow dispatching multiple actions over time: e.g. dispatch('FETCH_START'), make an asynchronous HTTP fetch call, and dispatch('FETCH_SUCCESS') or dispatch('FETCH_ERROR').",
            realWorldExample: "Loading syllabus lecture notes from the server while displaying a loading skeleton spinner.",
            codeSnippet: `// Asynchronous Redux Thunk Action Creator\nexport const fetchSyllabusNotes = (unitId) => {\n  return async (dispatch) => {\n    dispatch({ type: 'NOTES_FETCH_REQUEST' });\n    try {\n      const response = await fetch(\`/api/syllabus/unit/\${unitId}\`);\n      const notes = await response.json();\n      dispatch({ type: 'NOTES_FETCH_SUCCESS', payload: notes });\n    } catch (error) {\n      dispatch({ type: 'NOTES_FETCH_FAILURE', payload: error.message });\n    }\n  };\n};`,
            keyPoints: [
              "Redux Thunk middleware intercepts dispatched functions before reaching reducers.",
              "Always dispatch loading, success, and error actions to handle asynchronous network states cleanly.",
              "Use Redux DevTools for time-travel debugging and inspecting dispatched action payloads."
            ],
            practiceTask: "Implement an asynchronous thunk action creator that fetches user profile data and dispatches success and failure actions."
          }
        ]
      },
      {
        id: "fs-m11",
        title: "Module 11 – Unit IV: Enterprise Java Web Development & Spring MVC",
        description: "Enterprise Java backend principles, Model-View-Controller pattern, Spring Framework architecture, DispatcherServlet, and ViewResolvers.",
        lessons: [
          {
            id: "fs-m11-l1",
            title: "Java Backend Basics & Object-Oriented Principles",
            duration: "25 min",
            content: "Java is an enterprise-grade, strongly typed, class-based object-oriented programming language executed on the Java Virtual Machine (JVM). Java applications follow strict OOP principles: Encapsulation (private fields with public getters/setters), Inheritance (class hierarchies via extends), Polymorphism (method overloading and overriding), and Abstraction (interfaces and abstract classes). Strong type safety and robust exception handling (try-catch-finally, custom checked/unchecked exceptions) make Java the global standard for high-throughput enterprise web backends.",
            realWorldExample: "Creating student enrollment and course domain entities in enterprise university portals.",
            codeSnippet: `// Enterprise Java Domain Entity\npackage com.velfire.model;\n\npublic class Course {\n    private String courseCode;\n    private String courseName;\n    private int credits;\n\n    public Course(String courseCode, String courseName, int credits) {\n        this.courseCode = courseCode;\n        this.courseName = courseName;\n        this.credits = credits;\n    }\n\n    // Getters and Setters (Encapsulation)\n    public String getCourseCode() { return courseCode; }\n    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }\n    public String getCourseName() { return courseName; }\n    public int getCredits() { return credits; }\n}`,
            keyPoints: [
              "Java's 'Write Once, Run Anywhere' (WORA) philosophy relies on JVM bytecode compilation.",
              "Encapsulation protects enterprise data models from unauthorized external modifications.",
              "Packages organize Java classes into distinct namespaces preventing class collision."
            ],
            practiceTask: "Write a Java class 'Student' with private attributes, parameterized constructor, getters/setters, and a method computing GPA."
          },
          {
            id: "fs-m11-l2",
            title: "Model View Controller (MVC) Architecture & Spring MVC",
            duration: "25 min",
            content: "The Model-View-Controller (MVC) architectural pattern isolates business data (Model), user interface display (View), and input control logic (Controller) into distinct tiers. Spring MVC is an enterprise Java framework implementing this pattern. The workflow: 1. Client browser sends HTTP request -> 2. Spring's 'DispatcherServlet' (Front Controller) intercepts request -> 3. HandlerMapping locates matching '@Controller' -> 4. Controller processes business logic via Service layer and returns a 'ModelAndView' -> 5. 'ViewResolver' renders the appropriate HTML/JSP or JSON view back to client.",
            realWorldExample: "Routing incoming HTTP web requests through Spring DispatcherServlet to render student exam results.",
            codeSnippet: `package com.velfire.controller;\n\nimport org.springframework.stereotype.Controller;\nimport org.springframework.ui.Model;\nimport org.springframework.web.bind.annotation.GetMapping;\nimport org.springframework.web.bind.annotation.RequestParam;\n\n@Controller\npublic class SyllabusController {\n\n    @GetMapping(\"/syllabus\")\n    public String getUnitDetails(@RequestParam(name=\"unit\", defaultValue=\"1\") int unitNo, Model model) {\n        // Attach data to Model\n        model.addAttribute(\"unitNumber\", unitNo);\n        model.addAttribute(\"unitTitle\", \"Unit \" + unitNo + \": Web Development Basics\");\n        \n        // Returns the view name resolved by ViewResolver (e.g., syllabus.jsp or syllabus.html)\n        return \"syllabusView\";\n    }\n}`,
            keyPoints: [
              "MVC architecture enforces separation of concerns between business logic and UI presentation.",
              "DispatcherServlet acts as the unified front controller intercepting all HTTP requests.",
              "@Controller classes handle web navigation and model population."
            ],
            practiceTask: "Implement a Spring MVC controller class mapping a GET request to render course syllabus information."
          }
        ]
      },
      {
        id: "fs-m12",
        title: "Module 12 – Unit IV: RESTful APIs with Spring & Maven Build Lifecycles",
        description: "RESTful architecture, Spring Boot REST controllers, JSON marshaling, and Apache Maven build automation.",
        lessons: [
          {
            id: "fs-m12-l1",
            title: "Building RESTful APIs with Spring Framework",
            duration: "25 min",
            content: "REST (Representational State Transfer) is a stateless client-server architectural style using standard HTTP verbs: GET (retrieve data), POST (create resource), PUT (update resource), and DELETE (remove resource). In modern Spring web applications, '@RestController' combines '@Controller' and '@ResponseBody', automatically serializing Java objects into JSON payloads. Useful annotations: '@GetMapping', '@PostMapping', '@PathVariable' (URL path parameter), '@RequestBody' (deserialize incoming JSON request body), and 'ResponseEntity<T>' (control HTTP status codes like 200 OK, 201 Created, 404 Not Found).",
            realWorldExample: "Building REST API endpoints providing syllabus data to React and mobile frontends.",
            codeSnippet: `package com.velfire.api;\n\nimport com.velfire.model.Course;\nimport org.springframework.http.HttpStatus;\nimport org.springframework.http.ResponseEntity;\nimport org.springframework.web.bind.annotation.*;\n\nimport java.util.*;\n\n@RestController\n@RequestMapping(\"/api/courses\")\npublic class CourseRestController {\n\n    @GetMapping(\"/{code}\")\n    public ResponseEntity<Course> getCourseByCode(@PathVariable String code) {\n        if (\"R20A0516\".equals(code)) {\n            Course course = new Course(\"R20A0516\", \"Full Stack Development\", 4);\n            return new ResponseEntity<>(course, HttpStatus.OK); // 200 OK\n        }\n        return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Not Found\n    }\n\n    @PostMapping\n    public ResponseEntity<String> createCourse(@RequestBody Course newCourse) {\n        // Save newCourse to database...\n        return new ResponseEntity<>(\"Course registered successfully\", HttpStatus.CREATED); // 201 Created\n    }\n}`,
            keyPoints: [
              "@RestController automatically converts Java returned objects into JSON using Jackson.",
              "Always return appropriate HTTP status codes (200 OK, 201 Created, 400 Bad Request, 404 Not Found).",
              "Use @PathVariable for specific resource IDs and @RequestBody for JSON payloads."
            ],
            practiceTask: "Write a Spring @RestController providing GET and POST endpoints for managing student course enrollments."
          },
          {
            id: "fs-m12-l2",
            title: "Apache Maven Build Automation & Dependency Management",
            duration: "20 min",
            content: "Apache Maven is an enterprise build automation and project management tool based on the Project Object Model (POM) defined in 'pom.xml'. Maven manages dependencies automatically by downloading JAR libraries from the central Maven repository. Coordinates: 'groupId' (organization), 'artifactId' (project name), and 'version'. The Maven build lifecycle follows standardized sequential phases: 1. validate, 2. compile (compiles .java to .class), 3. test (executes unit tests), 4. package (bundles code into JAR or WAR), 5. verify, 6. install (stores in local repository), and 7. deploy (publishes to remote repository).",
            realWorldExample: "Automating dependency resolution and production JAR packaging for Spring web services.",
            codeSnippet: `<!-- Maven pom.xml Configuration -->\n<project xmlns=\"http://maven.apache.org/POM/4.0.0\">\n    <modelVersion>4.0.0</modelVersion>\n    <groupId>com.velfire</groupId>\n    <artifactId>velfire-fullstack-backend</artifactId>\n    <version>1.0.0</version>\n\n    <dependencies>\n        <!-- Spring Boot Web Starter for REST APIs -->\n        <dependency>\n            <groupId>org.springframework.boot</groupId>\n            <artifactId>spring-boot-starter-web</artifactId>\n            <version>3.2.0</version>\n        </dependency>\n        <!-- Spring JDBC for Database Persistence -->\n        <dependency>\n            <groupId>org.springframework.boot</groupId>\n            <artifactId>spring-boot-starter-jdbc</artifactId>\n            <version>3.2.0</version>\n        </dependency>\n    </dependencies>\n</project>`,
            keyPoints: [
              "Maven's pom.xml eliminates manual JAR file downloading and classpath configuration.",
              "Standard build commands: 'mvn clean compile', 'mvn test', 'mvn package'.",
              "Transitive dependency management automatically pulls in libraries required by dependencies."
            ],
            practiceTask: "Construct a Maven pom.xml file declaring project coordinates, Spring Web starter dependency, and build packaging."
          }
        ]
      },
      {
        id: "fs-m13",
        title: "Module 13 – Unit V: Relational Databases, Normalization & Spring JDBC",
        description: "Relational database schemas, 1NF to 3NF/BCNF normalization, Structured Query Language (SQL), and Spring JDBC persistence.",
        lessons: [
          {
            id: "fs-m13-l1",
            title: "Relational Schemas & Database Normalization (1NF, 2NF, 3NF, BCNF)",
            duration: "25 min",
            content: "Relational databases store structured data in tables linked by Primary Keys (unique entity identifier) and Foreign Keys (referential integrity constraints). Unnormalized tables suffer from data redundancy, leading to insertion, deletion, and update anomalies. Normalization decomposes relations into standardized forms: 1. First Normal Form (1NF: atomic values, no repeating groups), 2. Second Normal Form (2NF: in 1NF and no partial dependencies on candidate keys), 3. Third Normal Form (3NF: in 2NF and no transitive functional dependencies), and 4. Boyce-Codd Normal Form (BCNF: for every functional dependency X -> Y, X must be a super key).",
            realWorldExample: "Structuring university enrollment schemas so updating a student's address does not require modifying dozens of course rows.",
            codeSnippet: `-- Normalized Relational Tables Schema (3NF)\nCREATE TABLE students (\n    student_id VARCHAR(20) PRIMARY KEY,\n    name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE NOT NULL\n);\n\nCREATE TABLE courses (\n    course_code VARCHAR(20) PRIMARY KEY,\n    title VARCHAR(150) NOT NULL,\n    credits INT NOT NULL CHECK (credits > 0)\n);\n\n-- Junction Table for Many-to-Many Relationship\nCREATE TABLE enrollments (\n    enrollment_id SERIAL PRIMARY KEY,\n    student_id VARCHAR(20) REFERENCES students(student_id) ON DELETE CASCADE,\n    course_code VARCHAR(20) REFERENCES courses(course_code),\n    enrollment_date DATE DEFAULT CURRENT_DATE,\n    UNIQUE(student_id, course_code)\n);`,
            keyPoints: [
              "1NF requires atomic values; 2NF removes partial key dependencies; 3NF removes transitive dependencies.",
              "Foreign keys enforce referential integrity across related database tables.",
              "Proper normalization prevents database anomalies and reduces storage redundancy."
            ],
            practiceTask: "Design a 3NF normalized schema for a Student, Course, and Faculty registration system with primary and foreign keys."
          },
          {
            id: "fs-m13-l2",
            title: "SQL Operations & Data Persistence with Spring JDBC",
            duration: "25 min",
            content: "SQL (Structured Query Language) comprises DDL (Data Definition Language: CREATE, ALTER, DROP), DML (Data Manipulation Language: INSERT, UPDATE, DELETE), and DQL (Data Query Language: SELECT with JOIN, WHERE, GROUP BY, HAVING). In Java web applications, Spring JDBC provides 'JdbcTemplate' which simplifies relational persistence by managing connections, preparing statements, catching exceptions, and releasing resources automatically. Object mapping is achieved using 'RowMapper<T>' to transform SQL ResultSet rows into Java entity instances.",
            realWorldExample: "Persisting completed student quizzes and retrieving course enrollment lists using Spring JdbcTemplate.",
            codeSnippet: `package com.velfire.repository;\n\nimport com.velfire.model.Course;\nimport org.springframework.beans.factory.annotation.Autowired;\nimport org.springframework.jdbc.core.JdbcTemplate;\nimport org.springframework.jdbc.core.RowMapper;\nimport org.springframework.stereotype.Repository;\nimport java.util.List;\n\n@Repository\npublic class CourseJdbcRepository {\n\n    @Autowired\n    private JdbcTemplate jdbcTemplate;\n\n    // RowMapper maps SQL columns to Java Course object\n    private final RowMapper<Course> courseRowMapper = (rs, rowNum) -> new Course(\n        rs.getString(\"course_code\"),\n        rs.getString(\"title\"),\n        rs.getInt(\"credits\")\n    );\n\n    public List<Course> findAllCourses() {\n        String sql = \"SELECT course_code, title, credits FROM courses\";\n        return jdbcTemplate.query(sql, courseRowMapper);\n    }\n\n    public int insertCourse(Course course) {\n        String sql = \"INSERT INTO courses (course_code, title, credits) VALUES (?, ?, ?)\";\n        return jdbcTemplate.update(sql, course.getCourseCode(), course.getCourseName(), course.getCredits());\n    }\n}`,
            keyPoints: [
              "Spring JdbcTemplate eliminates tedious boilerplate JDBC code (try-catch, connection closing).",
              "RowMapper<T> converts database result sets directly into strongly-typed Java domain models.",
              "Use parameterized queries (?) to prevent SQL Injection attacks."
            ],
            practiceTask: "Write a Spring JDBC repository class using JdbcTemplate to insert and retrieve student records."
          }
        ]
      },
      {
        id: "fs-m14",
        title: "Module 14 – Unit V: Agile Engineering & Cloud Deployment",
        description: "Agile principles, Scrum framework, sprints, packaging, containerization with Docker, and cloud web hosting pipelines.",
        lessons: [
          {
            id: "fs-m14-l1",
            title: "Agile Development Principles & Scrum Framework",
            duration: "20 min",
            content: "Agile software engineering values working software, customer collaboration, and responding to change over rigid documentation. Scrum is the leading Agile framework. Core components: 1. Roles (Product Owner managing requirements, Scrum Master facilitating velocity, Developers building solutions), 2. Artifacts (Product Backlog containing user stories, Sprint Backlog for active work, Increment delivering usable features), 3. Events (Sprint Planning, Sprints lasting 1-4 weeks, Daily Standup meetings answering 3 questions: What did I do yesterday? What will I do today? Are there any blockers?, Sprint Review with stakeholders, and Sprint Retrospectives to inspect and adapt).",
            realWorldExample: "Organizing modern software engineering teams into two-week sprints to build and ship feature releases continuously.",
            codeSnippet: `// Agile User Story Template & Sprint Task Schema\nconst sprintTask = {\n  userStory: \"As a B.Tech student, I want to view my unit-wise lecture notes so that I can prepare for semester exams.\",\n  acceptanceCriteria: [\n    \"User can navigate between Unit I to Unit V\",\n    \"Code snippets can be copied with one click\",\n    \"Progress is stored in local storage and database\"\n  ],\n  storyPoints: 5,\n  status: \"In Progress\" // Backlog -> Sprint -> In Progress -> Code Review -> Done\n};`,
            keyPoints: [
              "Agile delivers working software in short, iterative, incremental cycles called Sprints.",
              "Daily standup meetings foster rapid communication and remove blockers immediately.",
              "User stories capture feature requirements from the perspective of the end user."
            ],
            practiceTask: "Draft a complete Agile user story with acceptance criteria and estimate story points for a student login feature."
          },
          {
            id: "fs-m14-l2",
            title: "Cloud Deployment, Containerization & CI/CD Pipelines",
            duration: "25 min",
            content: "Modern full stack applications are packaged into self-contained container images using Docker or compiled into executable JARs and deployed to Cloud platforms (AWS, Microsoft Azure, Google Cloud, Vercel). Cloud hosting provides auto-scaling, high availability, and managed databases. Continuous Integration and Continuous Deployment (CI/CD) pipelines automate testing and deployment: on every 'git push' to the main branch, automated test runners execute unit tests, build production bundles, and push release containers to cloud servers with zero downtime.",
            realWorldExample: "Deploying the VELFIRE full stack application with React frontend on Vercel and backend services on cloud compute.",
            codeSnippet: `# Dockerfile for Containerizing Web Backend\nFROM eclipse-temurin:17-jdk-alpine\nWORKDIR /app\nCOPY target/velfire-backend.jar app.jar\nEXPOSE 8080\nENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]\n\n# Cloud Build & Run Commands\n# 1. Package backend: mvn clean package -DskipTests\n# 2. Build Docker container: docker build -t velfire-backend:1.0 .\n# 3. Run container locally: docker run -p 8080:8080 velfire-backend:1.0`,
            keyPoints: [
              "Containerization packages code along with its runtime and dependencies, ensuring it runs identically everywhere.",
              "CI/CD pipelines automate building, testing, and cloud deployment on every Git commit.",
              "Store sensitive database passwords and API keys in cloud environment variables, never hardcoded in source."
            ],
            practiceTask: "Write a Dockerfile or deployment script for packaging and deploying a full stack web application to a cloud server."
          }
        ]
      }
    ]
  },
  {
    id: "react-js",
    title: "React.js Mastery",
    category: "Full Stack Development",
    level: "Intermediate",
    estimatedDuration: "9 Hours",
    shortDescription: "Build dynamic, fast Single Page Applications (SPAs) with modern React hooks, Context, and React Router.",
    fullDescription: "React is the most popular frontend JavaScript library built by Meta. Learn component architecture, state hooks, custom hooks, and performance optimization.",
    instructor: {
      name: "Alex Rivera",
      title: "Lead Frontend Engineer",
      avatar: "👨‍🎨"
    },
    icon: "⚛️",
    bannerGradient: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
    learningObjectives: [
      "Understand Virtual DOM reconciliation and JSX compilation",
      "Master useState, useEffect, useRef, and useMemo hooks",
      "Build custom hooks for reusable state logic (e.g. useLocalStorage, useFetch)",
      "Manage routing and sub-pages with React Router v6",
      "Integrate REST APIs cleanly using Axios or Fetch API"
    ],
    skills: ["React.js", "JSX", "Hooks", "Context API", "React Router", "State Management"],
    modules: [
      {
        id: "react-m1",
        title: "Module 1 – Modern JS & React Ecosystem",
        description: "ES6+, JSX syntax, and Virtual DOM concepts.",
        lessons: [
          { id: "react-m1-l1", title: "Why React & Virtual DOM?", duration: "15 min", content: "React updates the UI efficiently by calculating minimal diffs on a Virtual DOM in memory.", realWorldExample: "Rendering thousands of live social media posts without page refreshes.", codeSnippet: `const element = <h1>Hello, React!</h1>;`, keyPoints: ["Declarative UI approach.", "Component-driven architecture."], practiceTask: "Render a JSX element containing dynamic user props." }
        ]
      },
      {
        id: "react-m2",
        title: "Module 2 – Components & Props",
        description: "Functional components, prop passing, and destructuring.",
        lessons: [
          { id: "react-m2-l1", title: "Props & Composition", duration: "20 min", content: "Pass values, functions, and JSX elements down to child components.", realWorldExample: "Creating standard card containers wrapped around dynamic content.", codeSnippet: `function Badge({ text, type = "info" }) {\n  return <span className={\`badge \${type}\`}>{text}</span>;\n}`, keyPoints: ["Props are read-only.", "Children prop allows component nesting."], practiceTask: "Build a Card component accepting title, subtitle, and children." }
        ]
      },
      {
        id: "react-m3",
        title: "Module 3 – State & Lifecycle (useState & useEffect)",
        description: "Managing local state and side effects.",
        lessons: [
          { id: "react-m3-l1", title: "Managing State with useState", duration: "20 min", content: "Trigger re-renders when data changes.", realWorldExample: "Toggling dropdown menus and drawer sidebars.", codeSnippet: `const [isOpen, setIsOpen] = useState(false);\nconst toggle = () => setIsOpen(!isOpen);`, keyPoints: ["State updates are asynchronous.", "Functional state updates prevent race conditions."], practiceTask: "Build a accordion component that expands/collapses on click." }
        ]
      },
      {
        id: "react-m4",
        title: "Module 4 – Form Handling & Controlled Inputs",
        description: "Form validation, controlled inputs, and custom input handlers.",
        lessons: [
          { id: "react-m4-l1", title: "Controlled Form Components", duration: "20 min", content: "Bind input values directly to React state.", realWorldExample: "Building search filters that update results as the user types.", codeSnippet: `const [form, setForm] = useState({ email: '', password: '' });\nconst handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });`, keyPoints: ["Single source of truth for form data.", "Prevents default form submission reloads."], practiceTask: "Create a login form with validation error messages." }
        ]
      },
      {
        id: "react-m5",
        title: "Module 5 – Custom Hooks",
        description: "Extract reusable logic into custom hooks.",
        lessons: [
          { id: "react-m5-l1", title: "Building useLocalStorage Hook", duration: "20 min", content: "Encapsulate local storage persistence into a clean hook.", realWorldExample: "Saving theme preferences or course progress across browser refreshes.", codeSnippet: `function useLocalStorage(key, initialValue) {\n  const [value, setValue] = useState(() => {\n    const saved = localStorage.getItem(key);\n    return saved ? JSON.parse(saved) : initialValue;\n  });\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n  return [value, setValue];\n}`, keyPoints: ["Custom hook names must start with 'use'.", "Promotes code reuse across components."], practiceTask: "Create a useWindowSize hook tracking viewport dimensions." }
        ]
      },
      {
        id: "react-m6",
        title: "Module 6 – React Router v6",
        description: "Client-side routing, URL params, and nested routes.",
        lessons: [
          { id: "react-m6-l1", title: "Navigating Between Pages", duration: "20 min", content: "Create multi-page feel in single page applications without full browser page reloads.", realWorldExample: "Navigating from Course List (/courses) to Course Details (/courses/:id).", codeSnippet: `<Routes>\n  <Route path="/" element={<Home />} />\n  <Route path="/course/:id" element={<CourseDetail />} />\n</Routes>`, keyPoints: ["Link component prevents full page refreshes.", "useParams extracts URL parameters."], practiceTask: "Set up client routing for Home, Dashboard, and Course views." }
        ]
      },
      {
        id: "react-m7",
        title: "Module 7 – API Integration & Data Fetching",
        description: "Fetching API data cleanly with loading & error states.",
        lessons: [
          { id: "react-m7-l1", title: "Handling Async Data Fetching", duration: "20 min", content: "Manage loading spinners, error banners, and successful data rendering.", realWorldExample: "Loading live course lists from a backend database API.", codeSnippet: `const [loading, setLoading] = useState(true);\nuseEffect(() => {\n  fetchData().then(data => { setData(data); setLoading(false); });\n}, []);`, keyPoints: ["Always handle loading and error UI states.", "Clean up subscription effects."], practiceTask: "Fetch and display a list of items with a loading skeleton." }
        ]
      },
      {
        id: "react-m8",
        title: "Module 8 – Context API & Global State",
        description: "Global theme and session state provider pattern.",
        lessons: [
          { id: "react-m8-l1", title: "Global Context Architecture", duration: "20 min", content: "Pass application configuration state globally.", realWorldExample: "Sharing authentication user data with header, sidebar, and profile pages.", codeSnippet: `const AuthContext = createContext();`, keyPoints: ["Avoid overusing context for state that belongs locally."], practiceTask: "Wrap your application in a custom context provider." }
        ]
      },
      {
        id: "react-m9",
        title: "Module 9 – React Capstone SPA Project",
        description: "Build a production React application with custom hooks and router.",
        lessons: [
          { id: "react-m9-l1", title: "React Production Capstone", duration: "30 min", content: "Synthesize all concepts into a responsive Single Page Application.", realWorldExample: "Deploying a client-side web application to Vercel/Netlify.", codeSnippet: `// Production React Build Complete ✓`, keyPoints: ["Optimized production build bundle.", "Responsive and accessible design."], practiceTask: "Build and deploy a complete React web application." }
        ]
      }
    ]
  },
  {
    id: "fastapi-python",
    title: "FastAPI & Python Backend",
    category: "Python",
    level: "Intermediate",
    estimatedDuration: "8 Hours",
    shortDescription: "Build high-performance asynchronous REST APIs with Python, FastAPI, Pydantic, and SQLAlchemy.",
    fullDescription: "FastAPI is one of the fastest growing Python backend frameworks. Built on modern Python type hints, it automatically generates Interactive OpenAPI/Swagger documentation.",
    instructor: {
      name: "Dr. Aris Thorne",
      title: "Senior AI Engineer",
      avatar: "👨‍🏫"
    },
    icon: "⚡",
    bannerGradient: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
    learningObjectives: [
      "Understand ASGI asynchronous web servers and type hints",
      "Define request/response schemas with Pydantic validation",
      "Build CRUD REST API endpoints with path & query parameters",
      "Connect to databases using SQLAlchemy ORM and Alembic migrations",
      "Implement JWT authentication and security headers",
      "Containerize FastAPI apps with Docker"
    ],
    skills: ["FastAPI", "Python", "Pydantic", "Async/Await", "SQLAlchemy", "REST APIs", "Docker"],
    modules: [
      {
        id: "fast-m1",
        title: "Module 1 – Intro to FastAPI & Async Python",
        description: "ASGI servers, Uvicorn, and Python type hints.",
        lessons: [
          { id: "fast-m1-l1", title: "First FastAPI Application", duration: "15 min", content: "FastAPI leverages Python type hints for fast execution and automatic OpenAPI documentation.", realWorldExample: "Building microservices for AI model predictions and data processing.", codeSnippet: `from fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/")\ndef read_root():\n    return {"status": "FastAPI Running", "version": "2.0"}`, keyPoints: ["Access interactive docs at /docs (Swagger UI).", "Supports async def for non-blocking I/O."], practiceTask: "Create a FastAPI route returning server status JSON." }
        ]
      },
      {
        id: "fast-m2",
        title: "Module 2 – Request Validation with Pydantic",
        description: "Pydantic schemas, data types, and validation rules.",
        lessons: [
          { id: "fast-m2-l1", title: "Defining Pydantic Data Models", duration: "20 min", content: "Validate incoming JSON request bodies automatically.", realWorldExample: "Validating user registration payloads before database insertion.", codeSnippet: `from pydantic import BaseModel, EmailStr\n\nclass UserCreate(BaseModel):\n    name: str\n    email: str\n    age: int`, keyPoints: ["Pydantic raises automatic 422 Unprocessable Entity for invalid payloads.", "Ensures strong runtime data typing."], practiceTask: "Create a Pydantic model for a Course object." }
        ]
      },
      {
        id: "fast-m3",
        title: "Module 3 – Path Parameters & Query Parameters",
        description: "Routing parameters, default values, and status codes.",
        lessons: [
          { id: "fast-m3-l1", title: "RESTful URL Routing", duration: "20 min", content: "Pass parameters in the URL path or query string.", realWorldExample: "Filtering courses by category (/courses?category=Python) or ID (/courses/12).", codeSnippet: `@app.get("/courses/{course_id}")\ndef get_course(course_id: str, level: str = "All"):\n    return {"course_id": course_id, "filter_level": level}`, keyPoints: ["Path parameters capture URL segments.", "Query parameters handle optional filtering."], practiceTask: "Create a route searching items by keyword and pagination limits." }
        ]
      },
      {
        id: "fast-m4",
        title: "Module 4 – Database Integration with SQLAlchemy",
        description: "Connecting FastAPI to PostgreSQL/SQLite using ORM.",
        lessons: [
          { id: "fast-m4-l1", title: "SQLAlchemy ORM Models", duration: "25 min", content: "Map Python classes directly to database tables.", realWorldExample: "Executing database transactions within FastAPI request sessions.", codeSnippet: `class CourseDB(Base):\n    __tablename__ = "courses"\n    id = Column(String, primary_key=True)\n    title = Column(String)`, keyPoints: ["Dependency injection (Depends) handles database sessions.", "Alembic handles database migrations."], practiceTask: "Define a database model for user progress records." }
        ]
      },
      {
        id: "fast-m5",
        title: "Module 5 – Dependency Injection & Middleware",
        description: "Reusing logic using FastAPI Depends().",
        lessons: [
          { id: "fast-m5-l1", title: "FastAPI Dependency Injection", duration: "20 min", content: "Inject database sessions and authentication checks directly into path handlers.", realWorldExample: "Verifying authorization headers across 20 different protected routes.", codeSnippet: `def get_db():\n    db = SessionLocal()\n    try:\n        yield db\n    finally:\n        db.close()`, keyPoints: ["Promotes DRY (Don't Repeat Yourself) principle.", "Simplifies unit testing with mock dependencies."], practiceTask: "Write a dependency checking if API key headers are present." }
        ]
      },
      {
        id: "fast-m6",
        title: "Module 6 – Authentication & OAuth2",
        description: "Password hashing with passlib and JWT bearer tokens.",
        lessons: [
          { id: "fast-m6-l1", title: "Building Secure Auth Flow", duration: "25 min", content: "Issue signed JWT access tokens upon verification.", realWorldExample: "Protecting user dashboard endpoints from unauthorized public access.", codeSnippet: `@app.post("/token")\ndef login(form_data: OAuth2PasswordRequestForm = Depends()):\n    # Verify credentials and return JWT\n    return {"access_token": token, "token_type": "bearer"}`, keyPoints: ["OAuth2PasswordBearer extracts Bearer tokens.", "Use bcrypt for password hashing."], practiceTask: "Create a protected endpoint returning current authenticated user profile." }
        ]
      },
      {
        id: "fast-m7",
        title: "Module 7 – Testing FastAPI Applications",
        description: "Unit testing with PyTest and TestClient.",
        lessons: [
          { id: "fast-m7-l1", title: "Automated Endpoint Testing", duration: "20 min", content: "Test API routes programmatically without running a full server.", realWorldExample: "Running automated test suites on every pull request before deployment.", codeSnippet: `from fastapi.testclient import TestClient\nclient = TestClient(app)\n\ndef test_read_main():\n    response = client.get("/")\n    assert response.status_code == 200`, keyPoints: ["TestClient simulates HTTP calls.", "Assertions verify status codes and JSON payloads."], practiceTask: "Write a PyTest test verifying the /token endpoint returns 401 for bad passwords." }
        ]
      },
      {
        id: "fast-m8",
        title: "Module 8 – Docker Containerization & Deployment",
        description: "Package FastAPI apps into production Docker images.",
        lessons: [
          { id: "fast-m8-l1", title: "Writing a Dockerfile for FastAPI", duration: "25 min", content: "Package Python code, Uvicorn server, and dependencies into reproducible Docker containers.", realWorldExample: "Deploying microservices to AWS ECS, Kubernetes, or Render.", codeSnippet: `FROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`, keyPoints: ["Docker guarantees environment consistency.", "Lightweight slim base images."], practiceTask: "Write a Dockerfile for a FastAPI backend service." }
        ]
      }
    ]
  },
  {
    id: "ml-fundamentals",
    title: "Machine Learning Fundamentals",
    category: "Artificial Intelligence & Machine Learning",
    level: "Intermediate",
    estimatedDuration: "10 Hours",
    shortDescription: "Build, evaluate, and deploy Machine Learning models using Python, NumPy, Pandas, and Scikit-Learn.",
    fullDescription: "Machine Learning empowers computers to learn patterns from data and make intelligent predictions. Learn key algorithms from Linear Regression to Neural Networks.",
    instructor: {
      name: "Dr. Aris Thorne",
      title: "Senior AI Engineer",
      avatar: "👨‍🏫"
    },
    icon: "🤖",
    bannerGradient: "linear-gradient(135deg, #6b21a8 0%, #a855f7 100%)",
    learningObjectives: [
      "Understand Supervised vs Unsupervised vs Reinforcement Learning",
      "Process & clean datasets using Pandas and NumPy",
      "Train Regression models (Linear Regression, Decision Trees)",
      "Train Classification models (Logistic Regression, Random Forest, SVM)",
      "Evaluate models with Precision, Recall, F1-Score, and ROC-AUC",
      "Deploy ML models via REST API"
    ],
    skills: ["Python", "Pandas", "NumPy", "Scikit-Learn", "Regression", "Classification", "Model Evaluation"],
    modules: [
      {
        id: "ml-m1",
        title: "Module 1 – Introduction to AI & Machine Learning",
        description: "Core concepts, terminology, and ML workflow pipeline.",
        lessons: [
          { id: "ml-m1-l1", title: "What is Machine Learning?", duration: "15 min", content: "ML algorithms discover mathematical patterns in training data to make predictions on unseen data.", realWorldExample: "Spam filters identifying junk emails based on historical message features.", codeSnippet: `# Traditional Programming: Data + Rules -> Answers\n# Machine Learning: Data + Answers -> Rules`, keyPoints: ["Supervised learning uses labeled training targets.", "Unsupervised learning discovers hidden patterns without labels."], practiceTask: "Identify 3 real-world machine learning applications in your daily routine." }
        ]
      },
      {
        id: "ml-m2",
        title: "Module 2 – Python for Data Processing (NumPy & Pandas)",
        description: "Dataframes, feature matrix creation, and missing value handling.",
        lessons: [
          { id: "ml-m2-l1", title: "Pandas DataFrames for ML", duration: "25 min", content: "Load, inspect, filter, and preprocess raw CSV datasets into clean numerical feature matrices.", realWorldExample: "Handling missing values and encoding categorical attributes.", codeSnippet: `import pandas as pd\ndf = pd.read_csv('dataset.csv')\ndf.fillna(df.median(), inplace=True)\nX = df[['feature1', 'feature2']]\ny = df['target']`, keyPoints: ["X represents feature matrix; y represents target vector.", "Always split into train and test sets."], practiceTask: "Load a sample dataset and handle missing values." }
        ]
      },
      {
        id: "ml-m3",
        title: "Module 3 – Exploratory Data Analysis (EDA)",
        description: "Visualizing feature distributions and correlation matrices.",
        lessons: [
          { id: "ml-m3-l1", title: "Visualizing Feature Relationships", duration: "20 min", content: "Identify feature correlations and outliers using Matplotlib and Seaborn.", realWorldExample: "Detecting highly correlated features before model training.", codeSnippet: `import seaborn as sns\nsns.heatmap(df.corr(), annot=True)`, keyPoints: ["EDA guides feature selection.", "Detects skewness and missing data distribution."], practiceTask: "Plot a heatmap correlation matrix for a dataset." }
        ]
      },
      {
        id: "ml-m4",
        title: "Module 4 – Supervised Learning: Regression",
        description: "Linear Regression, Polynomial Regression, and MSE evaluation.",
        lessons: [
          { id: "ml-m4-l1", title: "Linear Regression with Scikit-Learn", duration: "25 min", content: "Predict continuous numerical outputs by fitting a linear equation to observations.", realWorldExample: "Predicting house prices or estimating student completion time.", codeSnippet: `from sklearn.linear_model import LinearRegression\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\npredictions = model.predict(X_test)`, keyPoints: ["Mean Squared Error (MSE) measures prediction residual error.", "R-squared score measures variance explained."], practiceTask: "Train a Linear Regression model predicting course completion percentage." }
        ]
      },
      {
        id: "ml-m5",
        title: "Module 5 – Supervised Learning: Classification",
        description: "Logistic Regression, Decision Trees, and Random Forests.",
        lessons: [
          { id: "ml-m5-l1", title: "Random Forest Classification", duration: "25 min", content: "Predict discrete categorical classes using ensemble decision tree classifiers.", realWorldExample: "Predicting whether a student will pass the Mock Interview Gate (Pass/Fail).", codeSnippet: `from sklearn.ensemble import RandomForestClassifier\nclf = RandomForestClassifier(n_estimators=100)\nclf.fit(X_train, y_train)`, keyPoints: ["Random Forest combines multiple decision trees for high accuracy.", "Handles non-linear feature relationships effectively."], practiceTask: "Train a Random Forest classifier on a student performance dataset." }
        ]
      },
      {
        id: "ml-m6",
        title: "Module 6 – Model Evaluation & Metrics",
        description: "Confusion Matrix, Precision, Recall, F1-Score, and ROC-AUC.",
        lessons: [
          { id: "ml-m6-l1", title: "Understanding the Confusion Matrix", duration: "20 min", content: "Evaluate classification performance across True Positives, False Positives, True Negatives, and False Negatives.", realWorldExample: "In medical diagnosis, high Recall is critical to avoid false negatives.", codeSnippet: `from sklearn.metrics import classification_report, confusion_matrix\nprint(classification_report(y_test, predictions))`, keyPoints: ["Accuracy alone can be misleading on imbalanced datasets.", "F1-Score balances Precision and Recall."], practiceTask: "Compute and interpret a classification report for a trained model." }
        ]
      },
      {
        id: "ml-m7",
        title: "Module 7 – Unsupervised Learning & Clustering",
        description: "K-Means Clustering and Principal Component Analysis (PCA).",
        lessons: [
          { id: "ml-m7-l1", title: "K-Means Customer Segmentation", duration: "20 min", content: "Group unlabeled data points into clusters based on feature similarity.", realWorldExample: "Segmenting website users into beginner, active, and power learner personas.", codeSnippet: `from sklearn.cluster import KMeans\nkmeans = KMeans(n_clusters=3)\nkmeans.fit(X)`, keyPoints: ["K-Means minimizes within-cluster variance.", "Elbow Method helps choose optimal cluster count K."], practiceTask: "Cluster a student dataset into 3 learning velocity groups." }
        ]
      },
      {
        id: "ml-m8",
        title: "Module 8 – Feature Engineering & Scaling",
        description: "StandardScaler, One-Hot Encoding, and Feature Selection.",
        lessons: [
          { id: "ml-m8-l1", title: "Preprocessing & Scaling Features", duration: "20 min", content: "Normalize feature scales (StandardScaler) and convert text categories to numbers (OneHotEncoder).", realWorldExample: "Scaling age (20-60) and salary (30k-150k) to equal variance.", codeSnippet: `from sklearn.preprocessing import StandardScaler\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)`, keyPoints: ["Algorithms like SVM and K-Means require feature scaling.", "Fit scalers on train set only to prevent data leakage."], practiceTask: "Apply StandardScaler and OneHotEncoder to a mixed raw dataset." }
        ]
      },
      {
        id: "ml-m9",
        title: "Module 9 – Introduction to Neural Networks",
        description: "Perceptrons, activation functions, and deep learning overview.",
        lessons: [
          { id: "ml-m9-l1", title: "Artificial Neural Networks (ANN)", duration: "25 min", content: "Understand how artificial neurons process inputs through weighted connections and non-linear activation functions.", realWorldExample: "Foundation behind modern AI systems, computer vision, and LLMs.", codeSnippet: `# Forward Pass: z = wx + b; a = activation(z)`, keyPoints: ["Activations like ReLU and Sigmoid introduce non-linearity.", "Backpropagation updates model weights via gradient descent."], practiceTask: "Draw a diagram of a 3-layer Feedforward Neural Network." }
        ]
      },
      {
        id: "ml-m10",
        title: "Module 10 – Deploying ML Models as Microservices",
        description: "Save trained models (joblib) and serve predictions via FastAPI.",
        lessons: [
          { id: "ml-m10-l1", title: "Deploying Model API Endpoint", duration: "30 min", content: "Serialize trained Scikit-Learn models using joblib and serve predictions through a FastAPI REST endpoint.", realWorldExample: "Serving real-time ATS resume match scoring models to web clients.", codeSnippet: `import joblib\nmodel = joblib.load('trained_model.pkl')\n\n@app.post("/predict")\ndef predict(features: FeatureInput):\n    pred = model.predict([features.vector])\n    return {"prediction": int(pred[0])}`, keyPoints: ["Joblib serializes python model objects efficiently.", "Rest API enables web applications to trigger predictions."], practiceTask: "Build an API endpoint that takes numerical parameters and returns a trained model prediction." }
        ]
      }
    ]
  },
  {
    id: "cloud-fundamentals",
    title: "Cloud Computing Fundamentals",
    category: "Cloud Computing",
    level: "Beginner",
    estimatedDuration: "8 Hours",
    shortDescription: "Learn core cloud infrastructure concepts, AWS services (EC2, S3, VPC), serverless, and IAM security.",
    fullDescription: "Cloud computing powers modern software infrastructure. Understand IaaS, PaaS, SaaS models, AWS core services, virtual networking, and automated cloud deployments.",
    instructor: {
      name: "Marcus Vance",
      title: "Lead DevOps Engineer",
      avatar: "👨‍💻"
    },
    icon: "☁️",
    bannerGradient: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
    learningObjectives: [
      "Understand cloud service models (IaaS, PaaS, SaaS) and public/private clouds",
      "Launch and configure AWS EC2 virtual compute instances",
      "Store object data securely in AWS S3 buckets",
      "Configure Virtual Private Clouds (VPC), subnets, and security groups",
      "Manage identity permissions with IAM roles and policies"
    ],
    skills: ["AWS", "Cloud Architecture", "EC2", "S3", "VPC", "IAM", "DevOps"],
    modules: [
      {
        id: "cloud-m1",
        title: "Module 1 – Cloud Fundamentals & Service Models",
        description: "IaaS, PaaS, SaaS, global infrastructure, and AWS cloud overview.",
        lessons: [
          { id: "cloud-m1-l1", title: "What is Cloud Computing?", duration: "15 min", content: "On-demand delivery of compute, storage, database, and networking power via the internet with pay-as-you-go pricing.", realWorldExample: "Replacing physical server hardware with elastic cloud instances.", codeSnippet: `Cloud Models: IaaS (AWS EC2), PaaS (Heroku/Vercel), SaaS (Google Workspace)`, keyPoints: ["Eliminates up-front hardware capital expenditures.", "Elastic scalability on demand."], practiceTask: "Identify whether AWS EC2, Vercel, and Office 365 represent IaaS, PaaS, or SaaS." }
        ]
      },
      {
        id: "cloud-m2",
        title: "Module 2 – Compute Services (AWS EC2)",
        description: "Launching Linux compute instances and SSH management.",
        lessons: [
          { id: "cloud-m2-l1", title: "Provisioning EC2 Virtual Machines", duration: "25 min", content: "Launch virtual servers in the cloud, attach key pairs, and configure security group firewalls.", realWorldExample: "Hosting web application backends on dedicated Linux compute instances.", codeSnippet: `# Connect via SSH:\nssh -i "my-key.pem" ubuntu@ec2-public-ip.compute-1.amazonaws.com`, keyPoints: ["Choose instance types (t3.micro, c5.large) based on workload.", "Security groups act as virtual firewalls."], practiceTask: "Write security group rules allowing HTTP (port 80) and SSH (port 22) traffic." }
        ]
      },
      {
        id: "cloud-m3",
        title: "Module 3 – Cloud Storage (AWS S3 & EBS)",
        description: "Object storage buckets, access policies, and persistent block volumes.",
        lessons: [
          { id: "cloud-m3-l1", title: "AWS S3 Object Storage", duration: "20 min", content: "Store and retrieve files, media assets, and static web host files globally.", realWorldExample: "Hosting user profile avatars and downloadable PDF certificates in S3 buckets.", codeSnippet: `import boto3\ns3 = boto3.client('s3')\ns3.upload_file('cert.pdf', 'my-bucket', 'cert.pdf')`, keyPoints: ["S3 bucket names must be globally unique.", "Supports 99.999999999% (11 9's) durability."], practiceTask: "Write an S3 bucket policy granting public read access to media files." }
        ]
      },
      {
        id: "cloud-m4",
        title: "Module 4 – Cloud Networking & VPCs",
        description: "Virtual Private Clouds, Public/Private subnets, and Internet Gateways.",
        lessons: [
          { id: "cloud-m4-l1", title: "Designing Custom Virtual Private Cloud (VPC)", duration: "25 min", content: "Isolate cloud resources inside private IP address ranges with custom routing rules.", realWorldExample: "Placing public web servers in Public Subnets and databases in isolated Private Subnets.", codeSnippet: `VPC CIDR Block: 10.0.0.0/16\nPublic Subnet: 10.0.1.0/24\nPrivate Subnet: 10.0.2.0/24`, keyPoints: ["Internet Gateways connect Public Subnets to the web.", "NAT Gateways allow Private Subnets to make outbound updates."], practiceTask: "Design a subnet topology diagram separating web apps and databases." }
        ]
      },
      {
        id: "cloud-m5",
        title: "Module 5 – Identity & Access Management (IAM)",
        description: "Users, groups, roles, and principle of least privilege.",
        lessons: [
          { id: "cloud-m5-l1", title: "AWS IAM Permissions & Security", duration: "20 min", content: "Grant granular permissions to users and cloud services using JSON policy documents.", realWorldExample: "Granting an EC2 server read-only access to a specific S3 bucket via IAM Roles.", codeSnippet: `{\n  "Effect": "Allow",\n  "Action": "s3:GetObject",\n  "Resource": "arn:aws:s3:::my-bucket/*"\n}`, keyPoints: ["Enforce Multi-Factor Authentication (MFA).", "Always follow the Principle of Least Privilege."], practiceTask: "Draft a JSON IAM policy granting read access to a specific S3 bucket." }
        ]
      },
      {
        id: "cloud-m6",
        title: "Module 6 – Database Services (AWS RDS & DynamoDB)",
        description: "Managed relational (RDS) and NoSQL (DynamoDB) databases.",
        lessons: [
          { id: "cloud-m6-l1", title: "Managed Cloud Databases", duration: "20 min", content: "Deploy automated PostgreSQL database clusters with automatic failover and backups.", realWorldExample: "Offloading database maintenance, patching, and backups to AWS RDS.", codeSnippet: `RDS Instance Engine: PostgreSQL 15 | Multi-AZ Deployment`, keyPoints: ["Multi-AZ deployment ensures high availability.", "DynamoDB provides single-digit millisecond NoSQL performance."], practiceTask: "Compare managed AWS RDS vs running PostgreSQL on an EC2 instance." }
        ]
      },
      {
        id: "cloud-m7",
        title: "Module 7 – Serverless Architecture (AWS Lambda)",
        description: "Running event-driven code without provisioning servers.",
        lessons: [
          { id: "cloud-m7-l1", title: "Event-Driven Serverless Functions", duration: "20 min", content: "Execute Python backend code in response to events (e.g. S3 uploads or HTTP API requests).", realWorldExample: "Automatically generating thumbnail images when a user uploads a profile photo.", codeSnippet: `def lambda_handler(event, context):\n    print("Processing event:", event)\n    return {"statusCode": 200, "body": "Function Executed"}`, keyPoints: ["Zero server management; scales automatically.", "Pay only for compute time consumed."], practiceTask: "Write a Python AWS Lambda function responding to an HTTP event." }
        ]
      },
      {
        id: "cloud-m8",
        title: "Module 8 – Cloud Deployment Capstone",
        description: "Deploy a resilient, auto-scaling cloud application architecture.",
        lessons: [
          { id: "cloud-m8-l1", title: "Cloud Deployment Project", duration: "30 min", content: "Assemble an auto-scaled EC2 web cluster behind an Application Load Balancer connected to RDS.", realWorldExample: "Architecting enterprise fault-tolerant cloud infrastructure.", codeSnippet: `// Cloud Architecture Verified ✓`, keyPoints: ["High availability across multiple Availability Zones.", "Auto Scaling manages traffic spikes automatically."], practiceTask: "Sketch a fault-tolerant multi-region cloud deployment architecture." }
        ]
      }
    ]
  },
  {
    id: "cybersecurity-fundamentals",
    title: "Cybersecurity Fundamentals",
    category: "Cybersecurity",
    level: "Beginner",
    estimatedDuration: "8 Hours",
    shortDescription: "Learn core security principles, networking security, ethical hacking tools, OWASP Top 10, and cryptography.",
    fullDescription: "Cybersecurity protects computer systems, networks, and data from digital attacks. Master security concepts, vulnerability assessment, and defensive strategies.",
    instructor: {
      name: "Marcus Vance",
      title: "Senior Security Specialist",
      avatar: "👨‍💻"
    },
    icon: "🛡️",
    bannerGradient: "linear-gradient(135deg, #991b1b 0%, #dc2626 100%)",
    learningObjectives: [
      "Understand the CIA Triad (Confidentiality, Integrity, Availability)",
      "Analyze network protocols (TCP/IP, DNS, HTTP vs HTTPS, Firewalls)",
      "Master symmetric and asymmetric cryptography principles",
      "Identify OWASP Top 10 web vulnerabilities (SQL Injection, XSS)",
      "Conduct basic vulnerability scans using security tools"
    ],
    skills: ["Cybersecurity", "Networking", "OWASP Top 10", "Cryptography", "Ethical Hacking", "Security Audit"],
    modules: [
      {
        id: "sec-m1",
        title: "Module 1 – Security Principles & CIA Triad",
        description: "Confidentiality, Integrity, Availability, and Threat Vectors.",
        lessons: [
          { id: "sec-m1-l1", title: "The CIA Triad", duration: "15 min", content: "The foundational model for security policies: Confidentiality (data secrecy), Integrity (data authenticity), and Availability (uninterrupted access).", realWorldExample: "Encrypting user passwords (Confidentiality) and maintaining 99.99% uptime (Availability).", codeSnippet: `CIA Model: Confidentiality | Integrity | Availability`, keyPoints: ["Authentication verifies who you are.", "Authorization determines what actions you can perform."], practiceTask: "Categorize 3 security incidents under Confidentiality, Integrity, or Availability breaches." }
        ]
      },
      {
        id: "sec-m2",
        title: "Module 2 – Network Security & Firewalls",
        description: "OSI Model, Wireshark, Port Scanning, and Firewall Rules.",
        lessons: [
          { id: "sec-m2-l1", title: "Network Protocols & Traffic Inspection", duration: "20 min", content: "Inspect network packets across TCP/IP layers to detect unauthorized port scans and intrusions.", realWorldExample: "Configuring firewalls to block unauthorized SSH attempts on port 22.", codeSnippet: `# Nmap Port Scan Command:\nnmap -sV -p 80,443,22 target_ip`, keyPoints: ["Port 80 = HTTP (unencrypted); Port 443 = HTTPS (SSL/TLS).", "Firewalls filter traffic based on source IP and port rules."], practiceTask: "Identify common default ports for HTTP, HTTPS, SSH, and MySQL." }
        ]
      },
      {
        id: "sec-m3",
        title: "Module 3 – Cryptography & Encryption",
        description: "Symmetric vs Asymmetric encryption, Hashing, and SSL/TLS.",
        lessons: [
          { id: "sec-m3-l1", title: "Symmetric vs Asymmetric Encryption", duration: "20 min", content: "Understand AES symmetric key encryption vs RSA/ECC public-private key pairs.", realWorldExample: "HTTPS uses asymmetric RSA key exchange to establish a fast symmetric session key.", codeSnippet: `Public Key: Encrypts data (Shared publicly)\nPrivate Key: Decrypts data (Kept secret)`, keyPoints: ["Hashing algorithms (SHA-256) are one-way functions.", "Digital signatures verify message sender authenticity."], practiceTask: "Explain why password storage requires salted hashes instead of reversible encryption." }
        ]
      },
      {
        id: "sec-m4",
        title: "Module 4 – Web Application Security (OWASP Top 10)",
        description: "SQL Injection, Cross-Site Scripting (XSS), and CSRF.",
        lessons: [
          { id: "sec-m4-l1", title: "Preventing SQL Injection & XSS", duration: "25 min", content: "Analyze how attackers inject malicious SQL queries or JavaScript scripts into unvalidated input fields.", realWorldExample: "Using parameterized SQL queries to completely neutralize SQL Injection threats.", codeSnippet: `// Vulnerable: "SELECT * FROM users WHERE input = '" + req.body + "'" \n// Secure: db.query("SELECT * FROM users WHERE input = $1", [req.body])`, keyPoints: ["Never trust client-side user input.", "Sanitize and escape all input before rendering on UI."], practiceTask: "Fix a vulnerable SQL query string using parameterized inputs." }
        ]
      },
      {
        id: "sec-m5",
        title: "Module 5 – Ethical Hacking & Reconnaissance",
        description: "OSINT, vulnerability discovery, and penetration testing methodologies.",
        lessons: [
          { id: "sec-m5-l1", title: "Penetration Testing Methodology", duration: "20 min", content: "Understand ethical hacking phases: Reconnaissance, Scanning, Exploitation, and Remediation Reporting.", realWorldExample: "Companies hire certified ethical hackers (CEH) to discover security gaps before attackers do.", codeSnippet: `Phases: Recon -> Scan -> Gain Access -> Maintain Access -> Report`, keyPoints: ["Always obtain explicit written authorization before testing systems.", "Document clear remediation recommendations."], practiceTask: "Outline a penetration testing scope document." }
        ]
      },
      {
        id: "sec-m6",
        title: "Module 6 – Identity & Access Management (IAM)",
        description: "MFA, Role-Based Access Control (RBAC), and Zero Trust.",
        lessons: [
          { id: "sec-m6-l1", title: "Zero Trust Architecture", duration: "20 min", content: "Assume network compromise; verify explicitly and continuously for every access request.", realWorldExample: "Enforcing MFA and device compliance checks for remote corporate logins.", codeSnippet: `Zero Trust Mantra: "Never Trust, Always Verify"`, keyPoints: ["Role-Based Access Control (RBAC) grants access based on job duties.", "Multi-Factor Authentication (MFA) protects against stolen passwords."], practiceTask: "Design an RBAC permission matrix for Admin, Editor, and Viewer roles." }
        ]
      },
      {
        id: "sec-m7",
        title: "Module 7 – Incident Response & Forensics",
        description: "Detecting breaches, malware analysis, and disaster recovery.",
        lessons: [
          { id: "sec-m7-l1", title: "Incident Response Lifecycle", duration: "20 min", content: "Prepare, detect, contain, eradicate, and recover from cybersecurity incidents.", realWorldExample: "Isolating compromised cloud servers to stop ransomware propagation.", codeSnippet: `Steps: Preparation -> Detection -> Containment -> Eradication -> Recovery`, keyPoints: ["Speed of containment minimizes data exfiltration.", "Conduct post-incident retrospective reviews."], practiceTask: "Draft a 5-step containment checklist for a suspected malware outbreak." }
        ]
      },
      {
        id: "sec-m8",
        title: "Module 8 – Security Audit & Capstone Lab",
        description: "Execute a practical security audit and vulnerability assessment.",
        lessons: [
          { id: "sec-m8-l1", title: "System Vulnerability Assessment", duration: "30 min", content: "Perform a comprehensive security audit of a sample web platform and issue a remediation report.", realWorldExample: "Delivering executive cybersecurity compliance reviews.", codeSnippet: `// Security Audit Report Generated ✓`, keyPoints: ["Prioritize findings by CVSS severity score.", "Verify patch deployment."], practiceTask: "Write a security audit report evaluating password strength and HTTPS headers." }
        ]
      }
    ]
  },
  {
    id: "sap-fundamentals",
    title: "SAP S/4HANA Fundamentals",
    category: "SAP",
    level: "Beginner",
    estimatedDuration: "8 Hours",
    shortDescription: "Understand Enterprise Resource Planning (ERP), SAP S/4HANA navigation, FI/CO, MM, SD modules, and ABAP.",
    fullDescription: "SAP is the world leader in enterprise application software. Learn how global enterprises manage supply chains, finance, sales, and operations on SAP S/4HANA.",
    instructor: {
      name: "Sarah Jenkins",
      title: "SAP Solutions Consultant",
      avatar: "👩‍💼"
    },
    icon: "💼",
    bannerGradient: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    learningObjectives: [
      "Understand Enterprise Resource Planning (ERP) architecture and business processes",
      "Navigate SAP Fiori launchpad and transaction codes (T-Codes)",
      "Master SAP Financial Accounting (FI/CO) core workflows",
      "Understand Materials Management (MM) and Procurement cycles",
      "Learn Sales & Distribution (SD) order-to-cash process",
      "Understand ABAP programming basics and SAP HANA database"
    ],
    skills: ["SAP S/4HANA", "ERP", "SAP Fiori", "FI/CO", "MM Module", "SD Module", "Business Processes"],
    modules: [
      {
        id: "sap-m1",
        title: "Module 1 – Introduction to ERP & SAP S/4HANA",
        description: "Overview of enterprise systems, SAP history, and S/4HANA architecture.",
        lessons: [
          { id: "sap-m1-l1", title: "What is SAP & ERP?", duration: "15 min", content: "Enterprise Resource Planning (ERP) integrates core business functions (Finance, Sales, Inventory, HR) into a unified real-time database.", realWorldExample: "Global Fortune 500 companies tracking international inventory and financial ledgers.", codeSnippet: `SAP Core Structure: Enterprise DB -> S/4HANA Core -> Fiori User Experience`, keyPoints: ["S/4HANA runs in-memory for instant real-time analytics.", "Replaces legacy siloed business software."], practiceTask: "List 4 core business departments unified by an ERP system." }
        ]
      },
      {
        id: "sap-m2",
        title: "Module 2 – SAP Navigation & Fiori UI",
        description: "Fiori tiles, T-Codes, user settings, and session management.",
        lessons: [
          { id: "sap-m2-l1", title: "Navigating SAP Fiori Launchpad", duration: "20 min", content: "Master the modern role-based HTML5 visual interface and classic SAP GUI transaction codes.", realWorldExample: "Accessing purchase order creation tiles directly from a web browser.", codeSnippet: `T-Code Examples: /nME21N (Create PO), /nVA01 (Create Sales Order)`, keyPoints: ["Fiori tiles organize tasks by role.", "T-codes allow rapid navigation in SAP GUI."], practiceTask: "Explain the difference between SAP Fiori launchpad and classic SAP GUI." }
        ]
      },
      {
        id: "sap-m3",
        title: "Module 3 – Financial Accounting (FI/CO)",
        description: "General Ledger, Accounts Payable, Accounts Receivable, and Controlling.",
        lessons: [
          { id: "sap-m3-l1", title: "General Ledger & Financial Reporting", duration: "25 min", content: "Record journal entries, manage Chart of Accounts, and generate balance sheets in SAP FI.", realWorldExample: "Closing quarterly financial ledgers automatically across international subsidiaries.", codeSnippet: `GL Account Posting -> Credit/Debit Validation -> Real-time Ledger Update`, keyPoints: ["FI handles external financial reporting.", "CO handles internal managerial cost accounting."], practiceTask: "Map a credit and debit posting flow for a customer invoice." }
        ]
      },
      {
        id: "sap-m4",
        title: "Module 4 – Materials Management (MM) & Procurement",
        description: "Purchase Requisition, Purchase Order, Goods Receipt, and Invoice Verification.",
        lessons: [
          { id: "sap-m4-l1", title: "Procurement Cycle (P2P)", duration: "25 min", content: "Follow the Procure-to-Pay (P2P) workflow from purchase requisition to vendor payment.", realWorldExample: "Ordering raw manufacturing parts and receiving automated warehouse inventory updates.", codeSnippet: `P2P Flow: Requisition -> Purchase Order -> Goods Receipt -> Invoice Verification`, keyPoints: ["Goods Receipt updates inventory levels automatically.", "3-way matching verifies PO, Goods Receipt, and Vendor Invoice."], practiceTask: "Diagram the 4-step Procure-to-Pay workflow." }
        ]
      },
      {
        id: "sap-m5",
        title: "Module 5 – Sales & Distribution (SD)",
        description: "Sales Order creation, Delivery processing, Billing, and Payment.",
        lessons: [
          { id: "sap-m5-l1", title: "Order-to-Cash (O2C) Process", duration: "25 min", content: "Execute the Order-to-Cash sales cycle from customer inquiry to payment receipt.", realWorldExample: "Processing customer orders online and triggering automated warehouse shipping.", codeSnippet: `O2C Flow: Inquiry -> Sales Order -> Outbound Delivery -> Billing Document`, keyPoints: ["Integrates sales orders directly with MM inventory checks.", "Automates billing document creation."], practiceTask: "Trace a customer order from initial inquiry to final billing document." }
        ]
      },
      {
        id: "sap-m6",
        title: "Module 6 – Introduction to ABAP Programming",
        description: "SAP ABAP syntax, internal tables, and custom reports.",
        lessons: [
          { id: "sap-m6-l1", title: "ABAP Syntax & Data Dictionary", duration: "20 min", content: "Understand SAP's proprietary programming language used to customize business logic.", realWorldExample: "Writing custom ABAP reports calculating regional tax adjustments.", codeSnippet: `DATA: lv_student TYPE string.\nlv_student = 'Priya'.\nWRITE: / 'SAP Learner:', lv_student.`, keyPoints: ["ABAP code runs inside the SAP Application Server.", "SE11 is the ABAP Data Dictionary T-Code."], practiceTask: "Write a simple pseudo-code ABAP SELECT statement querying customer master data." }
        ]
      },
      {
        id: "sap-m7",
        title: "Module 7 – SAP Analytics & HANA Database",
        description: "In-memory computing speed, Core Data Services (CDS) views, and reporting.",
        lessons: [
          { id: "sap-m7-l1", title: "In-Memory SAP HANA Architecture", duration: "20 min", content: "Understand how SAP HANA's column-based in-memory database eliminates data redundancy.", realWorldExample: "Running complex financial consolidation reports in seconds instead of overnight batches.", codeSnippet: `HANA Feature: Columnar In-Memory Store + Real-time Analytics`, keyPoints: ["Columnar storage speeds up aggregation queries 100x.", "CDS views define analytical data models directly in the database layer."], practiceTask: "Explain why column-based databases perform faster for analytics." }
        ]
      },
      {
        id: "sap-m8",
        title: "Module 8 – Enterprise SAP Implementation Capstone",
        description: "Understand ASAP/Activate implementation methodology and go-live.",
        lessons: [
          { id: "sap-m8-l1", title: "SAP Activate Project Execution", duration: "30 min", content: "Follow the SAP Activate methodology phases (Discover, Prepare, Explore, Realize, Deploy, Run).", realWorldExample: "Managing enterprise ERP digital transformation projects.", codeSnippet: `// SAP S/4HANA Implementation Completed ✓`, keyPoints: ["Explore phase conducts business process fit-gap workshops.", "Deploy phase handles data migration and cutover."], practiceTask: "Create an implementation timeline across the 6 SAP Activate phases." }
        ]
      }
    ]
  },
  {
    id: "uiux-design",
    title: "UI/UX Design Fundamentals",
    category: "UI/UX Design",
    level: "Beginner",
    estimatedDuration: "8 Hours",
    shortDescription: "Learn User Experience (UX) research, wireframing, Figma interface design, color theory, and interactive prototyping.",
    fullDescription: "Create intuitive, beautiful, and accessible user experiences for web and mobile apps. Master design thinking, visual hierarchy, Figma tools, and design systems.",
    instructor: {
      name: "Alex Rivera",
      title: "Lead UI/UX Product Designer",
      avatar: "👨‍🎨"
    },
    icon: "🎨",
    bannerGradient: "linear-gradient(135deg, #db2777 0%, #e11d48 100%)",
    learningObjectives: [
      "Understand Design Thinking stages (Empathize, Define, Ideate, Prototype, Test)",
      "Conduct user research, interviews, and construct User Personas",
      "Build low-fidelity wireframes and information architecture",
      "Master Figma tools, Auto-Layout, Components, and Design Tokens",
      "Build interactive click-through mobile and web prototypes"
    ],
    skills: ["UI/UX Design", "Figma", "Design Thinking", "Wireframing", "Prototyping", "Design Systems"],
    modules: [
      {
        id: "ux-m1",
        title: "Module 1 – UX Principles & Design Thinking",
        description: "Design thinking methodology, user-centered design, and usability laws.",
        lessons: [
          { id: "ux-m1-l1", title: "The 5 Stages of Design Thinking", duration: "15 min", content: "Solve complex user problems through Empathy, Definition, Ideation, Prototyping, and Usability Testing.", realWorldExample: "Redesigning a course checkout flow to reduce student drop-off rate by 30%.", codeSnippet: `Design Process: Empathize -> Define -> Ideate -> Prototype -> Test`, keyPoints: ["Design for user needs, not personal preference.", "Hick's Law: options choice time increases with complexity."], practiceTask: "Write 3 empathy interview questions for a student learning app." }
        ]
      },
      {
        id: "ux-m2",
        title: "Module 2 – User Research & Personas",
        description: "User interviews, journey mapping, and persona creation.",
        lessons: [
          { id: "ux-m2-l1", title: "Building User Personas", duration: "20 min", content: "Synthesize research data into realistic user profiles capturing pain points and goals.", realWorldExample: "Creating a persona for 'Priya - Fresh Graduate seeking Data Analyst job'.", codeSnippet: `Persona Card: Goals | Pain Points | Tech Proficiency | Key Motivations`, keyPoints: ["Ground personas in empirical interview data.", "Use journey maps to identify friction points."], practiceTask: "Create a user persona card for a working professional learning Python at night." }
        ]
      },
      {
        id: "ux-m3",
        title: "Module 3 – Information Architecture & Wireframing",
        description: "Sitemaps, user flows, and low-fidelity pencil/Figma wireframes.",
        lessons: [
          { id: "ux-m3-l1", title: "Creating User Flows & Wireframes", duration: "25 min", content: "Map step-by-step screen navigation and sketch low-fidelity layouts before visual styling.", realWorldExample: "Structuring the 3-step navigation flow from Course List to Lesson View.", codeSnippet: `User Flow: Home -> Course List -> Course Details -> Lesson Page`, keyPoints: ["Low-fi wireframes focus on layout structure without color distractions.", "Sitemaps define logical page hierarchy."], practiceTask: "Sketch a low-fidelity wireframe for a course details mobile page." }
        ]
      },
      {
        id: "ux-m4",
        title: "Module 4 – Figma Essentials & Auto Layout",
        description: "Figma interface, frames, Auto Layout, and responsive components.",
        lessons: [
          { id: "ux-m4-l1", title: "Mastering Figma Auto Layout", duration: "25 min", content: "Build responsive UI components that resize automatically like flexbox CSS containers.", realWorldExample: "Designing course card components that scale seamlessly across mobile and desktop.", codeSnippet: `Auto Layout: Direction = Vertical | Padding = 16px | Gap = 12px`, keyPoints: ["Auto Layout mirrors CSS Flexbox behavior.", "Use Constraints for screen resizing."], practiceTask: "Build a responsive button component in Figma using Auto Layout." }
        ]
      },
      {
        id: "ux-m5",
        title: "Module 5 – Visual Design (Typography & Color Theory)",
        description: "Color palettes, typography scale, spacing, and contrast ratios.",
        lessons: [
          { id: "ux-m5-l1", title: "Color Theory & Typography Scale", duration: "20 min", content: "Create harmonious color palettes and establish clear visual hierarchy using font weight and size.", realWorldExample: "Ensuring text contrast passes WCAG AA accessibility standards (min 4.5:1 ratio).", codeSnippet: `Palette Strategy: 60% Dominant Background, 30% Secondary Card, 10% Accent CTA`, keyPoints: ["Limit primary typefaces to 1-2 font families.", "Color conveys state (Green = Success, Red = Error)."], practiceTask: "Check contrast ratio between #10b981 green button text and white background." }
        ]
      },
      {
        id: "ux-m6",
        title: "Module 6 – Interactive Prototyping & Smart Animate",
        description: "Connecting frames, interactive states, and micro-animations.",
        lessons: [
          { id: "ux-m6-l1", title: "Figma Interactive Prototyping", duration: "20 min", content: "Link screens together with animated transitions (Smart Animate, Slide In, Overlays).", realWorldExample: "Creating a clickable prototype demonstrating course progress updates.", codeSnippet: `Trigger: On Click -> Action: Navigate To -> Transition: Smart Animate (300ms)`, keyPoints: ["Prototypes allow stakeholder testing before writing code.", "Micro-animations enhance user delight."], practiceTask: "Create a 2-screen clickable prototype in Figma." }
        ]
      },
      {
        id: "ux-m7",
        title: "Module 7 – Design Systems & Component Libraries",
        description: "Design tokens, component variants, and component documentation.",
        lessons: [
          { id: "ux-m7-l1", title: "Building Modular Design Systems", duration: "20 min", content: "Create centralized libraries of reusable buttons, inputs, icons, and color tokens.", realWorldExample: "Maintaining brand visual consistency across 5 different product teams.", codeSnippet: `Design Tokens: $color-primary: #10b981; $radius-card: 14px;`, keyPoints: ["Component variants organize component states (Default, Hover, Disabled).", "Ensures design scalability."], practiceTask: "Create a button component set with Primary, Secondary, and Disabled variants." }
        ]
      },
      {
        id: "ux-m8",
        title: "Module 8 – Usability Testing & Portfolio Capstone",
        description: "Conducting usability tests and showcasing a design case study.",
        lessons: [
          { id: "ux-m8-l1", title: "UI/UX Case Study Portfolio", duration: "30 min", content: "Structure a portfolio case study presenting problem statement, research, wireframes, iteration, and final Figma prototype.", realWorldExample: "Showcasing UI/UX design competency to hiring managers.", codeSnippet: `// Case Study Portfolio Complete ✓`, keyPoints: ["Highlight design rationale and user feedback iterations.", "Show before-and-after improvements."], practiceTask: "Write a 1-page summary outlining your UI/UX case study rationale." }
        ]
      }
    ]
  },
  {
    id: "business-analytics",
    title: "Business Analytics Foundations",
    category: "Business Analytics",
    level: "Beginner",
    estimatedDuration: "8 Hours",
    shortDescription: "Learn business problem frameworking, KPI metrics, descriptive statistics, financial modeling, and storytelling.",
    fullDescription: "Bridge the gap between raw data and executive business strategy. Learn to frame business problems, compute financial KPIs, and deliver data storytelling reports.",
    instructor: {
      name: "Sarah Jenkins",
      title: "Senior Business Analyst",
      avatar: "👩‍💼"
    },
    icon: "📉",
    bannerGradient: "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)",
    learningObjectives: [
      "Understand business analytics frameworks (Descriptive, Diagnostic, Predictive, Prescriptive)",
      "Define and measure Key Performance Indicators (KPIs) like CAC, LTV, Churn, ROI",
      "Apply descriptive statistics to identify business trends and anomalies",
      "Perform scenario analysis and financial forecasting",
      "Deliver persuasive data storytelling reports to executive stakeholders"
    ],
    skills: ["Business Analytics", "KPIs", "Data Storytelling", "Excel Modeling", "Descriptive Statistics", "Strategy"],
    modules: [
      {
        id: "ba-m1",
        title: "Module 1 – Business Analytics Overview",
        description: "Analytics spectrum, framing business questions, and metrics.",
        lessons: [
          { id: "ba-m1-l1", title: "The 4 Types of Business Analytics", duration: "15 min", content: "Understand Descriptive (What happened?), Diagnostic (Why did it happen?), Predictive (What will happen?), and Prescriptive (What should we do?).", realWorldExample: "Analyzing why student course dropouts occurred last quarter.", codeSnippet: `Analytics Spectrum: Descriptive -> Diagnostic -> Predictive -> Prescriptive`, keyPoints: ["Analytics must drive actionable business decisions.", "Always align metrics with strategic company goals."], practiceTask: "Classify 4 business questions into the 4 analytics categories." }
        ]
      },
      {
        id: "ba-m2",
        title: "Module 2 – Defining Key Performance Indicators (KPIs)",
        description: "Customer Acquisition Cost (CAC), Lifetime Value (LTV), Churn Rate, and ROI.",
        lessons: [
          { id: "ba-m2-l1", title: "Core Business Metrics & Ratios", duration: "20 min", content: "Compute financial metrics evaluating customer profitability and subscription retention.", realWorldExample: "Calculating LTV:CAC ratio (target >= 3:1 for healthy business growth).", codeSnippet: `LTV = (Avg Order Value * Purchase Frequency) / Churn Rate\nCAC = Total Marketing Spend / New Customers Acquired`, keyPoints: ["Churn Rate measures customer loss percentage.", "LTV must exceed CAC for profitable growth."], practiceTask: "Calculate LTV and CAC given a company's marketing spend and churn rate." }
        ]
      },
      {
        id: "ba-m3",
        title: "Module 3 – Descriptive Statistics for Business",
        description: "Mean, Median, Standard Deviation, Percentiles, and Distributions.",
        lessons: [
          { id: "ba-m3-l1", title: "Statistical Measures in Analytics", duration: "20 min", content: "Understand central tendency and variance to spot outliers and skewed data.", realWorldExample: "Using median salary instead of mean salary to prevent skew from extreme high earners.", codeSnippet: `Mean = Sum / N; Median = Middle Value when sorted`, keyPoints: ["Use median for skewed distributions.", "Standard deviation measures data dispersion around the mean."], practiceTask: "Calculate mean, median, and range for a sample student score dataset." }
        ]
      },
      {
        id: "ba-m4",
        title: "Module 4 – Problem Structuring & Root Cause Analysis",
        description: "Issue Trees, MECE framework, and 5 Whys analysis.",
        lessons: [
          { id: "ba-m4-l1", title: "MECE Framework & Issue Trees", duration: "25 min", content: "Break complex business problems into Mutually Exclusive, Collectively Exhaustive (MECE) sub-issues.", realWorldExample: "Deconstructing a drop in revenue into Price changes vs Volume changes.", codeSnippet: `Revenue Issue Tree = Volume (Traffic * Conversion) * Price (Avg Price per Unit)`, keyPoints: ["MECE prevents double-counting or missing key problem drivers.", "Issue trees structure hypothesis testing."], practiceTask: "Deconstruct a business problem (e.g. falling app signups) into a 2-level MECE tree." }
        ]
      },
      {
        id: "ba-m5",
        title: "Module 5 – Financial Modeling & Scenario Analysis",
        description: "Sensitivity analysis, break-even analysis, and revenue modeling.",
        lessons: [
          { id: "ba-m5-l1", title: "Building Scenario & Sensitivity Models", duration: "25 min", content: "Model Best Case, Base Case, and Worst Case business projections in Excel.", realWorldExample: "Testing how a 10% increase in course price impacts total gross margin.", codeSnippet: `Break-Even Quantity = Fixed Costs / (Price per Unit - Variable Cost per Unit)`, keyPoints: ["Sensitivity tables show metric impact across varying inputs.", "Include clear assumptions documentation."], practiceTask: "Calculate break-even units for a new course offering." }
        ]
      },
      {
        id: "ba-m6",
        title: "Module 6 – Data Storytelling & Presentation",
        description: "Structuring narrative presentations for executives.",
        lessons: [
          { id: "ba-m6-l1", title: "The Data Storytelling Framework", duration: "20 min", content: "Combine Data + Narrative + Visuals to influence decision-makers effectively.", realWorldExample: "Presenting a 5-slide executive deck advocating for new course development.", codeSnippet: `Structure: Context -> Problem -> Insight -> Business Impact -> Recommendation`, keyPoints: ["Lead with key business recommendations (Pyramid Principle).", "Keep slides clean with 1 message per slide."], practiceTask: "Outline a 4-slide presentation recommending platform improvements based on data." }
        ]
      },
      {
        id: "ba-m7",
        title: "Module 7 – Stakeholder Communication & Agile",
        description: "Gathering business requirements, Agile user stories, and acceptance criteria.",
        lessons: [
          { id: "ba-m7-l1", title: "Writing Business Requirements (BRDs)", duration: "20 min", content: "Translate stakeholder requests into clear technical requirements and user stories.", realWorldExample: "Writing user stories for adding automated course progress export functionality.", codeSnippet: `User Story: "As a student, I want to export my course certificate so that I can share it on LinkedIn."`, keyPoints: ["User stories follow format: As a [role], I want [feature], so that [benefit].", "Acceptance criteria define done state."], practiceTask: "Write 2 user stories with acceptance criteria for a learning management feature." }
        ]
      },
      {
        id: "ba-m8",
        title: "Module 8 – Business Case Study Capstone",
        description: "Solve an end-to-end strategic business case study.",
        lessons: [
          { id: "ba-m8-l1", title: "Strategic Business Case Presentation", duration: "30 min", content: "Analyze enterprise business dataset, compute financial KPIs, and deliver executive recommendation report.", realWorldExample: "Presenting strategic recommendations to company board members.", codeSnippet: `// Business Case Study Completed ✓`, keyPoints: ["Demonstrates business acumen and data fluency.", "Portfolio centerpiece for Business Analyst roles."], practiceTask: "Summarize strategic recommendations for a business case scenario." }
        ]
      }
    ]
  }
];
