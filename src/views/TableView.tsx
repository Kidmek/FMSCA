import DataTable from '../components/DataTable'
import DataChart from '../components/DataChart'
import useTableState from '../hoooks/useTableState'

const TableView = () => {
  const { columns, data, setColumns } = useTableState()

  return (
    <>
      <DataTable columns={columns} data={data} setColumns={setColumns} />
      {/* <DataChart data={data} /> */}
    </>
  )
}

export default TableView
