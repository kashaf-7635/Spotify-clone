export const formatTime = ms => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const formatDate = dateStr => {
  const date = new Date(dateStr);
  const options = {day: '2-digit', month: 'long', year: 'numeric'};
  return date.toLocaleDateString('en-GB', options);
};

export const formatTotalDuration = tracks => {
  const totalMs = tracks?.reduce((sum, track) => sum + track.duration_ms, 0);

  const totalSeconds = Math.floor(totalMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
};
