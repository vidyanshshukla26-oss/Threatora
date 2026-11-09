
<h1 align="center">Threatora</h1>

<h3 align="center">Detect Deception. Verify Trust. Stay Protected.</h3>

<p align="center">
  AI-Powered Web Threat Detection & Digital Trust Intelligence
</p>

<p align="center">
  <a href="https://threatora-6lyr.onrender.com/">Live Demo</a> |
  <a href="https://github.com/vidyanshshukla26-oss/Threatora">GitHub Repository</a>
</p>

---

<h2>1. Project Name & Description</h2>

<strong>Threatora</strong> is an AI-powered web threat detection and digital trust intelligence platform designed to identify malicious websites, detect online threats, and assess website credibility. It leverages artificial intelligence and cybersecurity intelligence to help users make safer decisions while browsing the internet.

<h2>2. Problem Statement</h2>

The growing dependence on the internet for banking, shopping, education, communication, and business has increased exposure to cyber threats.

<ul>
  <li>Phishing websites imitate legitimate platforms to steal sensitive information.</li>
  <li>Malicious URLs can expose users to scams, malware, and data theft.</li>
  <li>Users often struggle to distinguish genuine websites from fraudulent ones.</li>
  <li>Traditional security solutions may be difficult for ordinary users to understand or access.</li>
  <li>Lack of transparent website trust assessments makes informed online decisions harder.</li>
</ul>

<h2>3. Proposed Solution</h2>

Threatora provides an AI-powered digital trust and threat detection platform designed to help users identify potentially unsafe websites.

<strong>Key objectives:</strong>

<ul>
  <li>Analyze websites and URLs for suspicious indicators.</li>
  <li>Identify potential phishing attempts and malicious activity.</li>
  <li>Evaluate website credibility and digital trust.</li>
  <li>Present security insights through a user-friendly interface.</li>
  <li>Help users make informed decisions before interacting with suspicious websites.</li>
</ul>

The goal is to make cybersecurity intelligence more accessible through AI-driven analysis.

<h2>4. Demo Links & Screenshots</h2>

<p>
  <strong>Live Application:</strong>
  <a href="https://threatora-6lyr.onrender.com/">Threatora Live Demo</a>
</p>

<p>
  <strong>GitHub Repository:</strong>
  <a href="https://github.com/vidyanshshukla26-oss/Threatora">View Source Code</a>
</p>

<h3>Application Screenshots</h3>

<!-- Add your actual screenshots inside the assets folder -->

<p align="center">
  <img width="85%" alt="Screenshot 2026-11-09 134050" src="https://github.com/user-attachments/assets/cf413c07-54bc-44de-875b-d8060372d700" />

  <br>
  <em>Threatora Homepage</em>
</p>

<p align="center">
  <img width="85%" alt="Screenshot 2026-11-09 134232" src="https://github.com/user-attachments/assets/f5436325-f22d-4dc6-a270-47748d25b744" />

  <br>
  <em>Website Threat Scanning Interface</em>
</p>

<p align="center">
  <img width="85%" alt="Screenshot 2026-11-09 134143" src="https://github.com/user-attachments/assets/74b7e02d-0ad1-4f6f-8ebb-278f6983bab2" />

  <br>
  <em>Threat Analysis Results</em>
</p>

<h2>5. Technology Stack</h2>

<table>
  <tr>
    <th>Category</th>
    <th>Technologies</th>
  </tr>
  <tr>
    <td>Frontend</td>
    <td>React 19, Vite</td>
  </tr>
  <tr>
    <td>Backend</td>
    <td>Node.js, Express.js</td>
  </tr>
  <tr>
    <td>Programming Languages</td>
    <td>TypeScript, JavaScript</td>
  </tr>
  <tr>
    <td>Styling</td>
    <td>Tailwind CSS</td>
  </tr>
  <tr>
    <td>AI Integration</td>
    <td>Google Gemini API</td>
  </tr>
  <tr>
    <td>Animations</td>
    <td>Motion</td>
  </tr>
  <tr>
    <td>Icons</td>
    <td>Lucide React</td>
  </tr>
  <tr>
    <td>Mobile Development</td>
    <td>Expo / React Native</td>
  </tr>
  <tr>
    <td>Deployment</td>
    <td>Render / Vercel</td>
  </tr>
  <tr>
    <td>Package Manager</td>
    <td>npm</td>
  </tr>
</table>

<h2>6. System Architecture</h2>

<p>
  Threatora follows a client-server architecture with a shared Express API connecting its web and mobile clients to the backend threat analysis functionality.
</p>

<pre>
             +----------------------+
             |         USER         |
             +----------------------+
                        |
             +----------+----------+
             |                     |
      +-------------+       +--------------+
      | Web Client  |       | Mobile Client|
      | React/Vite  |       | Expo/RN      |
      +-------------+       +--------------+
             |                     |
             +----------+----------+
                        |
                +---------------+
                | Express API   |
                | Node.js       |
                +---------------+
                        |
             +----------+----------+
             |                     |
      +--------------+      +---------------+
      | Threat       |      | URL & Message |
      | Detection    |      | Analysis      |
      +--------------+      +---------------+
             |                     |
             +----------+----------+
                        |
                +---------------+
                | Google Gemini |
                | API           |
                +---------------+
                        |
                +---------------+
                | Threat        |
                | Assessment    |
                +---------------+
                        |
                +---------------+
                | Results       |
                | Dashboard     |
                +---------------+
</pre>

<h3>Architecture Components</h3>

<ul>
  <li><strong>Frontend:</strong> Provides the web interface for users to interact with Threatora.</li>
  <li><strong>Mobile Client:</strong> Provides mobile access to supported scanning and analysis features.</li>
  <li><strong>Backend:</strong> Express handles API requests and connects clients to analysis functionality.</li>
  <li><strong>Detection Engine:</strong> Processes website URLs and suspicious messages.</li>
  <li><strong>AI Integration:</strong> Google Gemini powers AI-backed features.</li>
  <li><strong>Results:</strong> Analysis results are returned to the client for presentation.</li>
</ul>

<h2>7. Setup & Installation</h2>

<h3>Prerequisites</h3>

<ul>
  <li>Node.js 22 or newer</li>
  <li>npm</li>
  <li>Git</li>
</ul>

<h3>Step 1: Clone the Repository</h3>

<pre><code>git clone https://github.com/vidyanshshukla26-oss/Threatora.git

cd Threatora</code></pre>

<h3>Step 2: Install Dependencies</h3>

<pre><code>npm ci</code></pre>

<h3>Step 3: Configure Environment Variables</h3>

<p>Create a <code>.env</code> file in the root directory:</p>

<pre><code>GEMINI_API_KEY=your_gemini_api_key</code></pre>

<p><em>Keep your API key private. Never commit your .env file to GitHub.</em></p>

<h3>Step 4: Start the Application</h3>

<pre><code>npm run dev</code></pre>

<h3>Step 5: Open the Application</h3>

<p>Visit the following address in your browser:</p>

<pre><code>http://localhost:3000</code></pre>

<p>
  Note: Gemini-backed features require a valid Gemini API key. Some scanners may work without it.
</p>

<h2>8. Disclosures & Third-Party Resources</h2>

<h3>Open-Source Libraries</h3>

<p>
  Threatora uses open-source libraries and frameworks, including:
</p>

<ul>
  <li>React</li>
  <li>Vite</li>
  <li>Express.js</li>
  <li>Tailwind CSS</li>
  <li>Lucide React</li>
  <li>Motion</li>
  <li>Expo / React Native</li>
  <li>Other dependencies listed in package.json</li>
</ul>

<h3>AI Tools & Services</h3>

<ul>
  <li>Google Gemini API – AI-powered functionality.</li>
  <li>AI development assistants, if used, should be disclosed here.</li>
</ul>

<h3>Templates & Deployment</h3>

<ul>
  <li>Third-party templates or starter code should be acknowledged if used.</li>
  <li>Render / Vercel – Application deployment.</li>
</ul>

<p>
  All third-party libraries, tools, and services are subject to their respective licenses and terms.
</p>

<h2>9. Track & Domain</h2>

<p><strong>Primary Track:</strong> Artificial Intelligence (AI) + Cybersecurity</p>

<p><strong>Additional Domains:</strong> Web3 / Digital Trust Intelligence</p>

<p><strong>Project Category:</strong> AI-Powered Cybersecurity & Web Threat Detection</p>

<p>
  Threatora combines artificial intelligence and cybersecurity to improve online safety, detect suspicious digital activity, and establish greater trust in online interactions.
</p>

---

<h2 align="center">Built with a Mission to Make the Internet Safer.</h2>

<p align="center">
  <strong>Threatora</strong> | AI-Powered Digital Trust Intelligence
</p>
