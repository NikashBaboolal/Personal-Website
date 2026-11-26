"use client";

import { AnimatePresence, motion } from "motion/react";
import { IconAlertCircle, IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const fieldBase =
  "peer block w-full rounded-2xl border bg-surface text-base text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-transparent focus:border-lamp-orange focus:shadow-[0_0_0_4px_rgba(247,147,30,0.15)]";

const labelBase =
  "pointer-events-none absolute left-4 origin-left text-muted-foreground transition-all duration-200";

/** Label floats when the field is focused or filled (`placeholder=" "` trick). */
const floatingLabel =
  "top-1/2 -translate-y-1/2 text-base peer-focus:top-3.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-lamp-orange peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs";

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          key="error"
          id={id}
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-lamp-red flex items-center gap-1.5 overflow-hidden pt-2 pl-1 text-sm font-medium"
        >
          <IconAlertCircle aria-hidden="true" className="size-4 shrink-0" />
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

type Common = {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
};

function LabelText({ label, optional }: { label: string; optional?: boolean }) {
  return (
    <>
      {label}
      {optional ? <span className="ml-1 opacity-60">(optional)</span> : null}
    </>
  );
}

export function TextField({
  id,
  label,
  error,
  optional,
  className,
  ...input
}: Common & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "placeholder">) {
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <div className="relative">
        <input
          id={id}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            fieldBase,
            "h-14 px-4 pt-5 pb-1.5",
            error ? "border-lamp-red/60" : "border-line hover:border-foreground/25",
          )}
          {...input}
        />
        <label htmlFor={id} className={cn(labelBase, floatingLabel)}>
          <LabelText label={label} optional={optional} />
        </label>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  error,
  optional,
  className,
  hint,
  ...input
}: Common & { hint?: React.ReactNode } & Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "id" | "placeholder"
  >) {
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <div className="relative">
        <textarea
          id={id}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            fieldBase,
            "min-h-40 resize-y px-4 pt-8 pb-3 leading-relaxed",
            error ? "border-lamp-red/60" : "border-line hover:border-foreground/25",
          )}
          {...input}
        />
        <label
          htmlFor={id}
          className={cn(
            labelBase,
            "top-5 text-base peer-focus:top-3 peer-focus:text-xs peer-focus:text-lamp-orange peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs",
          )}
        >
          <LabelText label={label} optional={optional} />
        </label>
        {hint ? (
          <span className="text-muted-foreground font-dm-mono pointer-events-none absolute right-4 bottom-3 text-[0.7rem] tracking-wider">
            {hint}
          </span>
        ) : null}
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  error,
  className,
  children,
  ...select
}: Common & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id">) {
  const errorId = `${id}-error`;
  return (
    <div className={className}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            fieldBase,
            "h-14 cursor-pointer appearance-none px-4 pt-5 pb-1.5 pr-12",
            error ? "border-lamp-red/60" : "border-line hover:border-foreground/25",
          )}
          {...select}
        >
          {children}
        </select>
        <label
          htmlFor={id}
          className={cn(labelBase, "peer-focus:text-lamp-orange top-3.5 text-xs")}
        >
          {label}
        </label>
        <IconChevronDown
          aria-hidden="true"
          className="text-muted-foreground peer-focus:text-lamp-orange pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 transition-colors"
        />
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}
