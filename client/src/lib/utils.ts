import { toast } from "@/components/ui/use-toast";
import { EntityError } from "@/lib/http";
import { type ClassValue, clsx } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((e) => {
      setError(e.field, {
        type: "server",
        message: e.message,
      });
    });
  } else {
    toast({
      title: "Error",
      description: error.payload.message ?? "An error occurred",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};
