import { Alert, Button } from "@material-tailwind/react"
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { IInfo, Media, UserRole } from "../../../types/types";
import Loading from "../elements/Loading";
import InputField from "../elements/InputField";
import moment from "moment";
import { Editor } from "react-draft-wysiwyg";
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'
import MediaTable from "../elements/MediaTable";
import { getFileFromUrl, uploadFiles } from "../../../utils/utils";
import { useAuth } from "../../../lib/auth";
import instance from "../../../api/instance";
import axios from "axios";


interface InfoFormProps {
    infoId: string | undefined
}

const InfoForm = ({ infoId }: InfoFormProps) => {
    const { roles } = useAuth();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState<IInfo>({
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
        files: [],
    } as IInfo);
    const [loading, setLoading] = useState(false);
    const [editorStateKk, setEditorStateKk] = useState<EditorState>(EditorState.createEmpty());
    const [editorStateRu, setEditorStateRu] = useState<EditorState>(EditorState.createEmpty());
    const [editorStateEn, setEditorStateEn] = useState<EditorState>(EditorState.createEmpty());
    const [medias, setMedias] = useState<Media[]>([]);
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
        try {
            const res = await instance.get(`${process.env.REACT_APP_API_HOST}/info/${infoId}`);
            setInfo(res.data);
            if (res.data.files) {
                let files: Media[] = [];
                for (const f of res.data.files) {
                    const file = await getFileFromUrl(f.file);
                    files.push({ file: file });
                    setMedias(files);
                }
            }
            if (res.data.text_kk) {
                setEditorStateKk(setContent(res.data.text_kk));
            }
            if (res.data.text_ru) {
                setEditorStateRu(setContent(res.data.text_ru));
            }
            if (res.data.text_en) {
                setEditorStateEn(setContent(res.data.text_en));
            }
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
    const handleSave = async () => {
        let newId = '';
        setError('');
        setSuccess('');
        setLoading(true);
        if (info.id) {
            try {
                const res = await instance.put(`${process.env.REACT_APP_API_HOST}/api/info/${info.id}/`, info);
                setInfo(res.data);
                await uploadFiles(`${process.env.REACT_APP_API_HOST}/api/info/${info.id}/upload_files/`, medias);
                setLoading(false);
                setError('');
                setSuccess(t('successSave'));
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data.new_password);
                } else {
                    setError(String(error));
                }
                setLoading(false);
                setSuccess('');
            }
        } else {
            try {
                const res = await instance.post(`${process.env.REACT_APP_API_HOST}/info/`, info);
                setInfo(res.data);
                await uploadFiles(`${process.env.REACT_APP_API_HOST}/api/info/${res.data.id}/upload_files/`, medias);
                setLoading(false);
                setError('');
                setSuccess(t('successSave'));
                newId = res.data.id;
                navigate(`/info/edit/${newId}`);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data.new_password);
                } else {
                    setError(String(error));
                }
                setLoading(false);
                setSuccess('');
            }
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
                setMedias([...medias, { file: file }]);
            }
        };
        input.click();
    }

    const handleRemoveMedia = (index: number) => {
        if (index === 0) {
            setMedias([]);
        } else {
            setMedias(medias.splice(index, 1));
        }
    }

    return (
        <div className="p-5">
            {roles.some(item => item.role === UserRole.admin || item.role === UserRole.info_edit)
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
                    <Alert className="bg-teal-500 mb-4" open={success !== ''} onClose={() => setSuccess('')}>{success}</Alert>
                    <Alert className="bg-red-500 mb-4" open={error !== ''} onClose={() => setError('')}>{error}</Alert>
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
                            mediaItems={medias}
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