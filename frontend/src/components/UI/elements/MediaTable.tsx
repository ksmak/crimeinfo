import { Button, IconButton } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { AiFillDelete } from 'react-icons/ai';
import { Media } from "../../../types/types";

interface MediaTableProps {
    mediaItems: Media[],
    handleAddMedia: () => void,
    handleRemoveMedia: (index: number) => void,
    showError: boolean,
}

const MediaTable = ({ mediaItems, handleAddMedia, handleRemoveMedia, showError }: MediaTableProps) => {
    const { t } = useTranslation();


    return (
        <div>
            <div className="flex flex-row flex-wrap justify-between items-center mb-1">
                <div className="text-blue-400 text-left">
                    {t('photos')}:
                </div>
                <div className="text-end">
                    <Button
                        size="sm"
                        color="blue"
                        onClick={() => {
                            handleAddMedia()
                        }}
                    >
                        {t('add')}
                    </Button>
                </div>
            </div>
            <table className="border-2 border-collapse border-blue-400 w-full">
                <thead>
                    <tr className="border-2 p-1">
                        <th className="border-2 p-1">
                            {t('value')}
                        </th>

                    </tr>
                </thead>
                <tbody>
                    <tr className="border-2 p-1"></tr>
                    {showError
                        ? <tr className="text-red-700 border-2 p-1">
                            <td colSpan={3}>
                                {t('loadError')}
                            </td>
                        </tr>
                        : null}
                    {mediaItems.map((item, index) => {
                        const type = item.file.type.replace(/\/.+/, '');
                        return (
                            <tr key={index} className="border-2 p-1">
                                <td className="border-2 p-1">
                                    {type === 'image'
                                        ? <img alt="" src={URL.createObjectURL(item.file)} />
                                        : type === 'video'
                                            ? <video width="400" height="300" controls={true}>
                                                <source src={URL.createObjectURL(item.file)} type={item.file.type}>
                                                </source>
                                            </video>
                                            : null}
                                </td>
                                <td className="border-2 p-1 text-center">
                                    <IconButton
                                        className="rounded-full"
                                        size="sm"
                                        color="blue"
                                        variant="outlined"
                                        onClick={() => handleRemoveMedia(index)}
                                    >
                                        <AiFillDelete />
                                    </IconButton>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default MediaTable;