"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError } from "@/services/api/errors";

/** Maps an API error to a translated message and pushes field errors from the backend into the form. */
export function useSubmitError<T extends FieldValues>(setError?: UseFormSetError<T>) {
  const t = useTranslations("forms.errors");
  return useCallback(
    (error: unknown): string => {
      if (error instanceof ApiError) {
        if (error.fieldErrors && setError) {
          for (const [field, key] of Object.entries(error.fieldErrors)) setError(field as Path<T>, { type: "server", message: key });
        }
        if (error.isNetworkError) return t("network");
        if (error.fieldErrors && Object.keys(error.fieldErrors).length) return "";
        return error.message && error.status < 500 ? error.message : t("generic");
      }
      return t("generic");
    },
    [setError, t],
  );
}
