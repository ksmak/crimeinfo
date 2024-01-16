import { useContext, useEffect, useState } from "react";
import NavigatorPanel from "../panels/NavigatorPanel";
import { MetaDataContext } from "../../../App";
import Loading from "../elements/Loading";
import { useTranslation } from "react-i18next";
import { Typography } from "@material-tailwind/react";
import { CategoryInfo } from "../../../types/types";
import { supabase } from "../../../api/supabase";
import { Link } from "react-router-dom";

const CategoriesPage = () => {
    const { t, i18n } = useTranslation();
    const { categories } = useContext(MetaDataContext);
    const [loading, setLoading] = useState(false);
    const [categoryInfo, setCategoryInfo] = useState<CategoryInfo[]>([]);

    const getCategoryInfo = async () => {
        const { data } = await supabase
            .from('category_info')
            .select()
        if (data) {
            setCategoryInfo(data);
        }
    }

    useEffect(() => {
        setLoading(true);
        getCategoryInfo();
        setLoading(false);
    }, [])

    return (
        <div>
            <NavigatorPanel />
            <div className="px-5 h-[calc(100vh-5.75rem)] overflow-y-auto">
                <div className="flex flex-row justify-between items-center py-5">
                    <Typography
                        className="text-primary-500"
                        variant="h4"
                    >
                        {t('categories')}
                    </Typography>
                    <Link to="/">
                        <Typography
                            className="text-primary-500 underline"
                            variant="paragraph"
                        >
                            {t('back')}
                        </Typography>
                    </Link>
                </div>
                {categoryInfo
                    ? categories?.map((category) => {
                        let title = category[`title_${i18n.language}` as keyof typeof category] as string;
                        let catInfo = categoryInfo.find(cat => cat.category_id === category.id);
                        if (catInfo) {
                            title = `${title} (${catInfo.count})`
                        }
                        return (
                            <div key={category.id} className="w-full mb-4 border-2 border-blue-gray-200 rounded-md p-3">
                                <Link
                                    className="flex flex-row items-center"
                                    to={`/search?category=${category.id}`}
                                >
                                    <img
                                        className="h-16 w-16 rounded-full object-contain object-center border-2 border-primary-500 p-1 "
                                        src={category.photo ? category.photo : undefined}
                                        alt={title ? title : undefined}
                                    />
                                    <Typography variant="lead" className="ml-5 text-primary-500">
                                        {title}
                                    </Typography>
                                </Link>
                            </div>
                        )
                    })
                    : null}
                {loading ? <Loading /> : null}
            </div>
        </div>
    )
}

export default CategoriesPage;