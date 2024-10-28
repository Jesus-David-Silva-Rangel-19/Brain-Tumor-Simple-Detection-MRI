from flask import Flask, request, jsonify, send_file
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
import numpy as np
import io

app = Flask(__name__)
model = load_model("model/TDM_Model.h5")

# Etiquetas descriptivas
labels = {
    'yes': 'Tumor detectado',
    'no': 'Sin tumor'
}

# Preprocesamiento de la imagen y predicción
def preprocess_and_predict(image_data):
    img = image.load_img(io.BytesIO(image_data), target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    prediction = model.predict(img_array)[0][0]
    class_label = 'yes' if prediction > 0.5 else 'no'
    descriptive_label = labels[class_label]
    
    return descriptive_label

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No se subió ningún archivo"}), 400
    
    file = request.files["file"]
    prediction = preprocess_and_predict(file.read())
    
    return jsonify({"prediction": prediction})

# Endpoint para cargar el archivo index.html
@app.route("/")
def home():
    return send_file("index.html")

if __name__ == "__main__":
    app.run(debug=True)