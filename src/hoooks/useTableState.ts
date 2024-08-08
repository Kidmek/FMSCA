import { useState, useEffect } from 'react'
import { ColumnDef, RowData, useTableInstance } from '@tanstack/react-table'
import localforage from 'localforage'
import { parse } from 'papaparse'

const useTableState = () => {
  const [columns, setColumns] = useState<ColumnDef<RowData>[]>([])
  const [data, setData] = useState<RowData[]>([])

  // Load data and setup columns

  useEffect(() => {
    parse('/data.csv', {
      header: true,
      download: true,
      complete: (results) => {
        const data = results.data as any[]
        setData(data.slice(1))

        setColumns(
          'created_dt,data_source_modified_dt,entity_type,operating_status,legal_name,dba_name,physical_address,p_street,p_city,p_state,p_zip_code,phone,mailing_address,m_street,m_city,m_state,m_zip_code,usdot_number,mc_mx_ff_number,power_units,mcs_150_form_date,out_of_service_date,state_carrier_id_number,duns_number,drivers,mcs_150_mileage_year,id,credit_score,record_status'.split(
            ','
          )
        )
      },
      error: (error) => {
        console.error('Error parsing CSV:', error)
      },
    })
  }, [])
  // Handle table state management (sorting, filtering, column resizing, etc.)

  return { columns, data, setColumns }
}

export default useTableState
