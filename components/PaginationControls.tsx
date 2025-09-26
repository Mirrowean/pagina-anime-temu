import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="flex justify-center items-center gap-4 my-8 text-text-primary">
      <button
        onClick={onPrevious}
        disabled={currentPage <= 1}
        className="px-4 py-2 bg-base-300 rounded-md font-semibold hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Go to previous page"
      >
        Previous
      </button>
      <span className="font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={!hasNextPage}
        className="px-4 py-2 bg-base-300 rounded-md font-semibold hover:bg-base-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Go to next page"
      >
        Next
      </button>
    </div>
  );
};
