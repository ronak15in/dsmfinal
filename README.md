# GraphExam 🎓📊

GraphExam is a cutting-edge, real-time examination platform built natively on a Mathematical **Directed Graph Model** instead of a traditional relational database. 

Rather than storing data in flat SQL tables, every action inside GraphExam (teachers creating a question, students submitting an answer, time constraints) is physically mapped into system memory as interconnected **Vertices (Nodes)** and **Edges (Lines)**.

## ✨ Core Features

*   **Graph-Theory Grading Engine:** Exam scores aren't retrieved by scanning tables. Grading is achieved organically through pure pathfinding traversal algorithms. If a continuous outward path exists from the `[Student]` -> `[Submission]` -> `[Correct Option]`, a point is mathematically validated.
*   **Holographic Teacher Command Center:** Utilizing `Cytoscape.js`, the teacher dashboard visualizes the live physical memory mapping of the exam. Every successful student action dynamically branches the visual network in real-time.
*   **Zero-Distraction Student Portal:** A completely clean front-end for test-taking featuring strict security lockouts.
*   **Auto-Submitting Global Timer:** An active countdown runs concurrently with the test. Upon reaching exactly `< 0ms`, active DOM listeners instantly halt and force a network bulk-submission.

## 🛠️ Technology Stack

1.  **Backend Runtime:** Node.js
2.  **API Framework:** Express.js 
3.  **Core Algorithm Engine:** Pure ES6 Javascript Arrays & Maps
4.  **Frontend Interface:** Vanilla HTML5 & CSS3 (No React/Angular dependencies)
5.  **Graph Visualization:** Cytoscape.js

## 🚀 Installation & Setup

You can deploy and run this platform locally in under a minute without configuring complex databases.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Instructions

1.  **Open your terminal** and navigate into the `dsmfinal` folder.
2.  **Install dependencies** (Express.js):
    ```bash
    npm install
    ```
3.  **Start the Engine:**
    ```bash
    node server.js
    ```
4.  **Launch the Exam System:** 
    Open your web browser and navigate to exactly: `http://localhost:3000`

---

## 🧭 How to Use

### 1. The Teacher Portal
*   From the main login screen, click **"Teacher Portal"**.
*   Use the left dashboard to create new questions. You must provide 4 options and label which option (1-4) is explicitly the correct answer.
*   As you add questions, watch the right-side Cytoscape visualizer build identical `Question` and `Option` nodes. The glowing Emerald dots indicate precisely what the mathematically correct path is.
*   Monitor the **Live Scoreboard** table below your controls to watch automatic path-scored rankings as students finish.

### 2. The Student Portal
*   From the main login screen, enter a unique identifier (e.g. `S101`).
*   Select your respective radio-button answers.
*   Click **Submit Entire Exam**, or wait exactly for the `60s` timer to reach ZERO to trigger an automatic Bulk-Submit payload.
*   Upon processing, the student is securely directed to an un-escapable `Exam Completed` lock-screen showcasing their finalized score integer. If they attempt to log back in to cheat, the backend algorithm will instantly lock them back out!

---

*Project mapped and structured internally via native Javascript V8 Maps for zero-lag mathematical relations.*
