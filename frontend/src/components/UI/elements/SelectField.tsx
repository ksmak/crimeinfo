import { useTranslation } from "react-i18next"
import { Dict } from "../../../types/types"
import { ChangeEvent } from "react";

interface SelectProps {
    name: string,
    label: string,
    value: string,
    dict: Dict[] | undefined,
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void,
    required: boolean
}

const SelectField = ({ name, label, value, dict, onChange, required }: SelectProps) => {
    const { i18n } = useTranslation();

    return (
        <div>
            <label
                htmlFor={name}
                className="text-blue-400 bold mr-1 capitalize"
            >
                {label}
            </label>
            <select
                id={name}
                className="bg-white p-1.5 border-2 border-blue-gray-200 rounded-md"
                value={value}
                onChange={onChange}
                required={required}
            >
                <option key={0} value=''>-</option>
                {dict
                    ? dict.map((item) => (
                        <option key={item.id} value={item.id}>{item[`title_${i18n.language}` as keyof typeof item]}</option>
                    ))
                    : null
                }
            </select>
        </div>
    )
}

export default SelectField;