import { Dispatch, SetStateAction, useState } from "react";
import { Detail, Field } from "../../../types/types";
import { useTranslation } from "react-i18next";
import { Button, Collapse, IconButton } from "@material-tailwind/react";
import { AiFillDelete } from 'react-icons/ai';

interface DetailsProps {
    details: Detail[],
    fields: Field[],
    handleAddDetail: (fieldName: string | undefined, value: string | undefined) => void,
    handleRemoveDetail: (index: number) => void,
    showError: boolean,
    openDetail: boolean,
    setOpenDetail: Dispatch<SetStateAction<boolean>>
}

const DetailsTable = ({ details, fields, handleAddDetail, handleRemoveDetail, showError, openDetail, setOpenDetail }: DetailsProps) => {
    const { t, i18n } = useTranslation();
    const [fieldName, setFieldName] = useState('');
    const [value, setValue] = useState('');

    const handleAdd = () => {
        setFieldName('');
        setValue('');
        setOpenDetail(true);
    }

    return (
        <div>
            <div className="flex flex-row flex-wrap justify-between items-center mb-1">
                <div className="text-blue-400 text-left">
                    {t('details')}:
                </div>
                <div className="text-end">
                    <Button onClick={handleAdd} size="sm" color="blue">{t('add')}</Button>
                </div>
            </div>
            <Collapse open={openDetail} >
                <div className="border-2 border-blue-gray-50 rounded-md p-4 mb-2">
                    <div className="w-full mb-4">
                        <label
                            htmlFor={fieldName}
                            className="text-blue-gray-800 bold mr-1 capitalize"
                        >
                            {t('name')}
                        </label>
                        <select
                            className="bg-white p-1.5 border-2 border-blue-gray-200 rounded-md"
                            value={fieldName}
                            onChange={e => {
                                setFieldName(e.target.value);
                            }}
                        >
                            <option value=''>-</option>
                            {fields.map((field, index) => {
                                return (
                                    <option key={index} value={field.field_name} className="flex items-center gap-1">
                                        {field[`title_${i18n.language}` as keyof typeof field]}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="w-full mb-4">
                        <label
                            htmlFor={fieldName}
                            className="text-blue-gray-800 bold mr-1"
                        >
                            {t('value')}
                        </label>
                        <input
                            className="border-2 border-blue-gray-200 p-1 w-full rounded-md"
                            type="text"
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value)
                            }}
                        />
                    </div>
                    <div className="text-red-600 mb-1">
                        {showError ? t('notNullError') : null}
                    </div>
                    <div className="flex flex-row flex-wrap justify-end gap-3">
                        <Button onClick={() => handleAddDetail(fieldName, value)} size="sm" color="blue" variant="outlined">{t('save')}</Button>
                        <Button onClick={() => setOpenDetail(false)} size="sm" color="blue" variant="outlined">{t('close')}</Button>
                    </div>
                </div>
            </Collapse>
            <table className="border-2 border-collapse border-blue-400 w-full">
                <thead>
                    <tr className="border-2 p-1">
                        <th className="border-2 p-1">
                            {t('name')}
                        </th>
                        <th className="border-2 p-1">
                            {t('value')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {details.map((detail, index) => {
                        const field = fields.find((field) => field.field_name === detail.field_name);
                        return (
                            <tr key={index} className="border-2 p-1">
                                <td className="border-2 p-1">
                                    {field ? field[`title_${i18n.language}` as keyof typeof field] : ''}
                                </td>
                                <td className="border-2 p-1">{detail.value}</td>
                                <td className="border-2 p-1 text-center">
                                    <IconButton
                                        className="rounded-full"
                                        variant="outlined"
                                        size="sm"
                                        color="blue"
                                        onClick={() => handleRemoveDetail(index)}
                                    >
                                        <AiFillDelete />
                                    </IconButton>
                                </td>
                            </tr>
                        )
                    })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default DetailsTable;