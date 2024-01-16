import { ChangeEvent } from "react";

interface InputFieldProps {
    type: string,
    name: string,
    label: string,
    value: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    required: boolean
}

const InputField = ({ type, name, label, value, onChange, required }: InputFieldProps) => {
    return (
        <div>
            <label
                htmlFor={name}
                className="text-blue-400 bold mr-1"
            >
                {label}
            </label>
            <input
                id={name}
                className="border-2 border-blue-gray-200 p-1 w-full rounded-md"
                type={type}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    )
}

export default InputField;