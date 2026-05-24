'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

export default function Skeleton({ className = '', variant = 'text' }: SkeletonProps) {
  const baseClass = 'animate-pulse bg-white/[0.06] rounded';
  
  const variants = {
    text: `${baseClass} h-4 rounded-md`,
    circular: `${baseClass} rounded-full`,
    rectangular: `${baseClass} rounded-xl`,
    card: `${baseClass} rounded-2xl h-40`,
  };

  return <div className={`${variants[variant]} ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-1/2 h-3" />
        </div>
      </div>
      <Skeleton className="w-full h-3" />
      <Skeleton className="w-2/3 h-3" />
      <div className="flex gap-2 mt-3">
        <Skeleton className="w-16 h-5 rounded-full" />
        <Skeleton className="w-20 h-5 rounded-full" />
      </div>
    </div>
  );
}
