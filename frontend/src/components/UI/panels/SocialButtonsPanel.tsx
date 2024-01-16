import { useTranslation } from "react-i18next";

interface SocialButtonsPanelProps {
    link: string
}
const SocialButtonsPanel = ({ link }: SocialButtonsPanelProps) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-row justify-end items-center px-4 gap-3">
            <div className="text-sm text-blue-gray-800 font-bold lowercase">{t('share')}:</div>
            <div className="h-6 w-6 mr-2">
                <a
                    href={`https://vk.com/share.php?url=${link}`}
                    target="_blank"
                    rel="noreferrer"
                    title="ВКонтакте" >
                    <img className="h-full w-full object-cover object-center" src="/vkontakte.png" alt="vkontakte" />
                </a>
            </div>
            <div className="h-6 w-6 mr-2">
                <a
                    href={`https://t.me/share/url?url=${link}`}
                    rel="noreferrer"
                    target="_blank"
                    title="Telegram"
                >
                    <img className="h-full w-full object-cover object-center" src="/telegram.png" alt="telegram" />
                </a>
            </div>
            <div className="h-6 w-6 mr-2">
                <a
                    href={`https://api.whatsapp.com/send?text=${link}`}
                    rel="noreferrer"
                    target="_blank"
                    title="Whatsapp"
                >
                    <img className="h-full w-full object-cover object-center" src="/whatsapp.png" alt="whatsapp" />
                </a>
            </div>
        </div>
    )
}

export default SocialButtonsPanel;