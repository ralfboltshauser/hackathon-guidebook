"use client";

import { Agentation } from "agentation";

const endpoint =
  process.env.NEXT_PUBLIC_AGENTATION_ENDPOINT ?? "http://localhost:4747";

const webhookUrl = process.env.NEXT_PUBLIC_AGENTATION_WEBHOOK_URL || undefined;

export function AgentationOverlay() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Agentation
      endpoint={endpoint}
      webhookUrl={webhookUrl}
      onSessionCreated={(sessionId) => {
        console.info("Agentation session started:", sessionId);
      }}
    />
  );
}
