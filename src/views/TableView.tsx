import {
  Button,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
} from '@mui/material'
import {
  DataGrid,
  GridColumnMenu,
  GridColumnMenuItemProps,
  GridColumnMenuProps,
  useGridApiRef,
} from '@mui/x-data-grid'
import { ArrowBack, ArrowForward } from '@mui/icons-material'
import { BarChart } from '@mui/x-charts'
import {
  useEffect,
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from 'react'
import useTableState, { headers } from '../hoooks/useTableState'
import { useNavigate, useSearchParams } from 'react-router-dom'

const chartSetting = {
  xAxis: [
    {
      label: 'Number of companies out of service',
    },
  ],
  width: 500,
  height: 400,
}

type MonthlyCount = {
  count: number
  month: string
}

const STORAGE_KEY = {
  STATE: 'IS_dataTableState',
  COLUMNS: 'IS_colOrder',
}

export const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function encodeData(data) {
  return btoa(encodeURIComponent(JSON.stringify(data)))
}

function decodeData(encodedData) {
  return JSON.parse(decodeURIComponent(atob(encodedData)))
}
const TableView = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const apiRef = useGridApiRef()
  const { columns, rows, setColumns } = useTableState()
  const [initialState, setInitialState] = useState()
  const [visibleRowsLookup, setVisibleRowsLookup] = useState<{
    [key: string]: boolean
  }>({})
  const [graphData, setGraphData] = useState<MonthlyCount[]>([])

  // Ref to keep track of the previous visibleRowsLookup state
  const prevVisibleRowsLookupRef = useRef<{
    [key: string]: boolean
  } | null>(null)

  const convertToMonthCounts = useMemo(() => {
    const monthCounts = new Map<string, number>()

    // Iterate through only visible rows
    for (const row of rows) {
      if (visibleRowsLookup[row.id]) {
        const outOfServiceDate = row.out_of_service_date

        if (outOfServiceDate && outOfServiceDate.trim() !== '') {
          const month = outOfServiceDate.split('/')[0] // Extract the month part

          // Increment the count for the month
          monthCounts.set(month, (monthCounts.get(month) || 0) + 1)
        }
      }
    }

    // Map month numbers to month names

    // Create the result array
    return Array.from(monthCounts.entries()).map(([month, count]) => ({
      count,
      month: monthNames[parseInt(month) - 1],
    }))
  }, [rows, visibleRowsLookup])

  // Only run effect when convertToMonthCounts changes

  const reorderColumns = (field: string, forward: boolean) => {
    const temp = columns.slice()
    const index = temp.findIndex((column) => column.field === field)

    if (index === -1) {
      console.warn(`Field "${field}" not found in columns.`)
      return
    }

    const [item] = temp.splice(index, 1)
    const newIndex = forward
      ? (index + 1) % temp.length
      : (index - 1 + temp.length) % temp.length

    temp.splice(newIndex, 0, item)
    setColumns(temp)
  }

  function CustomUserItem(props: GridColumnMenuItemProps) {
    const field = props.colDef.field
    return (
      <MenuList>
        <MenuItem
          onClick={() => {
            reorderColumns(field, false)
          }}
        >
          <ListItemIcon>
            <ArrowBack fontSize='small' />
          </ListItemIcon>
          <ListItemText>{'Move Left'}</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            reorderColumns(field, true)
          }}
        >
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
            displayOrder: 15,
          },
        }}
      />
    )
  }

  const saveSnapshot = useCallback(() => {
    if (apiRef?.current?.exportState && localStorage) {
      const currentState = apiRef.current.exportState()
      localStorage.setItem(STORAGE_KEY.STATE, JSON.stringify(currentState))
      localStorage.setItem(
        STORAGE_KEY.COLUMNS,
        JSON.stringify(columns.map((c) => c.field))
      )
    }
  }, [apiRef])

  useLayoutEffect(() => {
    let state = null
    let columns = null
    if (searchParams.size == 1) {
      const data = decodeData(searchParams.get('data'))
      state = data[STORAGE_KEY.STATE]
      columns = data[STORAGE_KEY.COLUMNS]
      setInitialState(state ? state : {})
    } else {
      state = localStorage?.getItem(STORAGE_KEY.STATE)
      columns = localStorage?.getItem(STORAGE_KEY.COLUMNS)
      state = state ? JSON.parse(state) : {}
      columns = columns ? JSON.parse(columns) : {}
    }
    setInitialState(state ? state : {})

    if (columns) {
      const reorderedColumns = (columns as string[])
        .map((field) => headers.find((col) => col.field === field))
        .filter((col) => col !== undefined)
      setColumns(reorderedColumns)
    }

    // handle refresh and navigating away/refreshing
    window.addEventListener('beforeunload', saveSnapshot)

    return () => {
      // in case of an SPA remove the event-listener
      window.removeEventListener('beforeunload', saveSnapshot)
      saveSnapshot()
    }
  }, [saveSnapshot])
  useEffect(() => {
    // Compare previous and current visibleRowsLookup
    if (prevVisibleRowsLookupRef.current !== visibleRowsLookup) {
      setGraphData(convertToMonthCounts)
      prevVisibleRowsLookupRef.current = visibleRowsLookup
    }
  }, [visibleRowsLookup, convertToMonthCounts])

  useEffect(() => {
    setGraphData(convertToMonthCounts)
  }, [convertToMonthCounts])

  if (!initialState || !rows.length) {
    return <CircularProgress />
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4rem',
      }}
    >
      <Button
        variant='contained'
        color='primary'
        onClick={() => navigate('/pivot')}
      >
        Go to Pivot View
      </Button>
      <Button
        variant='contained'
        color='primary'
        onClick={() => {
          if (apiRef?.current?.exportState) {
            const data = {
              [STORAGE_KEY.STATE]: apiRef.current.exportState(),
              [STORAGE_KEY.COLUMNS]: columns.map((c) => c.field),
            }

            console.log(`${location.origin}?data=${encodeData(data)}`)
          }
        }}
      >
        Share Table
      </Button>
      <BarChart
        dataset={graphData}
        yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
        series={[{ dataKey: 'count', label: 'Out of service' }]}
        layout='horizontal'
        {...chartSetting}
      />
      <div
        style={{
          width: '97vw',
          margin: '1rem',
          flex: 1,
        }}
      >
        <DataGrid
          slots={{ columnMenu: CustomColumnMenu }}
          rows={rows}
          columns={columns}
          initialState={initialState}
          getRowId={(row) => row.id}
          onStateChange={(state) => {
            const newVisibleRowsLookup = state.visibleRowsLookup
            // Compare current and previous state to avoid unnecessary updates
            if (
              JSON.stringify(newVisibleRowsLookup) !==
              JSON.stringify(visibleRowsLookup)
            ) {
              setVisibleRowsLookup(newVisibleRowsLookup)
            }
          }}
          pageSizeOptions={[25, 50, 100]}
          editMode='cell'
          apiRef={apiRef}
        />
      </div>
    </div>
  )
}

export default TableView
