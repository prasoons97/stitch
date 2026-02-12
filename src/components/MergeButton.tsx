interface MergeButtonProps {
  disabled: boolean;
  loading: boolean;
  onMerge: () => void;
}

function MergeButton({ disabled, loading, onMerge }: MergeButtonProps) {
  return (
    <button
      type="button"
      onClick={onMerge}
      disabled={disabled || loading}
      aria-busy={loading}
      className="button-primary w-full sm:w-auto"
    >
      {loading ? 'Merging PDFs...' : 'Generate Merged PDF'}
    </button>
  );
}

export default MergeButton;
