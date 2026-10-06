const MODEL = "not-jev";

const MAGIC_8_BALL_RESPONSES = [
  "It is certain.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes.",
  "Reply hazy, try again.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don't count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Very doubtful.",
] as const;

type NoulAnswer = {
  type: "noul";
  noul: 0 | 1;
};

type ChoiceAnswer = {
  type: "choice";
  choice: string;
  confidence: number;
  probabilities: Record<string, number>;
};

type JevStyleResponse = {
  model: string;
  answers: { answer: NoulAnswer | ChoiceAnswer };
  usage: { input_tokens: number; output_tokens: number };
  response: string;
};

function envelope(answer: NoulAnswer | ChoiceAnswer, response: string): JevStyleResponse {
  return {
    model: MODEL,
    answers: { answer },
    usage: { input_tokens: 0, output_tokens: 0 },
    response,
  };
}

function randomIndex(length: number): number {
  // Rejection sampling avoids the small modulo bias from a direct `% length`.
  const range = 0x1_0000_0000;
  const limit = Math.floor(range / length) * length;
  const value = new Uint32Array(1);

  do {
    crypto.getRandomValues(value);
  } while (value[0] >= limit);

  return value[0] % length;
}

function json(body: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}

function methodNotAllowed(): Response {
  return json({ error: "Method not allowed. Use POST." }, 405, { allow: "POST" });
}

export default {
  fetch(request: Request): Response {
    if (request.method !== "POST") {
      return methodNotAllowed();
    }

    const path = new URL(request.url).pathname.replace(/\/$/, "") || "/";

    switch (path) {
      case "/no":
        return json(envelope({ type: "noul", noul: 0 }, "no"));
      case "/yes":
        return json(envelope({ type: "noul", noul: 1 }, "yes"));
      case "/fuck-no":
        return json(envelope({ type: "noul", noul: 0 }, "fuck no"));
      case "/magic-8-ball": {
        const choice = MAGIC_8_BALL_RESPONSES[randomIndex(MAGIC_8_BALL_RESPONSES.length)];
        const probability = 1 / MAGIC_8_BALL_RESPONSES.length;
        const probabilities = Object.fromEntries(
          MAGIC_8_BALL_RESPONSES.map((response) => [response, probability]),
        );

        return json(
          envelope(
            { type: "choice", choice, confidence: probability, probabilities },
            choice,
          ),
        );
      }
      default:
        return json({ error: "Not found." }, 404);
    }
  },
};
