export interface GoogleBookResult {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  thumbnail: string | null;
  pageCount: number | null;
  publishedDate: string | null;
}

interface RawVolume {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    categories?: string[];
    description?: string;
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    pageCount?: number;
    publishedDate?: string;
  };
}

interface RawResponse {
  items?: RawVolume[];
  error?: { message: string };
}

export async function searchGoogleBooks(query: string): Promise<GoogleBookResult[]> {
  if (!query.trim()) return [];

  const url =
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&printType=books`;

  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error(`Google Books API error: ${res.status}`);

  const data: RawResponse = await res.json();
  if (!data.items) return [];

  return data.items
    .filter((v) => v.volumeInfo?.title)
    .map((v) => {
      const info = v.volumeInfo;
      // Use https for thumbnails (API returns http)
      const thumb = info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail ?? null;
      return {
        id: v.id,
        title: info.title ?? "Unknown title",
        author: info.authors?.join(", ") ?? "Unknown author",
        genre: info.categories?.[0] ?? "General",
        description: info.description?.slice(0, 300) ?? "",
        thumbnail: thumb ? thumb.replace("http://", "https://") : null,
        pageCount: info.pageCount ?? null,
        publishedDate: info.publishedDate ?? null,
      };
    });
}
