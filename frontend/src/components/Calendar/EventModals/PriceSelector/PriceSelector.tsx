"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import "./PriceSelector.css"

interface PriceSelectorProps {
  onPriceChange?: (price: number) => void
  initialPrice?: number
  minPrice?: number
  maxPrice?: number
  step?: number
}

export function PriceSelector({
  onPriceChange,
  initialPrice = 50,
  minPrice = 0,
  maxPrice = 1000,
  step = 0.5,
}: PriceSelectorProps ) {
  const [price, setPrice] = useState(initialPrice.toString())
  const [activeField, setActiveField] = useState<boolean>(false)
  const priceRef = useRef<HTMLInputElement>(null)

  // Notify parent component when price changes
  useEffect(() => {
    const numericPrice = Number.parseFloat(price)
    if (!isNaN(numericPrice) && onPriceChange) {
      onPriceChange(numericPrice)
    }
  }, [price, onPriceChange])

  // Adjust price by specified amount
  const adjustPrice = (currentPrice: string, amountToAdd: number): string => {
    const numericPrice = Number.parseFloat(currentPrice)

    if (isNaN(numericPrice)) {
      return initialPrice.toString()
    }

    // Calculate new price and ensure it's within bounds
    let newPrice = numericPrice + amountToAdd
    newPrice = Math.max(minPrice, Math.min(newPrice, maxPrice))

    // Format to 2 decimal places
    return newPrice.toFixed(2)
  }

  // Handle wheel event to increment/decrement price
  const handleWheel = (e: React.WheelEvent) => {
    const direction = e.deltaY < 0 ? 1 : -1
    const adjustment = direction * step

    setPrice(adjustPrice(price, adjustment))
  }

  const handlePriceChange = (direction: number) => {
    // For buttons, we'll use larger increments (10€)
    const adjustment = direction * 10
    setPrice(adjustPrice(price, adjustment))
  }

  // Handle manual input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Allow only numbers and decimal point
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setPrice(value)
    }
  }

  // Handle blur to format and validate the input
  const handleBlur = () => {
    setActiveField(false)

    if (!price.trim()) {
      setPrice(initialPrice.toString())
      return
    }

    const numericPrice = Number.parseFloat(price)

    if (isNaN(numericPrice)) {
      setPrice(initialPrice.toString())
    } else {
      // Ensure price is within bounds
      const boundedPrice = Math.max(minPrice, Math.min(numericPrice, maxPrice))
      // Format to 2 decimal places
      setPrice(boundedPrice.toFixed(2))
    }
  }

  return (
    <div className="price-picker">
      <div className={`price-field ${activeField ? "active" : ""}`}>
        <label className="price-label" htmlFor="price-input">
          Price (€)
        </label>
        <div className="price-input-container">
          <button className="price-control" onClick={() => handlePriceChange(1)} type="button">
            <ArrowDropUpIcon fontSize="small" />
          </button>
          <div className="input-wrapper">
            <input
              id="price-input"
              ref={priceRef}
              type="text"
              value={price}
              onChange={handleInputChange}
              onWheel={handleWheel}
              onFocus={() => setActiveField(true)}
              onBlur={handleBlur}
              spellCheck={false}
              autoComplete="off"
              className="input-field"
            />
          </div>
          <button className="price-control" onClick={() => handlePriceChange(-1)} type="button">
            <ArrowDropDownIcon fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  )
}
