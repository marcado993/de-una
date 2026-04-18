import { ActionTile, type ActionTileProps } from "../molecules/ActionTile";

export type ActionGridProps = {
  items: ActionTileProps[];
  columns?: number;
};

/**
 * Organism — home-screen grid of action tiles. Wraps items into rows of
 * `columns` entries and delegates each cell to the `ActionTile` molecule.
 */
export function ActionGrid({ items, columns = 5 }: ActionGridProps) {
  const rows: ActionTileProps[][] = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }

  return (
    <div className="flex flex-col gap-4">
      {rows.map((row, idx) => (
        <div key={idx} className="flex justify-between">
          {row.map((item, i) => (
            <ActionTile key={`${idx}-${i}-${item.label}`} {...item} />
          ))}
        </div>
      ))}
    </div>
  );
}
