import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PivotView from './views/PivotView'
import TableView from './views/TableView'

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path='/' element={<TableView />} />
      <Route path='/pivot' element={<PivotView />} />
    </Routes>
  </Router>
)

export default AppRoutes
