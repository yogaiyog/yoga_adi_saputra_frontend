"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type LoadingNavLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
  loadingLabel?: string;
};

export default function LoadingNavLink({
  children,
  className,
  href,
  loadingLabel = "Loading...",
  ...props
}: LoadingNavLinkProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Link
      {...props}
      href={href}
      onClick={(event) => {
        event.preventDefault();
        startTransition(() => {
          router.push(String(href));
        });
      }}
      aria-busy={isPending}
      className={className}
    >
      {isPending ? loadingLabel : children}
    </Link>
  );
}
