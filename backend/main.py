from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_core.tools import Tool
from langchain.agents import create_agent
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


openrouter_key = os.getenv("OPENROUTER_API_KEY")
if not openrouter_key:
    print("WARNING: OPENROUTER_API_KEY not found in environment variables!")

llm = ChatOpenAI(
    # Cheaper, lighter model routed through OpenRouter
    model="openai/gpt-4o-mini",
    api_key=openrouter_key,
    base_url="https://openrouter.ai/api/v1",
    temperature=0.7,
    max_tokens=256,  # keep responses short to stay within free credit limits
)


def get_weather(city: str) -> str:
    
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        return "Weather API key not configured. Please set OPENWEATHER_API_KEY in your .env file."
    
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather"
        params = {
            "q": city,
            "appid": api_key,
            "units": "metric"
        }
        
        response = httpx.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        temp = data["main"]["temp"]
        description = data["weather"][0]["description"]
        humidity = data["main"]["humidity"]
        feels_like = data["main"]["feels_like"]
        wind_speed = data["wind"]["speed"]
        
        return f"The weather in {city} is {temp}°C ({description}). It feels like {feels_like}°C. Humidity is {humidity}% and wind speed is {wind_speed} m/s."
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return f"City '{city}' not found. Please check the city name and try again."
        return f"Error fetching weather data: {str(e)}"
    except Exception as e:
        return f"Error fetching weather data: {str(e)}"



weather_tool = Tool(
    name="get_weather",
    func=get_weather,
    description="Get the current weather for a city. Input should be the city name as a string."
)


tools = [weather_tool]
system_prompt = "You are a helpful assistant that can answer questions about weather. When asked about weather, use the get_weather tool to fetch current weather information."

agent = create_agent(
    model=llm,
    tools=tools,
    system_prompt=system_prompt
)


class QueryRequest(BaseModel):
    message: str


class QueryResponse(BaseModel):
    response: str


@app.get("/")
async def root():
    return {"message": "Weather API is running"}


@app.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):

    try:
        from langchain_core.messages import HumanMessage
        
        result = await agent.ainvoke({"messages": [HumanMessage(content=request.message)]})
        if isinstance(result, dict) and "messages" in result:
            messages = result["messages"]
            for msg in reversed(messages):
                if hasattr(msg, 'content') and msg.content:
                    return QueryResponse(response=msg.content)
            response_text = str(result)
        elif hasattr(result, 'messages'):
            for msg in reversed(result.messages):
                if hasattr(msg, 'content') and msg.content:
                    return QueryResponse(response=msg.content)
            response_text = str(result)
        else:
            response_text = str(result)
            
        return QueryResponse(response=response_text)
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        return QueryResponse(response=f"Error processing query: {str(e)}\n\nDetails: {error_details}")

