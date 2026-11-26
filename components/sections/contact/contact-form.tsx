"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import {
  IconArrowRight,
  IconCheck,
  IconCopy,
  IconLoader2,
  IconMail,
  IconRefresh,
} from "@tabler/icons-react";
import { buttonClasses } from "@/components/button";
import { person } from "@/lib/content";
import { cn } from "@/lib/utils";
import {
  GENERAL_ENQUIRY,
  topics,
  composeDetails,
  emptyValues,
  validate,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from "./contact-schema";
import { SelectField, TextAreaField, TextField } from "./form-field";

const ease = [0.22, 1, 0.36, 1] as const;
const FIELD_ORDER: ContactField[] = ["name", "company", "email", "phone", "product", "message"];

type Status = "idle" | "sending" | "opened";

function resolveProduct(slug: string | null | undefined) {
  return slug && topics.some((t) => t.slug === slug) ? slug : GENERAL_ENQUIRY;
}

/** Reads `?topic=<slug>` — must be rendered inside <Suspense>. */
export function ContactFormWithParams() {
  const params = useSearchParams();
  const product = resolveProduct(params.get("topic"));
  return <ContactForm key={product} initialProduct={product} />;
}

export function ContactForm({ initialProduct }: { initialProduct?: string }) {
  const reduce = useReducedMotion();
  const [values, setValues] = useState<ContactValues>(() => ({
    ...emptyValues,
    product: resolveProduct(initialProduct),
  }));
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [details, setDetails] = useState<ReturnType<typeof composeDetails> | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const allErrors = validate(values);
  const errors: ContactErrors = {};
  for (const key of FIELD_ORDER) {
    if ((submitted || touched[key]) && allErrors[key]) errors[key] = allErrors[key];
  }

  const update =
    (key: ContactField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));
  const blur = (key: ContactField) => () => setTouched((t) => ({ ...t, [key]: true }));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    setSubmitted(true);
    const firstInvalid = FIELD_ORDER.find((k) => allErrors[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#contact-${firstInvalid}`)?.focus();
      return;
    }
    const composed = composeDetails(values);
    setDetails(composed);
    setStatus("sending");
    timer.current = window.setTimeout(
      () => {
        window.location.href = composed.href;
        setStatus("opened");
      },
      reduce ? 50 : 900,
    );
  };

  const reset = () => {
    setValues({ ...emptyValues, product: values.product });
    setTouched({});
    setSubmitted(false);
    setDetails(null);
    setStatus("idle");
  };

  const errorCount = Object.keys(errors).length;

  return (
    <div className="border-line bg-surface relative overflow-hidden rounded-3xl border p-6 shadow-[0_40px_80px_-50px_rgba(11,12,31,0.45)] md:p-10">
      <div
        aria-hidden="true"
        className="bg-flame pointer-events-none absolute -top-24 -right-24 size-64 rounded-full opacity-[0.12] blur-3xl"
      />
      <AnimatePresence mode="wait" initial={false}>
        {status === "opened" && details ? (
          <SuccessPanel key="opened" details={details} onReset={reset} />
        ) : (
          <motion.div
            key="form"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease }}
            className="relative"
          >
            <p className="font-dm-mono text-muted-foreground text-xs tracking-[0.2em] uppercase">
              Send a message
            </p>
            <h2 className="font-display text-foreground mt-3 text-3xl leading-tight font-extrabold tracking-tight md:text-4xl">
              Get in touch
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg text-base leading-relaxed">
              Fill in the form and I&apos;ll have an email ready in your mail app with everything
              included, ready for you to send.
            </p>

            <form ref={formRef} noValidate onSubmit={onSubmit} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                id="contact-name"
                label="Full name"
                autoComplete="name"
                required
                value={values.name}
                onChange={update("name")}
                onBlur={blur("name")}
                error={errors.name}
              />
              <TextField
                id="contact-company"
                label="Organisation"
                optional
                autoComplete="organization"
                value={values.company}
                onChange={update("company")}
                onBlur={blur("company")}
                error={errors.company}
              />
              <TextField
                id="contact-email"
                label="Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={values.email}
                onChange={update("email")}
                onBlur={blur("email")}
                error={errors.email}
              />
              <TextField
                id="contact-phone"
                label="Phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                optional
                value={values.phone}
                onChange={update("phone")}
                onBlur={blur("phone")}
                error={errors.phone}
              />
              <SelectField
                id="contact-product"
                label="What is it about?"
                className="sm:col-span-2"
                value={values.product}
                onChange={update("product")}
                onBlur={blur("product")}
                error={errors.product}
              >
                {topics.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.title}
                  </option>
                ))}
              </SelectField>
              <TextAreaField
                id="contact-message"
                label="Your message"
                className="sm:col-span-2"
                required
                rows={5}
                maxLength={4000}
                value={values.message}
                onChange={update("message")}
                onBlur={blur("message")}
                error={errors.message}
                hint={`${values.message.length}/4000`}
              />

              <div className="mt-2 flex flex-col-reverse gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-muted-foreground text-sm" aria-live="polite">
                  {submitted && errorCount > 0
                    ? `Please fix ${errorCount} ${errorCount === 1 ? "field" : "fields"} above.`
                    : `Opens your email app, addressed to ${person.email}.`}
                </p>
                <SubmitButton status={status} />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubmitButton({ status }: { status: Status }) {
  const sending = status === "sending";
  return (
    <motion.button
      type="submit"
      layout
      disabled={sending}
      aria-busy={sending}
      whileTap={{ scale: 0.97 }}
      className={buttonClasses(
        "flame",
        cn("h-12 min-w-48 shrink-0 px-7 text-base disabled:cursor-wait", sending && "opacity-90"),
      )}
    >
      {/* shimmer sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/40 opacity-0 blur-md transition-all duration-700 group-hover/btn:left-[120%] group-hover/btn:opacity-100"
      />
      <AnimatePresence mode="wait" initial={false}>
        {sending ? (
          <motion.span
            key="sending"
            className="relative inline-flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <IconLoader2 aria-hidden="true" className="size-4 animate-spin" />
            Preparing email…
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            className="relative inline-flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            Send message
            <IconArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover/btn:translate-x-1"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function SuccessPanel({
  details,
  onReset,
}: {
  details: ReturnType<typeof composeDetails>;
  onReset: () => void;
}) {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState<"idle" | "copied" | "failed">("idle");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(details.plain);
      setCopied("copied");
    } catch {
      // Fallback: select the text so the user can copy manually.
      textRef.current?.focus();
      textRef.current?.select();
      setCopied("failed");
    }
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied("idle"), 2500);
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease }}
      className="relative"
    >
      <div className="relative grid size-16 place-items-center">
        {!reduce ? (
          <motion.span
            aria-hidden="true"
            className="bg-flame absolute inset-0 rounded-full"
            initial={{ scale: 0.6, opacity: 0.6 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", repeat: 2 }}
          />
        ) : null}
        <span className="bg-night relative grid size-16 place-items-center rounded-full">
          <svg viewBox="0 0 24 24" className="size-8" aria-hidden="true">
            <motion.path
              d="M5 12.5l4.5 4.5L19 7.5"
              fill="none"
              stroke="#ffd200"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease }}
            />
          </svg>
        </span>
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-foreground mt-8 text-3xl leading-tight font-extrabold tracking-tight outline-none md:text-4xl"
      >
        Check your email app
      </h2>
      <p className="text-muted-foreground mt-3 max-w-lg text-base leading-relaxed">
        Your email app should have opened with a message to{" "}
        <a href={`mailto:${person.email}`} className="text-foreground font-semibold underline underline-offset-4">
          {person.email}
        </a>{" "}
        titled <span className="text-foreground font-medium">“{details.subject}”</span>, ready for
        you to send. Nothing has been sent yet. If your email app didn&apos;t open, copy the
        details below and email them to me.
      </p>

      <label htmlFor="contact-details" className="sr-only">
        Your message details
      </label>
      <textarea
        id="contact-details"
        ref={textRef}
        readOnly
        value={details.plain}
        rows={Math.min(14, Math.max(8, details.plain.split("\n").length + 1))}
        className="border-line bg-background text-foreground/80 focus:border-lamp-orange mt-6 block w-full resize-none rounded-2xl border p-4 font-mono text-xs leading-relaxed outline-none"
      />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="button" onClick={copy} className={buttonClasses("dark", "h-12 px-6")}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied}
              className="inline-flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              {copied === "copied" ? (
                <IconCheck aria-hidden="true" className="text-lamp-yellow size-4" />
              ) : (
                <IconCopy aria-hidden="true" className="size-4" />
              )}
              {copied === "copied"
                ? "Copied to clipboard"
                : copied === "failed"
                  ? "Press Ctrl/⌘ + C to copy"
                  : "Copy details"}
            </motion.span>
          </AnimatePresence>
        </button>
        <a href={details.href} className={buttonClasses("outline", "h-12 px-6")}>
          <IconMail aria-hidden="true" className="size-4" />
          Open email again
        </a>
        <button type="button" onClick={onReset} className={buttonClasses("outline", "h-12 px-6")}>
          <IconRefresh aria-hidden="true" className="size-4" />
          New message
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {copied === "copied" ? "Details copied to clipboard." : ""}
      </p>
    </motion.div>
  );
}
