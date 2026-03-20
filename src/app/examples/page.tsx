"use client";

import SentimentAnalyzer from "@/components/SentimentAnalyzer";
import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";

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

export default function ExamplesPage() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const handleSocialAnalysis = (
    result: ReviewResponse,
    analysis: AnalysisResult,
  ) => {
    addLog(`Social: Post analizado - ${analysis.sentiment_label}`);
    if (analysis.sentiment_label === "negative") {
      addLog("Social: ⚠️ Contenido negativo detectado - Requiere moderación");
    }
  };

  return (
    <PageWrapper title="📱 Red Social - Moderación de Contenido">
      <div className="text-center mb-12">
        <p className="text-xl text-gray-600">
          Análisis automático de sentimiento para publicaciones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Social Media Example */}
        <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">📱 Publicación</h2>
            <p className="text-gray-300">
              Escribe una publicación para analizar el sentimiento
            </p>
          </div>

          <div className="mb-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-300">
              <strong>Configuración:</strong> Tema oscuro, moderación automática
            </p>
          </div>

          <SentimentAnalyzer
            apiUrl="https://customer-satisfaction-analyzer.onrender.com"
            onAnalysisComplete={handleSocialAnalysis}
            theme="dark"
            showOriginalReview={false}
            compact={true}
          />
        </div>

        {/* Activity Logs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            📋 Activity Logs
          </h3>
          <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center">
                Los callbacks aparecerán aquí cuando realices análisis...
              </p>
            ) : (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="text-sm font-mono text-gray-700 p-2 bg-white rounded border border-gray-200"
                  >
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
          {logs.length > 0 && (
            <button
              onClick={() => setLogs([])}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Limpiar Logs
            </button>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
