'use client';

import { cn } from '@/lib/utils';

export const ColorfulText = ({
  children,
  className,
}: {
  children: string | React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        'font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
        'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-300',
        'text-transparent bg-clip-text',
        'animate-pulse',
        className
      )}
    >
      {children}
    </span>
  );
};
