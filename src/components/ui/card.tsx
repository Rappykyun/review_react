import * as React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return <div className={className} {...props} />;
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={className} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={className} {...props} />;
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={className} {...props} />;
}
