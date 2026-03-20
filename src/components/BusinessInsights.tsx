"use client";

import React, { useState } from "react";
import {
  Loader2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Calendar,
} from "lucide-react";

interface BusinessInsights {
  insights: string;
  improvements: string[];
  overall_sentiment: "positive" | "negative" | "mixed";
  critical_areas: string[];
  action_priority: "high" | "medium" | "low";
  total_reviews: number;
  batches_processed: number;
  analysis_date: string;
}

export default function BusinessInsights() {
  const [insights, setInsights] = useState<BusinessInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-50 border-green-200 text-green-700";
      case "negative":
        return "bg-red-50 border-red-200 text-red-700";
      case "mixed":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "medium":
        return <Target className="w-5 h-5 text-yellow-600" />;
      case "low":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return null;
    }
  };

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    setInsights(null);

    try {
      const response = await fetch(
        "https://customer-satisfaction-analyzer.onrender.com/business-insights",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Something went wrong");
      }

      const data = await response.json();
      setInsights(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Business Insights
          </h1>
          <p className="text-gray-600">
            AI-powered analysis of all customer reviews
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Analytics Dashboard
              </h2>
              <p className="text-gray-600 mt-1">
                Generate comprehensive business insights
              </p>
            </div>
            <button
              onClick={fetchInsights}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  <span>Generate Insights</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Insights Results */}
          {insights && (
            <div className="space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-700">
                      Total Reviews
                    </span>
                    <Calendar className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-blue-800">
                    {insights.total_reviews}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-green-700">
                      Overall Sentiment
                    </span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(insights.overall_sentiment)}`}
                  >
                    {insights.overall_sentiment.charAt(0).toUpperCase() +
                      insights.overall_sentiment.slice(1)}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-orange-700">
                      Action Priority
                    </span>
                    {getPriorityIcon(insights.action_priority)}
                  </div>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(insights.action_priority)}`}
                  >
                    {insights.action_priority.charAt(0).toUpperCase() +
                      insights.action_priority.slice(1)}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-purple-700">
                      Batches Processed
                    </span>
                    <Target className="w-4 h-4 text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold text-purple-800">
                    {insights.batches_processed}
                  </p>
                </div>
              </div>

              {/* Main Insights */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
                  Key Insights
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {insights.insights}
                </p>
              </div>

              {/* Critical Areas */}
              {insights.critical_areas.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                    Critical Areas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {insights.critical_areas.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full text-sm font-medium shadow-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvement Proposals */}
              {insights.improvements.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Improvement Proposals
                  </h3>
                  <div className="space-y-3">
                    {insights.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                          <span className="text-white text-xs font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-gray-700">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis Info */}
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-xl border border-gray-300">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="font-medium">
                    Analysis date: {insights.analysis_date}
                  </span>
                  <span className="font-medium">
                    Reviews analyzed: {insights.total_reviews}
                  </span>
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
