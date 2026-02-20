import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Loader from "./components/Loader.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const ScreenTest = lazy(() => import("./pages/ScreenTest.jsx"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          <Loader text="Loading page…" />
        </div>
      }
    >
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/screen-test" element={<ScreenTest />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
