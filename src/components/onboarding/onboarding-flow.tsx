"use client";

import { useEffect, useRef, useState } from "react";

import type { Taxpayer } from "@/lib/api";

import { ChoiceStep } from "./choice-step";
import { CustomerForm } from "./customer-form";
import type { CustomerValues, VendorDetailsValues } from "./schemas";
import { SELLER_TYPES, type SellerType } from "./seller-types";
import { TaxIdStep } from "./tax-id-step";
import { TaxpayerConfirmStep } from "./taxpayer-confirm-step";
import { VendorDetailsStep } from "./vendor-details-step";

type Role = "customer" | "vendor";

type Step =
  | { name: "role" }
  | { name: "customer" }
  | { name: "seller-type" }
  | { name: "tax-id"; sellerType: SellerType; serverError?: string }
  | { name: "confirm"; sellerType: SellerType; taxpayer: Taxpayer }
  | { name: "details"; sellerType: SellerType; taxpayer: Taxpayer };

const ROLE_OPTIONS = [
  { value: "customer", label: "Я покупатель" },
  { value: "vendor", label: "Я продавец" },
] as const;

const SELLER_TYPE_OPTIONS = [
  { value: "individual", label: SELLER_TYPES.individual.label },
  { value: "legal_entity", label: SELLER_TYPES.legal_entity.label },
] as const;

/** Введённые данные живут только здесь: в URL и хранилища браузера они не попадают. */
export function OnboardingFlow() {
  const [step, setStep] = useState<Step>({ name: "role" });
  const [role, setRole] = useState<Role>();
  const [sellerType, setSellerType] = useState<SellerType>();
  const [taxId, setTaxId] = useState("");
  const [customerDraft, setCustomerDraft] = useState<CustomerValues>();
  const [vendorDraft, setVendorDraft] = useState<VendorDetailsValues>();

  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Кнопка прошлого шага исчезла вместе с фокусом: возвращаем его к новому шагу.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const container = containerRef.current;
    if (container && !container.contains(document.activeElement)) container.focus();
  }, [step.name]);

  function selectSellerType(value: SellerType) {
    if (value !== sellerType) setTaxId("");
    setSellerType(value);
    setStep({ name: "tax-id", sellerType: value });
  }

  return (
    <div ref={containerRef} tabIndex={-1} className="flex w-full max-w-md outline-none">
      {step.name === "role" && (
        <ChoiceStep
          title="Кто вы?"
          options={ROLE_OPTIONS}
          initialValue={role}
          onSelect={(value) => {
            setRole(value);
            setStep(value === "customer" ? { name: "customer" } : { name: "seller-type" });
          }}
        />
      )}
      {step.name === "customer" && (
        <CustomerForm
          initialValues={customerDraft}
          onBack={(values) => {
            setCustomerDraft(values);
            setStep({ name: "role" });
          }}
        />
      )}
      {step.name === "seller-type" && (
        <ChoiceStep
          title="Тип продавца"
          options={SELLER_TYPE_OPTIONS}
          initialValue={sellerType}
          onSelect={selectSellerType}
          onBack={() => setStep({ name: "role" })}
        />
      )}
      {step.name === "tax-id" && (
        <TaxIdStep
          sellerType={step.sellerType}
          initialValue={taxId}
          serverError={step.serverError}
          onVerified={(value, taxpayer) => {
            setTaxId(value);
            setStep({ name: "confirm", sellerType: step.sellerType, taxpayer });
          }}
          onBack={(value) => {
            setTaxId(value);
            setStep({ name: "seller-type" });
          }}
        />
      )}
      {step.name === "confirm" && (
        <TaxpayerConfirmStep
          sellerType={step.sellerType}
          taxpayer={step.taxpayer}
          onConfirm={() => setStep({ ...step, name: "details" })}
          onReject={() => setStep({ name: "tax-id", sellerType: step.sellerType })}
        />
      )}
      {step.name === "details" && (
        <VendorDetailsStep
          taxpayer={step.taxpayer}
          initialValues={vendorDraft}
          onInvalidTaxId={(message, values) => {
            setVendorDraft(values);
            setStep({ name: "tax-id", sellerType: step.sellerType, serverError: message });
          }}
          onBack={(values) => {
            setVendorDraft(values);
            setStep({ ...step, name: "confirm" });
          }}
        />
      )}
    </div>
  );
}
