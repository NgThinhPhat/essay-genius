from concurrent import futures
import grpc

from application.proto_message import PredictResponse
from protobuf import ai_service_pb2_grpc


class AIServiceServicer(ai_service_pb2_grpc.AIServiceServicer):
    def Predict(self, request, context):
        input_data = request.input_data
        result = f"Processed: {input_data}"  # Replace with actual AI logic
        return PredictResponse(result=result)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    ai_service_pb2_grpc.add_AIServiceServicer_to_server(AIServiceServicer(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    print("AI Service running on port 50051...")
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
