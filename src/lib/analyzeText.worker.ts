import { analyzeText } from "./analyzeText";

export type AnalysisRequest = {
  requestId: number;
  text: string;
};

export function analyzeTextRequest({ requestId, text }: AnalysisRequest) {
  return {
    requestId,
    analysis: analyzeText(text),
  };
}

if (typeof document === "undefined") {
  const workerScope = self as unknown as {
    onmessage: ((event: MessageEvent<AnalysisRequest>) => void) | null;
    postMessage: (message: ReturnType<typeof analyzeTextRequest>) => void;
  };

  workerScope.onmessage = (event) => {
    workerScope.postMessage(analyzeTextRequest(event.data));
  };
}
