import clsx from "clsx";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useState, useRef } from "react";

interface MultiRangeSliderProps {
  min?: number;
  max?: number;
  onChange?: (event?: unknown) => void;
}

const MultiRangeSlider = ({
  min = 0,
  max = 100,
  onChange,
}: MultiRangeSliderProps) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  // Set width of the range to decrease from the left side
  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange && onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div className="w-full">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(+event.target.value, maxVal - 1);
          setMinVal(value);
          event.target.value = value.toString();
        }}
        className={clsx(
          "absolute z-30 h-0 w-full appearance-none outline-none",
          minVal > max - 1 && "z-50"
        )}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(+event.target.value, minVal + 1);
          setMaxVal(value);
          event.target.value = value.toString();
        }}
        className="absolute z-40 h-0 w-full appearance-none outline-none"
        //
      />

      <div className="slider relative h-3 w-full">
        <div className="slider__track bg-surface/5 absolute z-10 h-[5px] w-full rounded-full"></div>
        <div
          ref={range}
          className="slider__range bg-primary absolute z-20 h-[5px] w-full rounded-full"
        ></div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
