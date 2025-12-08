
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      style={{
        width: "16px",        // force exact size
        height: "16px",
        minWidth: "16px",
        minHeight: "16px",
      }}
      className={cn(
        "peer rounded-[3px] border border-input shadow-xs bg-white dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground flex items-center justify-center transition-all disabled:cursor-not-allowed disabled:opacity-50",className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <CheckIcon className="h-3 w-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }



