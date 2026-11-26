// zod/mini: tree-shakeable functional API — keeps the contact route's JS small.
import * as z from "zod/mini";
import { person } from "@/lib/content";

export const GENERAL_ENQUIRY = "general";

/** Reasons someone might get in touch (select options). */
export const topics = [
  { slug: "opportunity", title: "Job or role opportunity" },
  { slug: "project", title: "Project or consulting" },
  { slug: "collaboration", title: "Collaboration or research" },
  { slug: GENERAL_ENQUIRY, title: "General enquiry" },
] as const;

export const contactSchema = z.object({
  name: z.string().check(
    z.trim(),
    z.minLength(2, { error: "Please enter your full name." }),
    // zod/mini ships no locale, so spell out classic zod's default message.
    z.maxLength(120, { error: "Too big: expected string to have <=120 characters" }),
  ),
  company: z.string().check(z.trim(), z.maxLength(160, { error: "Organisation name is too long." })),
  email: z.pipe(
    z.string().check(z.trim()),
    z.email({ error: "Please enter a valid email address." }),
  ),
  phone: z.string().check(
    z.trim(),
    z.refine((v) => v === "" || /^\+?[\d\s()-]{7,20}$/.test(v), {
      error: "Please enter a valid phone number.",
    }),
  ),
  product: z.string(),
  message: z.string().check(
    z.trim(),
    z.minLength(10, { error: "Tell us a little more (at least 10 characters)." }),
    z.maxLength(4000, { error: "Message is too long." }),
  ),
});

export type ContactValues = z.input<typeof contactSchema>;
export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const emptyValues: ContactValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  product: GENERAL_ENQUIRY,
  message: "",
};

export function topicLabel(slug: string) {
  return topics.find((t) => t.slug === slug)?.title ?? "General enquiry";
}

export function validate(values: ContactValues): ContactErrors {
  const result = contactSchema.safeParse(values);
  if (result.success) return {};
  const errors: ContactErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && key in values && !errors[key as ContactField]) {
      errors[key as ContactField] = issue.message;
    }
  }
  return errors;
}

export function composeDetails(values: ContactValues) {
  const v = contactSchema.parse(values);
  const topic = topicLabel(v.product);
  const subject = `${topic} – from ${v.name}`;
  const body = [
    `Name: ${v.name}`,
    `Organisation: ${v.company || "-"}`,
    `Email: ${v.email}`,
    `Phone: ${v.phone || "-"}`,
    `Topic: ${topic}`,
    "",
    "Message:",
    v.message,
  ].join("\r\n");
  const href = `mailto:${person.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const plain = `To: ${person.email}\nSubject: ${subject}\n\n${body.replace(/\r\n/g, "\n")}`;
  return { subject, body, href, plain };
}
