import { getStageColorInfo } from '@/lib/fasting/bodyStages'

interface FastingStageChipProps {
  readonly stageName: string
  readonly color: string
  readonly className?: string
}

/** Small pill/badge showing the current fasting stage (e.g. "Fat Burning"). */
export function FastingStageChip({ stageName, color, className = '' }: FastingStageChipProps) {
  const colors = getStageColorInfo(color)

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border whitespace-nowrap ${colors.bg} ${colors.text} ${colors.border} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.hex }} />
      {stageName}
    </span>
  )
}
