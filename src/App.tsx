import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainContainer } from "./containers/main-container";
import "./App.css";
import "./assets/css/bootstrap.min.css";
import "./assets/color.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainContainer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
