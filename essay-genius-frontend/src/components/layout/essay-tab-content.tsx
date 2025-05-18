import { EssayScoredResponse } from "@/constracts/essay.constract";
import { EssayDetail } from "./essay-detail";
import { EssayItem } from "./essay-item";
import { PaginationControls } from "./pagination-control";

export function EssayTabContent({
  selectedEssay,
  setSelectedEssay,
  userEssays,
  tab,
  deleteEssay,
  newComment,
  setNewComment,
  handleAddComment,
  showComments,
  setShowComments,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
}: {
  selectedEssay: string | null;
  setSelectedEssay: (id: string | null) => void;
  userEssays: EssayScoredResponse[];
  tab: string;
  deleteEssay: (id: string) => void;
  newComment: string;
  setNewComment: (c: string) => void;
  handleAddComment: (id: string) => void;
  showComments: boolean;
  setShowComments: (s: boolean) => void;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}) {
  const filteredEssays =
    tab === "all"
      ? userEssays
      : userEssays.filter((e) => e.visibility === tab.toUpperCase());

  return selectedEssay !== null ? (
    <EssayDetail
      key={selectedEssay}
      essay={filteredEssays.find((e) => e.id === selectedEssay)!}
      onBack={() => setSelectedEssay(null)}
      onDelete={deleteEssay}
      newComment={newComment}
      setNewComment={setNewComment}
      handleAddComment={handleAddComment}
      showComments={showComments}
      setShowComments={setShowComments}
    />
  ) : (
    <>
      {filteredEssays.map((essay) => (
        <EssayItem
          key={essay.id}
          essay={essay}
          onView={() => setSelectedEssay(essay.id)}
          onDelete={deleteEssay}
        />
      ))}

      {/* Pagination */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}

