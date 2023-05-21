import { useEffect, useMemo, useState } from "react";

export function useFormValue<T, U = T>({
  value: _value,
  validate,
  onChange,
  cast,
}: {
  value: T;
  validate?: (values: T) => string | null;
  onChange?: (value: T) => void;
  cast?: (value: U) => T;
}) {
  const [value, setValue] = useState(_value);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(_value);
  }, [_value]);

  return useMemo(
    () => ({
      inputProps: {
        value,
        error,
        isValid: !error,
        onChange: (newValue: U | { target: { value: U } }) => {
          const newValue_: U =
            newValue && typeof newValue === "object" && "target" in newValue
              ? newValue.target.value
              : newValue;
          const newValue__ = cast ? cast(newValue_) : (newValue_ as unknown as T);
          setValue(newValue__);
          const error = validate ? validate(newValue__) : null;
          setError(error);
          if (!error && onChange) {
            onChange(newValue__);
          }
        },
      },
    }),
    [value, error, validate, onChange],
  );
}
