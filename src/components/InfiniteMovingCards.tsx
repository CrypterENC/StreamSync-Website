'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
}: {
  items: {
    id: string;
    name: string;
    memberCount: number;
    iconURL?: string;
  }[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((child) => {
        const duplicatedChild = child.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedChild);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'forwards'
        );
      } else {
        containerRef.current.style.setProperty(
          '--animation-direction',
          'reverse'
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '20s');
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '40s');
      } else {
        containerRef.current.style.setProperty('--animation-duration', '80s');
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20 w-full overflow-hidden',
        className
      )}
    >
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 1rem));
          }
        }
        .scroller ul {
          animation: scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite;
        }
        .scroller ul:hover {
          animation-play-state: ${pauseOnHover ? 'paused' : 'running'};
        }
      `}</style>
      <ul
        ref={scrollerRef}
        className="flex w-max min-w-full shrink-0 gap-6 sm:gap-8 md:gap-10 py-2 sm:py-3 flex-nowrap"
      >
        {items.map((item) => (
          <li
            key={item.id}
            className="w-[150px] xs:w-[170px] sm:w-[190px] md:w-[210px] lg:w-[380px] xl:w-[480px] max-w-full relative rounded-2xl border border-gray-700/50 px-1 xs:px-1.5 sm:px-2 lg:px-4 xl:px-6 py-1 xs:py-1.5 sm:py-2 lg:py-4 xl:py-6 bg-gray-800/30 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300"
          >
            <blockquote>
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 mb-1.5 xs:mb-2 sm:mb-3">
                <div className="flex-shrink-0 w-8 xs:w-10 sm:w-12 md:w-14 h-8 xs:h-10 sm:h-12 md:h-14 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center overflow-hidden">
                  {item.iconURL ? (
                    <img
                      src={item.iconURL}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-4 xs:w-5 sm:w-6 md:w-7 h-4 xs:h-5 sm:h-6 md:h-7 bg-blue-400/30 rounded" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-xs xs:text-sm sm:text-base line-clamp-2">
                    {item.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {item.memberCount.toLocaleString()} members
                  </p>
                </div>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
