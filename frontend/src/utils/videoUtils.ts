/**
 * Utility functions for video URL parsing and embedding across Maha Construction platform.
 */

export const getEmbedVideoUrl = (rawUrl: string | null | undefined): string => {
  if (!rawUrl) return "";
  let url = rawUrl.trim();

  // Convert relative backend uploads to absolute localhost URL
  if (url.startsWith("/uploads/")) {
    return `http://localhost:8000${url}`;
  }

  // Convert YouTube watch/share/shorts links to valid embed URLs
  if (url.includes("youtube.com/watch")) {
    try {
      const u = new URL(url);
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}?autoplay=1&rel=0`;
    } catch (e) {
      const match = url.match(/v=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
    }
  } else if (url.includes("youtu.be/")) {
    const parts = url.split("youtu.be/");
    const id = parts[1]?.split("?")[0]?.split("/")[0];
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  } else if (url.includes("youtube.com/shorts/")) {
    const parts = url.split("youtube.com/shorts/");
    const id = parts[1]?.split("?")[0]?.split("/")[0];
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  } else if (url.includes("youtube.com/embed/")) {
    if (!url.includes("autoplay=1")) {
      return url.includes("?") ? `${url}&autoplay=1` : `${url}?autoplay=1`;
    }
    return url;
  }

  return url;
};

export const isYouTubeUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
};
