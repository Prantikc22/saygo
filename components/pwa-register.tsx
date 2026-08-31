'use client';

import { useEffect } from 'react';

export function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator && !('__TAURI_INTERNALS__' in window)) {
      void navigator.serviceWorker.register('/sw.js');
    }
  }, []);
  return null;
}
