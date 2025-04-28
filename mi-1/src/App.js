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
import Good_knight_tube from './component/shap/Good-knight-tube';
import T_shap_2 from './component/shap/T-shap-2';
import T_shap_3 from './component/shap/T-shap-3';
import Round_4 from './component/shap/Round-4';
import Stiffner_front_edge from './component/shap/Stiffner-front-edge';
import Door_edge_profile from './component/shap/Door-edge-profile';
import Thcm_m from './component/shap/THCM-M';
import D_section from './component/shap/D-section';
import Al_h_section from './component/shap/Al-h-section';
import Al_lip_channel from './component/shap/Al-lip-channel';
import Cover_tray from './component/shap/Cover-tray';
import Double_center_mullion from './component/shap/Double-center-mullion';


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
          {permission && <Route exact path="/manager_dashboard" element={<ManagerDashboard/>}/>}
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/signup" element={<Signup/>}/>
          <Route exact path="/forgot-password" element={<ForgotPassword/>}/>
          <Route exact path="/reset-password/:id/:token" element={<ResetPassword/>}/>
          <Route exact path="/from-temp" element={<PrivateRoute element={<FromTemp/>}/>}/>
          <Route exact path="/from_scratch" element={<PrivateRoute element={<FromScratch/>}/>}/>
          <Route exact path="/from-dxf" element={<PrivateRoute element={<FromDxf/>}/>}/>
          <Route exact path="/rectangle" element={<PrivateRoute element={<Rectangle/>}/>}/>
          <Route exact path="/d_section" element={<PrivateRoute element={<D_section/>}/>}/>
          <Route exact path="/round" element={<PrivateRoute element={<Round/>}/>}/>
          <Route exact path="/round-1" element={<PrivateRoute element={<Round_1/>}/>}/>
          <Route exact path="/round-2" element={<PrivateRoute element={<Round_2/>}/>}/>
          <Route exact path="/round-3" element={<PrivateRoute element={<Round_3/>}/>}/>
          <Route exact path="/round-4" element={<PrivateRoute element={<Round_4/>}/>}/>
          <Route exact path="/square" element={<PrivateRoute element={<Square/>}/>}/>
          <Route exact path="/l-angle" element={<PrivateRoute element={<L_angle/>}/>}/>
          <Route exact path="/c-channel" element={<PrivateRoute element={<C_channel/>}/>}/>
          <Route exact path="/U-channel" element={<PrivateRoute element={<U_channel/>}/>}/>
          <Route exact path="/triangular-slit" element={<PrivateRoute element={<Triangular_slit/>}/>}/>
          <Route exact path="/door_channel" element={<PrivateRoute element={<Door_channel/>}/>}/>
          <Route exact path="/stiffner_front_edge" element={<PrivateRoute element={<Stiffner_front_edge/>}/>}/>
          <Route exact path="/door_edge_profile" element={<PrivateRoute element={<Door_edge_profile/>}/>}/>
          <Route exact path="/elliptical" element={<PrivateRoute element={<Elliptical/>}/>}/>
          <Route exact path="/flat_oval" element={<PrivateRoute element={<Flat_oval/>}/>}/>
          <Route exact path="/triangular" element={<PrivateRoute element={<Triangular/>}/>}/>
          <Route exact path="/top_hat" element={<PrivateRoute element={<Top_hat/>}/>}/>
          <Route exact path="/thcm_m" element={<PrivateRoute element={<Thcm_m/>}/>}/>
          <Route exact path="/d_shap" element={<PrivateRoute element={<D_shap/>}/>}/>
          <Route exact path="/t_shap" element={<PrivateRoute element={<T_shap/>}/>}/>
          <Route exact path="/t_shap_2" element={<PrivateRoute element={<T_shap_2/>}/>}/>
          <Route exact path="/t_shap_3" element={<PrivateRoute element={<T_shap_3/>}/>}/>
          <Route exact path="/figure_of_eight" element={<PrivateRoute element={<Figure_of_eight/>}/>}/>
          <Route exact path='/l-angle-1' element={<PrivateRoute element={<L_angle_1/>}/>}/>
          <Route exact path='/l-angle-2' element={<PrivateRoute element={<L_angle_2/>}/>}/>
          <Route exact path='/l-angle-3' element={<PrivateRoute element={<L_angle_3/>}/>}/>
          <Route exact path='/l-angle-4' element={<PrivateRoute element={<L_angle_4/>}/>}/>
          <Route exact path='/l-angle-5' element={<PrivateRoute element={<L_angle_5/>}/>}/>
          <Route exact path='/beam-window-frame' element={<PrivateRoute element={<Beam_window_frame/>}/>}/>
          <Route exact path='/stiffner' element={<PrivateRoute element={<Stiffner/>}/>}/>
          <Route exact path='/good-knight-tube' element={<PrivateRoute element={<Good_knight_tube/>}/>}/>
          <Route exact path='/al-h-section' element={<PrivateRoute element={<Al_h_section/>}/>}/>
          <Route exact path='/al-lip-channel' element={<PrivateRoute element={<Al_lip_channel/>}/>}/>
          <Route exact path='/cover_tray' element={<PrivateRoute element={<Cover_tray/>}/>}/>
          <Route exact path='/double_center_mullion' element={<PrivateRoute element={<Double_center_mullion/>}/>}/>
          <Route exact path='*' element={<PrivateRoute element={<PageNotFound/>}/>}/>
        </Routes>}
      </Router>
      
    </div>
  )
}

export default App
