import os
from concurrent import futures
import grpc
from application.proto_message import ScoringResponse
from google import genai
from google.genai import types
from protobuf import essay_service_pb2_grpc
from dotenv import load_dotenv
import json
import re

load_dotenv()


class EssayServiceServicer(essay_service_pb2_grpc.EssayServiceServicer):
    def Scoring(self, request, context):
        essay_prompt = request.essay_prompt
        essay_text = request.essay_text
        client = genai.Client(
            api_key=os.environ.get("GEMINI_API_KEY"),
        )

        model = "gemini-2.0-flash"
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(
                        text="""You are an IELTS Writing Task 2 examiner.

Your task is to do two things:

🔹 Step 1: Validate Input

Check whether the provided essay_prompt and essay_text are valid IELTS Writing Task 2 materials.

An input is considered valid if:

The prompt is a clear and typical IELTS Task 2 question.

The essay responds meaningfully to the prompt with logical structure, real sentences, and relevant content.

An input is invalid if:

The essay is off-topic, spammy, or nonsensical.

The content is mostly gibberish or unrelated text.

The prompt is missing or meaningless.

🔹 Step 2: Return a JSON result based on validity

✅ If valid, return the following JSON structure:
{
  \"valid\": true,
  \"result\":{
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
  }
If invalid, return this JSON structure:

{
  \"valid\": false,
  \"result\": \"Explain clearly why this input is invalid — for example, 'Essay is mostly gibberish', 'Prompt is missing', or 'Essay does not address the question'.\"
}
Now analyze the following input:
essay_prompt:
\"You should spend about 40 minutes on this task. Write about the following topic

Fresh water has always been a limited resource in some parts of the world. Today, however, growing worldwide demand has made this a global problem.

What are the causes of the increased demand and what measure could governments and individuals take to respond to this problem?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.\"

essay_text:
\"Since time immemorial, in certain drier parts of the world, fresh water has always been a scarce natural resource. However, in the present time, due to various reasons, scarcity of fresh water has become a global issue. This essay will illustrate some factors contributing to this problem and will also elicit certain steps that can help the national authorities and individuals in controlling this growing demand for natural salt free water.

Firstly, population explosion is the factor of utmost importance, which has lead to the global surge in potable water requirement. Secondly, increased pollution of natural fresh water reserves due to urbanisation and industrialization has compounded this demand. Furthermore, in modern times, the growing use of salt free water for activities like recreational swimming, have also catalysed the surge in global water demand.

National authorities, on the other hand, can control this surge by implementing public education schemes regarding controlled water usage. Strict national legislations for preventing natural fresh water reserve pollution are also required. Moreover, government should also enact infrastructures for purification of seawater into saline free water, which will help in meeting the growing requirement of fresh water.

Similarly, public can also contribute towards this noble cause by conserving water and also by limiting their daily household water usage. They should refrain themselves from performing activities that will pollute natural fresh water reserves.

Thus even though, the scarcity of fresh water is a growing global problem, there are various means and methods available, by which both the government and individuals can prevent this from worsening. \"

"""
                    ),
                ],
            ),
            types.Content(
                role="model",
                parts=[
                    types.Part.from_text(
                        text="""The user wants me to act as an IELTS examiner.
My task is to:
1.  **Validate** the provided `essay_prompt` and `essay_text`.
2.  If **valid**, provide a detailed IELTS assessment in JSON format, including band scores for each criterion (Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy), an overall band score, overall feedback, specific corrections, improvement tips, and a rewritten paragraph.
3.  If **invalid**, provide a JSON response indicating invalidity and the reason.

**Step 1: Validate Input**

*   **Prompt Analysis:**
    *   Is it a clear IELTS Task 2 question? Yes. It presents a situation (growing global demand for fresh water) and asks for causes and solutions (measures governments and individuals can take).
    *   Is it typical? Yes, this \"problem/causes/solutions\" format is very common in IELTS Task 2.
    *   Word count requirement? Yes, \"at least 250 words\".
    *   Time suggestion? Yes, \"about 40 minutes\".
    *   Specific instructions? Yes, \"Give reasons for your answer and include any relevant examples...\".
    *   Conclusion: The prompt is valid.

*   **Essay Analysis:**
    *   Does it respond meaningfully to the prompt? Yes, it attempts to address the causes of increased water demand and proposes solutions for governments and individuals.
    *   Does it have a logical structure? Yes, it has an introduction, body paragraphs discussing causes and solutions, and a conclusion.
    *   Does it use real sentences? Yes.
    *   Is the content relevant? Yes, it discusses population growth, pollution, recreational use (causes) and education, legislation, desalination, conservation (solutions).
    *   Is it off-topic, spammy, or nonsensical? No.
    *   Is it gibberish? No.
    *   Word count? Let's check (approximate):
        *   Intro: ~60 words
        *   Para 2 (Causes): ~60 words
        *   Para 3 (Govt Solutions): ~65 words
        *   Para 4 (Individual Solutions): ~35 words
        *   Conclusion: ~35 words
        *   Total: ~255 words. It meets the minimum word count.
    *   Conclusion: The essay is valid.

**Step 2: Return JSON Result (Valid Input)**

Since the input is valid, I need to generate the detailed assessment.

*   **Task Response (TR):**
    *   Addresses all parts of the prompt? Yes, discusses causes and solutions (both government and individual).
    *   Presents a clear position? The essay clearly outlines causes and solutions as requested.
    *   Develops ideas? Ideas are presented but could be developed further. Causes (population, pollution, recreational use) are listed but not elaborated much. Solutions (education, legislation, desalination, conservation) are mentioned but lack specific detail or examples. The examples mentioned are very general (e.g., \"recreational swimming\"). The prompt asks for *relevant examples from your own knowledge or experience*, which are largely missing.
    *   Word count? Sufficient.
    *   Conclusion: Addresses all parts but lacks sufficient development and specific examples. Band 6.

*   **Coherence and Cohesion (CC):**
    *   Logical organization? Yes, intro, causes, govt solutions, individual solutions, conclusion. Paragraphing is generally logical.
    *   Clear progression? Yes, the argument flows reasonably well.
    *   Use of cohesive devices? Uses devices like \"Firstly\", \"Secondly\", \"Furthermore\", \"on the other hand\", \"Similarly\", \"Thus\". Some usage is slightly mechanical (\"Firstly\", \"Secondly\"). \"On the other hand\" might not be the best choice between causes and solutions; perhaps \"Turning to solutions\" or similar would be better. Paragraph 4 (Individual solutions) feels a bit short and underdeveloped compared to the previous one.
    *   Referencing? Generally clear.
    *   Conclusion: Information is organized logically with mostly appropriate cohesive devices, though paragraphing could be slightly more balanced and some linking words could be improved. Band 6.

*   **Lexical Resource (LR):**
    *   Range of vocabulary? Attempts a good range (\"time immemorial\", \"scarce natural resource\", \"potable water\", \"compounded\", \"catalysed\", \"enact infrastructures\", \"saline free water\", \"noble cause\", \"refrain themselves\"). Uses topic-specific vocabulary (\"fresh water\", \"scarcity\", \"population explosion\", \"urbanisation\", \"industrialization\", \"pollution\", \"reserves\", \"conservation\", \"desalination\").
    *   Precision? Generally good, but some slightly awkward phrasing (\"natural salt free water\", \"saline free water\" - \"fresh water\" or \"desalinated water\" is simpler; \"elicit certain steps\" - \"outline\" or \"suggest\" is better; \"factor of utmost importance\"). \"Refrain themselves\" is redundant. \"enact infrastructures\" - \"develop\" or \"build\" infrastructure is more natural.
    *   Errors? Few significant errors in word choice or formation. Repetition of \"fresh water\" and \"demand\" is noticeable but acceptable.
    *   Conclusion: Uses a sufficient range of vocabulary with some awareness of style and collocation, though with occasional awkwardness or imprecision. Band 6.

*   **Grammatical Range and Accuracy (GRA):**
    *   Range of structures? Uses a mix of simple and complex sentences (e.g., relative clauses \"which has lead...\", adverbial clauses \"Due to various reasons...\", passive voice \"Strict national legislations... are also required\").
    *   Accuracy? Generally good control. Some errors:
        *   \"has lead\" -> \"has led\" (verb form)
        *   \"preventing natural fresh water reserve pollution\" -> \"preventing the pollution of natural fresh water reserves\" (article/structure)
        *   \"government should also enact infrastructures\" -> \"governments should also develop/build infrastructure\" (plural noun consistency, collocation)
        *   \"purification of seawater into saline free water\" -> \"purification of seawater into fresh water\" or \"desalination of seawater\" (word choice/naturalness)
        *   \"public can also contribute\" -> \"the public can also contribute\" (article)
        *   \"refrain themselves from performing\" -> \"refrain from performing\" (redundant reflexive pronoun)
        *   \"Thus even though, the scarcity...\" -> \"Thus, even though the scarcity...\" (comma splice/punctuation)
    *   Punctuation? Mostly okay, but some minor issues (comma usage).
    *   Conclusion: Uses a mix of sentence structures with reasonable accuracy. Errors occur but generally do not impede communication. Band 6.

*   **Overall Band Score:** The scores are consistently Band 6 across all criteria. Therefore, the overall band score is 6.0.

*   **Overall Feedback:** The essay addresses the prompt adequately, outlining causes for increased water demand and suggesting solutions for governments and individuals. It is logically organized and uses a reasonable range of vocabulary and grammar. However, the development of ideas is somewhat limited; causes and solutions could be explained in more detail with specific examples. There are some minor errors in vocabulary choice and grammar, but these do not significantly hinder understanding. To improve, focus on elaborating points more fully and ensuring greater precision in language use.

*   **Corrections:** Identify specific mistakes and provide suggestions/explanations.
    1.  Mistake: \"has lead\" Suggestion: \"has led\" Explanation: \"Led\" is the past participle of the verb \"to lead\".
    2.  Mistake: \"elicit certain steps\" Suggestion: \"outline certain steps\" / \"suggest certain steps\" Explanation: \"Elicit\" means to draw out a response or information, usually from a person. \"Outline\" or \"suggest\" fits the context of presenting solutions better.
    3.  Mistake: \"natural salt free water\" Suggestion: \"fresh water\" Explanation: \"Fresh water\" is the standard term. \"Salt free water\" is redundant.
    4.  Mistake: \"government should also enact infrastructures\" Suggestion: \"governments should also build/develop infrastructure\" Explanation: \"Government\" can be singular or plural depending on context, but using the plural \"governments\" is often better when speaking generally. \"Infrastructure\" is typically uncountable in this context. \"Enact\" is usually used for laws, while \"build\" or \"develop\" are used for infrastructure.
    5.  Mistake: \"public can also contribute\" Suggestion: \"the public can also contribute\" Explanation: \"The public\" requires the definite article when referring to people in general.
    6.  Mistake: \"refrain themselves from performing\" Suggestion: \"refrain from performing\" Explanation: The verb \"refrain\" does not require a reflexive pronoun (\"themselves\").
    7.  Mistake: \"Thus even though, the scarcity...\" Suggestion: \"Thus, even though the scarcity...\" Explanation: \"Thus\" is an introductory adverbial and should be followed by a comma. \"Even though\" introduces a subordinate clause, which should not be separated from the main clause by only a comma if it comes first (a comma splice issue). Here, the comma after \"Thus\" is correct, and no comma is needed after \"though\".

*   **Improvement Tips:**
    1.  **Develop Ideas Further:** Expand on the causes and solutions. For example, when mentioning population growth, explain *how* it increases demand (more agriculture, domestic use, industry). For solutions like education, suggest *what kind* of education campaigns.
    2.  **Use Specific Examples:** Instead of just \"recreational swimming\", you could mention the filling of private pools or the high water consumption of tourist resorts in arid areas. For government solutions, mention a specific country's successful water conservation law or desalination project.
    3.  **Enhance Cohesion:** While linking words are used, ensure they create a smooth flow. Consider alternatives to \"Firstly, Secondly\". Vary transition signals (e.g., \"Regarding solutions...\", \"On an individual level...\"). Ensure paragraph topics are distinct and well-developed (the paragraph on individual actions is quite brief).
    4.  **Refine Vocabulary:** While the range is decent, aim for more precise and natural phrasing (e.g., avoid \"salt free water\", use appropriate verbs like \"build infrastructure\" instead of \"enact infrastructures\").
    5.  **Grammar Check:** Pay attention to common errors like verb forms (lead/led), articles (a/an/the), and appropriate use of reflexive pronouns.

*   **Rewritten Paragraph:** Choose one paragraph to rewrite, demonstrating improvements. Let's rewrite the second body paragraph (government solutions) for better development and flow.

    *Original:* \"National authorities, on the other hand, can control this surge by implementing public education schemes regarding controlled water usage. Strict national legislations for preventing natural fresh water reserve pollution are also required. Moreover, government should also enact infrastructures for purification of seawater into saline free water, which will help in meeting the growing requirement of fresh water.\"

    *Rewritten:* \"Governments can play a crucial role in mitigating this water crisis through several measures. Firstly, implementing comprehensive public awareness campaigns can educate citizens on the importance of water conservation and demonstrate practical ways to reduce household consumption. Secondly, stricter regulations and enforcement are necessary to prevent industries and agricultural operations from polluting existing freshwater sources like rivers and lakes. For instance, heavy fines could be imposed on factories discharging untreated wastewater. Finally, investing in large-scale infrastructure projects, such as advanced desalination plants to convert seawater into potable water, particularly in coastal regions, and improving water recycling systems, could significantly augment the available freshwater supply.\"
    *(Explanation of changes: Improved topic sentence, clearer linking words (\"Firstly\", \"Secondly\", \"Finally\"), more specific examples/elaboration (mentioning types of pollution sources, fines, specific infrastructure types), better vocabulary (\"mitigating\", \"comprehensive\", \"augment\"), corrected grammar/collocation (\"investing in... infrastructure projects\").*

Now, assemble the JSON output."""
                    ),
                    types.Part.from_text(
                        text="""```json
{
  \"valid\": true,
  \"result\":{
  \"scores\": {
    \"task_response\": {
      \"band\": 6,
      \"explanation\": \"The essay addresses all parts of the prompt, discussing both the causes of increased freshwater demand and potential solutions for governments and individuals. However, the development of ideas is somewhat limited. Causes like 'population explosion' and 'pollution' are mentioned but not explored in depth. Solutions are listed rather than fully explained or supported with specific examples, which the prompt requests. The position is clear but lacks detailed substantiation.\"
    },
    \"coherence_and_cohesion\": {
      \"band\": 6,
      \"explanation\": \"The essay is logically organized with a clear introduction, body paragraphs addressing causes and solutions separately, and a conclusion. Paragraphing is generally appropriate, although the final body paragraph on individual actions is noticeably shorter and less developed than the others. Cohesive devices like 'Firstly', 'Secondly', 'Furthermore', 'Similarly', 'Thus' are used, but sometimes mechanically. The transition 'On the other hand' between causes and solutions is slightly awkward. Overall progression is clear, but flow could be smoother.\"
    },
    \"lexical_resource\": {
      \"band\": 6,
      \"explanation\": \"There is a reasonable range of vocabulary ('time immemorial', 'scarce', 'potable', 'compounded', 'catalysed', 'legislations', 'enact infrastructures', 'noble cause'). Topic-specific vocabulary related to water scarcity is used adequately. However, there are some instances of awkward phrasing or imprecise word choice ('natural salt free water', 'elicit certain steps', 'enact infrastructures', 'refrain themselves'). Repetition of key terms like 'fresh water' and 'demand' is noticeable. While errors are present, they generally do not impede communication.\"
    },
    \"grammatical_range_and_accuracy\": {
      \"band\": 6,
      \"explanation\": \"The essay uses a mix of simple and complex sentence structures, including relative clauses and passive voice. However, there are several grammatical errors that detract from the overall quality. These include incorrect verb forms ('has lead' instead of 'has led'), article usage ('public' instead of 'the public'), awkward noun phrasing ('natural fresh water reserve pollution'), incorrect collocations ('enact infrastructures'), and redundant pronouns ('refrain themselves'). Punctuation is mostly adequate, but minor errors exist. Despite these errors, the meaning is generally clear.\"
    }
  },
  \"overall_band\": 6.0,
  \"overall_feedback\": \"This essay adequately addresses the prompt by outlining causes of increased global demand for fresh water and suggesting measures for governments and individuals. It is organized logically and employs a fair range of vocabulary and grammatical structures. However, the key limitation is the lack of development; ideas are presented rather than fully explained or supported with specific examples. There are also noticeable, albeit non-impeding, errors in word choice and grammar. To achieve a higher score, focus on elaborating on each point with more detail and specific examples, refining vocabulary for precision, and improving grammatical accuracy.\",
  \"corrections\": [
    {
      \"mistake\": \"has lead to the global surge\",
      \"suggestion\": \"has led to the global surge\",
      \"explanation\": \"The past participle of the verb 'to lead' is 'led', not 'lead'.\"
    },
    {
      \"mistake\": \"This essay will illustrate some factors contributing to this problem and will also elicit certain steps\",
      \"suggestion\": \"This essay will illustrate some factors contributing to this problem and will also outline/suggest certain steps\",
      \"explanation\": \"The verb 'elicit' means to draw out a response or information, often from a person. 'Outline' or 'suggest' is more appropriate for presenting solutions or steps.\"
    },
    {
      \"mistake\": \"natural salt free water\",
      \"suggestion\": \"fresh water\",
      \"explanation\": \"'Fresh water' is the standard and more concise term. 'Salt free' is redundant in this context.\"
    },
    {
      \"mistake\": \"government should also enact infrastructures for purification\",
      \"suggestion\": \"governments should also build/develop infrastructure for purification / desalination\",
      \"explanation\": \"'Infrastructure' is usually uncountable here. 'Enact' is typically used for laws; 'build' or 'develop' are better verbs for infrastructure. Using plural 'governments' can be suitable for general statements. 'Desalination' is a more specific term for removing salt from seawater.\"
    },
    {
      \"mistake\": \"public can also contribute\",
      \"suggestion\": \"the public can also contribute\",
      \"explanation\": \"When referring to the general population as a collective noun, the definite article 'the' is required before 'public'.\"
    },
    {
      \"mistake\": \"They should refrain themselves from performing activities\",
      \"suggestion\": \"They should refrain from performing activities\",
      \"explanation\": \"The verb 'refrain' does not require a reflexive pronoun ('themselves'). One simply refrains from doing something.\"
    },
     {
      \"mistake\": \"Thus even though, the scarcity...\",
      \"suggestion\": \"Thus, even though the scarcity...\",
      \"explanation\": \"Place a comma after the introductory adverb 'Thus'. No comma is needed directly after 'even though' when it starts the sentence's dependent clause.\"
    }
  ],
  \"improvement_tips\": [
    \"Elaborate on Causes: Instead of just listing 'population explosion', briefly explain *how* it increases demand (e.g., through increased agriculture, industry, and domestic use).\",
    \"Develop Solutions: Expand on the suggested measures. For 'public education', what kind? For 'legislation', what should it target specifically? For 'desalination', mention its potential and limitations.\",
    \"Include Specific Examples: The prompt asks for relevant examples. You could mention a specific region facing water scarcity, a successful government water policy (e.g., Singapore's NEWater), or common wasteful individual habits.\",
    \"Balance Paragraph Development: Ensure that body paragraphs are reasonably balanced in length and depth. The paragraph on individual actions feels underdeveloped compared to the one on government actions.\",
    \"Refine Word Choice: Aim for more precise and natural vocabulary (e.g., use 'freshwater sources' instead of 'natural fresh water reserves', 'desalination' instead of 'purification of seawater into saline free water').\",
    \"Proofread for Grammar: Pay close attention to common errors like verb tenses/forms, articles (a/an/the), prepositions, and subject-verb agreement.\"
  ],
  \"rewritten_paragraph\": \"Governments possess several powerful tools to address this escalating water demand. Firstly, they can implement comprehensive public awareness campaigns emphasizing water conservation techniques, educating citizens on simple yet effective ways to reduce daily consumption, such as installing water-efficient appliances or practicing rainwater harvesting. Secondly, enforcing stricter regulations on industrial and agricultural water use is paramount. This could involve setting quotas, mandating the treatment of wastewater before discharge, and imposing significant penalties on entities polluting freshwater sources like rivers and aquifers. Finally, significant investment in infrastructure is crucial; this includes constructing advanced desalination plants in coastal areas to convert seawater into potable water and upgrading existing water treatment facilities to recycle wastewater for non-potable uses like irrigation and industrial processes, thereby augmenting the overall freshwater supply.\"

  }
}
```"""
                    ),
                ],
            ),
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(
                        text=f"""Essay prompt: {essay_prompt}
                    Essay text: {essay_text}"""
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

        cleaned_result = re.sub(
            r"^```json\s*|\s*```$", "", result.strip(), flags=re.DOTALL
        )
        parsed_json = json.loads(cleaned_result)
        valid = parsed_json.get("valid", False)
        result2 = parsed_json.get("result", "Invalid input")
        if not isinstance(result2, str):
            result2 = json.dumps(result2, ensure_ascii=False)
        return ScoringResponse(valid=valid, result=result2)


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
