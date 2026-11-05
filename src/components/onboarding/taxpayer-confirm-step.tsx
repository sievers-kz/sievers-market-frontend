import { AuthCard } from "@/components/auth/auth-card";
import { FormMessage } from "@/components/auth/form-message";
import { Button } from "@/components/ui/button";
import type { Taxpayer } from "@/lib/api";

import { LEGAL_FORM_LABELS, SELLER_TYPES, type SellerType } from "./seller-types";

interface TaxpayerConfirmStepProps {
  sellerType: SellerType;
  taxpayer: Taxpayer;
  onConfirm: () => void;
  onReject: () => void;
}

export function TaxpayerConfirmStep({
  sellerType,
  taxpayer,
  onConfirm,
  onReject,
}: TaxpayerConfirmStepProps) {
  const rows = [
    { label: "Наименование", value: taxpayer.legal_name },
    { label: SELLER_TYPES[sellerType].taxIdLabel, value: taxpayer.tax_id },
    { label: "Тип", value: LEGAL_FORM_LABELS[taxpayer.legal_form] },
    { label: "Статус", value: taxpayer.is_liquidation ? "На ликвидации" : "Действует" },
  ];

  return (
    <AuthCard title="Это ваша организация?">
      <div className="flex flex-col gap-4">
        <table className="w-full text-left text-sm">
          <tbody>
            {rows.map(({ label, value }) => (
              <tr key={label} className="border-b border-border last:border-b-0">
                <th scope="row" className="py-2 pr-4 align-top font-normal text-muted-foreground">
                  {label}
                </th>
                <td className="py-2 font-medium break-words">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {taxpayer.is_liquidation && (
          <FormMessage message="Данная организация находится на ликвидации" />
        )}
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" size="lg" onClick={onReject}>
            Нет
          </Button>
          <Button type="button" size="lg" disabled={taxpayer.is_liquidation} onClick={onConfirm}>
            Да
          </Button>
        </div>
      </div>
    </AuthCard>
  );
}
