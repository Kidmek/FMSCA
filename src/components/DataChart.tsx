import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Box } from '@mui/material'

const DataChart = ({ data }) => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Out of Service',
        data: data.map((item) => item['Out of Service Count']),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  }

  return (
    <Box sx={{ height: 300, width: '100%' }}>
      <Bar data={chartData} />
    </Box>
  )
}

export default DataChart
