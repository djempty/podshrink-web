function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function injectSummaryLinks(
  summary: string,
  options?: { episodeId?: number; showTitle?: string; showId?: number }
): string {
  let html = escapeHtml(summary);
  const { episodeId, showTitle, showId } = options || {};

  // Link first occurrence of episode-like phrases to episode page
  if (episodeId) {
    const matched = html.match(/(this (?:podcast )?episode|the (?:podcast )?episode|this conversation|this interview|this discussion)/i);
    if (matched) {
      const link = `<a href="/episodes/${episodeId}" class="text-purple-400 hover:text-purple-300 underline">${matched[0]}</a>`;
      html = html.replace(matched[0], link);
    }
  }

  // Link first occurrence of the show name to the show page
  if (showTitle && showId) {
    const escaped = escapeHtml(showTitle);
    if (html.includes(escaped)) {
      const showLink = `<a href="/shows/${showId}" class="text-purple-400 hover:text-purple-300 underline">${escaped}</a>`;
      html = html.replace(escaped, showLink);
    }
  }

  // Fallback: link "podcast episode" if no episode link inserted yet
  if (episodeId && !html.includes(`/episodes/${episodeId}`)) {
    const fallback = html.match(/(podcast episode)/i);
    if (fallback) {
      const link = `<a href="/episodes/${episodeId}" class="text-purple-400 hover:text-purple-300 underline">${fallback[0]}</a>`;
      html = html.replace(fallback[0], link);
    }
  }

  return html;
}
