from flask import Flask, request, jsonify
import json
from os.path import exists

app = Flask(__name__)
COMENTARIOS_FILE = "comentarios.json"

@app.route("/guardar_comentario", methods=["POST"])
def guardar_comentario():
    datos = request.get_json()
    comentarios = []

    if exists(COMENTARIOS_FILE):
        with open(COMENTARIOS_FILE, "r", encoding="utf-8") as f:
            comentarios = json.load(f)

    comentarios.append(datos)

    with open(COMENTARIOS_FILE, "w", encoding="utf-8") as f:
        json.dump(comentarios, f, ensure_ascii=False)

    return jsonify({"ok": True})

@app.route("/obtener_comentarios", methods=["GET"])
def obtener_comentarios():
    if exists(COMENTARIOS_FILE):
        with open(COMENTARIOS_FILE, "r", encoding="utf-8") as f:
            return jsonify(json.load(f))
    return jsonify([])

if __name__ == "__main__":
    app.run(debug=True)
    
