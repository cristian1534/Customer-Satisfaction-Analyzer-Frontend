import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import Navigation from "@/components/Navigation";
import AuthGuard from "@/components/AuthGuard";

export default function AnalyticsPage() {
  return (
    <div>
      <Navigation />
      <AuthGuard>
        <AnalyticsDashboard />
      </AuthGuard>
    </div>
  );
}
