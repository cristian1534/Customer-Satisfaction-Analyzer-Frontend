import BusinessInsights from "@/components/BusinessInsights";
import Navigation from "@/components/Navigation";
import AuthGuard from "@/components/AuthGuard";

export default function BusinessInsightsPage() {
  return (
    <div>
      <Navigation />
      <AuthGuard>
        <BusinessInsights />
      </AuthGuard>
    </div>
  );
}
