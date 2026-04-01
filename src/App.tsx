import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import MasterList from "./pages/MasterList";
import Archive from "./pages/Archive";
import Analysis from "./pages/Analysis";

import Dashboard from "./pages/Dashboard";
import AppTasks from "./pages/AppTasks";

function App() {
  return (
    <BrowserRouter>
      <Layout>   
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/app/:id" element={<AppTasks />} />
  <Route path="/master" element={<MasterList />} />
  <Route path="/archive" element={<Archive />} />
  <Route path="/analysis" element={<Analysis />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;