import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface UnsplashImage {
  url: string;
  authorName: string;
  authorUsername: string;
}

export function UnsplashImageAttribution({ image }: { image: UnsplashImage | null }) {
  if (!image) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="absolute bottom-2 right-2 rounded-full bg-white/10 p-2 backdrop-blur-sm transition-colors hover:bg-white/20">
            <Info className="h-4 w-4 text-white" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <p className="text-xs">
            Photo by{' '}
            <a 
              href={`https://unsplash.com/@${image.authorUsername}?utm_source=enologic&utm_medium=referral`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-300"
            >
              {image.authorName}
            </a>
            {' '}on{' '}
            <a 
              href="https://unsplash.com/?utm_source=enologic&utm_medium=referral"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-300"
            >
              Unsplash
            </a>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

