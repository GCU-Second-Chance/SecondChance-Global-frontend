/**
 * How It Works Section Component
 * 3-step process explanation
 */

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "챌린지 참여",
      description: "유기견과 함께 인생네컷을 제작하세요",
      icon: "🎨",
    },
    {
      number: "2",
      title: "SNS 공유",
      description: "친구들에게 공유해주세요",
      icon: "📱",
    },
    {
      number: "3",
      title: "입양 연결",
      description: "새로운 가족을 만나도록 도와주세요",
      icon: "🏠",
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">이용 방법</h2>
          <p className="text-lg text-gray-600">간단한 3단계로 참여하세요</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {/* Step Number Badge */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white shadow-lg">
                {step.number}
              </div>

              {/* Icon */}
              <div className="mb-4 text-6xl">{step.icon}</div>

              {/* Title */}
              <h3 className="mb-3 text-xl font-bold text-gray-900">{step.title}</h3>

              {/* Description */}
              <p className="text-gray-600">{step.description}</p>

              {/* Arrow (except last item) */}
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-8 hidden translate-x-1/2 text-4xl text-primary opacity-30 md:block">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
