import Testimonials from '@/components/Testimonials'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to Our Platform
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto">
            Discover what our community is saying about their experience
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials 
        title="What Our Users Say"
        columns={4}
        containerHeight="800px"
      />
    </main>
  )
}

