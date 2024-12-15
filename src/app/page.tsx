import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { getRandomImage } from '@/utils/unsplash'
import { Card, CardContent } from "@/components/ui/card"
import { LandingHeader } from '@/components/landing/header'
import { LandingFooter } from '@/components/landing/footer'
import { UnsplashImageAttribution } from '@/components/landing/hero-image-attribution'

export default async function LandingPage() {
  const heroImage = await getRandomImage('winery vineyard');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <LandingHeader />

      {/* Main content */}
      <main className="flex items-center justify-center p-4 min-h-[calc(100vh-64px)] bg-white">
        <Card className="w-full h-[calc(100vh-96px)] max-w-[calc(100vw-32px)] md:max-w-[calc(100vw-64px)] overflow-hidden rounded-[20px]">
          <CardContent className="p-0 h-full">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Hero Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${heroImage?.url})`,
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50" />
              </div>

              {/* Content */}
              <div className="relative z-10 text-center px-4">
                <h2 className="text-5xl font-bold mb-4 text-white">Less Paperwork. More Passion.</h2>
                <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                  Purpose-built software that takes care of the busywork, so you can focus on what you do best.
                </p>
                <div className="space-x-4">
                  <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                    <Link href="/auth">Get Started</Link>
                  </Button>
                </div>
              </div>

              {/* Unsplash Image Attribution */}
              <UnsplashImageAttribution image={heroImage} />
            </div>
          </CardContent>
        </Card>
      </main>

      <LandingFooter />
    </div>
  )
}

