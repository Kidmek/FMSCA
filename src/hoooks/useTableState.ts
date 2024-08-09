import { useState, useEffect } from 'react'
import { parse } from 'papaparse'
import { GridColDef } from '@mui/x-data-grid'

export type TruckingCompany = {
  created_dt: string
  data_source_modified_dt: string
  entity_type: string
  operating_status: string
  legal_name: string
  dba_name: string
  physical_address: string
  p_street: string
  p_city: string
  p_state: string
  p_zip_code: string
  phone: string
  mailing_address: string
  m_street: string
  m_city: string
  m_state: string
  m_zip_code: string
  usdot_number: string
  mc_mx_ff_number: string
  power_units: string
  mcs_150_form_date: string
  out_of_service_date: string
  state_carrier_id_number: string
  duns_number: string
  drivers: string
  mcs_150_mileage_year: string
  id: string
  credit_score: string
  record_status: string
}

const headers: GridColDef<TruckingCompany>[] = [
  {
    width: 200,
    headerName: 'Created_DT',
    field: 'created_dt',
    valueGetter: (value) => new Date(value).toUTCString(),
    renderHeader: (params) => {
      return <strong>{params.colDef.headerName}</strong>
    },
  },
  {
    width: 200,
    headerName: 'Modified_DT',
    field: 'data_source_modified_dt',
    valueGetter: (value) => new Date(value).toUTCString(),
  },
  { width: 100, headerName: 'Entity', field: 'entity_type' },
  { width: 150, headerName: 'Operating status', field: 'operating_status' },
  { width: 200, headerName: 'Legal name', field: 'legal_name' },
  { width: 200, headerName: 'DBA name', field: 'dba_name' },
  { width: 200, headerName: 'Physical address', field: 'physical_address' },
  { width: 150, headerName: 'Phone', field: 'phone' },
  { width: 100, headerName: 'DOT', field: 'usdot_number' },
  { width: 100, headerName: 'MC/MX/FF', field: 'mc_mx_ff_number' },
  { width: 100, headerName: 'Power units', field: 'power_units' },
  {
    width: 200,
    headerName: 'Out of service date',
    field: 'out_of_service_date',
  },
]

const useTableState = () => {
  const [columns, setColumns] = useState(headers)
  const [rows, setRows] = useState<TruckingCompany[]>([])

  useEffect(() => {
    parse('/data.csv', {
      header: true,
      download: true,
      complete: (results) => {
        setRows(results.data as TruckingCompany[])

        console.log(results)
      },
      error: (error) => {
        console.error('Error parsing CSV:', error)
      },
    })
  }, [])
  // Handle table state management (sorting, filtering, column resizing, etc.)

  return { columns, rows, setColumns }
}

export default useTableState
