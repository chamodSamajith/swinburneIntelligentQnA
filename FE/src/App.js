
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Home from "./containers/Chat/Home.js"
import toast, { Toaster } from 'react-hot-toast';
function App({props}) {
  

  return (
     <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Other routes can be added here */}
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}

export default App;
