
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .routes import router
from .database import get_db, setup_db
from sqlalchemy.orm import Session

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

# Add DB connection check endpoint
@app.get("/api/db-status")
def check_db_connection(db: Session = Depends(get_db)):
    return {"status": "connected" if db is not None else "fallback"}

# If running this file directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
