import os
from concurrent import futures
import grpc
import openai
from protobuf import essay_service_pb2
from protobuf import essay_service_pb2_grpc

# Load OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")


# AI Analysis Function
def analyze_essay(essay_text):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an IELTS essay evaluator."},
            {"role": "user", "content": essay_text},
        ],
        max_tokens=200,
    )
    return response["choices"][0]["message"]["content"]


# gRPC Service Implementation
class EssayAnalysisServicer(essay_service_pb2_grpc.EssayAnalysisServicer):
    def AnalyzeEssay(self, request, context):
        feedback = analyze_essay(request.essay_text)
        return essay_service_pb2.EssayResponse(feedback=feedback)


# Start gRPC Server
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    essay_service_pb2_grpc.add_EssayAnalysisServicer_to_server(
        EssayAnalysisServicer(), server
    )
    server.add_insecure_port("[::]:50051")
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
