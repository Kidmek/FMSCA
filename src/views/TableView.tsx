import {
  Box,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
} from '@mui/material'
import useTableState from '../hoooks/useTableState'
import {
  DataGrid,
  GridColumnMenu,
  GridColumnMenuItemProps,
  GridColumnMenuProps,
} from '@mui/x-data-grid'
import { ArrowForward } from '@mui/icons-material'

const TableView = () => {
  const { columns, rows, setColumns } = useTableState()

  function CustomUserItem(props: GridColumnMenuItemProps) {
    return (
      <MenuList>
        <MenuItem onClick={() => {}}>
          <ListItemIcon>
            <ArrowForward fontSize='small' />
          </ListItemIcon>
          <ListItemText>{'Move Left'}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {}}>
          <ListItemIcon>
            <ArrowForward fontSize='small' />
          </ListItemIcon>
          <ListItemText>{'Move Right'}</ListItemText>
        </MenuItem>
      </MenuList>
    )
  }
  function CustomColumnMenu(props: GridColumnMenuProps) {
    return (
      <GridColumnMenu
        {...props}
        slots={{
          columnMenuUserItem: CustomUserItem,
        }}
        slotProps={{
          columnMenuUserItem: {
            // set `displayOrder` for the new item
            displayOrder: 15,
            // Additional props
            myCustomValue: 'Move right',
            myCustomHandler: () => alert('Custom handler fired'),
          },
        }}
      />
    )
  }

  return (
    <Box sx={{ height: 'auto', width: '100vw' }}>
      <DataGrid
        slots={{ columnMenu: CustomColumnMenu }}
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
