"use client";
import { cn } from "@/utils/cn";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}

export const WavyBackground: React.FC<WavyBackgroundProps> = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth = 50,
  backgroundFill = "black",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}) => {
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSafari, setIsSafari] = useState(false);

  // Set Safari compatibility
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome")
    );
  }, []);

  // Speed mapping
  const getSpeed = () => (speed === "fast" ? 0.002 : 0.001);

  // Initialize canvas and context
  const init = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return { canvas, ctx };
  };

  // Draw wave
  const drawWave = (ctx: CanvasRenderingContext2D, waveColors: string[], nt: number, w: number, h: number) => {
    for (let i = 0; i < waveColors.length; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      for (let x = 0; x < w; x += 5) {
        const y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5);
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  // Render loop
  const render = (ctx: CanvasRenderingContext2D, waveColors: string[], w: number, h: number, nt: number) => {
    ctx.fillStyle = backgroundFill;
    ctx.globalAlpha = waveOpacity;
    ctx.fillRect(0, 0, w, h);
    drawWave(ctx, waveColors, nt, w, h);
    return requestAnimationFrame(() => render(ctx, waveColors, w, h, nt + getSpeed()));
  };

  useEffect(() => {
    const { canvas, ctx } = init() || {};
    if (!canvas || !ctx) return;

    const waveColors = colors ?? ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"];
    let nt = 0;

    const animationId = render(ctx, waveColors, canvas.width, canvas.height, nt);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", () => {});
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blur, colors, speed, waveOpacity, waveWidth, backgroundFill]);

  return (
    <div className={cn("h-screen flex flex-col items-center justify-center overflow-hidden", containerClassName)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={isSafari ? { filter: `blur(${blur}px)` } : {}}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
