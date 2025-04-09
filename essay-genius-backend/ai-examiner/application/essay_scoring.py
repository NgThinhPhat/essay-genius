import base64
import os

from concurrent import futures
import grpc
import requests
from application.proto_message import ScoringResponse
from google import genai
from google.genai import types
from protobuf import essay_service_pb2_grpc


class EssayServiceServicer(essay_service_pb2_grpc.EssayServiceServicer):
    def Scoring(self, request, context):
        essay_prompt = request.essay_prompt
        essay_text = request.essay_text
        client = genai.Client(
            api_key="AIzaSyCVjWeSZJlkxWu7At7navdn01BGPzmOlqw",
        )

        model = "gemini-2.0-flash"
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(
                        text="""You are an IELTS Writing Task 2 examiner.

Please evaluate the following essay based on the IELTS Band Descriptors:
- Task Response
- Coherence and Cohesion
- Lexical Resource
- Grammatical Range and Accuracy

Return the results in the following JSON format:

{
  \"scores\": {
    \"task_response\": { \"band\": number, \"explanation\": string },
    \"coherence_and_cohesion\": { \"band\": number, \"explanation\": string },
    \"lexical_resource\": { \"band\": number, \"explanation\": string },
    \"grammatical_range_and_accuracy\": { \"band\": number, \"explanation\": string }
  },
  \"overall_band\": number,
  \"overall_feedback\": string,
  \"corrections\": [
    {
      \"mistake\": string,
      \"suggestion\": string,
      \"explanation\": string
    }
  ],
  \"improvement_tips\": [string],
  \"rewritten_paragraph\": string
}

Here is the Task 2 question:
\"You should spend about 40 minutes on this task. Write about the following topic

Forests are the lungs of the earth. Destruction of the world’s forests amounts to death of the world we currently know.

To what extent do you agree or disagree?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.\"

Here is the essay:
\"I am in consummate accord with the statement that, the Earth’s natural green reserves purify its atmosphere and functions synonymously as that of the mammalian lungs. I also advocate the view that, forest destruction will ruin our present world.

Firstly, from our basic knowledge of plant physiology, it can be restated that, plants by the process of photosynthesis convert the harmful carbon-dioxide gas into Oxygen, without which life cannot exist.  Thus in a wider perspective, it can be stated that, the earth’s forests purify the atmosphere and thereby help in sustaining life. Secondly, environmentalists have proven that, the rapid destruction of forests is also a leading cause of global warming. Hence, destruction of the natural green reserves may lead to such a surge in the global temperature that agricultural land may become arid, leading to wide spread famine and deaths. Thirdly, forests also house diverse forms of life and these would become extinct if we continue to destroy their natural habitats.

Furthermore, scientific research have proven that forest ecosystem act as natural scavengers and by the process of biodegradation, forest ecology helps in producing crude oil, which fuels our modern world and its unavailability is unimaginable as this will directly catalyse a global economic crisis. Finally forests are also source of numerous medicinal plants, from which varieties of modern medicines are produced; Quinine, an antimalarial drug, produced from the barks of Cinchona trees is the best possible example. Hence forest destruction will also be a bane for the medical community.

Thus the harmony of the present wonderful will be ruined if our natural green reserves are continuously destroyed and there is a theoretical possibility that the blue planet might become lifeless if these green lungs are totally wiped out.\"
"""
                    ),
                ],
            ),
            types.Content(
                role="model",
                parts=[
                    types.Part.from_text(
                        text="""Here's a breakdown of the thinking process to evaluate the provided IELTS essay:

1.  **Understand the Goal:** The request asks me to act as an IELTS Writing Task 2 examiner and evaluate a specific essay against the official band descriptors for Task Response (TR), Coherence and Cohesion (CC), Lexical Resource (LR), and Grammatical Range and Accuracy (GRA). The output needs to be in a specific JSON format, including scores, explanations, overall feedback, corrections, improvement tips, and a rewritten paragraph.

2.  **Analyze the Prompt:**
    *   **Topic:** The importance of forests (\"lungs of the earth\") and the consequences of their destruction (\"death of the world we currently know\").
    *   **Task:** \"To what extent do you agree or disagree?\" This requires a clear position and supporting arguments.
    *   **Requirements:** Give reasons, include relevant examples (from own knowledge/experience), write at least 250 words.

3.  **Initial Read-Through:** Read the essay to get a general sense of the writer's position, arguments, structure, language, and grammar.
    *   *Impression:* The writer strongly agrees with the statement. The arguments cover photosynthesis/air purification, global warming, biodiversity loss, crude oil formation (this one seems less direct/accurate), and medicinal plants. The language is quite ambitious, sometimes overly formal or slightly unnatural. The sentence structure is varied but contains some errors. The overall structure (Intro, Body 1, Body 2, Conclusion) is clear. Word count seems sufficient (checking later).

4.  **Evaluate Against Band Descriptors (Iterative Process):**

    *   **Task Response (TR):**
        *   *Addresses all parts of the task?* Yes, the writer takes a clear position (strong agreement) and addresses both aspects (forests as lungs, destruction as death of the world).
        *   *Presents a well-developed position?* Yes, the position is consistent throughout.
        *   *Presents relevant, extended, and supported ideas?* Mostly. Photosynthesis, global warming, biodiversity, and medicinal plants are relevant and generally well-explained. The crude oil argument is less convincing and perhaps slightly off-topic in its direct causality (biodegradation produces soil/humus, oil formation is a geological process over millennia). Examples are included (Quinine/Cinchona).
        *   *Word Count:* (Quick check/estimate - seems over 250). Let's count: Intro (38), BP1 (102), BP2 (95), Conclusion (41) = Total 276 words. Sufficient.
        *   *Potential Issues:* The crude oil point might slightly weaken the focus.
        *   *Band Score Estimate:* Likely Band 7. Addresses all parts, clear position, relevant main ideas, mostly well-supported. Not quite Band 8 (perhaps due to the slightly less relevant crude oil point and needing *fully* developed ideas).

    *   **Coherence and Cohesion (CC):**
        *   *Logical organization?* Yes, intro-body-conclusion structure. Ideas within paragraphs are generally grouped logically (BP1: air, climate, biodiversity; BP2: resources - oil, medicine).
        *   *Clear progression?* Generally clear. Uses linking words/phrases (\"Firstly,\" \"Secondly,\" \"Thirdly,\" \"Furthermore,\" \"Finally,\" \"Thus\").
        *   *Appropriate use of cohesive devices?* Mostly. Some overuse/slightly awkward use (\"synonymously as that of,\" \"it can be restated that,\" \"Thus in a wider perspective, it can be stated that\"). Repetition of \"destruction\" and variations is noticeable. Paragraphing is clear.
        *   *Potential Issues:* Some linking phrases feel a bit mechanical or slightly misused. The flow could be smoother in places. Reference is generally clear.
        *   *Band Score Estimate:* Likely Band 7. Logical organisation, clear progression, range of cohesive devices used flexibly (though with occasional awkwardness). Not quite Band 8 (which requires seamless flow and less mechanical linking).

    *   **Lexical Resource (LR):**
        *   *Range of vocabulary?* Good range (\"consummate accord,\" \"natural green reserves,\" \"purify,\" \"synonymously,\" \"mammalian,\" \"advocate,\" \"physiology,\" \"perspective,\" \"sustaining,\" \"environmentalists,\" \"surge,\" \"arid,\" \"famine,\" \"diverse,\" \"extinct,\" \"habitats,\" \"ecosystem,\" \"scavengers,\" \"biodegradation,\" \"ecology,\" \"catalyse,\" \"economic crisis,\" \"numerous,\" \"varieties,\" \"bane,\" \"harmony,\" \"theoretical possibility\").
        *   *Skillful use of uncommon items?* Yes, attempts many less common words.
        *   *Awareness of style and collocation?* Generally good, but some awkward phrasing or slightly incorrect collocations/word choices (\"consummate accord with the statement that,\" \"functions synonymously as that of,\" \"restated\" instead of just \"stated\" or \"known,\" \"scientific research have proven,\" \"unavailability is unimaginable,\" \"catalyse a global economic crisis,\" \"present wonderful\").
        *   *Errors?* Minor errors in word choice/form (\"scientific research *have* proven,\" \"present wonderful\"). Some phrasing is unnatural.
        *   *Band Score Estimate:* Likely Band 7. Uses a sufficient range with some flexibility and precision, uses less common items with some awareness of style/collocation, but produces *occasional* errors in word choice/collocation. Not Band 8 (which requires *skillful* use of uncommon items and only *rare* errors). The ambition bumps it up, but the errors prevent a higher score.

    *   **Grammatical Range and Accuracy (GRA):**
        *   *Range of structures?* Good range. Uses complex sentences (relative clauses, subordinate clauses, conditional ideas). Attempts complex structures.
        *   *Accuracy?* Produces frequent error-free sentences, but grammatical errors persist.
            *   Comma splices/incorrect comma usage (\"statement that, the Earth's...\", \"view that, forest...\", \"photosynthesis convert...\", \"stated that, the earth's...\", \"proven that, the rapid...\", \"research have proven that...\", \"oil, which...\", \"medicines are produced; Quinine...\"). Many unnecessary commas after \"that\".
            *   Subject-verb agreement (\"scientific research *have* proven\").
            *   Article usage (\"the harmful carbon-dioxide gas,\" \"a leading cause,\" \"a surge,\" \"wide spread famine,\" \"diverse forms,\" \"the process,\" \"forest ecology,\" \"crude oil,\" \"a global economic crisis,\" \"source of,\" \"varieties of,\" \"the best possible example,\" \"a bane,\" \"the harmony,\" \"the present wonderful,\" \"the blue planet,\" \"these green lungs\"). Mostly okay, but some minor inconsistencies possible.
            *   Awkward phrasing (\"synonymously as that of\").
            *   Punctuation (semicolon use is okay, but comma issues are prevalent).
        *   *Potential Issues:* The number and type of grammatical errors, particularly punctuation (commas) and the S-V agreement error, limit the score.
        *   *Band Score Estimate:* Likely Band 6. Uses a mix of simple and complex structures, but errors in grammar and punctuation reduce clarity at times. Not Band 7 (which requires *frequent* error-free sentences and *good control* of grammar/punctuation, though *some* errors may persist).

5.  **Calculate Overall Band Score:**
    *   TR: 7
    *   CC: 7
    *   LR: 7
    *   GRA: 6
    *   Overall: (7+7+7+6) / 4 = 6.75. Round to the nearest half-band -> **7.0**.

6.  **Formulate Overall Feedback:** Summarize the strengths (clear position, good structure, relevant points, ambitious vocabulary, range of sentence structures) and weaknesses (slightly off-topic point, some awkward phrasing/collocations, grammatical errors - especially commas and S-V agreement). State the overall band score.

7.  **Identify Specific Corrections:** Go back through the essay sentence by sentence and pick out clear errors.
    *   \"I am in consummate accord with the statement that, the Earth’s...\" -> \"I am in consummate accord with the statement that the Earth’s...\" (Remove comma after 'that').
    *   \"...functions synonymously as that of the mammalian lungs.\" -> \"...function in a way synonymous with mammalian lungs.\" or \"...perform a function synonymous with mammalian lungs.\" (Awkward phrasing).
    *   \"I also advocate the view that, forest destruction...\" -> \"I also advocate the view that forest destruction...\" (Remove comma after 'that').
    *   \"...it can be restated that, plants by the process...\" -> \"...it is known that plants, through the process...\" (Remove comma after 'that', 'restated' is slightly odd).
    *   \"...convert the harmful carbon-dioxide gas into Oxygen...\" -> \"...convert harmful carbon dioxide gas into oxygen...\" (Articles, capitalization).
    *   \"...it can be stated that, the earth’s forests...\" -> \"...it can be stated that the Earth’s forests...\" (Remove comma after 'that').
    *   \"...proven that, the rapid destruction...\" -> \"...proven that the rapid destruction...\" (Remove comma after 'that').
    *   \"...research have proven that...\" -> \"...research *has* proven that...\" (Subject-verb agreement).
    *   \"...world and its unavailability is unimaginable as this will directly catalyse...\" -> \"...world; its unavailability is unimaginable as this would directly catalyse...\" (Punctuation/word choice - 'would' is probably better than 'will').
    *   \"Finally forests are also source of...\" -> \"Finally, forests are also *a* source of...\" (Article).
    *   \"...produced; Quinine...\" -> \"...produced. Quinine...\" or \"...produced, such as Quinine...\" (Punctuation - semicolon connects independent clauses, this is an example).
    *   \"...present wonderful will be ruined...\" -> \"...present wonderful *world* will be ruined...\" (Missing word).

8.  **Generate Improvement Tips:** Based on the evaluation:
    *   Focus on comma usage, especially after 'that'.
    *   Review subject-verb agreement.
    *   Refine complex vocabulary use for naturalness and correct collocation.
    *   Ensure all arguments directly and strongly support the main point (re-evaluate the crude oil argument's relevance/phrasing).
    *   Proofread carefully for small errors (missing words, articles).

9.  **Rewrite a Paragraph:** Choose a paragraph (e.g., the second body paragraph) that has a mix of strengths and weaknesses and rewrite it to demonstrate improvements in GRA, LR, and CC.
    *   *Original:* \"Furthermore, scientific research have proven that forest ecosystem act as natural scavengers and by the process of biodegradation, forest ecology helps in producing crude oil, which fuels our modern world and its unavailability is unimaginable as this will directly catalyse a global economic crisis. Finally forests are also source of numerous medicinal plants, from which varieties of modern medicines are produced; Quinine, an antimalarial drug, produced from the barks of Cinchona trees is the best possible example. Hence forest destruction will also be a bane for the medical community.\"
    *   *Focus:* Fix S-V agreement, remove dubious crude oil link (or rephrase carefully if keeping), improve flow, fix punctuation, improve word choice.
    *   *Rewritten Version (Example):* \"Furthermore, forests provide essential resources beyond clean air. Scientific research *has* shown that forest ecosystems contain immense biodiversity, including numerous medicinal plants vital for modern medicine. For instance, Quinine, a crucial antimalarial drug, is derived from the bark of the Cinchona tree, highlighting the potential loss to the medical community if such habitats are destroyed. While forests also play a role in natural decomposition processes, their destruction primarily threatens the irreplaceable biological and pharmaceutical resources they harbour, rather than directly causing an energy crisis related to crude oil formation, which is a geological process spanning millennia. Therefore, deforestation represents a significant threat not only to environmental stability but also to human health and scientific discovery.\" (This version corrects errors, clarifies the medicinal point, and addresses the problematic crude oil argument).

10. **Assemble the JSON:** Populate the JSON structure with the band scores, explanations, overall feedback, corrections list, improvement tips, and the rewritten paragraph generated in the previous steps. Double-check that all fields are filled and the format is correct."""
                    ),
                    types.Part.from_text(
                        text="""```json
{
  \"scores\": {
    \"task_response\": {
      \"band\": 7,
      \"explanation\": \"The essay addresses all parts of the prompt, presenting a clear position (strong agreement) that is directly relevant to the question. The main ideas (photosynthesis/air, climate change, biodiversity, resources/medicine) are relevant and extended. Examples are included (Quinine). However, the point about crude oil formation feels less directly relevant and slightly weakens the focus. The arguments are generally developed but could sometimes be explored in more depth or with greater clarity (e.g., the link between forest destruction and famine). Overall, it sufficiently addresses the task requirements.\"
    },
    \"coherence_and_cohesion\": {
      \"band\": 7,
      \"explanation\": \"The essay is logically organised with a clear introduction, body paragraphs presenting distinct points, and a conclusion. There is a clear overall progression. Cohesive devices are used effectively ('Firstly', 'Secondly', 'Thirdly', 'Furthermore', 'Finally', 'Thus'), although some phrasing around linking feels slightly mechanical or repetitive ('it can be stated that...'). Paragraphing is appropriate. While generally coherent, the flow is occasionally disrupted by slightly awkward sentence constructions or vocabulary choices.\"
    },
    \"lexical_resource\": {
      \"band\": 7,
      \"explanation\": \"The essay demonstrates a good range of vocabulary, including less common items ('consummate accord', 'synonymously', 'physiology', 'arid', 'bane', 'scavengers', 'biodegradation'). There is an awareness of style and collocation, although some attempts are slightly unnatural or inaccurate ('consummate accord with the statement that', 'functions synonymously as that of', 'present wonderful'). There are occasional errors in word choice or form ('research have proven'), but these generally do not impede communication significantly. The lexical resource is sufficient for a Band 7.\"
    },
    \"grammatical_range_and_accuracy\": {
      \"band\": 6,
      \"explanation\": \"The writer uses a mix of simple and complex sentence structures, attempting various clauses. However, errors in grammar and punctuation are noticeable and sometimes impact clarity. There are frequent issues with comma usage, particularly unnecessary commas after 'that' clauses ('statement that, the Earth's...', 'view that, forest...'). There is a subject-verb agreement error ('research have proven'). While many sentences are error-free, the persistence of these errors, especially punctuation, prevents a higher score. Control over complex structures is variable.\"
    }
  },
  \"overall_band\": 7.0,
  \"overall_feedback\": \"This essay presents a clear and well-supported argument in response to the prompt, demonstrating strong agreement with the statement. The structure is logical, and the writer uses a good range of vocabulary, including some sophisticated terms. Key arguments related to air purification, climate change, biodiversity, and medicinal resources are relevant. However, the essay is let down by recurring grammatical errors, particularly incorrect comma usage and a subject-verb agreement mistake. Some vocabulary choices, while ambitious, sound slightly unnatural ('consummate accord with the statement that', 'functions synonymously as that of'). The point linking forest biodegradation directly to crude oil production is scientifically questionable and weakens that part of the argument slightly. Overall, a solid Band 7 performance, limited primarily by grammatical accuracy.\",
  \"corrections\": [
    {
      \"mistake\": \"I am in consummate accord with the statement that, the Earth’s natural green reserves...\",
      \"suggestion\": \"I am in consummate accord with the statement that the Earth’s natural green reserves...\",
      \"explanation\": \"An unnecessary comma is used after 'that' when introducing the subordinate clause.\"
    },
    {
      \"mistake\": \"...functions synonymously as that of the mammalian lungs.\",
      \"suggestion\": \"...function synonymously with mammalian lungs.\",
      \"explanation\": \"The phrasing 'synonymously as that of' is awkward and grammatically incorrect. 'Synonymously with' is the correct prepositional phrase, or rephrasing for clarity (e.g., 'perform a function analogous to mammalian lungs').\"
    },
    {
      \"mistake\": \"I also advocate the view that, forest destruction will ruin...\",
      \"suggestion\": \"I also advocate the view that forest destruction will ruin...\",
      \"explanation\": \"An unnecessary comma is used after 'that' when introducing the subordinate clause.\"
    },
    {
      \"mistake\": \"...it can be restated that, plants by the process of photosynthesis convert...\",
      \"suggestion\": \"...it is known that plants, through the process of photosynthesis, convert...\",
      \"explanation\": \"'Restated' implies it was stated before in the essay; 'known' or 'understood' is better. An unnecessary comma is used after 'that'. Commas around 'through the process of photosynthesis' improve clarity.\"
    },
    {
      \"mistake\": \"...convert the harmful carbon-dioxide gas into Oxygen...\",
      \"suggestion\": \"...convert harmful carbon dioxide gas into oxygen...\",
      \"explanation\": \"Generally, specific chemical names like 'carbon dioxide' and 'oxygen' are not capitalized unless starting a sentence. The article 'the' before 'harmful carbon-dioxide gas' is slightly unnatural here.\"
    },
    {
      \"mistake\": \"...it can be stated that, the earth’s forests purify...\",
      \"suggestion\": \"...it can be stated that the Earth’s forests purify...\",
      \"explanation\": \"An unnecessary comma is used after 'that'. 'Earth' is usually capitalized when referring to the planet.\"
    },
    {
      \"mistake\": \"...environmentalists have proven that, the rapid destruction...\",
      \"suggestion\": \"...environmentalists have proven that the rapid destruction...\",
      \"explanation\": \"An unnecessary comma is used after 'that'.\"
    },
    {
      \"mistake\": \"...scientific research have proven that...\",
      \"suggestion\": \"...scientific research has proven that...\",
      \"explanation\": \"Subject-verb agreement error. 'Research' is typically an uncountable noun and takes a singular verb.\"
    },
     {
      \"mistake\": \"...forest ecosystem act as natural scavengers and by the process of biodegradation, forest ecology helps in producing crude oil...\",
      \"suggestion\": \"...forest ecosystems act as natural recyclers, and through processes like biodegradation, they break down organic matter...\",
      \"explanation\": \"'Scavengers' usually refers to animals. The link between forest biodegradation and crude oil production is inaccurate; oil formation is a geological process over millions of years. Rephrasing focuses on the more accurate role of decomposition/recycling.\"
    },
    {
      \"mistake\": \"Finally forests are also source of...\",
      \"suggestion\": \"Finally, forests are also a source of...\",
      \"explanation\": \"Missing indefinite article 'a' before 'source'.\"
    },
     {
      \"mistake\": \"...medicines are produced; Quinine, an antimalarial drug...\",
      \"suggestion\": \"...medicines are produced. Quinine, an antimalarial drug...\",
      \"explanation\": \"A semicolon connects two independent clauses. Here, 'Quinine...' is an example elaborating on the previous clause, so a full stop or a comma introducing the example (e.g., '...produced, such as Quinine...') would be more appropriate.\"
    },
    {
      \"mistake\": \"Thus the harmony of the present wonderful will be ruined...\",
      \"suggestion\": \"Thus, the harmony of the present wonderful world will be ruined...\",
      \"explanation\": \"Missing noun 'world' after 'wonderful'. A comma is usually used after introductory 'Thus'.\"
    }
  ],
  \"improvement_tips\": [
    \"Proofread carefully for grammatical errors, paying close attention to subject-verb agreement ('research has') and correct comma usage, especially avoiding unnecessary commas after 'that' introducing clauses.\",
    \"While using sophisticated vocabulary is good, ensure the words and phrases chosen sound natural and are used correctly in context (e.g., 'synonymously with' instead of 'synonymously as that of').\",
    \"Ensure all supporting points are directly relevant and accurately presented. The link between forest biodegradation and crude oil production should be omitted or rephrased to reflect decomposition accurately.\",
    \"Vary sentence beginnings and cohesive devices slightly to avoid repetition and make the flow smoother (e.g., instead of 'it can be stated that', use alternatives like 'it is clear that', 'undeniably', or integrate the point more directly).\"
  ],
  \"rewritten_paragraph\": \"Here is a revised version of the second body paragraph, addressing grammar, accuracy, and flow:\\n\\n\\\"Furthermore, forests provide essential resources beyond clean air. Scientific research has demonstrated that forest ecosystems harbour immense biodiversity, including numerous plant species vital for modern medicine. For instance, Quinine, a crucial antimalarial drug derived from the bark of the Cinchona tree, exemplifies the potential loss to the medical community should these habitats be destroyed. Additionally, forests play a critical role in natural decomposition and nutrient cycling, although the assertion that this process directly produces crude oil is inaccurate, as oil formation is a geological phenomenon occurring over millennia. Therefore, the destruction of forests not only destabilises ecosystems and climate but also eliminates irreplaceable sources of potential medical breakthroughs, posing a significant threat to human health and scientific advancement.\\\"\"
}
```"""
                    ),
                ],
            ),
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(
                        text=f"""Here is the Task 2 question:
\"{essay_prompt}\"

Here is the essay:
\"{essay_text}\""""
                    ),
                ],
            ),
        ]

        generate_content_config = types.GenerateContentConfig(
            response_mime_type="text/plain",
        )

        chunks = client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        )
        result = "".join(
            str(chunk.text) for chunk in chunks if hasattr(chunk, "text") and chunk.text
        )
        return ScoringResponse(result=result)


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
