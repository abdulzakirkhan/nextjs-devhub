# Building AI Applications with Next.js 16 and Modern AI SDKs

## Introduction

AI features add streaming, provider failures, rate limits, and conversation-state concerns to a web application. A reliable implementation needs clear boundaries between client UI, server-side provider calls, and persistence.

Next.js 16, combined with modern AI SDKs like Vercel AI SDK, makes building AI applications dramatically easier. Server Actions handle the backend, streaming responses feel instant, and the whole stack is type-safe.

In this guide, I'll show you how to build a production AI chatbot with Next.js 16, including streaming responses, LLM integration, and cost optimization.

## AI SDK Setup

Install the Vercel AI SDK:

```bash
npm install ai openai
```

Set up environment variables:

```env
OPENAI_API_KEY=your-openai-api-key
```

Create an AI client:

```typescript
// lib/ai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export { openai };
```

## Building a Chatbot

Create a chat interface with streaming:

```typescript
// app/actions/chat.ts
'use server';

import { openai } from '@/lib/ai';
import { streamText } from 'ai';

export async function chat(messages: Array<{ role: string; content: string }>) {
  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

Create the chat page:

```typescript
// app/chat/page.tsx
'use client';

import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="w-full rounded-lg border px-4 py-2"
        />
      </form>
    </div>
  );
}
```

Create the API route:

```typescript
// app/api/chat/route.ts
import { openai } from '@/lib/ai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

## Streaming Responses

Streaming makes the chat feel responsive. The Vercel AI SDK handles the complexity:

```typescript
// With custom system prompt
const result = streamText({
  model: openai('gpt-4-turbo'),
  system: 'You are a helpful assistant specialized in Next.js development.',
  messages,
  temperature: 0.7,
  maxTokens: 1000,
});
```

## LLM Integration

Different LLMs have different strengths. Here's how to integrate multiple providers:

```typescript
// lib/ai.ts
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const openai = new OpenAI();
const anthropic = new Anthropic();

export function getLLM(provider: 'openai' | 'anthropic') {
  switch (provider) {
    case 'openai':
      return openai;
    case 'anthropic':
      return anthropic;
    default:
      return openai;
  }
}
```

Use it in your action:

```typescript
export async function chat(
  messages: Array<{ role: string; content: string }>,
  provider: 'openai' | 'anthropic' = 'openai'
) {
  const llm = getLLM(provider);
  
  const result = streamText({
    model: llm('gpt-4-turbo'),
    messages,
  });

  return result.toDataStreamResponse();
}
```

## Cost Optimization

AI API costs can add up quickly. Here's how to optimize:

### 1. Use Smaller Models When Possible

```typescript
export async function chatSimple(messages: Array<{ role: string; content: string }>) {
  const result = streamText({
    model: openai('gpt-3.5-turbo'), // Cheaper than GPT-4
    messages,
  });

  return result.toDataStreamResponse();
}
```

### 2. Implement Caching

```typescript
// lib/cache.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function getCachedResponse(prompt: string) {
  const cached = await redis.get(`chat:${prompt}`);
  return cached ? JSON.parse(cached as string) : null;
}

export async function cacheResponse(prompt: string, response: string) {
  await redis.set(`chat:${prompt}`, JSON.stringify(response), { ex: 3600 });
}
```

### 3. Limit Token Usage

```typescript
const result = streamText({
  model: openai('gpt-4-turbo'),
  messages,
  maxTokens: 500, // Limit response length
});
```

### 4. Implement Rate Limiting

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, '1 h'),
});

export async function checkRateLimit(userId: string) {
  const { success } = await ratelimit.limit(userId);
  return success;
}
```

## Common Mistakes

### 1. Not Handling Errors

AI APIs can fail. Implement proper error handling:

```typescript
try {
  const result = streamText({ model, messages });
  return result.toDataStreamResponse();
} catch (error) {
  return new Response('AI service error', { status: 500 });
}
```

### 2. Ignoring Rate Limits

Implement rate limiting to prevent abuse and control costs.

### 3. Not Using Streaming

Streaming provides better UX. Always use streaming for chat applications.

### 4. Not Monitoring Costs

Track token usage and costs. Set up alerts for unexpected spending.

### 5. Hardcoding API Keys

Never commit API keys. Use environment variables.

## FAQ

### What AI SDKs work well with Next.js?

Vercel AI SDK, OpenAI SDK, LangChain, and Anthropic SDK all work well with Next.js for building AI applications.

### How do I implement streaming responses?

Use the Vercel AI SDK's streaming capabilities with Server Actions or API routes to stream LLM responses to the client.

### How do I optimize AI costs?

Implement caching, use smaller models when possible, batch requests, and monitor token usage with analytics.

### Can I use edge functions for AI?

Yes, many AI SDKs support edge runtime, but some features may require Node.js. Check the SDK documentation.
