import { useState, useCallback } from 'react';

/**
 * Returns the current date/time info, refreshed on demand.
 */
export function useDateTime() {
  const [now, setNow] = useState(new Date());

  const refresh = useCallback(() => setNow(new Date()), []);

  const greeting = (() => {
    const h = now.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return { now, greeting, dateString, refresh };
}
