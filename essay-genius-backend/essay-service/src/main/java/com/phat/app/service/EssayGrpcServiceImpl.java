package com.phat.app.service;

import com.phat.grpc.essay.GreetingRequest;
import com.phat.grpc.essay.GreetingResponse;
import com.phat.grpc.essay.GreetingServiceGrpc;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class EssayGrpcServiceImpl extends GreetingServiceGrpc.GreetingServiceImplBase {
     @Override
     public void greeting(GreetingRequest request, StreamObserver<GreetingResponse> responseObserver) {
         String message = "Hello " + request.getMessage();
         System.out.println("Received message: " + message);
         GreetingResponse response = GreetingResponse.newBuilder().setMessage(message).build();
         responseObserver.onNext(response);
         responseObserver.onCompleted();
     }
}
