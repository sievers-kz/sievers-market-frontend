"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";

import { FormField } from "@/components/auth/form-field";
import { FormMessage } from "@/components/auth/form-message";
import { TileRadioGroup } from "@/components/common/tile-radio-group";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  createOrganization,
  ERROR_CODES,
  isApiError,
  showFormError,
  type OrganizationListItem,
} from "@/lib/api";

import { ORGANIZATIONS_LOGIN_PATH } from "./login-path";
import { KIND_LABELS, KIND_ORDER, ORGANIZATIONS_TEXT } from "./organization-labels";
import {
  organizationSchema,
  TAX_ID_LENGTH,
  TAX_ID_RE,
  type OrganizationValues,
} from "./organization-schema";

const KIND_OPTIONS = KIND_ORDER.map((kind) => ({ value: kind, label: KIND_LABELS[kind].option }));
const TAX_ID_INPUT_ID = "organization-tax-id";

interface AddOrganizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 201: новая организация со статусом из ответа (`pending`). */
  onCreated: (organization: OrganizationListItem) => void;
}

export function AddOrganizationDialog({ open, onOpenChange, onCreated }: AddOrganizationDialogProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: { tax_id: "" },
  });

  const kind = useWatch({ control, name: "kind" });
  const taxId = useWatch({ control, name: "tax_id" });
  const ready = Boolean(kind) && TAX_ID_RE.test(taxId ?? "");
  const taxIdLabel = kind ? KIND_LABELS[kind].taxId : ORGANIZATIONS_TEXT.taxIdAnyLabel;
  const taxIdField = register("tax_id");

  async function onSubmit(values: OrganizationValues) {
    try {
      const created = await createOrganization(values);
      // Название и прочее подтянет первый ответ опроса `getOrganization`.
      onCreated({
        id: created.id,
        registry_status: created.registry_status,
        kind: values.kind,
        tax_id: values.tax_id,
        is_ownership_verified: false,
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        router.replace(ORGANIZATIONS_LOGIN_PATH);
        return;
      }
      if (isApiError(error) && error.errorCode === ERROR_CODES.organizationAlreadyExists) {
        setError("tax_id", { type: "server", message: ORGANIZATIONS_TEXT.alreadyExists }, { shouldFocus: true });
        return;
      }
      showFormError(error, setError, { fields: ["kind", "tax_id"] });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isSubmitting) return;
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ORGANIZATIONS_TEXT.addTitle}</DialogTitle>
          <DialogDescription>{ORGANIZATIONS_TEXT.addDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <TileRadioGroup
            legend={ORGANIZATIONS_TEXT.kindLegend}
            options={KIND_OPTIONS}
            error={errors.kind?.message}
            inputProps={register("kind")}
          />
          <FormField id={TAX_ID_INPUT_ID} label={taxIdLabel} error={errors.tax_id?.message}>
            <Input
              id={TAX_ID_INPUT_ID}
              inputMode="numeric"
              autoComplete="off"
              maxLength={TAX_ID_LENGTH}
              placeholder="123456789012"
              aria-invalid={Boolean(errors.tax_id)}
              aria-describedby={errors.tax_id ? `${TAX_ID_INPUT_ID}-error` : undefined}
              {...taxIdField}
              onChange={(event) => {
                event.target.value = event.target.value.replace(/\D/g, "");
                void taxIdField.onChange(event);
              }}
            />
          </FormField>
          <FormMessage message={errors.root?.message} />
          <Button
            type="submit"
            size="lg"
            className="w-full bg-cta text-cta-foreground hover:bg-cta/90"
            disabled={!ready || isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting && <LoaderCircle aria-hidden className="animate-spin" />}
            {isSubmitting ? ORGANIZATIONS_TEXT.submitPending : ORGANIZATIONS_TEXT.submit}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
