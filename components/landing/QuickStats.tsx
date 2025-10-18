/**
 * Quick Stats Section Component
 * Displays key metrics (shares, adoptions, countries)
 */

export default function QuickStats() {
  // Mock data - will be replaced with real data later
  const stats = [
    { label: "총 공유 횟수", value: "15,234", icon: "📊" },
    { label: "입양 성공", value: "127", icon: "❤️" },
    { label: "참여 국가", value: "23", icon: "🌍" },
  ];

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 text-5xl">{stat.icon}</div>
              <div className="mb-2 text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm font-medium text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
