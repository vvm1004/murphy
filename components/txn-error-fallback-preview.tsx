"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TxnErrorFallback } from "./ui/murphy/Txn-Feedback/txn-error-fallback";
import { TxnRetryButton } from "./ui/murphy/Txn-Feedback/txn-retry-button";
import { TxnFeedbackToast } from "./ui/murphy";
import type { TransactionStatus } from "@/types/transaction";

// ===== Types =====
type ErrorType = "simple" | "with-signature" | "with-logs";

type ErrorExample = {
  error: string;
  signature?: string;
  showLogs?: boolean;
  logs?: string[];
};

// ===== Data =====
const errorExamples: Record<ErrorType, ErrorExample> = {
  simple: {
    error: "Transaction failed: Insufficient funds for transaction fees",
  },
  "with-signature": {
    error: "Transaction failed: Program error occurred during execution",
    signature:
      "5VfYmGC9L8ty3D4HutfxndoKXGBwXJWKKvxgF7qQzqK8xMjU9v7Rw2sP3nT6hL4jK9mN8bC1dF2eG3hI5jK6lM7n",
  },
  "with-logs": {
    error: "Transaction failed: Custom program error: 0x1771",
    signature:
      "2B5VfYmGC9L8ty3D4HutfxndoKXGBwXJWKKvxgF7qQzqK8xMjU9v7Rw2sP3nT6hL4jK9mN8bC1dF2eG3hI5jK6lM",
    showLogs: true,
    logs: [
      "Program 11111111111111111111111111111111 invoke [1]",
      "Program log: Instruction: Transfer",
      "Program log: Error: custom program error: 0x1771",
      "Program 11111111111111111111111111111111 consumed 200000 of 200000 compute units",
      "Program 11111111111111111111111111111111 failed: custom program error: 0x1771",
    ],
  },
};

export default function TxnErrorFallbackPreview() {
  const [showError, setShowError] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>("simple");

  const [currentErrorMsg, setCurrentErrorMsg] = useState<string>("");

  const [toastStatus, setToastStatus] = useState<TransactionStatus>({
    status: "idle",
  });

  const retryTxn = async () => {
    await new Promise((r) => setTimeout(r, 800));
    const ok = Math.random() > 0.5;

    if (ok) {
      const sig = errorExamples[errorType].signature;
      setShowError(false);
      setToastStatus({ status: "success", signature: sig });
      return;
    }

    setToastStatus({
      status: "error",
      error: currentErrorMsg || errorExamples[errorType].error,
    });
    throw new Error("Simulated transaction failure");
  };

  const openWithType = (type: ErrorType) => {
    setErrorType(type);
    setCurrentErrorMsg(errorExamples[type].error);
    setShowError(true);
  };

  const closeToast = () => setToastStatus({ status: "idle" });

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="space-y-3">
        <Button
          onClick={() => openWithType("simple")}
          variant="destructive"
          className="w-full"
        >
          Simple Error
        </Button>
        <Button
          onClick={() => openWithType("with-signature")}
          variant="destructive"
          className="w-full"
        >
          Error with Signature
        </Button>
        <Button
          onClick={() => openWithType("with-logs")}
          variant="destructive"
          className="w-full"
        >
          Error with Logs
        </Button>
      </div>

      {showError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md space-y-3">
            <TxnErrorFallback
              {...errorExamples[errorType]}
              onClose={() => setShowError(false)}
            />
            <TxnRetryButton
              onRetry={retryTxn}
              maxRetries={3}
              retryDelay={1000}
              className="w-full"
            >
              Try Again
            </TxnRetryButton>
          </div>
        </div>
      )}

      <TxnFeedbackToast status={toastStatus} onClose={closeToast} />
    </div>
  );
}
