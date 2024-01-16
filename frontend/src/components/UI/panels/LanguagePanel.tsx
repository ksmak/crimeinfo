import { useTranslation } from "react-i18next";

const LanguagePanel = () => {
    const { i18n } = useTranslation();

    const langs = [
        {
            title: 'kz',
            label: 'kk'
        },
        {
            title: 'ru',
            label: 'ru'
        },
        {
            title: 'en',
            label: 'en'
        },
    ]

    return (
        <div className="flex flex-row items-center gap-3">
            {langs.map((item, index) => (
                <span
                    key={index}
                    className={`${i18n.language === item.label ? 'bg-primary-500' : 'bg-blue-gray-300'} text-white border-4 border-blue-gray-100 rounded-full h-8 w-8 pt-0.5 text-center text-sm hover:cursor-pointer uppercase`}
                    onClick={() => i18n.changeLanguage(item.label)}
                >
                    {item.title}
                </span>
            ))}
        </div>
    )
}

export default LanguagePanel;