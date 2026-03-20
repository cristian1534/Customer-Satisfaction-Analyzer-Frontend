import Navigation from "@/components/Navigation";

export default function PageWrapper({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-8 px-4">
          {title && (
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[#FFE600] mb-4">
                {title}
              </h1>
            </div>
          )}
          {children}
        </div>
      </main>
    </>
  );
}