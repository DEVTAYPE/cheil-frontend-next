import Link from "next/link";
import type { Producto } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "../atoms/product-image";
import { ProductoInfo } from "../molecules/producto-info";
import { DeleteActions } from "../molecules/delete-actions";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(
    price,
  );

interface ProductoRowProps {
  producto: Producto;
  idx: number;
  onRequestDelete: () => void;
}

export function ProductoRow({
  producto,
  idx,
  onRequestDelete,
}: ProductoRowProps) {
  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
      <td className="px-4 py-3">
        <ProductImage src={producto.imagenUrl} alt={producto.nombre} />
      </td>
      <td className="px-4 py-3">
        <ProductoInfo
          nombre={producto.nombre}
          descripcion={producto.descripcion}
        />
      </td>
      <td className="px-4 py-3">
        <Badge variant="blue">{producto.categoria.nombre}</Badge>
      </td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        {formatPrice(producto.precio)}
      </td>
      <td className="px-4 py-3">
        <Badge variant={producto.stock > 0 ? "green" : "red"}>
          {producto.stock}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Link href={`/productos/${producto.id}/editar`}>
            <Button variant="secondary" size="sm">
              Editar
            </Button>
          </Link>
          <DeleteActions onRequest={onRequestDelete} />
        </div>
      </td>
    </tr>
  );
}
