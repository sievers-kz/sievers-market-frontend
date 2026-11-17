"use client";

import { Controller, useFormContext } from "react-hook-form";

import { FormField } from "@/components/auth/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  parseOptions,
  parseUnitLabel,
  type AttributeField,
  type ListingFormValues,
} from "./listing-schema";
import { parseHexColor } from "./parse-hex-color";
import { SelectField, type SelectOption } from "./select-field";

/** `hex` есть только у справочника цветов (`ColorResponse`). */
export type ReferenceSources = Record<
  string,
  readonly { id: string; name: string; hex?: string }[]
>;

interface AttributeFieldInputProps {
  field: AttributeField;
  references: ReferenceSources;
}

export function AttributeFieldInput({ field, references }: AttributeFieldInputProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ListingFormValues>();
  const name = `attributes.${field.key}` as const;
  const id = `attr-${field.key}`;
  const error = errors.attributes?.[field.key]?.message;
  const describedBy = error ? `${id}-error` : undefined;

  if (field.type === "boolean") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Controller
            control={control}
            name={name}
            render={({ field: controlled }) => (
              <Checkbox
                id={id}
                ref={controlled.ref}
                checked={controlled.value === true}
                onCheckedChange={(checked) => controlled.onChange(checked === true)}
                onBlur={controlled.onBlur}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
              />
            )}
          />
          <Label htmlFor={id}>{field.label}</Label>
        </div>
        {error && (
          <p id={`${id}-error`} className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (field.type === "enumerate" || field.type === "reference") {
    const source = field.type === "reference" && field.source ? references[field.source] : undefined;
    const options: SelectOption[] =
      field.type === "enumerate"
        ? parseOptions(field.options).map((option) => ({ value: option.key, label: option.label }))
        : (source ?? []).map((item) => ({
            value: item.id,
            label: item.name,
            swatch: field.source === "color" ? parseHexColor(item.hex) : undefined,
          }));
    const unavailable = field.type === "reference" && !source;

    return (
      <FormField id={id} label={field.label} required={field.required} error={error}>
        <Controller
          control={control}
          name={name}
          render={({ field: controlled }) => (
            <SelectField
              id={id}
              triggerRef={controlled.ref}
              value={typeof controlled.value === "string" ? controlled.value : ""}
              onChange={controlled.onChange}
              onBlur={controlled.onBlur}
              options={options}
              placeholder={unavailable ? "Справочник недоступен" : "Выберите"}
              allowEmpty={!field.required}
              disabled={unavailable}
              invalid={Boolean(error)}
              describedBy={describedBy}
            />
          )}
        />
      </FormField>
    );
  }

  const numeric = field.type === "integer" || field.type === "float";
  const unit = parseUnitLabel(field.unit);

  return (
    <FormField id={id} label={field.label} required={field.required} error={error}>
      <div className="relative">
        <Input
          id={id}
          type={numeric ? "number" : "text"}
          inputMode={field.type === "integer" ? "numeric" : field.type === "float" ? "decimal" : undefined}
          step={field.type === "integer" ? 1 : field.type === "float" ? "any" : undefined}
          className={unit ? "pr-16" : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...register(name)}
        />
        {unit && (
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
    </FormField>
  );
}
