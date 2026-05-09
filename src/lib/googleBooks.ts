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

interface OLDoc {
  key: string;
  title?: string;
  author_name?: string[];
  subject?: string[];
  first_sentence?: string | { value: string } | string[];
  cover_i?: number;
  number_of_pages_median?: number;
  first_publish_year?: number;
}

interface OLResponse {
  docs?: OLDoc[];
}

export async function searchGoogleBooks(query: string): Promise<GoogleBookResult[]> {
  if (!query.trim()) return [];

  const fields = 'key,title,author_name,subject,first_sentence,cover_i,number_of_pages_median,first_publish_year';
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12&fields=${fields}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Open Library API error: ${res.status}`);

  const data: OLResponse = await res.json();
  if (!data.docs) return [];

  return data.docs
    .filter((d) => d.title)
    .slice(0, 10)
    .map((d) => {
      const thumb = d.cover_i
        ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg`
        : null;

      let description = '';
      if (d.first_sentence) {
        if (typeof d.first_sentence === 'string') description = d.first_sentence;
        else if (Array.isArray(d.first_sentence)) description = d.first_sentence[0] ?? '';
        else if (typeof d.first_sentence === 'object') description = d.first_sentence.value ?? '';
      }

      return {
        id: d.key.replace('/works/', ''),
        title: d.title ?? 'Unknown title',
        author: d.author_name?.join(', ') ?? 'Unknown author',
        genre: d.subject?.[0] ?? 'General',
        description: description.slice(0, 300),
        thumbnail: thumb,
        pageCount: d.number_of_pages_median ?? null,
        publishedDate: d.first_publish_year ? String(d.first_publish_year) : null,
      };
    });
}
