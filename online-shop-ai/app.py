from fastapi import FastAPI
from api.routes import router

api = FastAPI()
api.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:api", host="127.0.0.1", port=8000, reload=True)

# venv\Scripts\activate && uvicorn app:api --reload
# uvicorn app:api --reload