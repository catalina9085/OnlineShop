from sklearn.metrics.pairwise import cosine_similarity

def similar(product_id, products, embeddings, threshold=0.05):
    index = next(i for i, p in enumerate(products) if p["id"] == product_id)
    sims = cosine_similarity(embeddings[index], embeddings)[0]

    similar_indices = sims.argsort()[::-1]
    #eliminam produsul insusi
    similar_indices = [i for i in similar_indices if products[i]["id"] != product_id]

    similar_products = []
    for i in similar_indices:
        if sims[i] < threshold:
            break
        similar_products.append(products[i]["id"])

    return similar_products


def recommend_for_user(user_clicks, products, embeddings):
    recommended_products = set()
    for click in user_clicks:
        product_id = click.get("product_id")
        if product_id:
            recs = similar(product_id, products, embeddings)
            recommended_products.update(recs)
    return list(recommended_products)
