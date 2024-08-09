// src/react-pivot.d.ts
declare module 'react-pivot' {
  import { ComponentType } from 'react'

  export interface Transaction {
    amount: string
    date: string
    business: string
    name: string
    type: string
    account: string
  }

  export interface Row {
    firstName: string
    lastName: string
    state: string
    transaction: Transaction
  }

  export interface Memo {
    amountTotal: number
  }

  export interface Dimension {
    value: string
    title: string
  }

  export interface Calculation {
    title: string
    value: string
    template?: (val: number, row: Row) => string
    sortBy?: (row: Row) => number
  }

  export interface ReactPivotProps {
    rows: Row[]
    dimensions: Dimension[]
    reduce: (row: Row, memo: Memo) => Memo
    calculations: Calculation[]
    activeDimensions?: string[]
    nPaginateRows?: number
  }

  export const ReactPivot: ComponentType<ReactPivotProps>
}
