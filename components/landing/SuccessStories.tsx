/**
 * Success Stories Section Component
 * Displays adoption success stories
 */

export default function SuccessStories() {
  // Mock data - will be replaced with real data later
  const stories = [
    {
      id: 1,
      dogName: "멍멍이",
      location: "Seoul → Canada",
      story: "이효리와 함께한 OO, 캐나다에서 새 가족을 만났어요",
      image: "🐕",
    },
    {
      id: 2,
      dogName: "복실이",
      location: "Busan → USA",
      story: "챌린지를 통해 미국에서 새로운 삶을 시작했어요",
      image: "🐶",
    },
    {
      id: 3,
      dogName: "해피",
      location: "Incheon → Japan",
      story: "SNS 공유로 일본에서 사랑받는 가족이 되었어요",
      image: "🦮",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">성공 스토리</h2>
          <p className="text-lg text-gray-600">챌린지를 통해 새 가족을 만난 아이들</p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stories.map((story) => (
            <div
              key={story.id}
              className="overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl"
            >
              {/* Image Placeholder */}
              <div className="flex h-64 items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 text-8xl">
                {story.image}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{story.dogName}</h3>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    입양 완료
                  </span>
                </div>
                <div className="mb-3 text-sm font-medium text-primary">{story.location}</div>
                <p className="text-gray-600">{story.story}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-12 text-center">
          <button className="rounded-lg border-2 border-primary bg-white px-8 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-white">
            더 많은 스토리 보기
          </button>
        </div>
      </div>
    </section>
  );
}
