
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router

# Initialize FastAPI app
app = FastAPI(title="Investment Recommendation API")

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router
app.include_router(router)

# Start the app with: uvicorn main:app --reload
