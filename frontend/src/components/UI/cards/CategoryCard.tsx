import { Link } from "react-router-dom";
import { ICategory } from "../../../types/types";
import { useTranslation } from "react-i18next";

interface CategoryProps {
    category: ICategory
}

const CategoryCard = ({ category }: CategoryProps) => {
    const { i18n } = useTranslation();

    let title = category[`title_${i18n.language}` as keyof typeof category] as string;

    return (
        <div className="shrink-0 w-28 text-center m-3 flex flex-col gap-3">
            <Link to={`/search?category=${category.id}`}>
                <img
                    className="h-28 w-28 rounded-full object-contain object-center p-3 bg-white"
                    src={category.photo ? category.photo : undefined}
                    alt={title ? title : undefined}
                />
            </Link>
            <Link to={`/search?category=${category.id}`} className="text-blue-gray-700 h-20 text-sm hover:underline">
                {title}
            </Link>
        </div>
    )
}

export default CategoryCard;