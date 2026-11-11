"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useEffect, useMemo, useState } from "react";
import {
  Controller,
  FormProvider,
  get,
  useForm,
  type FieldErrors,
  type Path,
} from "react-hook-form";

import { FormField } from "@/components/auth/form-field";
import { FormMessage } from "@/components/auth/form-message";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  applyApiErrorToForm,
  createListing,
  ERROR_CODES,
  getCreatedListingId,
  isApiError,
  showFormError,
  type FieldError,
} from "@/lib/api";

import { AttributeFieldInput, type ReferenceSources } from "./attribute-field-input";
import { FormSection } from "./form-section";
import { ImageUploader } from "./image-uploader";
import {
  buildListingSchema,
  CURRENCIES,
  emptyAttributeValues,
  type AttributeGroup,
  type ListingFormOutput,
  type ListingFormValues,
} from "./listing-schema";
import type { ListingPreviewFields } from "./listing-preview-data";
import { ListingPreviewWatcher } from "./listing-preview-watcher";
import { ORGANIZATION_FIELD_ID } from "./organization-select";
import { SelectField } from "./select-field";
import type { ImageUploads } from "./use-image-uploads";

type FieldName = Path<ListingFormValues>;

interface OrderedField {
  name: FieldName;
  /** id элемента в DOM: на него ставится фокус при ошибке. */
  domId: string;
  /** Секция аккордеона; `null` у поля вне формы (организация). */
  section: string | null;
}

const STATIC_FIELDS = ["organization_id", "title", "price", "currency", "city_id", "description"] as const;

const CURRENCY_OPTIONS = CURRENCIES.map((code) => ({ value: code, label: code }));

/** Организацию удалили или она потеряла подтверждение после загрузки страницы. */
const ORGANIZATION_ERRORS: Record<string, string> = {
  [ERROR_CODES.organizationNotFound]:
    "Организация не найдена: возможно, её удалили. Выберите другую организацию.",
  [ERROR_CODES.organizationCannotPublish]:
    "Организация не подтверждена, от её имени нельзя подать объявление. Выберите другую организацию.",
};

interface ListingFormProps {
  /** Выбор живёт над формой (`OrganizationSelect`); `""`, пока ничего не выбрано. */
  organizationId: string;
  /** Ошибка поля организации: поле стоит вне формы и показывает её само. */
  onOrganizationError: (message: string | undefined) => void;
  onOrganizationsStale: () => void;
  categoryId: string;
  subcategoryId: string;
  /** Уже отсортированы по `position`. */
  groups: AttributeGroup[];
  cities: readonly { id: string; name: string }[];
  references: ReferenceSources;
  /** Фото принадлежат странице, а не форме: переживают смену подкатегории. */
  uploads: ImageUploads;
  /** Поля превью (название, цена, валюта, город); колбэк должен быть стабильным. */
  onPreviewChange: (fields: ListingPreviewFields) => void;
}

/** `memo`: обновление превью во Flow не перерисовывает форму. */
export const ListingForm = memo(function ListingForm({
  organizationId,
  onOrganizationError,
  onOrganizationsStale,
  categoryId,
  subcategoryId,
  groups,
  cities,
  references,
  uploads,
  onPreviewChange,
}: ListingFormProps) {
  const router = useRouter();
  const [published, setPublished] = useState(false);

  const schema = useMemo(() => buildListingSchema(groups, references), [groups, references]);
  const form = useForm<ListingFormValues, unknown, ListingFormOutput>({
    resolver: zodResolver(schema),
    defaultValues: {
      organization_id: organizationId,
      title: "",
      price: "",
      currency: "KZT",
      city_id: "",
      description: "",
      gallery: [],
      attributes: emptyAttributeValues(groups),
    },
    // Фокус ставим сами: поле может быть в свёрнутом аккордеоне.
    shouldFocusError: false,
  });
  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful, isSubmitted },
  } = form;

  /** Поля в порядке на странице: для раскрытия секций и фокуса на первой ошибке. */
  const orderedFields = useMemo<OrderedField[]>(
    () => [
      { name: "organization_id", domId: ORGANIZATION_FIELD_ID, section: null },
      { name: "title", domId: "title", section: "params" },
      { name: "price", domId: "price", section: "params" },
      { name: "currency", domId: "currency", section: "params" },
      { name: "city_id", domId: "city_id", section: "params" },
      ...groups.flatMap((group) =>
        group.fields.map((field) => ({
          name: `attributes.${field.key}` as const,
          domId: `attr-${field.key}`,
          section: `group-${group.key}`,
        })),
      ),
      { name: "gallery", domId: "gallery-dropzone", section: "images" },
      { name: "description", domId: "description", section: "description" },
    ],
    [groups],
  );
  const allSections = useMemo(
    () => ["params", ...groups.map((group) => `group-${group.key}`), "images", "description"],
    [groups],
  );
  const [openSections, setOpenSections] = useState<string[]>(allSections);
  /** Новый объект на каждую попытку: эффект сработает и при той же цели. */
  const [focusTarget, setFocusTarget] = useState<{ id: string } | null>(null);

  // В галерею формы попадают только подтверждённые файлы.
  useEffect(() => {
    setValue("gallery", uploads.gallery, { shouldValidate: isSubmitted });
  }, [uploads.gallery, isSubmitted, setValue]);

  useEffect(() => {
    setValue("organization_id", organizationId, { shouldValidate: isSubmitted });
  }, [organizationId, isSubmitted, setValue]);

  const organizationError = errors.organization_id?.message;
  useEffect(() => {
    onOrganizationError(organizationError);
  }, [organizationError, onOrganizationError]);
  // Форма пересоздаётся при смене подкатегории: ошибка старой формы не должна остаться.
  useEffect(() => () => onOrganizationError(undefined), [onOrganizationError]);

  // Фокус после того, как раскрытая секция смонтировала поле.
  useEffect(() => {
    if (!focusTarget) return;
    const element = document.getElementById(focusTarget.id);
    element?.focus({ preventScroll: true });
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focusTarget]);

  function revealErrors(failing: readonly FieldName[]) {
    const fields = orderedFields.filter((field) => failing.includes(field.name));
    if (fields.length === 0) return;
    const sections = new Set(
      fields.flatMap((field) => (field.section === null ? [] : [field.section])),
    );
    setOpenSections((prev) => [...new Set([...prev, ...sections])]);
    setFocusTarget({ id: fields[0].domId });
  }

  function onInvalid(fieldErrors: FieldErrors<ListingFormValues>) {
    revealErrors(orderedFields.filter((field) => get(fieldErrors, field.name)).map((f) => f.name));
  }

  const attributeKeys = useMemo(
    () => new Set(groups.flatMap((group) => group.fields.map((field) => field.key))),
    [groups],
  );

  /** Поле формы по ошибке бэкенда; атрибуты приходят с путём `attributes.<ключ>`. */
  function resolveField({ path }: FieldError): FieldName | undefined {
    const [head, key] = path.split(".");
    if (head === "attributes") {
      return key && attributeKeys.has(key) ? `attributes.${key}` : undefined;
    }
    if (head === "gallery") return "gallery";
    return (STATIC_FIELDS as readonly string[]).includes(path) ? (path as FieldName) : undefined;
  }

  async function onSubmit(values: ListingFormOutput) {
    const attributes = Object.fromEntries(
      Object.entries(values.attributes).filter(([, value]) => value !== undefined),
    );

    let response: unknown;
    try {
      response = await createListing({
        organization_id: values.organization_id,
        category_id: categoryId,
        subcategory_id: subcategoryId,
        title: values.title,
        price: values.price,
        currency: values.currency,
        city_id: values.city_id,
        description: values.description,
        gallery: values.gallery,
        attributes,
      });
    } catch (error) {
      if (!isApiError(error)) {
        showFormError(error, setError);
        return;
      }
      const organizationMessage = error.errorCode ? ORGANIZATION_ERRORS[error.errorCode] : undefined;
      if (organizationMessage) {
        setError("root", { type: "server", message: organizationMessage });
        onOrganizationsStale();
        return;
      }
      const resolved = error.fieldErrors.map((item) => resolveField(item));
      const mapped = resolved.filter((name): name is FieldName => Boolean(name));
      const unresolved = error.fieldErrors.filter((_, index) => !resolved[index]);
      applyApiErrorToForm(error, setError, { resolveField });
      if (unresolved.length > 0) {
        // Ошибки полей, которых нет в форме (например, category_id), показываем как есть.
        setError("root", {
          type: "server",
          message: unresolved
            .map((item) => (item.path ? `${item.path}: ${item.message}` : item.message))
            .join("; "),
        });
      } else if (mapped.length === 0) {
        showFormError(error, setError);
      }
      revealErrors(mapped);
      return;
    }

    const id = getCreatedListingId(response);
    if (!id) {
      // Объявление уже создано: повторная отправка сделала бы дубль.
      setPublished(true);
      setError("root", {
        type: "server",
        message: "Объявление опубликовано, но не удалось открыть его страницу. Найдите его в каталоге.",
      });
      return;
    }
    router.push(`/listing/${id}`);
  }

  const pending = isSubmitting || isSubmitSuccessful || published;
  const sectionHasError = (section: string) =>
    orderedFields.some((field) => field.section === section && get(errors, field.name));

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="flex flex-col gap-6"
      >
        <ListingPreviewWatcher control={control} onChange={onPreviewChange} />
        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={setOpenSections}
          className="flex flex-col gap-4"
        >
          <FormSection value="params" title="Параметры объявления" hasError={sectionHasError("params")}>
            <FormField id="title" label="Заголовок" required error={errors.title?.message}>
              <Input
                id="title"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : undefined}
                {...register("title")}
              />
            </FormField>

            <div className="flex gap-4">
              <div className="min-w-0 flex-1">
                <FormField id="price" label="Цена" required error={errors.price?.message}>
                  <Input
                    id="price"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    aria-invalid={Boolean(errors.price)}
                    aria-describedby={errors.price ? "price-error" : undefined}
                    {...register("price")}
                  />
                </FormField>
              </div>
              <div className="w-32">
                <FormField id="currency" label="Валюта" error={errors.currency?.message}>
                  <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => (
                      <SelectField
                        id="currency"
                        triggerRef={field.ref}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        options={CURRENCY_OPTIONS}
                        invalid={Boolean(errors.currency)}
                      />
                    )}
                  />
                </FormField>
              </div>
            </div>

            <FormField id="city_id" label="Город" required error={errors.city_id?.message}>
              <Controller
                control={control}
                name="city_id"
                render={({ field }) => (
                  <SelectField
                    id="city_id"
                    triggerRef={field.ref}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    options={cities.map((city) => ({ value: city.id, label: city.name }))}
                    placeholder="Выберите город"
                    invalid={Boolean(errors.city_id)}
                    describedBy={errors.city_id ? "city_id-error" : undefined}
                  />
                )}
              />
            </FormField>
          </FormSection>

          {groups.map((group) => (
            <FormSection
              key={group.key}
              value={`group-${group.key}`}
              title={group.label}
              hasError={sectionHasError(`group-${group.key}`)}
            >
              {group.fields.map((field) => (
                <AttributeFieldInput key={field.key} field={field} references={references} />
              ))}
            </FormSection>
          ))}

          <FormSection value="images" title="Изображения" hasError={sectionHasError("images")}>
            <Controller
              control={control}
              name="gallery"
              render={({ field }) => (
                <ImageUploader
                  dropzoneId="gallery-dropzone"
                  dropzoneRef={field.ref}
                  items={uploads.items}
                  rejections={uploads.rejections}
                  error={errors.gallery?.message ?? errors.gallery?.root?.message}
                  onAdd={uploads.addFiles}
                  onRetry={uploads.retry}
                  onRemove={uploads.remove}
                />
              )}
            />
          </FormSection>

          <FormSection value="description" title="Описание" hasError={sectionHasError("description")}>
            <FormField id="description" label="Описание" error={errors.description?.message}>
              <Textarea
                id="description"
                className="min-h-32"
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? "description-error" : undefined}
                {...register("description")}
              />
            </FormField>
          </FormSection>
        </Accordion>

        <FormMessage message={errors.root?.message} />

        <div className="flex flex-col gap-2">
          {/* Без блокировки по заполненности: ошибки показываются по нажатию. */}
          <Button
            type="submit"
            size="lg"
            className="w-full bg-cta text-cta-foreground hover:bg-cta/90"
            disabled={pending || uploads.isUploading}
            aria-busy={pending}
          >
            {pending && <LoaderCircle className="animate-spin" aria-hidden />}
            {pending ? "Публикация…" : "Опубликовать"}
          </Button>
          {uploads.isUploading && !pending && (
            <p className="text-center text-sm text-muted-foreground">
              Дождитесь окончания загрузки фото
            </p>
          )}
        </div>
      </form>
    </FormProvider>
  );
});
