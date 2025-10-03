import {
  flexRender, 
  getCoreRowModel,
  useReactTable,
 } from "@tanstack/react-table"
import PropTypes from 'prop-types';



const TableDesignModel = ({subCategoryData, columns}) => {

  const table = useReactTable({
    data: subCategoryData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
    <table className="w-full">
      <thead className="bg-blue-500 text-white">
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            <th>Serial No.</th>
            {headerGroup.headers.map(header => (
              <th key={header.id} className="border whitespace-nowrap">
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row,index) => (
          <tr key={row.id}>
            <td className="border border-gray-300 px-2 py-4">{index+1}</td>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className="border border-gray-300 px-2 whitespace-nowrap">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <div className="h-4" />
  </div>
  )
}
TableDesignModel.propTypes = {
  subCategoryData: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

export default TableDesignModel