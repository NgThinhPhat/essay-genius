"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useState } from "react";
import { PageReactionRequest, pageReactionResponseSchema } from "@/constracts/interaction.contrast";

interface ReactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetId: string;
}

const reactionTabs = [
  { key: "all", label: "All", icon: "" },
  { key: "STAR", label: "Star", icon: "⭐" },
  { key: "LOVE", label: "Love", icon: "❤️" },
  { key: "HAHA", label: "Haha", icon: "😂" },
  { key: "WOW", label: "Wow", icon: "😮" },
  { key: "FIRE", label: "Fire", icon: "🔥" },
  { key: "SAD", label: "Sad", icon: "😢" },
] as const;

type ReactionTab = typeof reactionTabs[number]["key"];

function useReactions(params: PageReactionRequest, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["reactions", params.targetId, params.reactionType],
    queryFn: async ({ pageParam = 0 }) => {
      const { status, body } = await api.interaction.getReactions({
        query: {
          targetId: params.targetId,
          reactionType: params.reactionType,
          page: pageParam,
          size: params.size,
        },
      });

      if (status !== 200) {
        console.error("Fetch reactions failed", body);
        throw new Error((body as any)?.message || "Failed to fetch reactions");
      }

      return body;
    },
    enabled,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.pageable.pageNumber + 1),
  });
}

export default function ReactionDialog({ open, onOpenChange, targetId }: ReactionDialogProps) {
  const [activeTab, setActiveTab] = useState<ReactionTab>("all");

  const {
    data,
    isLoading,
    isFetching,
  } = useReactions({
    targetId,
    reactionType: activeTab === "all" ? undefined : activeTab,
    size: 10,
  }, open);

  const allReactions = data?.pages.flatMap((page) => page.content) ?? [];

  const findReactionIcon = (type: string) => {
    const tab = reactionTabs.find((t) => t.key === type);
    return tab?.icon || "";
  };

  const findReactionLabel = (type: string) => {
    const tab = reactionTabs.find((t) => t.key === type);
    return tab?.label || "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reactions</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ReactionTab)}
          className="w-full mt-4"
        >
          <TabsList className="grid grid-cols-4 sm:grid-cols-7 gap-1">
            {reactionTabs.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.icon && <span className="mr-1">{tab.icon}</span>}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {reactionTabs.map((tab) => (
            <TabsContent key={tab.key} value={tab.key}>
              <div className="mt-4 space-y-4 max-h-[400px] overflow-y-auto">
                {isLoading || isFetching ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex space-x-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : allReactions.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    No {tab.icon} {tab.label} reactions yet.
                  </div>
                ) : (
                  allReactions.map((reaction) => (
                    <div key={reaction.id} className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={reaction.user.avatar || "/placeholder.svg"}
                          alt={`${reaction.user.firstName} ${reaction.user.lastName}`}
                        />
                        <AvatarFallback>
                          {reaction.user.firstName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {`${reaction.user.firstName} ${reaction.user.lastName}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(reaction.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="text-lg">
                        {findReactionIcon(reaction.type)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

