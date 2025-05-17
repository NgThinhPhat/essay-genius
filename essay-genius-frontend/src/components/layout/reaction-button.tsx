import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Star, Flame, Heart, Laugh, Meh, Frown,
  type LucideIcon,
} from "lucide-react";

export type ReactionType = "STAR" | "LOVE" | "HAHA" | "WOW" | "FIRE" | "SAD";

const reactionIconMap: Record<ReactionType, LucideIcon> = {
  STAR: Star,
  LOVE: Heart,
  HAHA: Laugh,
  WOW: Meh,
  FIRE: Flame,
  SAD: Frown,
};

const reactionColorMap: Record<ReactionType, string> = {
  STAR: "text-yellow-500",
  LOVE: "text-red-500",
  HAHA: "text-amber-400",
  WOW: "text-purple-500",
  FIRE: "text-orange-500",
  SAD: "text-blue-400",
};

export function ReactionButton({
  currentReaction,
  onReact,
  onUnreact,
  disabled,
  count,
}: {
  currentReaction: ReactionType | null;
  onReact: (reaction: ReactionType) => void;
  onUnreact: () => void;
  disabled?: boolean;
  count?: number;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (currentReaction) {
      onUnreact();
    } else {
      onReact("STAR");
    }
  };

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setShowDropdown(false), 200);
  };

  const Icon = currentReaction ? reactionIconMap[currentReaction] : Star;
  const textColor = currentReaction ? reactionColorMap[currentReaction] : "text-gray-400";

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        variant="ghost"
        size="sm"
        className={`flex items-center space-x-1 ${textColor}`}
        onClick={handleClick}
        disabled={disabled}
      >
        <Icon className="h-4 w-4" />
        {currentReaction && count !== undefined && <span>{count}</span>}
      </Button>

      {showDropdown && (
        <div className="absolute z-50 mb-1 left-0 bottom-full bg-white border shadow rounded p-1 flex flex-row space-x-1">
          {(Object.keys(reactionIconMap) as ReactionType[]).map((type) => {
            const ReactionIcon = reactionIconMap[type];
            return (
              <div
                key={type}
                onClick={() => {
                  onReact(type);
                  setShowDropdown(false);
                }}
                className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded flex items-center"
              >
                <ReactionIcon className={`mr-2 h-4 w-4 ${reactionColorMap[type]}`} />
                {type}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

