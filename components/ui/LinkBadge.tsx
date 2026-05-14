import { getLinkLevelStyle } from '@/lib/classification';
import type { LinkLevel } from '@/lib/supabase/types';

interface LinkBadgeProps {
  level: LinkLevel;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LinkBadge({ level, label, size = 'md' }: LinkBadgeProps) {
  const style = getLinkLevelStyle(level);
  const sizeClass = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${sizeClass} ${style.bg} ${style.text} ${style.border}`}
    >
      {label}
    </span>
  );
}
