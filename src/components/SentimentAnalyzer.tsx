"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface ReviewResponse {
  id: number;
  review: string;
  created_at: string;
  sentiment_score: number | null;
  sentiment_label: string | null;
}

interface AnalysisResult {
  sentiment_score: number;
  sentiment_label: string;
  confidence: number;
}

interface SentimentAnalyzerProps {
  apiUrl?: string;
  onAnalysisComplete?: (
    result: ReviewResponse,
    analysis: AnalysisResult,
  ) => void;
  theme?: "light" | "dark";
  compact?: boolean;
  showOriginalReview?: boolean;
  customStyles?: React.CSSProperties;
}

export default function SentimentAnalyzer({
  apiUrl = "https://customer-satisfaction-analyzer.onrender.com",
  onAnalysisComplete,
  theme = "light",
  compact = false,
  showOriginalReview = true,
  customStyles = {},
}: SentimentAnalyzerProps) {
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const getSentimentColor = (label: string) => {
    switch (label?.toLowerCase()) {
      case "positive":
        return theme === "dark"
          ? "text-green-400 bg-green-900/30 border-green-700"
          : "text-green-600 bg-green-50 border-green-200";
      case "negative":
        return theme === "dark"
          ? "text-red-400 bg-red-900/30 border-red-700"
          : "text-red-600 bg-red-50 border-red-200";
      case "neutral":
        return theme === "dark"
          ? "text-gray-400 bg-gray-800/50 border-gray-600"
          : "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return theme === "dark"
          ? "text-gray-400 bg-gray-800/50 border-gray-600"
          : "text-gray-500 bg-gray-50 border-gray-200";
    }
  };

  const getSentimentIcon = (label: string) => {
    switch (label?.toLowerCase()) {
      case "positive":
        return "😊";
      case "negative":
        return "😞";
      case "neutral":
        return "😐";
      default:
        return "🤔";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8)
      return theme === "dark" ? "text-green-400" : "text-green-600";
    if (confidence >= 0.6)
      return theme === "dark" ? "text-yellow-400" : "text-yellow-600";
    return theme === "dark" ? "text-red-400" : "text-red-600";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!review.trim()) {
      setError("Por favor ingresa un review para analizar");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setAnalysis(null);

    try {
      const response = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ review: review.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: ReviewResponse = await response.json();
      setResult(data);

      const confidence = Math.abs(data.sentiment_score || 0);

      const analysisResult: AnalysisResult = {
        sentiment_score: data.sentiment_score || 0,
        sentiment_label: data.sentiment_label || "neutral",
        confidence: confidence,
      };

      setAnalysis(analysisResult);
      onAnalysisComplete?.(data, analysisResult);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al enviar el review",
      );
    } finally {
      setLoading(false);
    }
  };

  const containerClasses =
    theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900";

  const inputClasses =
    theme === "dark"
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";

  const buttonClasses =
    theme === "dark"
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <div
      className={`${containerClasses} ${compact ? "p-4" : "p-8"} rounded-2xl shadow-xl`}
      style={customStyles}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Review Input */}
        <div>
          <label htmlFor="review" className="block text-sm font-medium mb-2">
            Tu Review
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Escribe aquí tu review..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 ${inputClasses}`}
            rows={compact ? 3 : 4}
            disabled={loading}
          />
          <div className="mt-2 text-right">
            <span
              className={`text-sm ${review.length > 500 ? "text-red-500" : theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              {review.length}/500
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !review.trim()}
          className={`w-full ${buttonClasses} py-3 px-6 rounded-lg font-medium focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analizando...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Analizar Sentimiento</span>
            </>
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div
          className={`mt-6 p-4 ${theme === "dark" ? "bg-red-900/30 border-red-700" : "bg-red-50 border-red-200"} rounded-lg flex items-center space-x-3`}
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && analysis && (
        <div className="mt-8 space-y-6">
          <div
            className={`border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"} pt-6`}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Resultado del Análisis
            </h3>

            {/* Sentiment Result */}
            <div
              className={`grid ${compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"} gap-4`}
            >
              <div
                className={`p-4 rounded-lg border ${getSentimentColor(analysis.sentiment_label)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Sentimiento</span>
                  <span className="text-2xl">
                    {getSentimentIcon(analysis.sentiment_label)}
                  </span>
                </div>
                <p className="text-xl font-bold capitalize">
                  {analysis.sentiment_label}
                </p>
              </div>

              <div
                className={`p-4 ${theme === "dark" ? "bg-blue-900/30 border-blue-700" : "bg-blue-50 border-blue-200"} rounded-lg`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">
                    Puntuación
                  </span>
                  <span className="text-sm text-blue-600">
                    {analysis.sentiment_score > 0 ? "+" : ""}
                    {analysis.sentiment_score.toFixed(2)}
                  </span>
                </div>
                <div
                  className={`w-full ${theme === "dark" ? "bg-blue-800" : "bg-blue-200"} rounded-full h-2`}
                >
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.abs(analysis.sentiment_score) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Confidence */}
            <div
              className={`p-4 ${theme === "dark" ? "bg-gray-800/50 border-gray-600" : "bg-gray-50 border-gray-200"} rounded-lg`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Confianza del Análisis
                </span>
                <span
                  className={`text-sm font-bold ${getConfidenceColor(analysis.confidence)}`}
                >
                  {(analysis.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div
                className={`w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} rounded-full h-2 mt-2`}
              >
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    analysis.confidence >= 0.8
                      ? "bg-green-500"
                      : analysis.confidence >= 0.6
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${analysis.confidence * 100}%` }}
                />
              </div>
            </div>

            {/* Original Review */}
            {showOriginalReview && (
              <div
                className={`p-4 ${theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"} rounded-lg`}
              >
                <p className="text-sm mb-2">Review original:</p>
                <p className="italic">&ldquo;{result.review}&rdquo;</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
