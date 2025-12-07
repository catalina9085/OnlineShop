from sklearn.feature_extraction.text import TfidfVectorizer

def build_embeddings(products):
    descriptions = [p["description"] for p in products]
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(descriptions)
    return X


