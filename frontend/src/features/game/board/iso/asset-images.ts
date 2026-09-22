import { useEffect, useState } from 'react';
import cornerGoUrl from '@lotrace/design-system/assets/pieces/corner-go.svg?url';
import cornerJailUrl from '@lotrace/design-system/assets/pieces/corner-jail.svg?url';
import cornerGotoJailUrl from '@lotrace/design-system/assets/pieces/corner-goto-jail.svg?url';
import cornerParkUrl from '@lotrace/design-system/assets/pieces/corner-park.svg?url';
import houseUrl from '@lotrace/design-system/assets/pieces/house.svg?url';
import hotelUrl from '@lotrace/design-system/assets/pieces/hotel.svg?url';
import stationUrl from '@lotrace/design-system/assets/pieces/station.svg?url';
import taxUrl from '@lotrace/design-system/assets/pieces/tax.svg?url';
import car0Url from '@lotrace/design-system/assets/tokens/car-seat-0-rose.svg?url';
import car1Url from '@lotrace/design-system/assets/tokens/car-seat-1-emerald.svg?url';
import car2Url from '@lotrace/design-system/assets/tokens/car-seat-2-amber.svg?url';
import car3Url from '@lotrace/design-system/assets/tokens/car-seat-3-violet.svg?url';
import car4Url from '@lotrace/design-system/assets/tokens/car-seat-4-cyan.svg?url';
import car5Url from '@lotrace/design-system/assets/tokens/car-seat-5-fuchsia.svg?url';

/**
 * Asset image registry for the isometric canvas board.
 *
 * The board's buildings, corner glyphs and player cars are hand-drawn SVGs in
 * `design-system/assets`. The canvas can't render SVG markup directly, so we
 * load each asset URL into an HTMLImageElement once and cache it. Drawing code
 * reads from `assetImages` synchronously; anything not yet loaded is skipped
 * for that frame and picked up on the next render tick.
 */

/** Named board assets (buildings, corner glyphs, tile icons). */
export type BoardAssetKey =
  | 'corner-go'
  | 'corner-jail'
  | 'corner-goto-jail'
  | 'corner-park'
  | 'house'
  | 'hotel'
  | 'station'
  | 'tax';

const ASSET_URLS: Record<BoardAssetKey, string> = {
  'corner-go': cornerGoUrl,
  'corner-jail': cornerJailUrl,
  'corner-goto-jail': cornerGotoJailUrl,
  'corner-park': cornerParkUrl,
  house: houseUrl,
  hotel: hotelUrl,
  station: stationUrl,
  tax: taxUrl,
};

/** Per-seat car SVGs (index = playerID % 6), each with its colour baked in. */
const CAR_URLS: readonly string[] = [car0Url, car1Url, car2Url, car3Url, car4Url, car5Url];

type ImageCache = { image: HTMLImageElement; ready: boolean };

const cache = new Map<string, ImageCache>();
const listeners = new Set<() => void>();
let allReady = false;

function notify(): void {
  for (const listener of listeners) listener();
}

function load(url: string): ImageCache {
  const existing = cache.get(url);
  if (existing) return existing;
  const image = new Image();
  const entry: ImageCache = { image, ready: false };
  cache.set(url, entry);
  image.onload = (): void => {
    entry.ready = true;
    if ([...cache.values()].every((c) => c.ready)) allReady = true;
    notify();
  };
  image.src = url;
  return entry;
}

/** Kick off loading every asset once (idempotent). */
function loadAll(): void {
  for (const url of Object.values(ASSET_URLS)) load(url);
  for (const url of CAR_URLS) load(url);
}

/** A loaded image for a named asset, or null if not ready yet. */
export function assetImage(key: BoardAssetKey): HTMLImageElement | null {
  const entry = cache.get(ASSET_URLS[key]);
  return entry?.ready ? entry.image : null;
}

/** A loaded car image for a player seat (playerID % 6), or null if not ready. */
export function carImage(playerID: string): HTMLImageElement | null {
  const index = Number(playerID) % CAR_URLS.length;
  const url = CAR_URLS[index] ?? CAR_URLS[0];
  if (!url) return null;
  const entry = cache.get(url);
  return entry?.ready ? entry.image : null;
}

/**
 * Load all board assets and re-render on every load. Returns a tick that
 * increments as images arrive, so a canvas effect can depend on it and repaint
 * once the artwork is available.
 */
export function useBoardAssets(): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    loadAll();
    if (allReady) return;
    const onLoaded = (): void => setTick((t) => t + 1);
    listeners.add(onLoaded);
    return () => {
      listeners.delete(onLoaded);
    };
  }, []);

  return tick;
}
