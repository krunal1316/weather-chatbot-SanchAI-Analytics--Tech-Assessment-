# Weather App with Langchain and OpenRouter

A minimal weather application with React frontend and FastAPI backend, using Langchain with OpenRouter to intelligently process weather queries.

## Features

- React-based frontend with modern UI
- FastAPI backend with Langchain agent
- OpenRouter integration for LLM responses
- Weather tool that fetches real-time weather data
- Natural language processing - ask questions like "What's the weather in Pune?" or "weather of pune today?"

## Project Structure

```
weather app/
├── backend/
│   ├── main.py              # FastAPI backend with Langchain agent
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Styling
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   └── package.json        # Node dependencies
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 14+ and npm
- OpenRouter API key (get it from https://openrouter.ai/)
- OpenWeatherMap API key (get it from https://openweathermap.org/api)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the `backend` directory:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENWEATHER_API_KEY=your_openweather_api_key_here
   ```

6. Run the backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

The backend will be running on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create a `.env` file if the backend is running on a different URL:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The frontend will be running on `http://localhost:3000`

## Usage

1. Start both the backend and frontend servers
2. Open your browser and navigate to `http://localhost:3000`
3. Type a weather query in the input box, for example:
   - "What's the weather in Pune?"
   - "weather of pune today?"
   - "Tell me the weather in Mumbai"
4. Click the "Send" button
5. The Langchain agent will process your query, use the weather tool if needed, and return a natural language response

## How It Works

1. User sends a message through the React frontend
2. Frontend sends a POST request to `/query` endpoint
3. FastAPI backend receives the query
4. Langchain agent processes the query:
   - If the query is about weather, the agent uses the `get_weather` tool
   - The tool fetches weather data from OpenWeatherMap API
   - The agent formulates a natural language response using OpenRouter LLM
5. Response is sent back to the frontend and displayed to the user

## API Endpoints

- `GET /` - Health check endpoint
- `POST /query` - Process user query
  - Request body: `{"message": "your query here"}`
  - Response: `{"response": "agent's response"}`

## Technologies Used

- **Frontend**: React, CSS3
- **Backend**: FastAPI, Python
- **LLM**: OpenRouter (GPT-4 Turbo)
- **Langchain**: For agent orchestration
- **Weather API**: OpenWeatherMap

## Notes

- Make sure both API keys are properly configured in the `.env` file
- The backend uses CORS middleware to allow requests from the frontend
- The agent is configured to use the weather tool when weather-related queries are detected

## GitHub Repository

After completion, the repository will be shared with view access to username: **pyaf**

