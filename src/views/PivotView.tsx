import useTableState from "../hoooks/useTableState";
import PivotTableUI from "react-pivottable/PivotTableUI";
import "react-pivottable/pivottable.css";
import { useState } from "react";

export type ChartData = {
  month: string;
  count: number;
};

const PivotView: React.FC = () => {
  const { rows } = useTableState();
  const [pivotState, setPivotState] = useState({});
  return (
    <div
      style={{
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>Pivot Table</h2>
      <PivotTableUI
        data={rows}
        onChange={(e) => {
          setPivotState(e);
        }}
        {...pivotState}
      />
    </div>
  );
};

export default PivotView;
