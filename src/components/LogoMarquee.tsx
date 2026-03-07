import React, { useRef, useEffect } from "react";
import {
  motion,
  useSpring,
  useTransform,
  type PanInfo,
  type MotionValue,
} from "framer-motion";
import normalizeWheel from "normalize-wheel";
import useRafLoop from "react-use/esm/useRafLoop";
import { useWindowSize } from "@react-hook/window-size";

// 1. Define the Partner type for Astro images
type Partner = {
  name: string;
  logo: string;
  link: string;
  size: string;
};

type MarqueeItemProps = {
  logos: Partner[];
  speed: MotionValue<number>;
};

const MarqueeItem: React.FC<MarqueeItemProps> = ({ logos, speed }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const x = useRef(0);
  const [width, height] = useWindowSize();

  const setX = () => {
    if (!itemRef.current || !rectRef.current) return;

    const xPercentage = (x.current / rectRef.current.width) * 100;

    if (xPercentage < -100) x.current = 0;
    if (xPercentage > 0) x.current = -rectRef.current.width;

    itemRef.current.style.transform = `translate3d(${xPercentage}%, 0, 0)`;
  };

  useEffect(() => {
    if (itemRef.current) {
      rectRef.current = itemRef.current.getBoundingClientRect();
    }
  }, [width, height]);

  const loop = () => {
    x.current -= speed.get();
    setX();
  };

  const [, loopStart] = useRafLoop(loop, false);

  useEffect(() => {
    loopStart();
  }, [loopStart]);

  return (
    <motion.div
      className="flex min-w-full shrink-0 items-center justify-around px-4"
      ref={itemRef}
    >
      {logos.map((partner, i) => (
        <a
          key={i}
          href={partner.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-8 block" // Added 'block' for better anchor sizing
          draggable={false} // Prevent native dragging on the link itself
          onDragStart={(e) => e.preventDefault()} // The magic bullet to stop browser link-ghosting
        >
          <img
            src={partner.logo}
            className={`w-auto transition-all hover: scale-110 ${partner.size}`}
            alt={partner.name}
            draggable={false}
          />
        </a>
      ))}
    </motion.div>
  );
};

type MarqueeProps = {
  logos: Partner[];
  speed?: number;
  threshold?: number;
  wheelFactor?: number;
  dragFactor?: number;
};

export const LogoMarquee: React.FC<MarqueeProps> = ({
  logos,
  speed = 1,
  threshold = 0.014,
  wheelFactor = 1.8,
  dragFactor = 1.2,
}) => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const slowDown = useRef(false);
  const isScrolling = useRef<NodeJS.Timeout | null>(null);

  const x = useRef(0);
  const [wWidth] = useWindowSize();
  const speedSpring = useSpring(speed, {
    damping: 40,
    stiffness: 90,
    mass: 5,
  });

  const skewX = useTransform(
    speedSpring,
    [-wWidth * 0.05, 0, wWidth * 0.05],
    [1, 0, 1],
  );

  // Replaced inline onWheel with a non-passive native event listener
  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault(); // Stop the page from scrolling!

      const normalized = normalizeWheel(e);
      x.current = normalized.pixelY * wheelFactor;

      if (isScrolling.current) {
        window.clearTimeout(isScrolling.current);
      }

      isScrolling.current = setTimeout(() => {
        speedSpring.set(speed);
      }, 30);
    };

    // { passive: false } is required to allow e.preventDefault()
    marquee.addEventListener("wheel", handleNativeWheel, { passive: false });

    return () => {
      marquee.removeEventListener("wheel", handleNativeWheel);
    };
  }, [speedSpring, speed, wheelFactor]);

  const handleDragStart = () => {
    slowDown.current = true;
    speedSpring.set(0);
  };

  const handleOnDrag = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    speedSpring.set(dragFactor * -info.delta.x);
  };

  const handleDragEnd = () => {
    slowDown.current = false;
    x.current = speed;
  };

  const loop = () => {
    if (slowDown.current || Math.abs(x.current) < threshold) return;

    x.current *= 0.66;

    if (x.current < 0) {
      x.current = Math.min(x.current, 0);
    } else {
      x.current = Math.max(x.current, 0);
    }

    speedSpring.set(speed + x.current);
  };

  useRafLoop(loop);

  return (
    <div className="relative flex w-full overflow-hidden border-b border-t py-10">
      <motion.div
        className="flex w-full cursor-grab active:cursor-grabbing"
        ref={marqueeRef}
        style={{ skewX }}
        // Removed synthetic onWheel={handleOnWheel} from here
        drag="x"
        dragPropagation={true}
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={handleDragStart}
        onDrag={handleOnDrag}
        onDragEnd={handleDragEnd}
        dragElastic={0.000001}
      >
        <MarqueeItem speed={speedSpring} logos={logos} />
        <MarqueeItem speed={speedSpring} logos={logos} />
      </motion.div>
    </div>
  );
};
