import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import LoadingSpinner from './components/Loader/LoadingSpinner';
import PageTransition from './components/Common/PageTransition';

// Route-based code splitting: each page is its own chunk, fetched on demand.
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ArticleDetails = lazy(() => import('./pages/ArticleDetails'));
const Topics = lazy(() => import('./pages/Topics'));
const TopicDetails = lazy(() => import('./pages/TopicDetails'));
const AnalyticsPage = lazy(() => import('./pages/Analytics'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageFallback() {
  return (
    <div className="flex justify-center py-24">
      <LoadingSpinner size="lg" label="Loading page" />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route
            index
            element={
              <PageTransition>
                <Dashboard />
              </PageTransition>
            }
          />
          <Route
            path="article/:id"
            element={
              <PageTransition>
                <ArticleDetails />
              </PageTransition>
            }
          />
          <Route
            path="topics"
            element={
              <PageTransition>
                <Topics />
              </PageTransition>
            }
          />
          <Route
            path="topics/:clusterId"
            element={
              <PageTransition>
                <TopicDetails />
              </PageTransition>
            }
          />
          <Route
            path="analytics"
            element={
              <PageTransition>
                <AnalyticsPage />
              </PageTransition>
            }
          />
          <Route
            path="search"
            element={
              <PageTransition>
                <SearchResults />
              </PageTransition>
            }
          />
          <Route
            path="settings"
            element={
              <PageTransition>
                <Settings />
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <AnimatedRoutes />
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
