import React from "react";

export type PatternType = "dots" | "grid" | "waves" | "circles" | "hex";

interface DecorativePatternProps {
  type?: PatternType;
  color?: string;
  opacity?: number;
  density?: "low" | "medium" | "high";
  className?: string;
  animate?: boolean;
}

/**
 * A component that renders various decorative background patterns
 */
const DecorativePattern: React.FC<DecorativePatternProps> = ({
  type = "dots",
  color = "#ffffff",
  opacity = 0.1,
  density = "medium",
  className = "",
  animate = false,
}) => {
  // Calculate pattern density values
  const getDensityValues = () => {
    switch (density) {
      case "low":
        return {
          dotCount: 20,
          gridGap: 50,
          waveCount: 3,
          circleCount: 5,
          hexCount: 6,
        };
      case "high":
        return {
          dotCount: 100,
          gridGap: 15,
          waveCount: 8,
          circleCount: 20,
          hexCount: 18,
        };
      case "medium":
      default:
        return {
          dotCount: 50,
          gridGap: 30,
          waveCount: 5,
          circleCount: 10,
          hexCount: 12,
        };
    }
  };

  const densityValues = getDensityValues();

  // Render dots pattern
  const renderDots = () => {
    return (
      <div className="absolute inset-0" style={{ opacity }}>
        {Array.from({ length: densityValues.dotCount }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              animate ? "animate-pulse" : ""
            }`}
            style={{
              backgroundColor: color,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: animate ? `${Math.random() * 3}s` : undefined,
              animationDuration: animate
                ? `${3 + Math.random() * 2}s`
                : undefined,
            }}
          />
        ))}
      </div>
    );
  };

  // Render grid pattern
  const renderGrid = () => {
    return (
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px), 
                           linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
          backgroundSize: `${densityValues.gridGap}px ${densityValues.gridGap}px`,
          opacity,
        }}
      />
    );
  };

  // Render waves pattern
  const renderWaves = () => {
    const paths = [
      "M0,64 C21.3,68.1 42.6,72.2 64,64 C85.4,55.8 106.7,35.3 128,32 C149.3,28.7 170.7,42.7 192,48 C213.3,53.3 234.7,50 256,42.7 C277.3,35.3 298.7,24 320,21.3 C341.3,18.7 362.7,24.7 384,32 C405.3,39.3 426.7,48 448,48 C469.3,48 490.7,39.3 512,37.3 C533.3,35.3 554.7,40 576,42.7 C597.3,45.3 618.7,46 640,42.7 C661.3,39.3 682.7,32 704,26.7 C725.3,21.3 746.7,18 768,21.3 C789.3,24.7 810.7,34.7 832,42.7 C853.3,50.7 874.7,56.7 896,53.3 C917.3,50 938.7,37.3 960,32 C981.3,26.7 1002.7,28.7 1024,32 C1045.3,35.3 1066.7,40 1088,42.7 C1109.3,45.3 1130.7,46 1152,45.3 C1173.3,44.7 1194.7,42.7 1216,40 C1237.3,37.3 1258.7,34 1280,32 L1280,64 L0,64 Z",
      "M0,32 C21.3,37.3 42.6,42.6 64,45.3 C85.4,48 106.7,48 128,42.7 C149.3,37.3 170.7,26.7 192,21.3 C213.3,16 234.7,16 256,18.7 C277.3,21.3 298.7,26.7 320,32 C341.3,37.3 362.7,42.7 384,42.7 C405.3,42.7 426.7,37.3 448,34.7 C469.3,32 490.7,32 512,32 C533.3,32 554.7,32 576,32 C597.3,32 618.7,32 640,34.7 C661.3,37.3 682.7,42.7 704,42.7 C725.3,42.7 746.7,37.3 768,34.7 C789.3,32 810.7,32 832,32 C853.3,32 874.7,32 896,32 C917.3,32 938.7,32 960,29.3 C981.3,26.7 1002.7,21.3 1024,18.7 C1045.3,16 1066.7,16 1088,21.3 C1109.3,26.7 1130.7,37.3 1152,42.7 C1173.3,48 1194.7,48 1216,45.3 C1237.3,42.7 1258.7,37.3 1280,32 L1280,64 L0,64 Z",
    ];

    return (
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden"
        style={{ opacity }}
      >
        {Array.from({ length: densityValues.waveCount }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full overflow-hidden"
            style={{
              height: `${15 + i * 5}px`,
              bottom: `${i * 10}px`,
              animationDuration: animate ? `${15 + i * 5}s` : undefined,
            }}
          >
            <svg
              className={`w-full h-full fill-current ${animate ? "animate-wave" : ""}`}
              style={{
                color,
                animationDelay: animate ? `-${i * 2}s` : undefined,
              }}
              preserveAspectRatio="none"
              viewBox="0 0 1280 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={paths[i % 2]} />
            </svg>
          </div>
        ))}
      </div>
    );
  };

  // Render circles pattern
  const renderCircles = () => {
    return (
      <div className="absolute inset-0" style={{ opacity }}>
        {Array.from({ length: densityValues.circleCount }).map((_, i) => {
          const size = 30 + Math.random() * 120;
          return (
            <div
              key={i}
              className={`absolute rounded-full ${animate ? "scale-animation" : ""}`}
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${color}`,
                width: `${size}px`,
                height: `${size}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: "translate(-50%, -50%)",
                animationDuration: animate
                  ? `${5 + Math.random() * 5}s`
                  : undefined,
                animationDelay: animate ? `${Math.random() * 2}s` : undefined,
              }}
            />
          );
        })}
      </div>
    );
  };

  // Render hexagon pattern
  const renderHex = () => {
    return (
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23${color.replace(
            "#",
            ""
          )}' fill-opacity='1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: `${densityValues.hexCount * 2}px`,
          opacity,
          animation: animate ? "hexRotate 60s linear infinite" : undefined,
        }}
      />
    );
  };

  // Render pattern based on type
  const renderPattern = () => {
    switch (type) {
      case "dots":
        return renderDots();
      case "grid":
        return renderGrid();
      case "waves":
        return renderWaves();
      case "circles":
        return renderCircles();
      case "hex":
        return renderHex();
      default:
        return renderDots();
    }
  };

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {renderPattern()}
    </div>
  );
};

export default DecorativePattern;
