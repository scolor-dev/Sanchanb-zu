import { useState } from "react";

const makeDrops = () =>
  Array.from({ length: 40 }, () => ({
    left: `${Math.random() * 100}vw`,
    delay: `${Math.random() * 2}s`,
    duration: `${0.5 + Math.random() * 0.5}s`,
  }));

const RainEffect = () => {
  // 初回マウント時にだけ生成して固定
  const [drops] = useState(makeDrops);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {drops.map((style, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: style.left,
            animationDelay: style.delay,
            animationDuration: style.duration,
          }}
        />
      ))}
    </div>
  );
};

export default function WeatherBackground({ weather }) {
  return (
    <>
      {weather === "Rain" && <RainEffect />}
      {weather === "Clear" && <div className="fixed inset-0 sunny-overlay z-0" />}
      {weather === "Clouds" && (
        <div className="fixed inset-0 cloudy-overlay z-0" />
      )}
    </>
  );
}
