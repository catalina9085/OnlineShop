import os

from fastapi import APIRouter
from google import genai
from transformers import pipeline
from database.db import get_products, get_user_clicks
from recommender.embeddings import build_embeddings
from recommender.recommendations import similar, recommend_for_user
from chatbot.faq_bot import get_answer
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

load_dotenv(dotenv_path="api/.env")
router = APIRouter()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

product_embedding_cache = {}


class ProductSearchItem(BaseModel):
    id: int
    name: str
    description: str
    category: str


class SemanticSearchRequest(BaseModel):
    query: str
    products: list[ProductSearchItem]


@router.post("/semantic-search")
def semantic_search(req: SemanticSearchRequest):
    if not req.query.strip() or not req.products:
        return {"productIds": []}

    query_embedding = embedding_model.encode(req.query)

    product_embeddings = []

    for product in req.products:
        if product.id not in product_embedding_cache:
            product_text = f"""
            Product name: {product.name}
            Description: {product.description}
            Category: {product.category}
            """

            product_embedding_cache[product.id] = embedding_model.encode(product_text)

        product_embeddings.append(product_embedding_cache[product.id])

    similarities = cosine_similarity(
        [query_embedding],
        product_embeddings
    )[0]

    results = sorted(
        zip(req.products, similarities),
        key=lambda x: x[1],
        reverse=True
    )

    return {
        "productIds": [
            product.id
            for product, score in results
            if score > 0.10
        ]
    }

class ReviewSummaryRequest(BaseModel):
    productName: str
    reviews: list[str]

@router.post("/summarize-reviews")
def summarize_reviews(req: ReviewSummaryRequest):
    reviews_text = "\n".join([f"- {review}" for review in req.reviews])

    prompt = f"""
Summarize the customer reviews for this product in English.
Mention the main positive points and the main complaints.
Maximum 3 sentences.
Do not invent information.

Product: {req.productName}

Reviews:
{reviews_text}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {
        "summary": response.text.strip()
    }

class DescriptionRequest(BaseModel):
    name: str
    category: str
    price: float | None = None
    keywords: str | None = None

@router.post("/generate-description")
def generate_description(req: DescriptionRequest):
    prompt = f"""
Write one attractive short ecommerce product description in English.
Do not use labels.
Do not repeat the fields directly.
Maximum 2 sentences.

Product:
Name: {req.name}
Category: {req.category}
Price: {req.price}
Keywords: {req.keywords}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {"description": response.text.strip()}

@router.get("/similar/{product_id}")
def recommend_api(product_id: int):
    products = get_products()
    embeddings = build_embeddings(products)
    sims = similar(product_id, products, embeddings)
    print(sims)
    return {"product_id": product_id, "similar": sims}


@router.get("/recommend/{user_id}")
def recommend(user_id: int):
    products = get_products()
    embeddings = build_embeddings(products)
    clicks = get_user_clicks(user_id)
    recs = recommend_for_user(clicks, products, embeddings)
    return {"user_id": user_id, "recommendations": recs}

@router.get("/ask")
def chatbot(message: str):
    answer = get_answer(message)
    return answer