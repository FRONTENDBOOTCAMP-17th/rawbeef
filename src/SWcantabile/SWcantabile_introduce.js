async function loadTopSong() {
  const loading = document.getElementById('topSongLoading');
  const content = document.getElementById('topSongContent');
  const error = document.getElementById('topSongError');

  try {
    const res = await fetch(`${API_BASE}/songs`);
    if (!res.ok) throw new Error('fetch failed');

    const data = await res.json();

    const songs = Array.isArray(data) ? data : (data.songs ?? data.data ?? []);
    if (!songs.length) throw new Error('empty');

    const top = songs.sort((a, b) => b.score - a.score)[0];

    document.getElementById('topSongTitle').textContent = top.title ?? '–';
    document.getElementById('topSongArtist').textContent = top.artist ?? '–';
    document.getElementById('topSongScore').textContent = `${Number(top.score).toLocaleString()}점`;

    loading.classList.add('hidden');
    content.classList.remove('hidden');
  } catch (e) {
    loading.classList.add('hidden');
    error.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadTopSong();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0 }
  );

  document.querySelectorAll('body > *, section > *, footer > *').forEach((el, i) => {
    if (!el.classList.contains('scrollAnim')) {
      el.classList.add('scrollAnim');
      el.style.transitionDelay = `${(i % 5) * 0.1}s`;
    }
    observer.observe(el);

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
  });
});
