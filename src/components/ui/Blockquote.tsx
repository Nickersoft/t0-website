import type React from "react";

import { Stack } from "@/components/ui/Stack";
import { Typography } from "./Typography";
import { Grid } from "./Grid";
import { Separator } from "./Separator";
import { cn } from "@/lib/utils";

interface BlockquoteAuthorProps extends React.ComponentProps<"div"> {
  name: string;
  title: string;
}
export function BlockquoteAuthor({
  title,
  className,
  name,
  ...props
}: BlockquoteAuthorProps) {
  return (
    <Grid
      {...props}
      className={cn("w-full", className)}
      columns="1fr auto 1fr"
      alignItems="center"
      gap="lg"
    >
      <Separator />

      <div className="text-center">
        <Typography variant="title" size="md">
          {name}
        </Typography>
        <Typography variant="body" color="muted" size="md">
          {title}
        </Typography>
      </div>

      <Separator />
    </Grid>
  );
}

interface BlockquoteProps extends React.ComponentProps<"div"> {}

export function Blockquote({ children, ...props }: BlockquoteProps) {
  return (
    <Stack
      {...props}
      align="center"
      gap="lg"
      className="text-center text-lg leading-relaxed"
      orientation="column"
    >
      {children}
    </Stack>
  );
}
