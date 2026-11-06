VeriScan AI

AI-Powered Identity & Document Screening Platform

<p align="center">
  <b>Verify Smart. Browse Safely. Stay Informed.</b>
</p><p align="center">
  An AI-powered platform exploring identity screening, document analysis, and safer web navigation.
</p><p align="center">
  <a href="https://veriscan-seven.vercel.app/">Live Demo</a> •
  <a href="https://github.com/Shekhar-Kumar576/Veriscan">GitHub Repository</a>
</p>---

Table of Contents

1. "About the Project" (#about-the-project)
2. "Problem Statement" (#problem-statement)
3. "Our Solution" (#our-solution)
4. "Key Features" (#key-features)
5. "Safe Browsing and Content Redirection" (#safe-browsing-and-content-redirection)
6. "TinyFish API Integration" (#tinyfish-api-integration)
7. "How VeriScan Works" (#how-veriscan-works)
8. "System Architecture" (#system-architecture)
9. "Technology Stack" (#technology-stack)
10. "Project Structure" (#project-structure)
11. "Getting Started" (#getting-started)
12. "Environment Variables" (#environment-variables)
13. "Deployment" (#deployment)
14. "Security and Privacy" (#security-and-privacy)
15. "Future Scope" (#future-scope)
16. "Hackathon Experience" (#hackathon-experience)
17. "Contributing" (#contributing)
18. "Acknowledgements" (#acknowledgements)
19. "Contact" (#contact)

---

About the Project

VeriScan AI is an AI-powered identity and document screening platform developed to explore smarter verification workflows and safer digital interactions.

In today's digital world, users regularly interact with online platforms, external websites, documents, and digital information. Determining whether information and destinations can be trusted is increasingly important.

VeriScan AI brings together the ideas of AI-assisted screening, web-connected intelligence, and safe browsing into one platform.

The project also explores the use of TinyFish API to connect AI applications with live web information and automation capabilities.

Our vision: Make digital verification more intelligent and online interactions more informed.

Problem Statement

Digital users face several challenges when interacting with online information and verification systems:

- Manual screening processes can be time-consuming.
- Document verification workflows can involve repetitive tasks.
- External websites may contain misleading or suspicious information.
- Users may unknowingly navigate to untrusted destinations.
- Information gathered from different sources can be difficult to organize.
- Traditional workflows may lack integrated AI-assisted capabilities.

There is a need for an accessible platform that explores intelligent screening and safer navigation.

Our Solution

VeriScan AI aims to address these challenges through an integrated platform focused on:

1. AI-powered identity and document screening.
2. Intelligent information processing.
3. TinyFish-powered web connectivity.
4. Safe browsing and controlled content redirection.
5. Improved user interaction and screening management.

Instead of treating verification and browsing as completely separate activities, VeriScan explores how they can work together to provide a more informed digital experience.

Key Features

1. AI-Powered Identity and Document Screening

A dedicated screening experience focused on identity and document verification workflows.

- AI-assisted screening approach.
- Organized screening interface.
- Support for improving digital verification workflows.
- Focus on making screening more accessible.

2. Safe Browsing

A browsing-oriented feature designed to help users interact more carefully with external websites.

- Safer external navigation.
- Destination URL validation.
- Awareness of suspicious destinations.
- Controlled access to external content.

3. Content Redirection

Content redirection helps users navigate toward relevant external information while maintaining control over the destination.

- Controlled external navigation.
- URL validation before redirection.
- User awareness before leaving the application.
- Protection against unsupported or malformed URL schemes.
- Clear handling of potentially suspicious destinations.

4. TinyFish-Powered Web Intelligence

Integration with TinyFish API to explore live-web information retrieval and browser-based automation.

- Live website information retrieval.
- Webpage content extraction.
- AI-assisted web interactions.
- Support for information-gathering workflows.

5. Screening History Management

- Clear Scan History functionality.
- Improved management of screening activity.
- Direct Sign Out functionality.

6. User-Friendly Interface

- Dedicated VeriScan AI branding.
- Simple navigation.
- Organized application interface.
- Accessible web-based experience.

---

Safe Browsing and Content Redirection

One of the important aspects of VeriScan AI is its focus on safer web navigation.

Users frequently encounter external links while browsing online. Not every destination should automatically be trusted.

VeriScan aims to provide a controlled content-redirection experience.

How It Works

       User Interaction
              |
              v
      External URL Received
              |
              v
        URL Validation
              |
              v
    Destination Assessment
              |
        +-----+-----+
        |           |
        v           v
   Acceptable    Suspicious
   Destination   Destination
        |           |
        v           v
   User Review   Warning /
        |         Block
        v
   Controlled
   Redirection
        |
        v
   External Content

Safe Browsing Principles

- Accept only supported HTTP and HTTPS destinations.
- Reject malformed URLs and unsupported protocols.
- Validate redirect destinations rather than trusting the original link.
- Avoid exposing sensitive information in URLs.
- Provide users with clear destination information.
- Treat external webpage content as untrusted data.

Important: URL validation alone cannot guarantee that a website is legitimate or safe. A complete security assessment requires additional reputation and threat-detection checks.

---

TinyFish API Integration

TinyFish is an important technology explored during AZINHACK 2026.

It provides web-agent capabilities that allow applications to interact with live websites and retrieve useful information.

Why TinyFish?

Traditional applications often depend on predefined data sources. Live-web interaction can help applications access more dynamic information.

TinyFish provides capabilities such as:

Capability| Purpose
Web Search| Discover relevant online information
Web Fetch| Retrieve webpage content
Web Agent| Perform goal-oriented browser tasks
Browser Automation| Interact with website interfaces

Role in VeriScan AI

TinyFish is explored as a web-connected intelligence component.

Its potential role includes:

1. Receiving a web-information request.
2. Interacting with relevant web sources.
3. Retrieving webpage information.
4. Passing retrieved information into the application's processing workflow.
5. Presenting relevant information to the user.

Integration Considerations

- API credentials should be stored securely.
- External content should be treated as untrusted.
- Requests should handle errors and timeouts.
- Retrieved information should be reviewed before being used for important decisions.

TinyFish does not independently guarantee that an external website is safe. Its web interaction capabilities and VeriScan's security checks serve different purposes.

---

How VeriScan Works

The overall conceptual workflow:

1. User Interaction: The user accesses the VeriScan AI platform.
2. Screening Request: The user interacts with the available screening functionality.
3. Information Processing: The application processes the relevant request.
4. Web Intelligence: TinyFish can support connected web-information workflows.
5. Safety Checks: External destinations can be evaluated through the safe-navigation workflow.
6. Results: Relevant information is presented through the application interface.
7. User Review: The user reviews the available information before taking further action.

---

System Architecture

              USER
                |
                v
        VERISCAN AI FRONTEND
                |
                v
       APPLICATION WORKFLOW
                |
        +-------+-------+
        |               |
        v               v
  IDENTITY &         SAFE BROWSING
  DOCUMENT           & CONTENT
  SCREENING          REDIRECTION
        |               |
        v               v
  AI PROCESSING     URL VALIDATION
        |               |
        v               v
        +-------+-------+
                |
                v
          TINYFISH API
                |
                v
        LIVE WEB INTERACTION
                |
                v
         INFORMATION REVIEW
                |
                v
          USER INTERFACE

This diagram represents the conceptual architecture. Actual service connections should be confirmed against the deployed source code.

---

Technology Stack

Layer| Technology
Application| VeriScan AI
AI Integration| AI-assisted screening
Web Intelligence| TinyFish API
Hosting| Vercel
Version Control| Git
Repository| GitHub

The exact frontend framework, backend framework, database and AI model should be documented according to the project's source-code configuration.

---

Project Structure

The current public repository contains the application directory and README.

Conceptual organization:

Veriscan/
│
├── sih/
│   └── Application files
│
└── README.md

The detailed internal folder structure depends on the application source files.

---

Getting Started

Follow these steps to obtain the project locally.

Prerequisites

- Git
- Node.js and npm, if required by the frontend
- Python, if required by the backend
- Code editor such as VS Code
- Required API credentials

Step 1: Clone the Repository

git clone https://github.com/Shekhar-Kumar576/Veriscan.git

Step 2: Navigate to the Project

cd Veriscan

Step 3: Install Dependencies

Navigate to the application directory and install dependencies using its package configuration.

For an npm-based application:

npm install

For a Python-based backend, if present:

pip install -r requirements.txt

Step 4: Configure Environment Variables

Create the required environment configuration using the variable names expected by the application.

See the Environment Variables section below.

Step 5: Start the Application

Use the development commands defined in the project's configuration files.

For an npm application, the command may be:

npm run dev

---

Environment Variables

VeriScan may require API credentials for its external integrations.

Example configuration:

TINYFISH_API_KEY=your_api_key

Add other environment variables only when required by the source code.

Security guidelines:

- Never upload real API keys to GitHub.
- Never hardcode private credentials in frontend code.
- Store secrets in the hosting platform's environment settings.
- Rotate credentials if they are accidentally exposed.

---

Deployment

VeriScan AI is hosted on Vercel.

Live Application: https://veriscan-seven.vercel.app/

Deployment Steps

1. Push the latest project changes to GitHub.
2. Open Vercel.
3. Import the VeriScan repository.
4. Configure the project's root directory and build settings.
5. Add the required environment variables.
6. Deploy the application.
7. Test the live application and external API integrations.

Deployment Verification

After deployment, verify:

- Application loads correctly.
- Screening interface is accessible.
- Sign Out works correctly.
- Clear Scan History works correctly.
- Safe browsing and content-redirection flows work correctly.
- TinyFish integration responds as expected.

---

Security and Privacy

Security and responsible data handling are important considerations for VeriScan AI.

Our security objectives include:

- Secure handling of API credentials.
- Validation of external URLs.
- Controlled content redirection.
- Protection of sensitive user information.
- Responsible handling of external website content.
- Human review for important screening decisions.

AI-generated results should not be treated as official proof of identity. Users should independently verify important information through appropriate trusted channels.

---

Future Scope

VeriScan AI has opportunities for further development.

Potential improvements include:

- More advanced document information extraction.
- Enhanced identity-screening workflows.
- Integration with additional trusted information sources.
- Improved malicious URL and phishing detection.
- More advanced website reputation assessment.
- Detailed screening reports.
- Improved audit and activity management.
- Stronger privacy and access controls.
- More comprehensive testing and performance evaluation.

Our long-term objective is to develop VeriScan into a more comprehensive platform for intelligent verification and safer digital interactions.

---

Hackathon Experience

VeriScan AI was developed and explored as part of AZINHACK 2026, organized by the Intel oneAPI Student Club (IoSC), GGSIPU East Delhi Campus.

Participating in this hackathon provided an opportunity to experiment with new technologies, explore TinyFish API integration, and understand the practical challenges involved in building AI-powered applications.

Although the project did not qualify for the next round, the experience contributed valuable technical knowledge, practical exposure and new learning opportunities.

The journey reinforced an important lesson:

Every hackathon is an opportunity to learn, experiment, improve and build something better.

---

Contributing

Contributions and suggestions are welcome.

If you would like to improve VeriScan AI:

1. Fork the repository.
2. Create a new feature branch.
3. Make your changes.
4. Test your implementation.
5. Submit a pull request with a clear explanation.

---

Acknowledgements

Special thanks to:

- AZINHACK 2026 organizers.
- Intel oneAPI Student Club (IoSC), GGSIPU East Delhi Campus.
- TinyFish for its web-agent technology and API capabilities.
- Everyone who contributed to the hackathon learning experience.

---

Contact

Developer: Shekhar Kumar

GitHub: https://github.com/Shekhar-Kumar576

Project Repository: https://github.com/Shekhar-Kumar576/Veriscan

Live Application: https://veriscan-seven.vercel.app/

---

<p align="center">
  <b>VERISCAN AI</b><br>
  Verify Smart. Browse Safely. Stay Informed.
  <br><br>
  Built with curiosity, experimentation and a passion for innovation.
</p>