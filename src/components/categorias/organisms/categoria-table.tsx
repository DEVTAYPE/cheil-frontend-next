import type { Categoria } from "@/lib/types";
import { EmptyRow } from "../molecules/empty-row";
import { CategoriaRow } from "./categoria-row";

const TABLE_HEADERS = ["#", "Nombre", "Descripción", "Acciones"];

interface CategoriaTableProps {
  categorias: Categoria[];
  onEdit: (cat: Categoria) => void;
  onRequestDelete: (id: number) => void;
}

export function CategoriaTable({
  categorias,
  onEdit,
  onRequestDelete,
}: CategoriaTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {TABLE_HEADERS.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categorias.length === 0 ? (
            <EmptyRow colSpan={TABLE_HEADERS.length} />
          ) : (
            categorias.map((cat, idx) => (
              <CategoriaRow
                key={cat.id}
                idx={idx}
                categoria={cat}
                onEdit={() => onEdit(cat)}
                onRequestDelete={() => onRequestDelete(cat.id)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
