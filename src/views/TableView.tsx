import {
  Box,
  Button,
  CircularProgress,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Modal,
  Popover,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridColumnMenu,
  GridColumnMenuItemProps,
  GridColumnMenuProps,
  useGridApiRef,
} from "@mui/x-data-grid";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { BarChart } from "@mui/x-charts";
import {
  useEffect,
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import useTableState, { headers } from "../hoooks/useTableState";
import { useNavigate, useSearchParams } from "react-router-dom";
import ShareIcon from "@mui/icons-material/Share";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import PivotTableChartIcon from "@mui/icons-material/PivotTableChart";

const chartSetting = {
  xAxis: [
    {
      label: "Number of companies out of service",
    },
  ],
  width: 500,
  height: 400,
};

type MonthlyCount = {
  count: number;
  month: string;
};

const STORAGE_KEY = {
  STATE: "IS_dataTableState",
  COLUMNS: "IS_colOrder",
};

export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function encodeData(data) {
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

function decodeData(encodedData) {
  return JSON.parse(decodeURIComponent(atob(encodedData)));
}
const TableView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const { columns, rows, setColumns } = useTableState();
  const [initialState, setInitialState] = useState();
  const [visibleRowsLookup, setVisibleRowsLookup] = useState<{
    [key: string]: boolean;
  }>({});
  const [graphData, setGraphData] = useState<MonthlyCount[]>([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [copyTooltipText, setCopyTooltipText] = useState("Copy to clipboard");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const prevVisibleRowsLookupRef = useRef<{
    [key: string]: boolean;
  } | null>(null);

  const convertToMonthCounts = useMemo(() => {
    const monthCounts = new Map<string, number>();

    for (const row of rows) {
      if (visibleRowsLookup[row.id]) {
        const outOfServiceDate = row.out_of_service_date;

        if (outOfServiceDate && outOfServiceDate.trim() !== "") {
          const month = outOfServiceDate.split("/")[0];

          monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
        }
      }
    }
    return Array.from(monthCounts.entries()).map(([month, count]) => ({
      count,
      month: monthNames[parseInt(month) - 1],
    }));
  }, [rows, visibleRowsLookup]);

  const reorderColumns = (field: string, forward: boolean) => {
    const temp = columns.slice();
    const index = temp.findIndex((column) => column.field === field);

    if (index === -1) {
      console.warn(`Field "${field}" not found in columns.`);
      return;
    }

    const [item] = temp.splice(index, 1);
    const newIndex = forward
      ? (index + 1) % temp.length
      : (index - 1 + temp.length) % temp.length;

    temp.splice(newIndex, 0, item);
    setColumns(temp);
  };

  function CustomUserItem(props: GridColumnMenuItemProps) {
    const field = props.colDef.field;
    return (
      <MenuList>
        <MenuItem
          onClick={() => {
            reorderColumns(field, false);
          }}
        >
          <ListItemIcon>
            <ArrowBack fontSize="small" />
          </ListItemIcon>
          <ListItemText>{"Move Left"}</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            reorderColumns(field, true);
          }}
        >
          <ListItemIcon>
            <ArrowForward fontSize="small" />
          </ListItemIcon>
          <ListItemText>{"Move Right"}</ListItemText>
        </MenuItem>
      </MenuList>
    );
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
    );
  }

  const saveSnapshot = useCallback(() => {
    if (apiRef?.current?.exportState && localStorage) {
      const currentState = apiRef.current.exportState();
      localStorage.setItem(STORAGE_KEY.STATE, JSON.stringify(currentState));
      localStorage.setItem(
        STORAGE_KEY.COLUMNS,
        JSON.stringify(columns.map((c) => c.field))
      );
    }
  }, [apiRef]);

  useLayoutEffect(() => {
    let state = null;
    let columns = null;
    if (searchParams.size == 1) {
      const data = decodeData(searchParams.get("data"));
      state = data[STORAGE_KEY.STATE];
      columns = data[STORAGE_KEY.COLUMNS];
      setInitialState(state ? state : {});
    } else {
      state = localStorage?.getItem(STORAGE_KEY.STATE);
      columns = localStorage?.getItem(STORAGE_KEY.COLUMNS);
      state = state ? JSON.parse(state) : {};
      columns = columns ? JSON.parse(columns) : {};
    }
    setInitialState(state ? state : {});

    if (columns) {
      const reorderedColumns = (columns as string[])
        .map((field) => headers.find((col) => col.field === field))
        .filter((col) => col !== undefined);
      setColumns(reorderedColumns);
    }

    window.addEventListener("beforeunload", saveSnapshot);

    return () => {
      window.removeEventListener("beforeunload", saveSnapshot);
      saveSnapshot();
    };
  }, [saveSnapshot]);
  useEffect(() => {
    if (prevVisibleRowsLookupRef.current !== visibleRowsLookup) {
      setGraphData(convertToMonthCounts);
      prevVisibleRowsLookupRef.current = visibleRowsLookup;
    }
  }, [visibleRowsLookup, convertToMonthCounts]);

  useEffect(() => {
    setGraphData(convertToMonthCounts);
  }, [convertToMonthCounts]);

  if (!initialState || !rows.length) {
    return (
      <div
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress color="primary" />
      </div>
    );
  }

  const handleLinkShare = (
    url: string,
    event: React.MouseEvent<HTMLElement>
  ) => {
    if (url) {
      navigator.clipboard.writeText(url);
      setAnchorEl(event.currentTarget);
      setCopied(true);
      setCopyTooltipText("Copied!");
      setTimeout(() => {
        setCopied(false);
        setCopyTooltipText("Copy to clipboard");
        setAnchorEl(null);
      }, 2000);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/pivot")}
        style={{ marginTop: "2rem", display: "flex", gap: "0.5rem" }}
      >
        <PivotTableChartIcon /> Go to Pivot View
      </Button>
      <BarChart
        dataset={graphData}
        yAxis={[{ scaleType: "band", dataKey: "month" }]}
        series={[{ dataKey: "count", label: "Out of service" }]}
        layout="horizontal"
        {...chartSetting}
      />
      <div style={{ display: "flex", marginTop: "2rem", gap: "2rem" }}>
        <div>
          <Button onClick={handleOpen} variant="outlined" color="primary">
            <FilterAltIcon />
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Text in a modal
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
            </Box>
          </Modal>
        </div>
        <Button
          variant="outlined"
          color="primary"
          onClick={(event) => {
            if (apiRef?.current?.exportState) {
              const data = {
                [STORAGE_KEY.STATE]: apiRef.current.exportState(),
                [STORAGE_KEY.COLUMNS]: columns.map((c) => c.field),
              };

              handleLinkShare(
                `${location.origin}?data=${encodeData(data)}`,
                event
              );
            }
          }}
          style={{ display: "flex", gap: "0.5rem" }}
        >
          <ShareIcon />
          Share Table
        </Button>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Typography sx={{ p: 2 }}>{copyTooltipText}</Typography>
        </Popover>
      </div>
      <div
        style={{
          width: "97vw",
          margin: "1rem",
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
            const newVisibleRowsLookup = state.visibleRowsLookup;
            if (
              JSON.stringify(newVisibleRowsLookup) !==
              JSON.stringify(visibleRowsLookup)
            ) {
              setVisibleRowsLookup(newVisibleRowsLookup);
            }
          }}
          pageSizeOptions={[25, 50, 100]}
          editMode="cell"
          apiRef={apiRef}
        />
      </div>
    </div>
  );
};

export default TableView;
