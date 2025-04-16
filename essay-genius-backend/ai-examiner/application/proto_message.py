from google.protobuf.symbol_database import Default
from protobuf import ai_service_pb2

sym_db = Default()
sym_db.RegisterFileDescriptor(ai_service_pb2.DESCRIPTOR)

# Lấy message từ protobuf symbol database
ScoringRequest = sym_db.GetSymbol("com.phat.grpc.ai.ScoringRequest")
ScoringResponse = sym_db.GetSymbol("com.phat.grpc.ai.ScoringResponse")
GenerateEssayPromptRequest = sym_db.GetSymbol(
    "com.phat.grpc.ai.GenerateEssayPromptRequest"
)
GenerateEssayPromptResponse = sym_db.GetSymbol(
    "com.phat.grpc.ai.GenerateEssayPromptResponse"
)
