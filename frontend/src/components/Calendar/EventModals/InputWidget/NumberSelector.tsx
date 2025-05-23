import type React from "react";
import { useState, useRef, useEffect } from "react";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import "./InputWidget.css";

interface NumberSelectorProps {
  onValueChange?: (value: number) => void;
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  mouseStep?: number;
  label?: string;
  unit?: string;
}

export function NumberSelector({
  onValueChange,
  initialValue = 0,
  min = 0,
  max = 1000,
  step = 1,
  mouseStep,
  label = "Value",
}: NumberSelectorProps) {
  const [value, setValue] = useState(initialValue.toString());
  const [activeField, setActiveField] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const numericValue = Number.parseFloat(value);
    if (!isNaN(numericValue) && onValueChange) {
      onValueChange(numericValue);
    }
  }, [value, onValueChange]);

  const adjustValue = (currentValue: string, amountToAdd: number): string => {
    const numericValue = parseFloat(currentValue);
    if (isNaN(numericValue)) {
      return initialValue.toFixed(2);
    }

    let newValue = numericValue + amountToAdd;
    newValue = Math.max(min, Math.min(newValue, max));

    return newValue.toFixed(2);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const direction = e.deltaY < 0 ? 1 : -1;
    const adjustment = direction * (mouseStep ?? step);
    setValue(adjustValue(value, adjustment));
  };

  const handleButtonChange = (direction: number) => {
    const adjustment = direction * 10;
    setValue(adjustValue(value, adjustment));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
      setValue(val);
    }
  };

  const handleBlur = () => {
    setActiveField(false);
    if (!value.trim()) {
      setValue(initialValue.toString());
      return;
    }

    const numericValue = Number.parseFloat(value);
    if (isNaN(numericValue)) {
      setValue(initialValue.toString());
    } else {
      const boundedValue = Math.max(min, Math.min(numericValue, max));
      setValue(step % 1 !== 0 ? boundedValue.toFixed(2) : boundedValue.toString());
    }
  };

  return (
    <div className="input-widget">
      <div className={`input-group ${activeField ? "active" : ""}`}>
        <label className="input-label" htmlFor="number-input">{label}</label>
        <div className="input-container">
          <button className="input-button" onClick={() => handleButtonChange(1)} type="button">
            <ArrowDropUpIcon fontSize="small" />
          </button>

            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleInputChange}
              onWheel={handleWheel}
              onFocus={() => setActiveField(true)}
              onBlur={handleBlur}
              spellCheck={false}
              autoComplete="off"
              className="input-field"
            />

          <button className="input-button" onClick={() => handleButtonChange(-1)} type="button">
            <ArrowDropDownIcon fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
}
