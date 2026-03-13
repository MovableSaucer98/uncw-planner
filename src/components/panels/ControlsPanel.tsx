import React from "react";

type Props = {
  loading: boolean;
  onGenerate: () => void;
  onRecalculate: () => void;
  onRevert: () => void;
  error: string | null;
};

export default function ControlsPanel({
  loading, onGenerate, onRecalculate, onRevert, error
}: Props) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Planning Controls</h2>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          onClick={onGenerate}
          className="px-3 py-2 rounded bg-blue-600 text-white text-sm"
          disabled={loading}
        >
          {loading ? "Generating…" : "Generate"}
        </button>
        <button
          onClick={onRecalculate}
          className="px-3 py-2 rounded bg-emerald-600 text-white text-sm"
          disabled={loading}
        >
          Recalculate
        </button>
        <button
          onClick={onRevert}
          className="px-3 py-2 rounded bg-gray-200 text-gray-900 text-sm"
          disabled={loading}
        >
          Revert
        </button>
      </div>

      <div className="mt-4">
        <label className="block text-xs text-gray-600 mb-1">Search</label>
        <input
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="Search courses…"
        />
      </div>

      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}
    </div>
  );
}
