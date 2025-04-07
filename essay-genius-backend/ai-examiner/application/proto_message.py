from google.protobuf.symbol_database import Default
from protobuf import essay_service_pb2

sym_db = Default()
sym_db.RegisterFileDescriptor(essay_service_pb2.DESCRIPTOR)

# Lấy message từ protobuf symbol database
ScoringRequest = sym_db.GetSymbol("com.phat.grpc.essay.ScoringRequest")
ScoringResponse = sym_db.GetSymbol("com.phat.grpc.essay.ScoringResponse")
