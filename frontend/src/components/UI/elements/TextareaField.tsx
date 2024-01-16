import { ChangeEvent } from "react";

interface TextareaFieldProps {
    rows: number,
    name: string,
    label: string,
    value: string,
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void,
    required: boolean
}

const TextareaField = ({ rows, name, label, value, onChange, required }: TextareaFieldProps) => {
    return (
        <div>
            <label
                htmlFor={name}
                className="text-blue-400 bold mr-1"
            >
                {label}
            </label>
            <textarea
                id={name}
                rows={rows}
                className="border-2 w-full border-blue-gray-200 rounded-md p-2"
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    )
}

export default TextareaField;