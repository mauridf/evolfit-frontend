import { StatusDot } from '@/components/ui/StatusDot';
import { WORKOUT_STATUS_LABELS, type WorkoutStatus } from '@/lib/constants';
import { cn } from '@/lib/utils/cn';

export interface WorkoutStatusBadgeProps {
  status: WorkoutStatus;
  className?: string;
}

const STYLES: Record<WorkoutStatus, string> = {
  0: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40',
  1: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/40',
  2: 'bg-[#0EA5E9]/15 text-[#0EA5E9] border-[#0EA5E9]/40',
};

const TONE: Record<WorkoutStatus, 'paused' | 'active' | 'completed'> = {
  0: 'paused',
  1: 'active',
  2: 'completed',
};

export function WorkoutStatusBadge({ status, className }: WorkoutStatusBadgeProps) {
  return (
    <span
      className={cn(
        'pill border',
        STYLES[status],
        className,
      )}
    >
      <StatusDot tone={TONE[status]} />
      {WORKOUT_STATUS_LABELS[status]}
    </span>
  );
}