from concurrent import futures
import requests
import grpc
from application.proto_message import ScoringResponse
from protobuf import essay_service_pb2_grpc
import re


class EssayServiceServicer(essay_service_pb2_grpc.EssayServiceServicer):
    def Scoring(self, request, context):
        essay_prompt = request.essay_prompt
        essay_text = request.essay_text

        OLLAMA_API_URL = "http://localhost:11434/api/generate"

        # Sử dụng essay_prompt và essay_text từ request gRPC
        prompt = f"""
        You are an IELTS examiner. Your task is to evaluate the following IELTS Writing Task 2 essay using the official IELTS band descriptors.

        ### **Essay Prompt:**  
        "{essay_prompt}"

        ---

        ### **Essay for Evaluation:**  
        "{essay_text}"

        ### IMPORTANT:
        If either the essay prompt or essay text is missing, empty, or formatted incorrectly, return only the following string:
        **"Your inputs are not correct."**
        Do not attempt to process or evaluate the essay in such a case.
        Do not add any explanation or reasoning. Just return that string exactly.

        ---

        ### **Instructions:**  
        - **Do NOT provide any extra commentary, thoughts, or reasoning before answering.**  
        - **Strictly follow the format below.**  
        - **Ensure each section contains at least two strengths, two weaknesses, and two suggestions for improvement.**  
        - **DO NOT add unnecessary explanations outside the requested format.**  

        ### **Scoring Criteria:**
        - **Use numerical scores (1.0 - 9.0) in X.X format, rounded to the nearest 0.5.**  
        - **Do NOT include any other scoring scale (e.g., /7.0, /8.0, etc.). Only use /9.0.**  
        - **For example points, use 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0 etc from 1.0 to 9.0.**
        ---

        ### **FORMAT (REQUIRED RESPONSE)**  

        1.Task Response: X.X  

            Strengths:  
            - [What was done well?]  
            - [Another strength]  

            Weaknesses:  
            - [Point out areas for improvement]  
            - [Another weakness]  

            How to Improve:  
            - [Suggestions to enhance this area]  
            - [Another suggestion]  

        2.Coherence & Cohesion: X.X  

            Strengths:  
            - [What was done well?]  
            - [Another strength]  

            Weaknesses:  
            - [Point out areas for improvement]  
            - [Another weakness]  

            How to Improve:  
            - [Suggestions to enhance this area]  
            - [Another suggestion]  

        3.Lexical Resource: X.X  

            Strengths:  
            - [What was done well?]  
            - [Another strength]  

            Weaknesses:  
            - [Point out areas for improvement]  
            - [Another weakness]  

            How to Improve:  
            - [Suggestions to enhance this area]  
            - [Another suggestion]  

        4.Grammatical Range & Accuracy: X.X  

            Strengths:  
            - [What was done well?]  
            - [Another strength]  

            Weaknesses:  
            - [Point out areas for improvement]  
            - [Another weakness]  

            How to Improve:  
            - [Suggestions to enhance this area]  
            - [Another suggestion]  

        OVERALL BAND SCORE: X.X  (Accurate final score, an average of the four sections)
        ---
        """
        payload = {
            "model": "deepseek-r1:1.5b",  # Model bạn đang chạy
            "prompt": prompt,
            "stream": False,
        }
        response = requests.post(OLLAMA_API_URL, json=payload)

        # Hiển thị kết quả
        if response.status_code == 200:
            result = response.json()
            print("\n################## IELTS Score Breakdown:")
            text = re.sub(
                r"<think>.*?</think>", "", result["response"], flags=re.DOTALL
            ).strip()
            print(result["response"])
            return ScoringResponse(result=text)
        else:
            print("❌ Error:", response.text)

        # print(f"Received request: {essay_prompt}, {essay_text}")
        # response = ScoringResponse(result="asdfasdfs")
        # print(f"Returning response: {response}")
        # return response


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    essay_service_pb2_grpc.add_EssayServiceServicer_to_server(
        EssayServiceServicer(), server
    )
    server.add_insecure_port("[::]:9090")
    server.start()
    print("AI IELTS Scoring Service running on port 9090...")
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
