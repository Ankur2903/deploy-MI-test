import React, {useState} from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate,  useLocation} from 'react-router-dom';
import Navbar from './component/Navbar'
import Home from './component/Home'
import FromTemp from './component/FromTemp';
import Square from './component/shap/Square';
import Rectangle from './component/shap/Rectangle';
import C_channel from './component/shap/C-channel';
import U_channel from './component/shap/U-channel';
import Door_channel from './component/shap/Door_channel';
import Elliptical from './component/shap/Elliptical';
import L_angle from './component/shap/L-angle';
import Round from './component/shap/Round';
import Flat_oval from './component/shap/Flat-oval';
import Triangular_slit from './component/shap/Triangular-slit';
import Triangular from './component/shap/Triangular';
import Top_hat from './component/shap/Top-hat';
import D_shap from './component/shap/D-shap';
import T_shap from './component/shap/T-shap';
import FromScratch from './component/FromScratch/FromScratch';
import Figure_of_eight from './component/shap/Figure-of-eight';
import L_angle_1 from './component/shap/L-angle-1';
import L_angle_2 from './component/shap/L-angle-2';
import L_angle_3 from './component/shap/L-angle-3';
import Round_1 from './component/shap/Round-1';
import L_angle_4 from './component/shap/L-angle-4';
import Round_2 from './component/shap/Round-2';
import L_angle_5 from './component/shap/L-angle-5';
import Round_3 from './component/shap/Round-3';
import Signup from './component/Signup';
import Login from './component/Login';
import RefrshHandler from './RefrshHandler';
import ManagerDashboard from './component/ManagerDeshboard';
import CollectData from './CollectData';
import ForgotPassword from './component/ForgotPassword';
import ResetPassword from './component/ResetPassword';
import PageNotFound from './component/PageNotFound';
import Start from './component/Start';
import Beam_window_frame from './component/shap/Beam-window-frame';
import FromDxf from './component/FromDxf';
import Stiffner from './component/shap/Stiffner';


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const [permission,setPermission] = useState(false)
  const [loading, setLoading] = useState(true);

  const PrivateRoute = ({ element }) =>{
    if(isAuthenticated){
      return element;
    }
    else{
      return <Navigate to='/login'/>
    }
  }

  return (
    
    <div>
      <Router>
        <RefrshHandler setIsAuthenticated={setIsAuthenticated} setLoading={setLoading}/>
        <CollectData setUsers = {setUsers} setPermission = {setPermission}/>
        <Navbar/>
       
        {!loading && 
        <Routes>
          <Route exact path="/" element={<Start/>}/>
          <Route exact path="/home" element={<PrivateRoute element={<Home/>}/>}/>
          {permission && <Route exact path="/manager_deshboard" element={<ManagerDashboard/>}/>}
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/signup" element={<Signup/>}/>
          <Route exact path="/forgot-password" element={<ForgotPassword/>}/>
          <Route exact path="/reset-password/:id/:token" element={<ResetPassword/>}/>
          <Route exact path="/from-temp" element={<PrivateRoute element={<FromTemp/>}/>}/>
          <Route exact path="/from_scratch" element={<PrivateRoute element={<FromScratch/>}/>}/>
          <Route exact path="/from-dxf" element={<PrivateRoute element={<FromDxf/>}/>}/>
          <Route exact path="/rectangle" element={<PrivateRoute element={<Rectangle/>}/>}/>
          <Route exact path="/round" element={<PrivateRoute element={<Round/>}/>}/>
          <Route exact path="/round-1" element={<PrivateRoute element={<Round_1/>}/>}/>
          <Route exact path="/round-2" element={<PrivateRoute element={<Round_2/>}/>}/>
          <Route exact path="/round-3" element={<PrivateRoute element={<Round_3/>}/>}/>
          <Route exact path="/square" element={<PrivateRoute element={<Square/>}/>}/>
          <Route exact path="/l-angle" element={<PrivateRoute element={<L_angle/>}/>}/>
          <Route exact path="/c-channel" element={<PrivateRoute element={<C_channel/>}/>}/>
          <Route exact path="/U-channel" element={<PrivateRoute element={<U_channel/>}/>}/>
          <Route exact path="/triangular-slit" element={<PrivateRoute element={<Triangular_slit/>}/>}/>
          <Route exact path="/door_channel" element={<PrivateRoute element={<Door_channel/>}/>}/>
          <Route exact path="/elliptical" element={<PrivateRoute element={<Elliptical/>}/>}/>
          <Route exact path="/flat_oval" element={<PrivateRoute element={<Flat_oval/>}/>}/>
          <Route exact path="/triangular" element={<PrivateRoute element={<Triangular/>}/>}/>
          <Route exact path="/top_hat" element={<PrivateRoute element={<Top_hat/>}/>}/>
          <Route exact path="/d_shap" element={<PrivateRoute element={<D_shap/>}/>}/>
          <Route exact path="/t_shap" element={<PrivateRoute element={<T_shap/>}/>}/>
          <Route exact path="/figure_of_eight" element={<PrivateRoute element={<Figure_of_eight/>}/>}/>
          <Route exact path='/l-angle-1' element={<PrivateRoute element={<L_angle_1/>}/>}/>
          <Route exact path='/l-angle-2' element={<PrivateRoute element={<L_angle_2/>}/>}/>
          <Route exact path='/l-angle-3' element={<PrivateRoute element={<L_angle_3/>}/>}/>
          <Route exact path='/l-angle-4' element={<PrivateRoute element={<L_angle_4/>}/>}/>
          <Route exact path='/l-angle-5' element={<PrivateRoute element={<L_angle_5/>}/>}/>
          <Route exact path='/beam-window-frame' element={<PrivateRoute element={<Beam_window_frame/>}/>}/>
          <Route exact path='/stiffner' element={<PrivateRoute element={<Stiffner/>}/>}/>
          <Route exact path='*' element={<PrivateRoute element={<PageNotFound/>}/>}/>
        </Routes>}
      </Router>
      
    </div>
  )
}

export default App
