import { Bar } from 'react-chartjs-2'

const PivotChart = ({ data }) => {
  const chartData = {
    labels: ['Pivot Label 1', 'Pivot Label 2'],
    datasets: [
      {
        label: 'Pivot Data',
        data: data.map((item) => item['Pivot Value']),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  }

  return <Bar data={chartData} />
}

export default PivotChart
