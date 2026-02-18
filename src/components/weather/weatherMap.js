/**
 * @typedef {"Clear" | "Clouds" | "Rain"} WeatherKind
 */

/**
 * OpenWeatherMap の main を UI 用の WeatherKind に正規化
 * @param {string} main
 * @returns {WeatherKind}
 */
export function normalizeWeather(main) {
  if (["Rain", "Drizzle", "Thunderstorm"].includes(main)) return "Rain";
  if (main === "Clouds") return "Clouds";
  return "Clear";
}

/**
 * 天気に応じた背景クラス
 * @param {WeatherKind} weather
 */
export function bgClassFromWeather(weather) {
  return weather === "Rain"
    ? "bg-slate-200/80"
    : weather === "Clouds"
    ? "bg-gray-100"
    : "bg-orange-50/30";
}
