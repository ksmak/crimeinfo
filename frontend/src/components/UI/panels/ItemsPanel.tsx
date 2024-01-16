import { Collapse } from "@material-tailwind/react";
import { Dict, Item } from "../../../types/types";
import ItemCard from "../cards/ItemCard";


interface ItemsPanelProps {
    items: Item[] | undefined,
    regions: Dict[] | undefined,
    districts: Dict[] | undefined,
    openItems: boolean,
}

const ItemsPanel = ({ items, regions, districts, openItems }: ItemsPanelProps) => {

    return (
        <Collapse
            className="flex flex-row gap-4 flex-wrap overflow-x-auto"
            open={openItems}
        >
            {items
                ? items.map((item) => {
                    return (
                        <ItemCard
                            key={item.id}
                            item={item}
                            regions={regions}
                            districts={districts}
                        />)
                })
                : null}
        </Collapse>
    )
}

export default ItemsPanel;