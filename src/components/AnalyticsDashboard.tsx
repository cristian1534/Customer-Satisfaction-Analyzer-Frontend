"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from "lucide-react";

interface Review {
  id: number;
  review: string;
  created_at: string;
  sentiment_score: number | null;
  sentiment_label: string | null;
}

interface Analytics {
  total_reviews: number;
  average_sentiment: number;
  sentiment_distribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  reviews: Review[];
}

export default function AnalyticsDashboard() {
  const [isClient, setIsClient] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  useEffect(() => {
    setIsClient(true);
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://customer-satisfaction-analyzer.onrender.com/reviews/analytics",
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  // Pagination functions
  const totalPages = analytics
    ? Math.ceil(analytics.reviews.length / reviewsPerPage)
    : 1;
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const endIndex = startIndex + reviewsPerPage;
  const currentReviews = analytics
    ? analytics.reviews.slice(startIndex, endIndex)
    : [];
  const paginate = (page: number) => setCurrentPage(page);

  // Pagination controls
  const PaginationControls = () => (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-600 mb-4">❌</div>
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const total =
    analytics.sentiment_distribution.positive +
    analytics.sentiment_distribution.negative +
    analytics.sentiment_distribution.neutral;
  const sentimentLevel =
    analytics.average_sentiment >= 0.6
      ? "Very Positive"
      : analytics.average_sentiment >= 0.2
        ? "Positive"
        : analytics.average_sentiment >= -0.2
          ? "Neutral"
          : analytics.average_sentiment >= -0.6
            ? "Negative"
            : "Very Negative";

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
        return <ThumbsUp className="w-4 h-4" />;
      case "negative":
        return <ThumbsDown className="w-4 h-4" />;
      case "neutral":
        return <Minus className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case "positive":
        return "bg-green-50 border-green-200 text-green-700";
      case "negative":
        return "bg-red-50 border-red-200 text-red-700";
      case "neutral":
        return "bg-gray-50 border-gray-200 text-gray-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time customer satisfaction metrics
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Refresh Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={fetchAnalytics}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              🔄 Refresh Data
            </button>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-700 mb-1">
                  Total Reviews
                </p>
                <p className="text-2xl font-bold text-blue-800">
                  {analytics.total_reviews.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-green-700 mb-1">
                  Average Satisfaction
                </p>
                <p className="text-2xl font-bold text-green-800">
                  {analytics.average_sentiment.toFixed(3)}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm">
                  <ThumbsUp className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-700 mb-1">
                  Satisfied Customers
                </p>
                <p className="text-2xl font-bold text-emerald-800">
                  {analytics.sentiment_distribution.positive}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm">
                  <ThumbsDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-red-700 mb-1">
                  Dissatisfied Customers
                </p>
                <p className="text-2xl font-bold text-red-800">
                  {analytics.sentiment_distribution.negative}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Reviews Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-lg mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Customer Review Summary
              </h3>
              <span className="text-sm text-gray-500">
                Showing {currentReviews.length} of{" "}
                {analytics?.reviews.length || 0} reviews
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      #{review.id}
                    </span>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(
                        review.sentiment_label || "",
                      )}`}
                    >
                      <span className="mr-1">
                        {getSentimentIcon(review.sentiment_label || "")}
                      </span>
                      {review.sentiment_label || "N/A"}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                    {review.review}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>
                      Satisfaction:{" "}
                      {(review.sentiment_score || 0) > 0 ? "+" : ""}
                      {(review.sentiment_score || 0).toFixed(2)}
                    </span>
                    <span>
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6">
              <PaginationControls />
            </div>

            {totalPages > 1 && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages} • Total{" "}
                  {analytics?.reviews.length || 0} reviews
                </p>
              </div>
            )}
          </div>

          {/* Satisfaction Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Customer Satisfaction Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(analytics.sentiment_distribution).map(
                  ([sentiment, count]) => {
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <div key={sentiment}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="mr-2">
                              {getSentimentIcon(sentiment)}
                            </span>
                            <span className="font-medium capitalize text-gray-700">
                              {sentiment}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-lg text-gray-800">
                              {count}
                            </span>
                            <span className="text-gray-500 ml-2">
                              ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              sentiment === "positive"
                                ? "bg-gradient-to-r from-green-400 to-green-500"
                                : sentiment === "negative"
                                  ? "bg-gradient-to-r from-red-400 to-red-500"
                                  : "bg-gradient-to-r from-gray-400 to-gray-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-6 rounded-xl border border-indigo-200 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Overall Customer Satisfaction
              </h3>
              <div className="text-center">
                <div
                  className={`inline-block p-6 rounded-full bg-white/50 backdrop-blur-sm mb-4 shadow-lg`}
                >
                  <span className="text-3xl font-bold text-indigo-600">
                    {analytics.average_sentiment.toFixed(2)}
                  </span>
                </div>
                <p
                  className={`text-lg font-medium mb-4 ${
                    analytics.average_sentiment >= 0.2
                      ? "text-green-600"
                      : analytics.average_sentiment >= -0.2
                        ? "text-gray-600"
                        : "text-red-600"
                  }`}
                >
                  {sentimentLevel}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      analytics.average_sentiment >= 0.6
                        ? "bg-gradient-to-r from-green-400 to-green-500"
                        : analytics.average_sentiment >= 0.2
                          ? "bg-gradient-to-r from-green-300 to-green-400"
                          : analytics.average_sentiment >= -0.2
                            ? "bg-gradient-to-r from-gray-400 to-gray-500"
                            : analytics.average_sentiment >= -0.6
                              ? "bg-gradient-to-r from-red-300 to-red-400"
                              : "bg-gradient-to-r from-red-400 to-red-500"
                    }`}
                    style={{
                      width: `${Math.min(Math.max((analytics.average_sentiment + 1) * 50, 0), 100)}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Scale: -1 (Very Dissatisfied) to +1 (Very Satisfied)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Cristian Machuca - 2026</p>
        </div>
      </div>
    </div>
  );
}
