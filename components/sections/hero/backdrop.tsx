import { cn } from "@/lib/utils";

/**
 * Blueprint grid (like an engineering drawing sheet) with a radial mask so it
 * fades out from the top-centre. Fine 14px minor grid inside a 56px major grid.
 */
export function NightGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 mask-[radial-gradient(ellipse_75%_65%_at_50%_0%,black_10%,transparent_78%)]",
        className,
      )}
      style={{
        backgroundImage: [
          "linear-gradient(to right, rgba(94,234,212,0.07) 1px, transparent 1px)",
          "linear-gradient(to bottom, rgba(94,234,212,0.07) 1px, transparent 1px)",
          "linear-gradient(to right, rgba(94,234,212,0.025) 1px, transparent 1px)",
          "linear-gradient(to bottom, rgba(94,234,212,0.025) 1px, transparent 1px)",
        ].join(","),
        backgroundSize: "56px 56px, 56px 56px, 14px 14px, 14px 14px",
      }}
    />
  );
}

/** Dashed hairline in the stream teal, like a signal line on a P&ID. */
export function DashedRule({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "mask-fade-x h-px w-full bg-[repeating-linear-gradient(90deg,rgba(45,212,191,0.55)_0_8px,transparent_8px_16px)]",
        className,
      )}
    />
  );
}
