import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { Box } from '@mui/material'

interface DataTableProps {
  columns: GridColDef[]
  data: GridRowsProp
  setColumns: React.Dispatch<React.SetStateAction<GridColDef[]>>
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, setColumns }) => {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        onColumnHeaderClick={(params) => {
          // Handle column header click logic here
        }}
        getRowId={(row) => row.id}
        // Add more props as needed
      />
    </Box>
  )
}

export default DataTable
