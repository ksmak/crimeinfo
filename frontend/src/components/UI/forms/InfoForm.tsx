import { Alert, Button } from "@material-tailwind/react"
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { supabase } from "../../../api/supabase";
import { Info, Media, UserRole } from "../../../types/types";
import Loading from "../elements/Loading";
import InputField from "../elements/InputField";
import moment from "moment";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'
import MediaTable from "../elements/MediaTable";
import uuid from "react-uuid";
import { getFileFromUrl, uploadFiles } from "../../../utils/utils";
import { AuthContext } from "../../../App";


interface InfoFormProps {
    infoId: string | undefined
}

const InfoForm = ({ infoId }: InfoFormProps) => {
    const { session, roles } = useContext(AuthContext);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [openSucces, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [info, setInfo] = useState<Info>({
        id: null,
        is_active: false,
        order: null,
        title_ru: null,
        title_kk: null,
        title_en: null,
        text_kk: null,
        text_ru: null,
        text_en: null,
        date_of_action: moment().format('YYYY-MM-DD'),
        data: null,
        photo_path: null
    } as Info);
    const [loading, setLoading] = useState(false);
    const [editorStateKk, setEditorStateKk] = useState<EditorState>(EditorState.createEmpty());
    const [editorStateRu, setEditorStateRu] = useState<EditorState>(EditorState.createEmpty());
    const [editorStateEn, setEditorStateEn] = useState<EditorState>(EditorState.createEmpty());
    const [photos, setMedias] = useState<Media[]>([]);
    const [photoError, setMediaError] = useState(false);

    useEffect(() => {
        if (infoId) {
            getInfo();
        }
        // eslint-disable-next-line 
    }, []);

    const setContent = (content: string) => {
        const blocksFromHtml = htmlToDraft(content);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        return EditorState.createWithContent(contentState);
    }

    const onEditorStateChangeKk = (editorState: EditorState) => {
        setEditorStateKk(editorState);
        const markup = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        setInfo({ ...info, text_kk: markup });
    };

    const onEditorStateChangeRu = (editorState: EditorState) => {
        setEditorStateRu(editorState);
        const markup = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        setInfo({ ...info, text_ru: markup });
    };

    const onEditorStateChangeEn = (editorState: EditorState) => {
        setEditorStateEn(editorState);
        const markup = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        setInfo({ ...info, text_en: markup });
    };

    const getInfo = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('info')
            .select()
            .or(`and(id.eq.${infoId},is_active.eq.true), and(id.eq.${infoId}${session?.user.id ? ', user_id.eq.' + session.user.id : ''})`)
            .single();
        if (error) {
            setLoading(false);
            setErrorMessage(error.message);
            setOpenError(true);
            return;
        }
        if (data) {
            setInfo(data);
            if (data.data?.photos) {
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
            if (data.text_kk) {
                setEditorStateKk(setContent(data.text_kk));
            }
            if (data.text_ru) {
                setEditorStateRu(setContent(data.text_ru));
            }
            if (data.text_en) {
                setEditorStateEn(setContent(data.text_en));
            }
        }
        setLoading(false);
    }

    const handleSave = async () => {
        let newId = '';
        setErrorMessage('');
        setOpenError(false);
        setOpenSuccess(false);
        setLoading(true);
        const photo_path = info.photo_path ? info.photo_path : `info/${uuid()}`;
        const { uploadError, urls } = await uploadFiles('crimeinfo_storage', photo_path, photos);
        if (uploadError) {
            setLoading(false);
            setErrorMessage(uploadError.message);
            setOpenError(true);
            setOpenSuccess(false);
            return;
        }
        setInfo({ ...info, photo_path: photo_path });
        if (info.id) {
            const { error } = await supabase.from('info')
                .update({
                    is_active: info.is_active,
                    order: info.order,
                    title_kk: info.title_kk,
                    title_ru: info.title_ru,
                    title_en: info.title_en,
                    text_kk: info.text_kk,
                    text_ru: info.text_ru,
                    text_en: info.text_en,
                    date_of_action: info.date_of_action,
                    photo_path: photo_path,
                    data: { photos: urls },
                })
                .eq('id', info.id);
            if (error) {
                setLoading(false);
                setErrorMessage(error.message);
                setOpenError(true);
                setOpenSuccess(false);
                return;
            }
        } else {
            const { data, error } = await supabase.from('info')
                .insert({
                    is_active: info.is_active,
                    order: info.order,
                    title_kk: info.title_kk,
                    title_ru: info.title_ru,
                    title_en: info.title_en,
                    text_kk: info.text_kk,
                    text_ru: info.text_ru,
                    text_en: info.text_en,
                    date_of_action: info.date_of_action,
                    photo_path: photo_path,
                    data: { photos: urls },
                })
                .select()
                .single();
            if (error) {
                setLoading(false);
                setErrorMessage(error.message);
                setOpenError(true);
                setOpenSuccess(false);
                return;
            }
            if (data) {
                setInfo(data);
                newId = data.id;
            }
        }
        setLoading(false);
        setOpenError(false);
        setOpenSuccess(true);
        setInterval(() => setOpenSuccess(false), 3000);
        if (newId) {
            navigate(`/info/edit/${newId}`);
        }
    }

    const handleAddMedia = () => {
        setMediaError(false);
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = async (e: Event) => {
            const files = (e.target as HTMLInputElement).files;
            if (e.target && files) {
                const file = files[0];
                const file_id = uuid()
                setMedias([...photos, { id: file_id, file: file }]);
            }
        };
        input.click();
    }

    const handleRemoveMedia = (index: number) => {
        if (index === 0) {
            setMedias([]);
        } else {
            setMedias(photos.splice(index, 1));
        }
    }

    return (
        <div className="p-5">
            {roles.includes(UserRole.admin) || (roles.includes(UserRole.info_edit) && info.user_id === session?.user.id)
                ? <div>
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
                            onClick={() => navigate(-1)}
                        >
                            {t('close')}
                        </Button>
                    </div>
                    <Alert className="bg-teal-500 mb-4" open={openSucces} onClose={() => setOpenSuccess(false)}>{t('successSave')}</Alert>
                    <Alert className="bg-red-500 mb-4" open={openError} onClose={() => setOpenError(false)}>{errorMessage}</Alert>
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
                            checked={info.is_active}
                            onChange={(e) => setInfo({ ...info, is_active: !info.is_active })}
                            required={true}
                        />
                    </div>
                    <div className="w-full  mb-4">
                        <InputField
                            type='number'
                            name='order'
                            label={t('order')}
                            value={info.order ? info.order.toString() : ''}
                            onChange={(e) => setInfo({ ...info, order: Number(e.target.value) })}
                            required={true}
                        />
                    </div>
                    {i18n.language === 'kk'
                        ? <div>
                            <div className="w-full  mb-4">
                                <InputField
                                    type='text'
                                    name='title_kk'
                                    label={t('title_kk')}
                                    value={info.title_kk ? info.title_kk : ''}
                                    onChange={(e) => setInfo({ ...info, title_kk: e.target.value })}
                                    required={true}
                                />
                            </div>
                            <div className="w-full  mb-4">
                                <div className="text-blue-400">{t('text_kk')}</div>
                                <Editor
                                    editorState={editorStateKk}
                                    toolbarClassName="toolbar-class"
                                    wrapperClassName="wrapper-class"
                                    editorClassName="editor-class"
                                    onEditorStateChange={onEditorStateChangeKk}
                                />
                            </div>
                        </div>
                        : i18n.language === 'ru'
                            ? <div>
                                <div className="w-full  mb-4">
                                    <InputField
                                        type='text'
                                        name='title_ru'
                                        label={t('title_ru')}
                                        value={info.title_ru ? info.title_ru : ''}
                                        onChange={(e) => setInfo({ ...info, title_ru: e.target.value })}
                                        required={true}
                                    />
                                </div>
                                <div className="w-full  mb-4">
                                    <div className="text-blue-400">{t('text_ru')}</div>
                                    <Editor
                                        editorState={editorStateRu}
                                        toolbarClassName="toolbar-class"
                                        wrapperClassName="wrapper-class"
                                        editorClassName="editor-class"
                                        onEditorStateChange={onEditorStateChangeRu}
                                    />
                                </div>
                            </div>
                            : i18n.language === 'en'
                                ? <div>
                                    <div className="w-full  mb-4">
                                        <InputField
                                            type='text'
                                            name='title_en'
                                            label={t('title_en')}
                                            value={info.title_en ? info.title_en : ''}
                                            onChange={(e) => setInfo({ ...info, title_en: e.target.value })}
                                            required={true}
                                        />
                                    </div>
                                    <div className="w-full  mb-4">
                                        <div className="text-blue-400">{t('text_en')}</div>
                                        <Editor
                                            editorState={editorStateEn}
                                            toolbarClassName="toolbar-class"
                                            wrapperClassName="wrapper-class"
                                            editorClassName="editor-class"
                                            onEditorStateChange={onEditorStateChangeEn}
                                        />
                                    </div>
                                </div>
                                : null
                    }
                    <div className="w-44  mb-4">
                        <InputField
                            type='date'
                            name='date_of_action'
                            label={t('date')}
                            value={info.date_of_action}
                            onChange={(e) => setInfo({ ...info, date_of_action: e.target.value })}
                            required={true}
                        />
                    </div>
                    <div className="w-full bg-white mb-4">
                        <MediaTable
                            mediaItems={photos}
                            handleAddMedia={handleAddMedia}
                            handleRemoveMedia={handleRemoveMedia}
                            showError={photoError}
                        />
                    </div>
                    {loading ? <Loading /> : null}
                </div>
                : <Alert className="bg-red-500 my-4">{t('errorAccess')}</Alert>}
        </div>
    )
}

export default InfoForm;