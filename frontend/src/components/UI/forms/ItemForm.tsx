import { Alert, Button } from "@material-tailwind/react";
import SelectField from "../elements/SelectField";
import { Detail, Field, Item, Media, UserRole } from "../../../types/types";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext, MetaDataContext } from "../../../App";
import InputField from "../elements/InputField";
import TextareaField from "../elements/TextareaField";
import DetailsTable from "../elements/DetailsTable";
import MediasTable from "../elements/MediaTable";
import uuid from 'react-uuid';
import { supabase } from "../../../api/supabase";
import { useNavigate } from "react-router";
import Loading from "../elements/Loading";
import { getFileFromUrl, googleTranslate, uploadFiles } from "../../../utils/utils";
import moment from "moment";

interface ItemViewProps {
    itemId: string | undefined
}

const ItemForm = ({ itemId }: ItemViewProps) => {
    const { session, roles } = useContext(AuthContext);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { categories, regions, districts } = useContext(MetaDataContext);
    const [fields, setFields] = useState<Field[]>([]);
    const [detailError, setDetailError] = useState(false);
    const [photoError, setMediaError] = useState(false);
    const [isSuccesSave, setIsSuccesSave] = useState(false);
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState('');
    const [medias, setMedias] = useState<Media[]>([]);
    const [details, setDetails] = useState<Detail[]>([]);
    const [item, setItem] = useState<Item>({
        id: null,
        is_active: false,
        is_reward: false,
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
    const [openDetail, setOpenDetail] = useState(false);

    useEffect(() => {
        getItem();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (item?.category_id) {
            const category = categories?.find(category => category.id === item.category_id);
            if (category && category.fields) {
                setFields(category.fields);
            }
        }
    }, [item?.category_id, categories])

    const getItem = async () => {
        if (itemId) {
            const { data } = await supabase
                .from('item')
                .select()
                .or(`and(id.eq.${itemId},is_active.eq.true), and(id.eq.${itemId}${session?.user.id ? ', user_id.eq.' + session.user.id : ''})`)
                .single();
            if (data) {
                const prunedData = data as Item;
                setItem(prunedData);
                getMedias(prunedData);
                getDetails(prunedData);
            }
        }
    }

    const getMedias = (item: Item) => {
        if (item?.data?.details) {
            setDetails(item.data.details);
        }
    }

    const getDetails = async (item: Item) => {
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

    const handleSave = async () => {
        let newId = '';
        setErrors('');
        setIsError(false);
        setIsSuccesSave(false);
        setLoading(true);
        //translate
        let title_kk = item.title_kk;
        let title_en = item.title_en;
        let text_kk = item.text_kk;
        let text_en = item.text_en;
        let punkt_kk = item.punkt_kk ? item.punkt_kk : item.punkt_ru;
        let punkt_en = item.punkt_en ? item.punkt_en : item.punkt_ru;
        if (i18n.language === 'ru') {
            if (item.title_ru) {
                title_kk = await googleTranslate('kk', item.title_ru);
                title_en = await googleTranslate('en', item.title_ru);
            }
            if (item.text_ru) {
                text_kk = await googleTranslate('kk', item.text_ru);
                text_en = await googleTranslate('en', item.text_ru);
            }
        }
        const photo_path = item?.photo_path ? item.photo_path : `items/${uuid()}`;
        const { uploadError, urls } = await uploadFiles('crimeinfo_storage', photo_path, medias);
        if (uploadError) {
            setLoading(false);
            setErrors(uploadError.message);
            setIsError(true);
            setIsSuccesSave(false);
            return;
        }
        if (item?.id) {
            const { error } = await supabase.from('item')
                .update({
                    is_active: item.is_active,
                    is_reward: item.is_reward,
                    category_id: item.category_id,
                    title_kk: title_kk,
                    title_ru: item.title_ru,
                    title_en: title_en,
                    text_kk: text_kk,
                    text_ru: item.text_ru,
                    text_en: text_en,
                    region_id: item.region_id,
                    district_id: item.district_id,
                    punkt_kk: punkt_kk,
                    punkt_ru: item.punkt_ru,
                    punkt_en: punkt_en,
                    date_of_action: item.date_of_action,
                    time_of_action: item.time_of_action,
                    photo_path: photo_path,
                    data: { details: details, photos: urls },
                    show_danger_label: item.show_danger_label
                })
                .eq('id', item.id);
            if (error) {
                setLoading(false);
                setErrors(error.message);
                setIsError(true);
                setIsSuccesSave(false);
                return;
            }
        } else {
            const { data, error } = await supabase.from('item')
                .insert({
                    is_active: item.is_active,
                    is_reward: item.is_reward,
                    category_id: item.category_id,
                    title_kk: title_kk,
                    title_ru: item.title_ru,
                    title_en: title_en,
                    text_kk: text_kk,
                    text_ru: item.text_ru,
                    text_en: text_en,
                    region_id: item.region_id,
                    district_id: item.district_id,
                    punkt_kk: punkt_kk,
                    punkt_ru: item.punkt_ru,
                    punkt_en: punkt_en,
                    date_of_action: item.date_of_action,
                    time_of_action: item.time_of_action,
                    photo_path: photo_path,
                    data: { details: details, photos: urls },
                    show_danger_label: item.show_danger_label
                })
                .select()
                .single();
            if (error) {
                setLoading(false);
                setErrors(error.message);
                setIsError(true);
                setIsSuccesSave(false);
                return;
            }
            if (data) {
                setItem(data);
                newId = data.id;
            }
        }
        setLoading(false);
        setIsError(false);
        setIsSuccesSave(true);
        setInterval(() => setIsSuccesSave(false), 3000);
        if (newId) {
            navigate(`/items/edit/${newId}`);
        }
    }

    const handleClose = () => {
        navigate(-1);
    }


    const handleAddDetail = (fieldName: string | undefined, value: string | undefined) => {
        setDetailError(false);
        if (!fieldName || !value) {
            setDetailError(true);
            return;
        }
        setDetails([...details, { field_name: fieldName, value: value }]);
        setOpenDetail(false);
    }

    const handleRemoveDetail = (index: number) => {
        setDetails([
            ...details.slice(0, index),
            ...details.slice(index + 1, details.length)
        ]);
    }

    const handleAddMedia = () => {
        setMediaError(false);
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = async (e: Event) => {
            const files = (e.target as HTMLInputElement).files;
            if (e.target && files) {
                const file = files[0];
                const type = file.type.replace(/\/.+/, '');
                if (type === 'image' || type === 'video') {
                    const file_id = uuid()
                    setMedias([...medias, { id: file_id, file: file }]);
                }
            }
        };
        input.click();
    }

    const handleRemoveMedia = (index: number) => {
        setMedias([
            ...medias.slice(0, index),
            ...medias.slice(index + 1, medias.length)
        ]);
    }

    return (
        <div className="p-5">
            {roles.includes(UserRole.admin) || (roles.includes(UserRole.item_edit) && (item.id ? item.user_id === session?.user.id : true))
                ? <form method="post" action="/item" className="mt-4">
                    <div className="flex flex-row justify-end py-4">
                        <Button
                            className="bg-blue-400 mr-4"
                            size="sm"
                            onClick={handleSave}
                        >
                            {t('save')}
                        </Button>
                        <Button
                            className=""
                            variant="outlined"
                            size="sm"
                            color="blue"
                            onClick={handleClose}
                        >
                            {t('close')}
                        </Button>
                    </div>
                    <Alert className="bg-blue-400 mb-4" open={isSuccesSave} onClose={() => setIsSuccesSave(false)}>{t('successSave')}</Alert>
                    <Alert className="bg-red-500 mb-4" open={isError} onClose={() => setIsError(false)}>{errors}</Alert>
                    <div className="mb-4 w-fit">
                        <label
                            htmlFor="is_active"
                            className="text-blue-400 bold mr-1"
                        >
                            {t('active')}
                        </label>
                        <input
                            id="is_active"
                            type='checkbox'
                            name='is_active'
                            checked={item.is_active}
                            onChange={(e) => setItem({ ...item, is_active: !item.is_active })}
                            required={true}
                        />
                    </div>
                    <div className="w-full mb-4">
                        <SelectField
                            name='category_id'
                            label={t('category')}
                            value={String(item?.category_id)}
                            onChange={(e) => setItem({ ...item, category_id: Number(e.target.value) })}
                            dict={categories}
                            required={true}
                        />
                    </div>
                    {i18n.language === 'kk'
                        ? <div>
                            <div className="w-full bg-white mb-4">
                                <InputField
                                    type='text'
                                    name='title_kk'
                                    label={t('title_kk')}
                                    value={item.title_kk ? item.title_kk : ''}
                                    onChange={(e) => setItem({ ...item, title_kk: e.target.value })}
                                    required={true}
                                />
                            </div>
                            <div className="w-full bg-white mb-4">
                                <TextareaField
                                    rows={7}
                                    name='text_kk'
                                    label={t('text_kk')}
                                    value={item.text_kk ? item.text_kk : ''}
                                    onChange={(e) => setItem({ ...item, text_kk: e.target.value })}
                                    required={true}
                                />
                            </div>
                        </div>
                        : i18n.language === 'ru'
                            ? <div>
                                <div className="w-full bg-white mb-4">
                                    <InputField
                                        type='text'
                                        name='title_ru'
                                        label={t('title_ru')}
                                        value={item.title_ru ? item.title_ru : ''}
                                        onChange={(e) => setItem({ ...item, title_ru: e.target.value })}
                                        required={true}
                                    />
                                </div>
                                <div className="w-full bg-white mb-4">
                                    <TextareaField
                                        rows={7}
                                        name='text_ru'
                                        label={t('text_ru')}
                                        value={item.text_ru ? item.text_ru : ''}
                                        onChange={(e) => setItem({ ...item, text_ru: e.target.value })}
                                        required={true}
                                    />
                                </div>
                            </div>
                            : i18n.language === 'en'
                                ? <div>
                                    <div className="w-full bg-white mb-4">
                                        <InputField
                                            type='text'
                                            name='title_en'
                                            label={t('title_en')}
                                            value={item.title_en ? item.title_en : ''}
                                            onChange={(e) => setItem({ ...item, title_en: e.target.value })}
                                            required={true}
                                        />
                                    </div>
                                    <div className="w-full bg-white mb-4">
                                        <TextareaField
                                            rows={7}
                                            name='text_en'
                                            label={t('text_en')}
                                            value={item.text_en ? item.text_en : ''}
                                            onChange={(e) => setItem({ ...item, text_en: e.target.value })}
                                            required={true}
                                        />
                                    </div>
                                </div>
                                : null}
                    <div className="mb-4 w-fit">
                        <label
                            htmlFor="show_danger_label"
                            className="text-blue-400 bold mr-1"
                        >
                            {t('showDangerLabel')}
                        </label>
                        <input
                            id="show_danger_label"
                            type='checkbox'
                            name='show_danger_label'
                            checked={item.show_danger_label}
                            onChange={(e) => setItem({ ...item, show_danger_label: !item.show_danger_label })}
                            required={true}
                        />
                    </div>
                    <div className="mb-4 w-fit">
                        <label
                            htmlFor="is_reward"
                            className="text-blue-400 bold mr-1"
                        >
                            {t('reward')}
                        </label>
                        <input
                            id="is_reward"
                            type='checkbox'
                            name='is_reward'
                            checked={item.is_reward}
                            onChange={(e) => setItem({ ...item, is_reward: !item.is_reward })}
                            required={true}
                        />
                    </div>
                    <div className="w-44 bg-white mb-4">
                        <InputField
                            type='date'
                            name='date_of_action'
                            label={t('date')}
                            value={item.date_of_action}
                            onChange={(e) => setItem({ ...item, date_of_action: e.target.value })}
                            required={true}
                        />
                    </div>
                    <div className="w-44 bg-white mb-4">
                        <InputField
                            type='time'
                            name='time_of_action'
                            label={t('time')}
                            value={item.time_of_action}
                            onChange={(e) => setItem({ ...item, time_of_action: e.target.value })}
                            required={true}
                        />
                    </div>
                    <div className="w-full mb-4">
                        <SelectField
                            name='region_id'
                            label={t('region')}
                            value={String(item.region_id)}
                            dict={regions}
                            onChange={(e) => setItem({ ...item, region_id: Number(e.target.value) })}
                            required={true}
                        />
                    </div>
                    <div className="w-full mb-4">
                        <SelectField
                            name='district_id'
                            label={t('district')}
                            value={String(item.district_id)}
                            dict={districts}
                            onChange={(e) => setItem({ ...item, district_id: Number(e.target.value) })}
                            required={true}
                        />
                    </div>
                    {i18n.language === 'kk'
                        ? <div>
                            <div className="w-full bg-white mb-4">
                                <InputField
                                    type='text'
                                    name='punkt_kk'
                                    label={t('punkt')}
                                    value={item.punkt_kk ? item.punkt_kk : ''}
                                    onChange={(e) => setItem({ ...item, punkt_kk: e.target.value })}
                                    required={true}
                                />
                            </div>
                        </div>
                        : i18n.language === 'ru'
                            ? <div>
                                <div className="w-full bg-white mb-4">
                                    <InputField
                                        type='text'
                                        name='punkt_ru'
                                        label={t('punkt')}
                                        value={item.punkt_ru ? item.punkt_ru : ''}
                                        onChange={(e) => setItem({ ...item, punkt_ru: e.target.value })}
                                        required={true}
                                    />
                                </div>
                            </div>
                            : i18n.language === 'en'
                                ? <div>
                                    <div className="w-full bg-white mb-4">
                                        <InputField
                                            type='text'
                                            name='punkt_en'
                                            label={t('punkt')}
                                            value={item.punkt_en ? item.punkt_en : ''}
                                            onChange={(e) => setItem({ ...item, punkt_en: e.target.value })}
                                            required={true}
                                        />
                                    </div>
                                </div>
                                : null}

                    <div className="w-full bg-white mb-4">
                        <DetailsTable
                            details={details}
                            fields={fields}
                            handleAddDetail={handleAddDetail}
                            handleRemoveDetail={handleRemoveDetail}
                            showError={detailError}
                            openDetail={openDetail}
                            setOpenDetail={setOpenDetail}
                        />
                    </div>
                    <div className="w-full bg-white mb-4">
                        <MediasTable
                            mediaItems={medias}
                            handleAddMedia={handleAddMedia}
                            handleRemoveMedia={handleRemoveMedia}
                            showError={photoError}
                        />
                    </div>
                    {loading ? <Loading /> : null}
                </form >
                : <Alert className="bg-red-500 my-4">{t('errorAccess')}</Alert>}
        </div>
    )
}

export default ItemForm;