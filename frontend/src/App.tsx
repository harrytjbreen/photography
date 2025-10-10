import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import type { FC } from "react";
import Home from "./pages/Home";
import CollectionDetail from "./pages/CollectionDetail";

const ScrollToHash: FC = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      }
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [hash, pathname]);

  return null;
};

const App: FC = () => {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections/:collectionId" element={<CollectionDetail />} />
        <Route
          path="*"
          element={
            <h1 className="text-center text-2xl mt-20">404 — Page Not Found</h1>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
