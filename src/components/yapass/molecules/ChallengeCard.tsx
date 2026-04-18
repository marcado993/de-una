import { Emoji } from "../atoms/Emoji";
import { ProgressBar } from "../atoms/ProgressBar";
import { Card } from "./Card";

export type ChallengeCardProps = {
  title?: string;
  description: string;
  progress: number;
  total: number;
  emoji?: string;
};

/**
 * Molecule — a "Desafíos Diarios" card: framed emoji on the left,
 * description + progress bar on the right. Composed entirely from
 * `Card` + `Emoji` + `ProgressBar` so each piece can be tweaked alone.
 */
export function ChallengeCard({
  title = "Desafíos Diarios",
  description,
  progress,
  total,
  emoji = "🍔",
}: ChallengeCardProps) {
  const pct = total > 0 ? progress / total : 0;

  return (
    <Card variant="elevated" padding="lg" className="flex flex-col gap-3">
      {title ? <span className="text-title-sm text-primary">{title}</span> : null}
      <div className="flex items-center gap-3">
        <Emoji symbol={emoji} framed size="md" />
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-body line-clamp-2 font-medium">{description}</span>
          <div className="flex items-center gap-2">
            <ProgressBar value={pct} fillClassName="bg-primary" aria-label={title} />
            <span className="text-caption font-semibold">
              {progress}/{total}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
