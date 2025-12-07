from chatbot.faq_data import faq
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# încărcăm modelul
model = SentenceTransformer('all-MiniLM-L6-v2')


questions=[item["question"] for item in faq]
question_embeddings=model.encode(questions,convert_to_tensor=True)


def get_answer(user_message,threshold=0.5):
    user_vec=model.encode([user_message],convert_to_tensor=True)
    sims=cosine_similarity(user_vec,question_embeddings)[0]

    max_sim_index = sims.argmax()
    if sims[max_sim_index] < threshold:
        return "Îmi pare rău, nu am găsit un răspuns potrivit."
    response=faq[max_sim_index]["answer"]
    print("Response: "+response)
    return response
