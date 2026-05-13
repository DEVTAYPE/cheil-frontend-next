export function EmptyRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12 text-center text-gray-400">
        No hay categorías registradas
      </td>
    </tr>
  )
}
