import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Play from "./pages/Play";
import Blogs from "./pages/Login";
import Words from "./pages/Words";
import NoPage from "./pages/NoPage";
import Users from "./pages/Users";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Play />} />
          <Route path="login" element={<Blogs />} />
          <Route path="words" element={<Words/>} />
          <Route path="users" element={<Users/>} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));