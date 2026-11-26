"use client";

import { useEffect } from "react";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";
import { Button, ButtonLink } from "@/components/button";
import { Container } from "@/components/container";

export default function ErrorPage({
  error,
  unstable_retry,
  reset,
}: {
  error: Error & { digest?: string };
  unstable_retry?: () => void;
  reset?: () => void;
}) {
  useEffect(() => {
    // Hook an error reporting service in here if one is added later.
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <section className="bg-night relative isolate flex min-h-[100svh] items-center overflow-hidden py-24 text-white md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-grid-night mask-fade-y absolute inset-0 opacity-60" />
        <div className="bg-lamp-red absolute top-1/3 left-1/2 size-[30rem] -translate-x-1/2 rounded-full opacity-20 blur-[120px]" />
      </div>

      <Container className="flex flex-col items-center text-center">
        <span className="border-night-line bg-night-2 text-lamp-orange relative flex size-16 items-center justify-center rounded-2xl border">
          <span className="animate-pulse-ring absolute inset-0 rounded-2xl border border-lamp-orange/40 motion-reduce:hidden" />
          <IconAlertTriangle className="size-8" aria-hidden="true" />
        </span>
        <p className="font-dm-mono text-night-muted mt-8 text-xs tracking-[0.3em] uppercase">
          Unexpected error
        </p>
        <h1 className="font-display mt-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
          Pressure spike detected.
        </h1>
        <p className="text-night-muted mt-4 max-w-xl text-base sm:text-lg">
          Something went wrong while loading this page. Try again, or head back home while we
          bleed off the pressure.
        </p>
        {error.digest ? (
          <p className="text-night-muted/70 mt-3 font-mono text-xs">Reference: {error.digest}</p>
        ) : null}

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          {retry ? (
            <Button type="button" variant="flame" onClick={() => retry()}>
              <IconRefresh className="size-4" aria-hidden="true" />
              Try again
            </Button>
          ) : null}
          <ButtonLink href="/" variant="ghost-light">
            Back to home
          </ButtonLink>
          <ButtonLink href="/contact" variant="ghost-light">
            Contact us
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
