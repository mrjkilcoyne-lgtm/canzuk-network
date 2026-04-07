import Anthropic from '@anthropic-ai/sdk';

export interface LLMResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

export class LLMClient {
  private client: Anthropic;
  private totalInputTokens = 0;
  private totalOutputTokens = 0;
  private maxBudgetTokens: number;

  constructor(maxBudgetTokens = 2_000_000) {
    this.client = new Anthropic();
    this.maxBudgetTokens = maxBudgetTokens;
  }

  async ask(
    systemPrompt: string,
    userMessage: string,
    options?: { model?: string; maxTokens?: number },
  ): Promise<LLMResponse> {
    const totalUsed = this.totalInputTokens + this.totalOutputTokens;
    if (totalUsed > this.maxBudgetTokens) {
      throw new Error(
        `Token budget exceeded: ${totalUsed} / ${this.maxBudgetTokens}. Stopping to prevent runaway costs.`,
      );
    }

    const model = options?.model ?? 'claude-sonnet-4-20250514';
    const maxTokens = options?.maxTokens ?? 4096;

    const response = await this.client.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    this.totalInputTokens += response.usage.input_tokens;
    this.totalOutputTokens += response.usage.output_tokens;

    return {
      text,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    };
  }

  async askJson<T>(
    systemPrompt: string,
    userMessage: string,
    options?: { model?: string; maxTokens?: number },
  ): Promise<T> {
    const response = await this.ask(
      systemPrompt + '\n\nIMPORTANT: Respond ONLY with valid JSON, no markdown fences, no explanation.',
      userMessage,
      options,
    );

    // Strip markdown fences if the model adds them despite instructions
    let cleaned = response.text.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    return JSON.parse(cleaned) as T;
  }

  getUsage() {
    return {
      inputTokens: this.totalInputTokens,
      outputTokens: this.totalOutputTokens,
      totalTokens: this.totalInputTokens + this.totalOutputTokens,
    };
  }
}
