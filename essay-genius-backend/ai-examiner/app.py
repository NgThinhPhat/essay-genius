from concurrent import futures
import grpc
from protobuf import ai_service_pb2_grpc
from application.essay_task2_ai_service import AIServiceServicer


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    ai_service_pb2_grpc.add_AIServiceServicer_to_server(AIServiceServicer(), server)
    server.add_insecure_port("[::]:9081")
    server.start()
    print("AI IELTS Scoring Service running on port 9081...")
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
