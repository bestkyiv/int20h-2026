import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/util/utils";

export interface LabelProps
  extends React.ComponentProps<typeof LabelPrimitive.Root> {
  pixelated?: boolean;
}

function Label({ className, pixelated, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-md flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        pixelated ? "font-pixelated" : "",
        className
      )}
      {...props}
    />
  );
}

export { Label };
