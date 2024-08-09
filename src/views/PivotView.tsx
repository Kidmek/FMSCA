import useTableState from '../hoooks/useTableState'
import PivotTableUI from 'react-pivottable/PivotTableUI'
import 'react-pivottable/pivottable.css'
// import TableRenderers from 'react-pivottable/TableRenderers'
// import Plot from 'react-plotly.js'
// import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers'
import { useState } from 'react'

export type ChartData = {
  month: string
  count: number
}

// create Plotly renderers via dependency injection
// const PlotlyRenderers = createPlotlyRenderers(Plot)

const PivotView: React.FC = () => {
  const { rows } = useTableState()
  const [pivotState, setPivotState] = useState({})
  return (
    <div
      style={{
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2>Pivot Table</h2>
      <PivotTableUI
        data={rows}
        onChange={(e) => {
          console.log('Pivot Change', e)
          setPivotState(e)
        }}
        // renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
        {...pivotState}
      />
    </div>
  )
}

export default PivotView
