import '@/styles/globals.css'
import { Toaster } from "@/components/ui/toaster"
import { getRandomImage } from '@/utils/unsplash'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const backgroundImage = await getRandomImage('winery landscape');

  return (
    <html lang="en">
      <body 
        style={{
          backgroundImage: `url(${backgroundImage?.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}

