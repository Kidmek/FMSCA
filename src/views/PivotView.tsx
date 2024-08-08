import PivotTable from '../components/PivotTable'
import PivotChart from '../components/PivotChart'
import useTableState from '../hoooks/useTableState'

const PivotView = () => {
  const { columns, data } = useTableState()

  return (
    <>
      <PivotTable data={data} />
      <PivotChart data={data} />
    </>
  )
}

export default PivotView
