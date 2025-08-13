# 🤖 AI Interview Coach

This is a full-stack application that provides a mock interview experience with an AI, complete with voice interaction and performance feedback.

## ✨ About The Project

This project allows users to practice interviews for various roles (e.g., Software Engineer, Product Manager). The AI asks relevant questions, listens to spoken answers, and provides a detailed feedback report at the end.

## 🛠️ Tech Stack

-   **Frontend:** Next.js (React), TypeScript, Tailwind CSS
-   **Backend:** Python, FastAPI
-   **AI:** Google Gemini API
-   **Voice:** Web Speech API (Speech-to-Text & Text-to-Speech)

## 🚀 Getting Started

### Prerequisites

-   Node.js and npm
-   Python and pip
-   A free Google AI API Key

### How to Run

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/Gsjskskkudjd/ai-interview-coach.git](https://github.com/Gsjskskkudjd/ai-interview-coach.git)
    ```
2.  **Backend Setup**
    ```sh
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt # You would need to create this file
    cp .env.example .env # Create .env from an example file
    # Add your GOOGLE_API_KEY to the .env file
    uvicorn main:app --reload
    ```
3.  **Frontend Setup**
    ```sh
    cd ../frontend
    npm install
    npm run dev
    ```