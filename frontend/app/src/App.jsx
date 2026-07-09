import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Features from "@/pages/Features";
import Estimator from "@/pages/Estimator";
import Result from "@/pages/Result";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path="/features"
              element={
                <PageWrapper>
                  <Features />
                </PageWrapper>
              }
            />
            <Route
              path="/estimator"
              element={
                <PageWrapper>
                  <Estimator />
                </PageWrapper>
              }
            />
            <Route
              path="/result"
              element={
                <PageWrapper>
                  <Result />
                </PageWrapper>
              }
            />
            <Route
              path="/about"
              element={
                <PageWrapper>
                  <About />
                </PageWrapper>
              }
            />
            <Route
              path="/contact"
              element={
                <PageWrapper>
                  <Contact />
                </PageWrapper>
              }
            />
            <Route
              path="*"
              element={
                <PageWrapper>
                  <NotFound />
                </PageWrapper>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
