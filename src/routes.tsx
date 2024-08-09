import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import PivotView from './views/PivotView'
import TableView from './views/TableView'
import Test from './views/Test'

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path='/' element={<TableView />} />
      <Route path='/pivot' element={<Test />} />
    </Routes>
  </Router>
)

export default AppRoutes
