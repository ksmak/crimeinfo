import { Button, Card, CardBody, CardHeader, Carousel, IconButton, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { IInfo, Media, UserRole } from "../../../types/types";
import moment from "moment";
import { ContentState, EditorState } from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { Editor } from "react-draft-wysiwyg";
import Loading from "../elements/Loading";
import { getFileFromUrl } from "../../../utils/utils";
import { useAuth } from "../../../lib/auth";
import axios from "axios";


interface InfoViewProps {
    infoId: string | undefined
}

const InfoView = ({ infoId }: InfoViewProps) => {
    const { roles } = useAuth();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [info, setInfo] = useState<IInfo>({
        id: null,
        title_ru: null,
        title_kk: null,
        title_en: null,
        text_kk: null,
        text_ru: null,
        text_en: null,
        date_of_action: moment().format('YYYY-MM-DD'),
        files: [],
    } as IInfo);
    const [medias, setMedias] = useState<Media[]>([]);

    useEffect(() => {
        getInfo();
        // eslint-disable-next-line
    }, [infoId]);

    const getInfo = async () => {
        if (infoId) {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_HOST}/api/info/${infoId}/`)
                setInfo(res.data);
                if (res.data.files) {
                    let files: Media[] = [];
                    for (const f of res.data.files) {
                        const file = await getFileFromUrl(f.file);
                        files.push({ file: file });
                    }
                    setMedias(files);
                }
            } catch (error) {
                //console.log(error.message);
            }
        }
    }

    const title = String(info[`title_${i18n.language}` as keyof typeof info]);
    const text = String(info[`text_${i18n.language}` as keyof typeof info]);
    const date_add = `${moment(info.date_of_action).locale(i18n.language).format('LL')}`;
    const blocksFromHtml = htmlToDraft(text);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const editorState = EditorState.createWithContent(contentState);

    return (
        <div className="w-full">
            <div className="flex flex-row justify-end py-4 pr-5">
                {roles.some(item => item.role === UserRole.admin || item.role === UserRole.info_edit)
                    ? <Button
                        className="bg-primary-500 mr-3"
                        size="sm"
                        onClick={() => navigate(`/info/edit/${info.id}`)}
                    >
                        {t('edit')}
                    </Button>
                    : null}
            </div>
            {info.id
                ? <div>
                    {!info.is_active ? <div className="text-red-400 font-bold px-5">
                        {t('notActive')}
                    </div> : null}
                    <Card className="mt-5 pt-5">
                        <CardHeader
                            floated={false}
                            shadow={false}
                            color="transparent"
                            className="h-1/2 flex flex-col items-center"
                        >
                            <Carousel
                                className="h-96 w-full rounded-xl mt-4"
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
                                {medias.map((item, index) => {
                                    const type = item.file.type.replace(/\/.+/, '');
                                    return (
                                        <div key={index}>
                                            {type === 'image'
                                                ? <img
                                                    key={index}
                                                    className="h-96 w-full object-contain object-center"
                                                    alt="" src={URL.createObjectURL(item.file)}
                                                />
                                                : type === 'video'
                                                    ? <video
                                                        key={index}
                                                        className="h-96 w-full object-contain object-center"
                                                        controls={true}>
                                                        <source src={URL.createObjectURL(item.file)} type={item.file.type}>
                                                        </source>
                                                    </video>
                                                    : null
                                            }
                                        </div>
                                    )
                                })}
                            </Carousel>
                        </CardHeader>
                        <CardBody className="flex flex-col">
                            <Typography variant="h3" color="blue" className="self-center">{title}</Typography>
                            <Editor toolbarHidden editorState={editorState} readOnly={true} />
                            <Typography variant="small" className="mt-3">{date_add}</Typography>
                        </CardBody>
                    </Card>
                </div>
                : <Loading />}
        </div>
    )
}

export default InfoView;