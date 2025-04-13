import base64
import os
from google import genai
from google.genai import types

from dotenv import load_dotenv

load_dotenv()


def generate():
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    model = "gemini-2.0-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(
                    text="""You are an IELTS examiner assistant.

From the list of topics provided, generate **one IELTS Writing Task 2** prompt. Follow the official IELTS question style.

List of topics:
[\"technology\", \"education\", \"environment\", \"health\", \"globalization\"]

Rules:
- Choose only **one** topic from the list.
- The prompt should be suitable for Task 2 (opinion/discussion/problem-solution type).
- Use proper IELTS phrasing, e.g.:
  - \"Some people believe that... while others think that... Discuss both views and give your own opinion.\"
  - \"To what extent do you agree or disagree?\"
  - \"What are the causes of this problem and how can it be solved?\"

Return output in this format:
```json
{
  \"essay_prompt\": \"Your generated IELTS Writing Task 2 question here\"
}
"""
                ),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(
                    text="""The user wants an IELTS Writing Task 2 prompt based on one topic from the provided list: [\"technology\", \"education\", \"environment\", \"health\", \"globalization\"].

I need to:
1.  **Choose one topic:** I'll choose \"technology\".
2.  **Decide on a question type:** An opinion/discussion type seems suitable for technology. Let's go with a \"discuss both views and give your own opinion\" structure.
3.  **Formulate the question:** I need to present two contrasting views related to technology. A common debate is the impact of technology on social interaction or skills.
    *   View 1: Technology enhances communication and connection.
    *   View 2: Technology leads to social isolation and diminishes real-world interaction skills.
4.  **Phrase it according to IELTS style:**
    *   \"Some people believe that modern technology has improved social connections and made communication easier than ever before.\"
    *   \"Others argue that it has led to increased social isolation and a decline in face-to-face interaction skills.\"
    *   Combine these with the standard instruction: \"Discuss both these views and give your own opinion.\"
5.  **Format the output:** Place the final prompt within the specified JSON structure.

Let's try another topic: \"environment\".
1.  **Choose topic:** Environment.
2.  **Decide question type:** Problem/solution or To what extent agree/disagree. Let's try \"To what extent...\".
3.  **Formulate the question:** Focus on individual vs. government responsibility for environmental problems.
    *   Statement: Individuals can do little to improve the environment; only governments and large companies can make a real difference.
4.  **Phrase it according to IELTS style:**
    *   \"Some argue that individuals can have little impact on tackling environmental problems, and that only governments and large corporations can make a significant difference.\"
    *   Combine with the standard instruction: \"To what extent do you agree or disagree?\"
5.  **Format the output:** Place the final prompt within the specified JSON structure.

This second option seems solid and addresses a common environmental debate. Let's go with the environment topic and the \"To what extent...\" format.

Final check:
-   Topic chosen: Environment (from the list).
-   Question type: Opinion (Agree/Disagree).
-   Phrasing: Uses standard IELTS structure (\"Some argue that...\", \"To what extent do you agree or disagree?\").
-   Suitability: Appropriate complexity for Task 2.
-   Output format: Correct JSON structure."""
                ),
                types.Part.from_text(
                    text="""```json
{
  \"essay_prompt\": \"Some argue that individuals can have little impact on tackling environmental problems, and that only governments and large corporations can make a significant difference. \\n\\nTo what extent do you agree or disagree?\"
}
```"""
                ),
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""INSERT_INPUT_HERE"""),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        response_mime_type="text/plain",
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")


if __name__ == "__main__":
    generate()
