import { Box } from '@mui/material'
import useTableState from '../hoooks/useTableState'
import { DataGrid } from '@mui/x-data-grid'

const TableView = () => {
  const { columns, rows, setColumns } = useTableState()

  return (
    <Box sx={{ height: 'auto', width: '100vw' }}>
      <DataGrid
        onColumnHeaderDoubleClick={(params) => {
          console.log(params)
        }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </Box>
  )
}

export default TableView
