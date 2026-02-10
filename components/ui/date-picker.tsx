import { DateRange } from "react-day-picker"
import { Matcher } from "react-day-picker"




type SinglePickerProps = {
    mode?: "single"
    value?: Date
    onChange: (date?: Date) => void
    minDate?: Date
    maxDate?: Date
    placeholder?: string
    className?: string
}

type RangePickerProps = {
    mode: "range"
    range?: DateRange
    onRangeChange: (range?: DateRange) => void
    minDate?: Date
    maxDate?: Date
    placeholder?: string
    className?: string
}

type DatePickerProps = SinglePickerProps | RangePickerProps



import { DayPicker } from "react-day-picker"
import "react-day-picker/style.css"

export function DatePicker(props: DatePickerProps) {
    const {
        minDate,
        maxDate,
        placeholder = "Pick a date",
        className,
    } = props

    const disabled: Matcher[] = [
        ...(props.minDate ? [{ before: props.minDate }] : []),
        ...(props.maxDate ? [{ after: props.maxDate }] : []),
    ]

    if (props.mode === "range") {
        // ✅ RANGE MODE (fully type-safe)
        return (
            <div className={className}>
                <DayPicker
                    mode="range"
                    selected={props.range}
                    onSelect={props.onRangeChange}
                    disabled={disabled.length ? disabled : undefined}
                    footer={
                        props.range?.from && props.range?.to
                            ? `${props.range.from.toLocaleDateString()} → ${props.range.to.toLocaleDateString()}`
                            : "Select start and end date"
                    }
                />
            </div>
        )
    }

    // ✅ SINGLE MODE (default)
    return (
        <div className={className}>
            <DayPicker
                mode="single"
                selected={props.value}
                onSelect={props.onChange}
                fromDate={minDate}
                toDate={maxDate}
                footer={
                    props.value
                        ? `Selected: ${props.value.toLocaleDateString()}`
                        : placeholder
                }
            />
        </div>
    )
}
