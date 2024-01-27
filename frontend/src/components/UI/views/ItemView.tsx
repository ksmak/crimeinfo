import { Alert, Badge, Button, Card, CardBody, Carousel, Chip, IconButton, Typography } from "@material-tailwind/react";
import { IComment, IDetail, IItem, Media, UserRole } from "../../../types/types";
import { useTranslation } from "react-i18next";
import moment from "moment";
import 'moment/locale/ru';
import 'moment/locale/kk';
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import CommentsPanel from "../panels/CommentsPanel";
import Loading from "../elements/Loading";
import SocialButtonsPanel from "../panels/SocialButtonsPanel";
import { getFileFromUrl } from "../../../utils/utils";
import { useAuth } from "../../../lib/auth";
import { useMeta } from "../../../lib/meta";
import axios from "axios";
import instance from "../../../api/instance";


interface ItemViewProps {
    itemId: string | undefined
}

const ItemView = ({ itemId }: ItemViewProps) => {
    const { isAuthenticated, user, roles } = useAuth();
    const { categories, regions, districts } = useMeta();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [comment, setComment] = useState<IComment>();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState<IItem>({
        id: null,
        category: null,
        title_kk: null,
        title_ru: null,
        title_en: null,
        text_kk: null,
        text_ru: null,
        text_en: null,
        region: null,
        district: null,
        punkt_kk: null,
        punkt_ru: null,
        punkt_en: null,
        date_of_action: moment().format('YYYY-MM-DD'),
        time_of_action: moment().format('HH:MM'),
        details: null,
        created_user: null,
        change_user: null,
        show_danger_label: false
    } as IItem);
    const [comments, setComments] = useState<IComment[]>([]);
    const [medias, setMedias] = useState<Media[]>([]);
    const [detailItem, setDetailItem] = useState<IDetail | null>(null);

    useEffect(() => {
        setLoading(true);
        if (itemId) {
            getItem(itemId);
            getComments(itemId);
        }
        setLoading(false);
        // eslint-disable-next-line
    }, [itemId]);

    const getItem = async (itemId: string) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_HOST}/api/items/${itemId}/`);
            setItem(res.data);
            setComment({ item: res.data.id });
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

    const getComments = async (itemId: string) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_HOST}/api/item_comments/${itemId}`)
            setComments(res.data);
        } catch (error) {
            //console.log(error.message);
        }
    }

    const getPlaceInfo = (): string => {
        var place = [];
        const punkt = item[`punkt_${i18n.language}` as keyof typeof item];
        if (punkt) {
            place.push(punkt);
        }
        if (item.district) {
            const district = districts?.find(d => d.id === item.district);
            if (district) {
                place.push(district[`title_${i18n.language}` as keyof typeof district]);
            }
        }
        if (item.region) {
            const region = regions?.find(r => r.id === item.region);
            if (region) {
                place.push(region[`title_${i18n.language}` as keyof typeof region]);
            }
        }
        let date = moment(`${item.date_of_action} ${item.time_of_action}`).locale(i18n.language).format('LLLL');
        place.push(date);
        return place.join(', ');
    }
    const title = item[`title_${i18n.language}` as keyof typeof item] as string;
    const place_info = getPlaceInfo();
    const text = item[`text_${i18n.language}` as keyof typeof item] as string;
    const date_add = `${t('dateAdd')}: ${moment(item.date_of_action).locale(i18n.language).format('LL')}`;

    const handleAddComment = async () => {
        if (!isAuthenticated && user?.id) {
            navigate('/login')
        }
        if (!comment?.text) {
            setError(t('errorEmptyComment'));
            return;
        }
        setLoading(true);
        comment.user = user?.id;
        try {
            const res = await instance.post(`${process.env.REACT_APP_API_HOST}/api/comments/`, comment)
            setComments([...comments, res.data]);
            setComment({ item: item.id });
            setLoading(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.errors);
            } else {
                setError(String(error));
            }
            setLoading(false);
        }
    }

    const handleRemoveComment = async (id: number | null | undefined) => {
        if (id) {
            setLoading(true);
            try {
                await instance.delete(`${process.env.REACT_APP_API_HOST}/api/comments/${id}/`)
                setComments(comments.filter(item => item.id !== id))
                setLoading(false);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data.errors);
                } else {
                    setError(String(error));
                }
                setLoading(false);
            }
        }
    }

    const handleClickChip = (detail: IDetail) => {
        navigator.clipboard.writeText(detail.value).then(() => {
            setDetailItem(detail);
            setInterval(() => setDetailItem(null), 3000)
        }).catch((error) => {
            console.error("Error copying text: ", error);
        });
    }

    return (
        <div className="w-full container mx-auto">
            <div className="flex flex-row justify-end py-4 pr-5">
                {roles.some(item => item.role === UserRole.admin || item.role === UserRole.item_edit)
                    ? <Button
                        className="bg-primary-500 mr-3"
                        size="sm"
                        onClick={() => navigate(`/items/edit/${item.id}`)}
                    >
                        {t('edit')}
                    </Button>
                    : null}
            </div>
            <Alert className="bg-red-500 my-4 sticky bottom-5" open={error !== ''} onClose={() => setError('')}>{error}</Alert>
            {item.id
                ? <div>
                    {!item.is_active ? <div className="text-red-400 font-bold">
                        {t('notActive')}
                    </div> : null}
                    {item.show_danger_label
                        ? <div className="flex flex-row flex-wrap justify-between items-center gap-4 px-5">
                            <div className="text-red-600 font-bold text-lg uppercase text-center">
                                {t('dangerLabel')}
                            </div>
                            <SocialButtonsPanel link={`${process.env.REACT_APP_HOST}/items/${item.id}`} />
                        </div>
                        : <div className="flex flex-row justify-end items-center gap-4 px-5">
                            <SocialButtonsPanel link={`${process.env.REACT_APP_HOST}/items/${item.id}`} />
                        </div>}
                    <Card className="p-0">
                        <CardBody className="flex flex-col">
                            <Typography variant="h3" color="blue" className="place-self-center">{title}</Typography>
                            <div className="flex flex-row flex-wrap justify-center items-center gap-4 mt-4">
                                <div className="text-blue-gray-800 italic">{t('ifFind')}</div>
                                <a
                                    className="text-center text-red-600 border-2 border-red-600 p-2 rounded-full flex flex-row gap-2 hover:underline"
                                    href={`tel:${process.env.REACT_APP_CRIME_PHONE}`}
                                >
                                    {t('callPoliceOfficer')}
                                    <img src="/phone.png" alt="phone" />
                                </a>
                                <div className="w-full md:w-fit text-center">{t('OR')}</div>
                                <a
                                    className="font-bold text-white bg-red-600 border-2 border-red-600 p-3 rounded-full hover:underline"
                                    href={`tel:${process.env.REACT_APP_102_PHONE}`
                                    }
                                >
                                    102
                                </a>
                            </div>
                            {item.is_reward
                                ? <div className=" w-fit self-center rounded-sm mt-5 text-white bg-red-400 p-1.5 text-lg italic text-center">
                                    {t('rewardLabel')}
                                </div>
                                : null}
                            <Typography variant="h6" color="blue" className="uppercase mt-4">{t('placeAndTime')}</Typography>
                            <div className="text-blue-gray-800">{place_info}</div>
                            <Typography variant="h6" color="blue" className="uppercase mt-4">{t('text')}</Typography>
                            <div className="text-blue-gray-800">{text}</div>
                            <Typography variant="h6" color="blue" className="uppercase mt-4">{t('details')}</Typography>
                            <div className="flex flex-row flex-wrap gap-2">
                                {item.details
                                    ? item.details.map((detail, index) => {
                                        let category = categories?.find(category => category.id === item.category);
                                        let field = category?.fields.find(field => field.field_name === detail.field_name);
                                        let title = field ? field[`title_${i18n.language}` as keyof typeof field] as string : '';
                                        let display = `${title}:${detail.value}`;
                                        return (
                                            <Chip
                                                key={index}
                                                value={
                                                    <Badge
                                                        content={t('copied')}
                                                        className="z-50 text-xs lowercase bg-gradient-to-tr from-green-400 to-green-600 border-2 border-white shadow-lg shadow-black/20"
                                                        invisible={detailItem !== detail}>
                                                        <Typography
                                                            variant="small"
                                                            color="white"
                                                            className="cursor-pointer"
                                                            onClick={() => handleClickChip(detail)}
                                                        >
                                                            {display}
                                                        </Typography>
                                                    </Badge>
                                                }
                                                size="sm"
                                                className="bg-primary-500"
                                            />
                                        )
                                    })
                                    : null}
                            </div>
                            <div className="mt-3 text-blue-gray-800">{date_add}</div>
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
                                {medias.length > 0
                                    ? medias.map((item, index) => {
                                        const type = item.file.type.replace(/\/.+/, '');
                                        return (
                                            <div key={index}>
                                                {type === 'image'
                                                    ? <a key={index} href={URL.createObjectURL(item.file)} target="_blank" rel="noreferrer">
                                                        <img
                                                            className="w-full h-96 object-contain object-center"
                                                            src={URL.createObjectURL(item.file)}
                                                            alt={item.file.name}
                                                        />
                                                    </a>
                                                    : type === 'video'
                                                        ? <video
                                                            className="w-full h-96 object-contain object-center"
                                                            key={index}
                                                            controls={true}>
                                                            <source src={URL.createObjectURL(item.file)} type={item.file.type}>
                                                            </source>
                                                        </video>
                                                        : null
                                                }
                                            </div>
                                        )
                                    })
                                    : <img
                                        className="w-full h-96 object-contain object-center"
                                        src={`/default${item.category}.png`}
                                        alt="default"
                                    />}
                            </Carousel>
                        </CardBody>
                    </Card>
                    <div className="w-full mt-6 px-5">
                        <CommentsPanel comments={comments} handleRemoveComment={handleRemoveComment} />
                    </div>
                    <div className="w-full mb-4 px-5">
                        <textarea
                            className="border-2 border-blue-gray-200 p-1 w-full rounded-md mr-1"
                            value={comment?.text ? comment.text : ''}
                            onChange={(e) => setComment({ ...comment, text: e.target.value })}
                        />
                        <div>
                            <Button className="bg-primary-500 mb-52" size="sm" onClick={handleAddComment}>{t('addComment')}</Button>
                        </div>
                    </div>
                </div>
                : null}
            {loading ? <Loading /> : null}
        </div>
    )
}

export default ItemView;