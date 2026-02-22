function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function injectSummaryLinks(
  summary: string,
  options?: { episodeId?: number; showTitle?: string; showId?: number }
): string {
  let html = escapeHtml(summary);
  const { episodeId, showTitle, showId } = options || {};

  // Link first occurrence of episode/podcast-like phrases to episode page
  if (episodeId) {
    const patterns = [
      /this (?:podcast )?episode/i,
      /the (?:podcast )?episode/i,
      /this podcast/i,
      /the podcast/i,
      /this conversation/i,
      /the conversation/i,
      /this interview/i,
      /the interview/i,
      /this discussion/i,
      /the discussion/i,
      /this show/i,
      /the show/i,
      /this talk/i,
      /podcast episode/i,
      /full episode/i,
      /the full (?:conversation|interview|discussion|episode)/i,
      /the original (?:episode|conversation|interview|podcast)/i,
    ];

    for (const pattern of patterns) {
      const matched = html.match(pattern);
      if (matched) {
        const link = `<a href="/episodes/${episodeId}" class="text-purple-400 hover:text-purple-300 underline">${matched[0]}</a>`;
        html = html.replace(matched[0], link);
        break;
      }
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

  return html;
}
