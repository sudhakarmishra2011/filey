from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)
qa_pipeline = pipeline('question-answering', model='bert-large-uncased-whole-word-masking-finetuned-squad')

#Old_model_used --> 'distilbert-base-uncased-distilled-squad'

@app.route('/answer', methods=['POST'])
def answer():
    data = request.json
    context = data['context']
    question = data['question']
    result = qa_pipeline(question=question, context=context)
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000)
