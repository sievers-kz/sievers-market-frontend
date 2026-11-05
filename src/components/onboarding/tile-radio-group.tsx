import type { UseFormRegisterReturn } from "react-hook-form";

interface TileRadioGroupProps {
  legend: string;
  options: readonly { value: string; label: string }[];
  error?: string;
  inputProps: UseFormRegisterReturn;
}

/** Настоящие радиокнопки в виде плиток: клавиатура и скринридер работают как у обычных радио. */
export function TileRadioGroup({ legend, options, error, inputProps }: TileRadioGroupProps) {
  const errorId = `${inputProps.name}-error`;

  return (
    <fieldset className="flex flex-col gap-2" aria-describedby={error ? errorId : undefined}>
      <legend className="sr-only">{legend}</legend>
      <div className="grid grid-cols-2 gap-2">
        {options.map(({ value, label }) => (
          <label
            key={value}
            className="relative flex min-h-16 cursor-pointer items-center justify-center rounded-lg border border-border p-2 text-center text-sm font-medium transition-colors hover:bg-accent has-checked:border-primary has-checked:bg-primary/10 has-checked:ring-1 has-checked:ring-primary has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring"
          >
            <input type="radio" value={value} className="sr-only" {...inputProps} />
            {label}
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  );
}
