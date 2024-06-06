from FlagEmbedding import FlagReranker
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
import pandas as pd
from flask_cors import CORS

import warnings
warnings.filterwarnings("ignore", category=FutureWarning,
                        module="huggingface_hub.file_download")

# Initialize the Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Import Swinburne Frequently asked questions from a CSV file
faq_df = pd.read_csv('SwinFAQDataSet.csv')
faq_questions = faq_df['Question'].tolist()
faq_answers = faq_df['Answer'].tolist()

# Load a pre-trained sentence transformer model for encoding questions
question_model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
question_embeddings = question_model.encode(faq_questions)

# Load the custom re-ranker model
question_reranker = FlagReranker('BAAI/bge-reranker-v2-m3', use_fp16=True)


# Function to get the best answer for a given user question
def get_best_answer(user_question):
    # Encode the user question into an embedding
    user_question_embedding = question_model.encode(user_question)

    # Compute cosine similarities between the user question embedding and FAQ question embeddings
    cosine_similarities = util.cos_sim(
        user_question_embedding, question_embeddings)

    # Extract similarity scores from the computed cosine similarities
    similarity_scores = [cosine_similarities[0][i].item()
                         for i in range(len(cosine_similarities[0]))]

    # Sort indices of FAQ questions based on similarity scores in descending order
    sorted_indices = sorted(range(len(similarity_scores)),
                            key=lambda i: similarity_scores[i], reverse=True)

    # Retrieve possible answers and questions based on sorted similarity scores
    possible_answers = [faq_answers[i] for i in sorted_indices]
    possible_questions = [faq_questions[i] for i in sorted_indices]

    # Use the re-ranker to check if the top matching question is sufficiently similar to the user question
    if question_reranker.compute_score([possible_questions[0], user_question]) > 0:
        return possible_answers[0]
    else:
        # Return a message if no good match is found
        return "Sorry, This Question is not in my scope"


# Define a route to handle question queries via POST requests
@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.json  # Get JSON data from the request
    if not data or 'question' not in data:    # Validate input data
        return jsonify({'error': 'Invalid input'}), 400

    # Extract the user question from the input data
    user_question = data['question']
    # Get the best answer for the user question
    answer = get_best_answer(user_question)
    return jsonify({'answer': answer})  # Return the answer as a JSON response


# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)
