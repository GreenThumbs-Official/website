<?php

namespace App\Http\Controllers;

use GeminiAPI\Client;
use GeminiAPI\Enums\Role;
use GeminiAPI\Resources\Content;
use GeminiAPI\Resources\Parts\TextPart;
use GeminiAPI\GenerationConfig;
use GeminiAPI\Resources\ModelName;
use Illuminate\Http\Request;

class GeminiController extends Controller
{
    /**
     * @param Request $request
     * $request->prompt - The text prompt to send to the Gemini API.
     *
     * $request->instructions - Instructions for the Gemini API.
     *
     * @example
     * body: {
     *     "prompt": "What is the capital of France?",
     *     "instructions": "respond in this format: {capital: 'Paris'}"
     * }
     */
    public function handlePrompt(Request $request)
    {
        $request->validate([
            'prompt' => 'required|max:1000',
            'instructions' => 'nullable|max:2000',
            'response_syntax' => 'nullable',
            'resopnse_format' => 'nullable'
        ]);

        switch ($request->response_syntax) {
            case 'json':
                $response_syntax = 'strictly raw json syntax, strictly no markdown or any other formatting is allowed in the response, every thing has to be valid for json_decode() in PHP to work, no comments, no markdown, no code blocks, just raw json';
                break;
            case 'text':
                $response_syntax = 'strictly raw text syntax';
                break;
            default:
                $response_syntax = 'text';
        }

        $instruction = [
            "instructions" => $request->instructions ?? 'You are a helpful assistant.',
            "response_syntax" => $response_syntax,
            "response_format" => $request->response_format ?? 'no example format provided',
        ];

        $client = new Client("AIzaSyCYl6E40mBmhP-gg4tjeJ6u6cKfqPFV2sQ");

        $generationConfig = (new GenerationConfig())->withTemperature(0.1);

        $response = $client->withV1BetaVersion()
            ->generativeModel(ModelName::GEMINI_1_5_FLASH)
            ->withGenerationConfig($generationConfig)
            ->withSystemInstruction(json_encode($instruction) ?? 'You are a helpful assistant.')
            ->generateContent(new TextPart($request->prompt),
            );
        $raw = $response->text();
        // Supprime les balises ```json et ```
        $clean = preg_replace('/^```json\s*|\s*```$/', '', trim($raw));
        // Correction des échappements dans les classes Tailwind
        $clean = str_replace('\\/', '/', $clean);
        // Décodage JSON
        $data = json_decode($clean);

        return response()->json([
            'prompt' => $request->prompt,
            'response' => $data,
            'raw_response' => $raw,
            'clean_response' => $clean
        ]);
    }

    public function Chat(Request $request) {
        $request->validate([
            'history' => 'nullable',
            'prompt' => 'required|max:1000',
        ]);

        if (isset($request->history)) {
            $messages = json_decode($request->history);;
            $history = [];
            foreach ($messages as $message) {
                $history[] = Content::text($message->parts[0]->text, Role::from($message->role));
            }
        } else {
            $history = [];
        }
        $client = new Client("AIzaSyCYl6E40mBmhP-gg4tjeJ6u6cKfqPFV2sQ");

        $chat = $client->withV1BetaVersion()
            ->generativeModel(Modelname::GEMINI_1_5_FLASH)
            ->withSystemInstruction('You are a chatbot that gives straightforward and concise answers to user questions, respond in french unless if the user speaks in an other language or asks for you to respond in an other language, if the question is not related to plant do not answer.')
            ->startChat()
            ->withHistory($history);

        $response = $chat->sendMessage(new TextPart($request->prompt));

        $history[] = Content::text($request->prompt, Role::User);
        $history[] = Content::text($response->text(), Role::Model);
        return response()->json([
            'prompt' => $request->prompt,
            'response' => $response->text(),
            'history' => $history,
        ]);

    }
}




