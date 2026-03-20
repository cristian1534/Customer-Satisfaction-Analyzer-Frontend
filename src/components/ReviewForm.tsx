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

export default function ReviewForm() {
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const getSentimentColor = (label: string) => {
    switch (label?.toLowerCase()) {
      case "positive":
        return "text-green-700 bg-green-50 border-green-200";
      case "negative":
        return "text-red-700 bg-red-50 border-red-200";
      case "neutral":
        return "text-gray-700 bg-gray-50 border-gray-200";
      default:
        return "text-gray-500 bg-gray-50 border-gray-200";
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
    if (confidence >= 0.8) return "text-green-700";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-red-700";
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
    setError(null);
    setSuccess(null); // Clear success message when typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!review.trim()) {
      setError("Please enter a review to analyze");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setAnalysis(null);

    try {
      const response = await fetch("https://customer-satisfaction-analyzer.onrender.com/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review: review.trim() }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data: ReviewResponse = await response.json();
      setResult(data);

      const confidence = Math.abs(data.sentiment_score || 0);
      setAnalysis({
        sentiment_score: data.sentiment_score || 0,
        sentiment_label: data.sentiment_label || "neutral",
        confidence,
      });

      // Clear form after successful submission
      setReview("");

      // Show success message
      setSuccess(
        "Thanks for sharing your feedback! Your review has been analyzed.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error sending review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Send className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Review Analysis
          </h1>
          <p className="text-gray-600">
            Share your feedback and get instant insights
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Review Input */}
            <div>
              <label
                htmlFor="review"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Customer Review
              </label>
              <div className="relative">
                <textarea
                  id="review"
                  value={review}
                  onChange={handleReviewChange}
                  placeholder="Share your customer experience here..."
                  className="w-full px-4 py-3 pl-11 border border-gray-300 text-gray-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  rows={4}
                  disabled={loading}
                />
                <div className="absolute left-3 top-3.5 w-5 h-5 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-2 text-right">
                <span
                  className={`text-sm font-medium ${
                    review.length > 500 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {review.length}/500
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !review.trim()}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 focus:ring-4 focus:ring-green-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Analyze Review</span>
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Results */}
          {result && analysis && (
            <div className="mt-8 space-y-6">
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Review Analysis Results
                </h3>

                {/* Satisfaction Result */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-lg border ${getSentimentColor(
                      analysis.sentiment_label,
                    )}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800">
                        Satisfaction Level
                      </span>
                      <span className="text-2xl">
                        {getSentimentIcon(analysis.sentiment_label)}
                      </span>
                    </div>
                    <p className="text-xl font-bold capitalize text-gray-800">
                      {analysis.sentiment_label}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800">
                        Satisfaction Score
                      </span>
                      <span className="text-sm text-gray-800">
                        {analysis.sentiment_score > 0 ? "+" : ""}
                        {analysis.sentiment_score.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.abs(analysis.sentiment_score) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Confidence */}
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">
                      Analysis Confidence
                    </span>
                    <span
                      className={`text-sm font-bold ${getConfidenceColor(
                        analysis.confidence,
                      )}`}
                    >
                      {(analysis.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        analysis.confidence >= 0.8
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : analysis.confidence >= 0.6
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                            : "bg-gradient-to-r from-red-500 to-red-600"
                      }`}
                      style={{ width: `${analysis.confidence * 100}%` }}
                    />
                  </div>
                </div>

                {/* Original Review */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2 font-medium">
                    Customer review:
                  </p>
                  <p className="text-gray-800 italic">
                    &ldquo;{result.review}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Cristian Machuca - 2026</p>
        </div>
      </div>
    </div>
  );
}
