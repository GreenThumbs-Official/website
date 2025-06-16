import React from 'react';

const Circle = ({ size, top, left, duration, move }) => (
  <div
    className={`absolute rounded-full bg-white bg-opacity-10 animate-float`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      top: `${top}%`,
      left: `${left}%`,
      animationDuration: `${duration}s`,
      animationName: `float-${move}`,
    }}
  />
);

export default function Background() {
  const circles = [
    { size: 300, top: 10, left: 10, duration: 20, move: 30 },
    { size: 200, top: 60, left: 80, duration: 15, move: -20 },
    { size: 400, top: 40, left: 30, duration: 25, move: 40 },
    { size: 250, top: 80, left: 60, duration: 18, move: -30 },
  ];

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {circles.map((circle, index) => (
        <Circle key={index} {...circle} />
      ))}
    </div>
  );
}