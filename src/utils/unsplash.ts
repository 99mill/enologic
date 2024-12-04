import { createApi } from 'unsplash-js';

// Initialize the Unsplash API client
const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!
});

export async function getRandomImage(query: string) {
  try {
    const result = await unsplash.photos.getRandom({
      query,
      orientation: 'landscape',
    });

    if (result.type === 'success') {
      const { urls, user } = result.response;
      return {
        url: urls.regular,
        authorName: user.name,
        authorUsername: user.username,
      };
    } else {
      console.error('Failed to fetch image from Unsplash');
      return null;
    }
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return null;
  }
}

