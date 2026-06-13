import re
from app.modules.coreference_resolver import _extract_named_entities

STOP_WORDS = {
    "a", "an", "the", "in", "on", "at", "for", "to", "of", "by", "with", "is", "are", "was", "were", "be", "been", "being",
    "he", "she", "it", "they", "i", "you", "we", "his", "her", "its", "their", "my", "your", "our",
    "has", "have", "had", "do", "does", "did", "will", "would", "shall", "should", "can", "could", "may", "might", "must",
    "and", "but", "or", "so", "if", "when", "while", "that", "which", "who", "what", "where", "why", "how", "this", 
    "these", "those", "from", "about", "as", "into", "like", "through", "after", "before", "during", "from", "very"
}

def rewrite_query(claim_text: str) -> str:
    """
    Distills a claim into a concise, keyword-based search query to improve retrieval accuracy and cache hits.
    
    Strategy:
    1. Extract named entities.
    2. Extract numeric values.
    3. Remove stop words and punctuation.
    4. Combine the most salient parts into a query.
    """
    
    entities = _extract_named_entities(claim_text)
    
    cleaned_entities = []
    for ent in entities:
        words = ent.split()
        while words and words[0].lower() in {"the", "a", "an"}:
            words.pop(0)
        if words:
            cleaned_ent = " ".join(words)
            if cleaned_ent.lower() in {"earth", "world", "sun", "moon"}:
                cleaned_entities.append(cleaned_ent.lower())
            elif cleaned_ent.lower() not in STOP_WORDS:
                cleaned_entities.append(cleaned_ent)
                
    raw_tokens = claim_text.split()
    tokens = []
    for t in raw_tokens:
        cleaned = t.strip('.,?!;:()[]{}"\'*_')
        if cleaned:
            tokens.append(cleaned)
            
    numbers = []
    keywords = []
    for token in tokens:
        token_lower = token.lower()
        if token_lower in STOP_WORDS:
            continue
        if any(c.isdigit() for c in token):
            numbers.append(token)
        else:
            keywords.append(token_lower)
            
    query_parts = list(dict.fromkeys(cleaned_entities))
    seen_words = {word.lower() for ent in cleaned_entities for word in ent.split()}
    
    if cleaned_entities:
        candidates = numbers + keywords
    else:
        candidates = []
        for token in tokens:
            token_lower = token.lower()
            if token_lower in STOP_WORDS:
                continue
            if any(c.isdigit() for c in token):
                candidates.append(token)
            else:
                candidates.append(token_lower)
                
    for kw in candidates:
        if kw.lower() not in seen_words:
            query_parts.append(kw)
            for w in kw.split():
                seen_words.add(w.lower())
                
    final_query = " ".join(query_parts)
    
    return final_query if final_query else claim_text