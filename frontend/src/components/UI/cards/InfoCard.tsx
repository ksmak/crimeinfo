import { Carousel, IconButton } from "@material-tailwind/react";
import { Info } from "../../../types/types";
import { useTranslation } from "react-i18next";
import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { Link } from "react-router-dom";
import { truncate } from "../../../utils/utils";
import { useEffect, useState } from "react";

interface InfoCardProps {
    info: Info,
}

const InfoCard = ({ info }: InfoCardProps) => {
    const { t, i18n } = useTranslation();
    const title = info[`title_${i18n.language}` as keyof typeof info] as string;
    const [content, setContent] = useState('');

    useEffect(() => {
        try {
            const text = info[`text_${i18n.language}` as keyof typeof info] as string;
            const blocksFromHtml = htmlToDraft(text);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const editorState = EditorState.createWithContent(contentState);
            setContent(editorState.getCurrentContent().getPlainText('\u0001'));
        } catch (e) {
            console.log(e);
        }
        // eslint-disable-next-line
    }, []);



    return (
        <div className="w-full md:w-96 flex flex-col justify-between border-2 border-blue-600 mt-4">
            <Carousel
                className="h-64 rounded-sm"
                prevArrow={({ handlePrev }) => (
                    <IconButton
                        variant="text"
                        color="blue"
                        size="lg"
                        onClick={handlePrev}
                        className="!absolute top-2/4 left-4 -translate-y-2/4"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                            />
                        </svg>
                    </IconButton>
                )}
                nextArrow={({ handleNext }) => (
                    <IconButton
                        variant="text"
                        color="blue"
                        size="lg"
                        onClick={handleNext}
                        className="!absolute top-2/4 !right-4 -translate-y-2/4"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                        </svg>
                    </IconButton>
                )}
            >
                {info.data?.photos
                    ? info.data.photos.map((photo, index) => (
                        <img
                            key={index}
                            src={photo}
                            alt={photo}
                            className="h-full w-full object-cover object-center"
                        />

                    ))
                    :
                    <img
                        src='default.png'
                        alt="default"
                        className="h-full w-full object-cover object-center"
                    />}
            </Carousel>
            <div className="h-18 bg-blue-600 w-full p-2 text-white font-bold text-lg py-4">
                <Link to={`/info/${info.id}`} className="hover:underline">{truncate(title, 70)}</Link>
            </div>
            <div className="h-14 p-2 text-blue-900 text-sm">
                {truncate(content, 130)}
            </div>
            <div className="h-8 text-end p-2 text-blue-900 font-serif text-sm">
                <Link to={`/info/${info.id}`} className="hover:underline">{t('readAll')}</Link>
            </div>
        </div>
    )
}

export default InfoCard;