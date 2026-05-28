import { Input } from "./input";
import { Label } from "./label";

interface TimePickerProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    name?: string;
    required?: boolean;
    className?: string;
}





export default function TimePicker({
    label = "Select Time",
    value = "",
    onChange,
    name,
    required = false,
    className,
}: TimePickerProps) {
    return (
        <div className="flex flex-col gap-2">
            {label && <Label>{label}</Label>}
            <Input
                type="time"
                name={name}
                value={value}
                required={required}
                className={className}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
