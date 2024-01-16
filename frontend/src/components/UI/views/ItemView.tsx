import { Alert, Badge, Button, Card, CardBody, Carousel, Chip, IconButton, Typography } from "@material-tailwind/react";
import { Comment, Detail, Item, Media, UserRole } from "../../../types/types";
import { useTranslation } from "react-i18next";
import moment from "moment";
import 'moment/locale/ru';
import 'moment/locale/kk';
import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { supabase } from "../../../api/supabase";
import { AuthContext, MetaDataContext } from "../../../App";
import CommentsPanel from "../panels/CommentsPanel";
import Loading from "../elements/Loading";
import SocialButtonsPanel from "../panels/SocialButtonsPanel";
import uuid from "react-uuid";
import { getFileFromUrl } from "../../../utils/utils";


interface ItemViewProps {
    itemId: string | undefined
}

const ItemView = ({ itemId }: ItemViewProps) => {
    const { session, roles } = useContext(AuthContext);
    const { categories, regions, districts } = useContext(MetaDataContext);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [comment, setComment] = useState<Comment>();
    const [openError, setOpenError] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState<Item>({
        id: null,
        category_id: null,
        title_kk: null,
        title_ru: null,
        title_en: null,
        text_kk: null,
        text_ru: null,
        text_en: null,
        region_id: null,
        district_id: null,
        punkt_kk: null,
        punkt_ru: null,
        punkt_en: null,
        date_of_action: moment().format('YYYY-MM-DD'),
        time_of_action: moment().format('HH:MM'),
        data: null,
        created_at: '',
        user_id: '',
        show_danger_label: false
    } as Item);
    const [comments, setComments] = useState<Comment[]>([]);
    const [medias, setMedias] = useState<Media[]>([]);
    const [detailItem, setDetailItem] = useState<Detail | null>(null);

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
        const { data } = await supabase
            .from('item')
            .select()
            .or(`and(id.eq.${itemId},is_active.eq.true), and(id.eq.${itemId}${session?.user.id ? ', user_id.eq.' + session.user.id : ''})`)
            .single();
        if (data) {
            const prunedData = data as Item;
            setItem(prunedData);
            setComment({ item_id: prunedData.id });
            if (data?.data?.photos) {
                let photosFromBase: Media[] = [];
                for (const url of data.data.photos) {
                    const id = uuid();
                    const file = await getFileFromUrl(url, id);
                    photosFromBase.push({
                        id: id,
                        file: file,
                    })
                }
                setMedias(photosFromBase);
            }
        }
    }

    const getComments = async (itemId: string) => {
        const { data } = await supabase
            .from('comments')
            .select()
            .eq('item_id', itemId);
        if (data) {
            const prunedData = data as Comment[];
            setComments(prunedData);
        }
    }

    const getPlaceInfo = (): string => {
        var place = [];
        const punkt = item[`punkt_${i18n.language}` as keyof typeof item];
        if (punkt) {
            place.push(punkt);
        }
        if (item.district_id) {
            const district = districts?.find(d => d.id === item.district_id);
            if (district) {
                place.push(district[`title_${i18n.language}` as keyof typeof district]);
            }
        }
        if (item.region_id) {
            const region = regions?.find(r => r.id === item.region_id);
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
    const date_add = `${t('dateAdd')}: ${moment(item.created_at).locale(i18n.language).format('LL')}`;

    const handleAddComment = async () => {
        if (!session?.user) {
            navigate('/login')
        }
        if (!comment?.text) {
            setError(t('errorEmptyComment'));
            setOpenError(true);
            return;
        }
        setLoading(true);
        const { data, error } = await supabase
            .from('comments')
            .insert(comment)
            .select()
            .single();
        if (error) {
            setError(error.message);
            setOpenError(true);
        }
        if (data) {
            setComments([...comments, data]);
        }
        setComment({ item_id: item.id });
        setLoading(false);
    }

    const handleRemoveComment = async (id: number | null | undefined) => {
        setLoading(true);
        if (id) {
            const { error } = await supabase.from('comments').delete().eq('id', id);
            if (error) {
                setError(error.message);
                setOpenError(true);
                return;
            }
            if (item.id) {
                getComments(String(item.id));
            }
        }
        setLoading(false);
    }

    const handleClickChip = (detail: Detail) => {
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
                {roles.includes(UserRole.admin) || (roles.includes(UserRole.item_edit) && item.user_id === session?.user.id)
                    ? <Button
                        className="bg-primary-500 mr-3"
                        size="sm"
                        onClick={() => navigate(`/items/edit/${item.id}`)}
                    >
                        {t('edit')}
                    </Button>
                    : null}
            </div>
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
                                {item.data?.details
                                    ? item.data.details.map((detail, index) => {
                                        let category = categories?.find(category => category.id === item.category_id);
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
                                            <div >
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
                                        src={`/default${item.category_id}.png`}
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
            <Alert className="bg-red-500 my-4 sticky bottom-5" open={openError} onClose={() => setOpenError(!openError)}>{error}</Alert>
        </div>
    )
}

export default ItemView;