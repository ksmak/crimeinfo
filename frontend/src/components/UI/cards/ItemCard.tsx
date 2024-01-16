import { Carousel, IconButton } from "@material-tailwind/react";
import { Dict, Item, Media } from "../../../types/types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import moment from "moment";
import { getFileFromUrl, truncate } from "../../../utils/utils";
import { useEffect, useState } from "react";
import uuid from "react-uuid";


interface ItemCardProps {
    item: Item,
    regions: Dict[] | undefined,
    districts: Dict[] | undefined,
}

const ItemCard = ({ item, regions, districts }: ItemCardProps) => {
    const { t, i18n } = useTranslation();
    const [medias, setMedias] = useState<Media[]>([]);

    useEffect(() => {
        getMedias(item);
    }, [item])

    const getMedias = async (item: Item) => {
        if (item?.data?.photos) {
            let photosFromBase: Media[] = [];
            for (const url of item.data.photos) {
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

        return place.join(', ');
    }

    let title = item[`title_${i18n.language}` as keyof typeof item] as string;
    let text = item[`text_${i18n.language}` as keyof typeof item] as string;
    let place_info = getPlaceInfo();
    let date = item.date_of_action ? moment(item.date_of_action).locale(i18n.language).format('LL') : '';

    return (
        <div className="relative w-full md:w-96 flex flex-col justify-between border-2 border-blue-400 mt-4">
            {item.show_danger_label ? <div className="absolute top-2 right-2 z-50 border-2 border-red-400 text-red-400 font-bold rounded-lg p-2 text-xs">{t('dangerLabel')}</div> : null}
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
                {medias.length > 0
                    ? medias.map((item, index) => {
                        const type = item.file.type.replace(/\/.+/, '');
                        return (
                            <div >
                                {type === 'image'
                                    ? <img
                                        className="w-96 h-64 object-cover object-center"
                                        src={URL.createObjectURL(item.file)}
                                        alt={item.file.name}
                                    />
                                    : type === 'video'
                                        ? <video
                                            className="w-96 h-64 object-cover object-center"
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
                        className="w-96 h-64 object-cover object-center"
                        src={`default${item.category_id}.png`}
                        alt="default"
                    />}
            </Carousel>
            <div
                className="h-24 bg-blue-400 px-2 text-white font-bold text-lg flex flex-col justify-center"
            >
                <Link to={`/items/${item.id}`} className="hover:underline">{truncate(title, 70)}</Link>
            </div>
            <div className="h-20 px-2 indent-3 text-blue-gray-900 font-sans text-sm">
                {truncate(text, 130)}
            </div>
            <div className="h-12 px-2 text-blue-800 font-serif text-sm">
                {place_info}
            </div>
            <div className="h-6 px-2">
                <div className="flex flex-row justify-between">
                    <div
                        className="text-blue-gray-900 font-serif text-sm"
                    >
                        {date}
                    </div>
                    <div
                        className="text-blue-800 font-serif text-sm"
                    >
                        <Link to={`/items/${item.id}`} className="hover:underline">{t('see')}</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemCard;