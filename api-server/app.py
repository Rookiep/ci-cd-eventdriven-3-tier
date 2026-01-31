from flask import Flask, request, jsonify
import pika, os

app = Flask(__name__)
rabbitmq_host = os.environ.get('RABBITMQ_HOST', 'localhost')

def send_to_queue(message):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host))
    channel = connection.channel()
    channel.queue_declare(queue='task-queue')
    channel.basic_publish(exchange='', routing_key='task-queue', body=message)
    connection.close()

@app.route('/tasks', methods=['POST'])
def tasks():
    data = request.json
    send_to_queue(data['task'])
    return jsonify({"status": "sent", "task": data['task']})

app.run(host='0.0.0.0', port=5000)