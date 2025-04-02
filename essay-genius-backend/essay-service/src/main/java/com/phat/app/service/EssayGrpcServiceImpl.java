package com.phat.app.service;

import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class EssayGrpcServiceImpl extends GreetingServiceGrpc.GreetingServiceImplBase {
     @Override
     public void greeting(EssayRequest request, StreamObserver<GreetingResponse> responseObserver) {
         String message = "Hello " + request.getMessage();
         System.out.println("Received message: " + message);
         GreetingResponse response = GreetingResponse.newBuilder().setMessage(message).build();
         responseObserver.onNext(response);
         responseObserver.onCompleted();
     }
}
