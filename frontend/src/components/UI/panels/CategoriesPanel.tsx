import { Category } from "../../../types/types";
import CategoryCard from "../cards/CategoryCard";
import { MouseEvent, useRef, useState } from "react";

interface CategoriesPanelProps {
    categories: Category[] | undefined,
}

const CategoriesPanel = ({ categories }: CategoriesPanelProps) => {
    const ourRef = useRef<HTMLDivElement>(null);
    const journalRef = useRef<HTMLDivElement>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const mouseCoords = useRef({
        startX: 0,
        startY: 0,
        scrollLeft: 0,
        scrollTop: 0
    });
    const handleDragStart = (e: MouseEvent<HTMLDivElement>) => {
        if (!ourRef.current) return
        const slider = ourRef.current.children[0] as HTMLElement;
        const startX = e.pageX - slider.offsetLeft;
        const startY = e.pageY - slider.offsetTop;
        const scrollLeft = slider.scrollLeft;
        const scrollTop = slider.scrollTop;
        mouseCoords.current = { startX, startY, scrollLeft, scrollTop }
        setIsMouseDown(true)
        document.body.style.cursor = "grabbing"
    }
    const handleDragEnd = () => {
        setIsMouseDown(false)
        if (!ourRef.current) return
        document.body.style.cursor = "default"
    }
    const handleDrag = (e: MouseEvent<HTMLDivElement>) => {
        if (!isMouseDown || !ourRef.current) return;
        e.preventDefault();
        const slider = ourRef.current.children[0] as HTMLElement;
        const x = e.pageX - slider.offsetLeft;
        const y = e.pageY - slider.offsetTop;
        const walkX = (x - mouseCoords.current.startX) * 1.5;
        const walkY = (y - mouseCoords.current.startY) * 1.5;
        slider.scrollLeft = mouseCoords.current.scrollLeft - walkX;
        slider.scrollTop = mouseCoords.current.scrollTop - walkY;
        // console.log(walkX, walkY);
    }

    return (
        <div
            ref={ourRef}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onMouseMove={handleDrag}
            className="drag flex flex-row overflow-x-hidden"
        >
            <div
                className="flex flex-row overflow-x-auto w-full xl:justify-center"
                ref={journalRef}
            >

                {categories
                    ? categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                        />
                    ))
                    : null}
            </div>
        </div>
    )
}

export default CategoriesPanel;