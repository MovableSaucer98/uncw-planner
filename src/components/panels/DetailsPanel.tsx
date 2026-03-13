import React from "react";
import type { GridSection } from "../PlannerShell";

type Props = {
  selected: GridSection | null;
};

export default function DetailsPanel({ selected }: Props) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-lg mb-2">Course Details</h2>
      {!selected ? (
        <div className="text-sm text-gray-600">
          Select a class block on the schedule to see details.
        </div>
      ) : (
        <div className="text-sm">
          <div className="font-semibold text-gray-900">{selected.code}</div>
          <div className="text-gray-700">{selected.title}</div>
          <div className="mt-2 text-gray-600">
            Meets: {selected.days.join(", ")} {selected.start}–{selected.end}
          </div>
          {selected.credits != null && (
            <div className="mt-1 text-gray-600">Credits: {selected.credits}</div>
          )}
          {selected.meta?.section && (
            <div className="mt-3 text-gray-600">
              Section: {selected.meta.section} · CRN: {selected.meta.crn}
            </div>
          )}
          {selected.meta?.instructor && (
            <div className="mt-1 text-gray-600">
              Instructor: {selected.meta.instructor}
            </div>
          )}
          {selected.meta?.building && (
            <div className="mt-1 text-gray-600">
              Location: {selected.meta.building} {selected.meta.room}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
