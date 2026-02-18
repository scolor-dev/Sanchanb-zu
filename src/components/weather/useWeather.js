import { useEffect, useState } from "react";
import { normalizeWeather } from "./weatherMap";

/**
 * @typedef {"Clear" | "Clouds" | "Rain"} WeatherKind
 */

/**
 * @param {{
 *  testMode?: boolean,
 *  city?: string,
 *  apiKey?: string,
 *  testDelayMs?: number,
 *  testPatterns?: WeatherKind[]
 * }} opts
 * @returns {WeatherKind}
 */
export function useWeather(opts = {}) {
  const {
    testMode = true,
    city = "Fukuoka",
    apiKey = "12ad352acdd75d4eb6919e18fddd9807",
    testDelayMs = 500,
    testPatterns = ["Clear", "Clouds", "Rain"],
  } = opts;

  const [weather, setWeather] = useState("Clear");

  useEffect(() => {
    let cancelled = false;
    let timerId = null;

    const setSafe = (v) => {
      if (!cancelled) setWeather(v);
    };

    const run = async () => {
      // パターンA: テスト用シミュレーション
      if (testMode) {
        timerId = setTimeout(() => {
          const pick =
            testPatterns[Math.floor(Math.random() * testPatterns.length)];
          setSafe(pick);
        }, testDelayMs);
        return;
      }

      // パターンB: 本番用 (OpenWeatherMap)
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const data = await res.json();
        const main = data?.weather?.[0]?.main;
        setSafe(normalizeWeather(main));
      } catch {
        // エラー時はデフォルトで晴れ
        setSafe("Clear");
      }
    };

    run();

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [testMode, city, apiKey, testDelayMs, testPatterns]);

  return weather;
}
