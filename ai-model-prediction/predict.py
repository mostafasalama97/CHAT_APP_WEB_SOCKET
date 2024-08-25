from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import GPT2Tokenizer, GPT2LMHeadModel

app = Flask(__name__)
CORS(app)

tokenizer = GPT2Tokenizer.from_pretrained('gpt2')
model = GPT2LMHeadModel.from_pretrained('gpt2')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    input_text = data.get("input_text", "")
    
    input_ids = tokenizer.encode(input_text, return_tensors="pt")
    generated_text = model.generate(input_ids,
    max_length=50,
    do_sample=True, 
    top_k=50,        
    top_p=0.95,
    )
    output_text = tokenizer.decode(generated_text[0], skip_special_tokens=True , clean_up_tokenization_spaces=True)
    
    return jsonify({"predicted_text": output_text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
