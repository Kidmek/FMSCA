import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material'
import useTableState, { TruckingCompany } from '../hoooks/useTableState'
import { monthNames } from './TableView'

const enum GroupBy {
  YEAR = 'Year',
  MONTH = 'Month',
  WEEK = 'Week',
}
const TOTAL = 'Total'
// Grouping helper function
const groupBy = (
  data: TruckingCompany[],
  period: GroupBy,
  subPeriod: string | null
) => {
  const groupedData: Record<string, Record<string, number>> = {}

  data.forEach((item) => {
    const date = new Date(item.created_dt)
    let primaryKey: string
    let secondaryKey: string | null = null

    // Determine primary grouping key
    switch (period) {
      case GroupBy.YEAR:
        primaryKey = date.getFullYear().toString()
        break
      case GroupBy.MONTH:
        primaryKey = `${date.getFullYear()}-${monthNames[date.getMonth()]}`
        break
      case GroupBy.WEEK: {
        const year = date.getFullYear()
        const week = Math.ceil(date.getDate() / 7)
        primaryKey = `${year}-W${week}`
        break
      }
      default:
        primaryKey = ''
    }

    // Determine secondary grouping key if applicable
    if (subPeriod) {
      switch (subPeriod) {
        case GroupBy.MONTH:
          secondaryKey = `${monthNames[date.getMonth()]}` // Numeric month
          break
        case GroupBy.WEEK: {
          const year = date.getFullYear()
          const week = Math.ceil(date.getDate() / 7)
          secondaryKey = `W${week}`
          break
        }
        default:
          secondaryKey = null
      }
    }

    if (!groupedData[primaryKey]) {
      groupedData[primaryKey] = {}
    }

    if (secondaryKey) {
      if (!groupedData[primaryKey][secondaryKey]) {
        groupedData[primaryKey][secondaryKey] = 0
      }
      groupedData[primaryKey][secondaryKey]++
    }
    if (!groupedData[primaryKey][TOTAL]) {
      groupedData[primaryKey][TOTAL] = 0
    }
    groupedData[primaryKey][TOTAL]++
  })

  return groupedData
}
// PivotTableWithBarChart Component
const Test: React.FC = () => {
  const { rows } = useTableState()
  const [period, setPeriod] = useState<GroupBy>(GroupBy.YEAR)
  const [groupedData, setGroupedData] = useState<Record<
    string,
    Record<string, number>
  > | null>(null)
  const [subPeriod, setSubPeriod] = useState<string | null>(null)

  useEffect(() => {
    if (rows) {
      setGroupedData(groupBy(rows, period, subPeriod))
    }
  }, [rows, period, subPeriod])

  console.log(groupedData)
  return (
    <div
      style={{
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '80vw',
        }}
      >
        <FormControl fullWidth margin='normal'>
          <InputLabel id='period-select-label'>Period</InputLabel>
          <Select
            labelId='period-select-label'
            value={period}
            onChange={(e) => setPeriod(e.target.value as GroupBy)}
            label='Period'
          >
            <MenuItem value={GroupBy.YEAR}>Year</MenuItem>
            <MenuItem value={GroupBy.MONTH}>Month</MenuItem>
            <MenuItem value={GroupBy.WEEK}>Week</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin='normal'>
          <InputLabel id='sub-period-select-label'>Sub-Period</InputLabel>
          <Select
            labelId='sub-period-select-label'
            value={subPeriod || ''}
            onChange={(e) => setSubPeriod(e.target.value as GroupBy)}
            label='Sub-Period'
            disabled={!period} // Disable sub-filter if no primary filter is selected
          >
            {period === GroupBy.YEAR && (
              <MenuItem value={GroupBy.MONTH}>Month</MenuItem>
            )}
            {period === GroupBy.YEAR && (
              <MenuItem value={GroupBy.WEEK}>Week</MenuItem>
            )}
            {period === GroupBy.MONTH && (
              <MenuItem value={GroupBy.WEEK}>Week</MenuItem>
            )}
          </Select>
        </FormControl>

        <Typography variant='h6' gutterBottom>
          Pivot Table
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{period}</TableCell>
                {subPeriod && <TableCell>{subPeriod}</TableCell>}
                <TableCell>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedData &&
                Object.keys(groupedData).map((primaryKey) => {
                  const keys = Object.keys(groupedData[primaryKey])

                  return subPeriod ? (
                    // Render rows with secondary period
                    [
                      keys.map((secondaryKey, index) => {
                        if (secondaryKey !== TOTAL)
                          return (
                            <TableRow key={`${primaryKey}-${secondaryKey}`}>
                              {index === 0 && (
                                <TableCell rowSpan={keys.length}>
                                  {primaryKey}
                                </TableCell>
                              )}
                              <TableCell>{secondaryKey}</TableCell>
                              <TableCell>
                                {groupedData[primaryKey][secondaryKey]}
                              </TableCell>
                            </TableRow>
                          )
                      }),
                      <TableRow key={`${primaryKey}-total`}>
                        <TableCell>{TOTAL}</TableCell>
                        <TableCell>{groupedData[primaryKey][TOTAL]}</TableCell>
                      </TableRow>,
                    ]
                  ) : (
                    // Render rows with only primary period
                    <TableRow key={primaryKey}>
                      <TableCell>{primaryKey}</TableCell>
                      <TableCell>{groupedData[primaryKey][TOTAL]}</TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}

export default Test
