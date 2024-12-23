let wakeLock: WakeLockSentinel | null = null;

export async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      console.log('Requesting wake lock...');
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake lock acquired');

      wakeLock.addEventListener('release', () => {
        console.log('Wake lock released');
        wakeLock = null;
      });
    } else {
      console.log('Wake lock API not supported');
    }
  } catch (err) {
    console.error('Error requesting wake lock:', err);
  }
}

export async function releaseWakeLock() {
  if (wakeLock) {
    try {
      await wakeLock.release();
      wakeLock = null;
      console.log('Wake lock released');
    } catch (err) {
      console.error('Error releasing wake lock:', err);
    }
  }
}

// Handle visibility change
document.addEventListener('visibilitychange', async () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    await requestWakeLock();
  }
});
