/**
 * Featured Dogs Section Component
 * Displays urgent rescue cases
 */

export default function FeaturedDogs() {
  // Mock data - will be replaced with real data later
  const featuredDogs = [
    {
      id: 1,
      name: "별이",
      age: 3,
      gender: "female",
      location: "Seoul",
      urgent: true,
      image: "🐕",
    },
    {
      id: 2,
      name: "초코",
      age: 2,
      gender: "male",
      location: "Busan",
      urgent: true,
      image: "🐶",
    },
    {
      id: 3,
      name: "구름",
      age: 5,
      gender: "female",
      location: "Incheon",
      urgent: false,
      image: "🦮",
    },
    {
      id: 4,
      name: "뭉치",
      age: 1,
      gender: "male",
      location: "Daegu",
      urgent: true,
      image: "🐕‍🦺",
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">긴급 케이스</h2>
          <p className="text-lg text-gray-600">지금 도움이 필요한 아이들</p>
        </div>

        {/* Dogs Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredDogs.map((dog) => (
            <div
              key={dog.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl"
            >
              {/* Urgent Badge */}
              {dog.urgent && (
                <div className="absolute left-4 top-4 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  긴급
                </div>
              )}

              {/* Image Placeholder */}
              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 text-7xl transition-transform group-hover:scale-105">
                {dog.image}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="mb-2 text-xl font-bold text-gray-900">{dog.name}</h3>
                <div className="mb-3 space-y-1 text-sm text-gray-600">
                  <div>
                    {dog.age}살 · {dog.gender === "male" ? "남아" : "여아"}
                  </div>
                  <div>📍 {dog.location}</div>
                </div>
                <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-600">
                  지금 도와주기
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button className="rounded-lg border-2 border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 transition-all hover:border-primary hover:text-primary">
            모든 유기견 보기
          </button>
        </div>
      </div>
    </section>
  );
}
