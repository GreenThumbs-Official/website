<?php

namespace App\Http\Controllers;

use GeminiAPI\Client;
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
    public function handlePrompt(Request $request) {
        $request->validate([
            'prompt' => 'required|max:1000',
            'instructions' => 'nullable|max:2000',
            'response_syntax' => 'nullable',
            'resopnse_format' => 'nullable'
        ]);

        switch ($request->response_syntax) {
            case 'json':
                $response_syntax = 'strictly raw json syntax, strictly no markdown at all';
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

        $client = new Client("AIzaSyAhiPKbhHp7O6NuuQwbClxyZj0V8f2TLZk");

        $generationConfig = (new GenerationConfig())->withTemperature(0.5);

        $response = $client->withV1BetaVersion()
            ->generativeModel(ModelName::GEMINI_1_5_FLASH_LATEST)
            ->withGenerationConfig($generationConfig)
            ->withSystemInstruction(json_encode($instruction) ?? 'You are a helpful assistant.')

            ->generateContent(new TextPart($request->prompt),
        );

        return response()->json([
            'response' => $response->text(),
        ]);
    }
}
