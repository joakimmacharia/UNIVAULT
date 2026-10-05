import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';

/**
 * Routes that are a natural "home" for the user — pressing back here should
 * offer to leave the app rather than pop further into the history stack.
 */
const ROOT_ROUTES = ['/', '/dashboard', '/login', '/register'];

const EXIT_WINDOW_MS = 2000;

/**
 * Wires the Android hardware/gesture back button to React Router.
 *
 * Without this, Capacitor falls back to its default handling and the app
 * closes on the first back press instead of stepping back through the pages
 * the user actually visited. On a root route we require two presses within
 * EXIT_WINDOW_MS so a stray swipe never kills the app.
 *
 * Returns whether the "press back again to exit" hint should be shown.
 */
const useAndroidBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showExitHint, setShowExitHint] = useState(false);

  // Keep the latest path in a ref so the listener is registered only once.
  const pathRef = useRef(location.pathname);
  pathRef.current = location.pathname;

  useEffect(() => {
    if (Capacitor.getPlatform() !== 'android') return undefined;

    let listener;
    let armed = false;
    let timer;
    let cancelled = false;

    const handleBack = () => {
      const path = pathRef.current;

      if (!ROOT_ROUTES.includes(path) && window.history.length > 1) {
        navigate(-1);
        return;
      }

      if (armed) {
        CapacitorApp.exitApp();
        return;
      }

      armed = true;
      setShowExitHint(true);
      timer = setTimeout(() => {
        armed = false;
        setShowExitHint(false);
      }, EXIT_WINDOW_MS);
    };

    Promise.resolve(CapacitorApp.addListener('backButton', handleBack)).then((handle) => {
      if (cancelled) handle?.remove();
      else listener = handle;
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      listener?.remove();
    };
  }, [navigate]);

  return showExitHint;
};

export default useAndroidBackButton;
