import pika, os, time
rabbitmq_host = os.environ.get('RABBITMQ_HOST', 'localhost')
connection = pika.BlockingConnection(pika.ConnectionParameters(host=rabbitmq_host))
channel = connection.channel()
channel.queue_declare(queue='task-queue')

def callback(ch, method, properties, body):
    print(f"Processing task: {body.decode()}")
    time.sleep(1)
    ch.basic_ack(delivery_tag=method.delivery_tag)

channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='task-queue', on_message_callback=callback)
channel.start_consuming()
