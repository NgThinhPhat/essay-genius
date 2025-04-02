from google.protobuf.symbol_database import Default
from protobuf import essay_service_pb2
from protobuf import ai_service_pb2

sym_db = Default()
sym_db.RegisterFileDescriptor(essay_service_pb2.DESCRIPTOR)

# Lấy message từ protobuf symbol database
PredictRequest = sym_db.GetSymbol("ai.PredictRequest")
PredictResponse = sym_db.GetSymbol("ai.PredictResponse")
