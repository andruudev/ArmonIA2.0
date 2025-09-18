import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-muted-foreground">Cargando...</p>
    </div>
  </div>
);

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home").then(module => ({ default: module.Home })));
const Login = lazy(() => import("./pages/Login").then(module => ({ default: module.Login })));
const Signup = lazy(() => import("./pages/Signup").then(module => ({ default: module.Signup })));
const Dashboard = lazy(() => import("./pages/Dashboard").then(module => ({ default: module.Dashboard })));
const Chat = lazy(() => import("./pages/Chat").then(module => ({ default: module.Chat })));
const Activities = lazy(() => import("./pages/Activities").then(module => ({ default: module.Activities })));
const Profile = lazy(() => import("./pages/Profile").then(module => ({ default: module.Profile })));
const Achievements = lazy(() => import("./pages/Achievements").then(module => ({ default: module.Achievements })));
const Audio = lazy(() => import("./pages/Audio").then(module => ({ default: module.Audio })));
const NotFound = lazy(() => import("./pages/NotFound"));
const Onboarding = lazy(() => import("./pages/Onboarding"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={
                      <ErrorBoundary>
                        <Home />
                      </ErrorBoundary>
                    } />
                    <Route path="/login" element={
                      <ErrorBoundary>
                        <Login />
                      </ErrorBoundary>
                    } />
                    <Route path="/signup" element={
                      <ErrorBoundary>
                        <Signup />
                      </ErrorBoundary>
                    } />

                    {/* Onboarding - requires auth but allows incomplete onboarding */}
                    <Route
                      path="/onboarding"
                      element={
                        <ErrorBoundary>
                          <ProtectedRoute allowOnboarding>
                            <Onboarding />
                          </ProtectedRoute>
                        </ErrorBoundary>
                      }
                    />
                    
                    {/* Protected Routes with Dashboard Layout */}
                    <Route path="/dashboard" element={
                      <ErrorBoundary>
                        <ProtectedRoute>
                          <DashboardLayout>
                            <Suspense fallback={<PageLoader />}>
                              <Dashboard />
                            </Suspense>
                          </DashboardLayout>
                        </ProtectedRoute>
                      </ErrorBoundary>
                    } />
                    
                    <Route path="/chat" element={
                      <ErrorBoundary>
                        <ProtectedRoute>
                          <DashboardLayout>
                            <Suspense fallback={<PageLoader />}>
                              <Chat />
                            </Suspense>
                          </DashboardLayout>
                        </ProtectedRoute>
                      </ErrorBoundary>
                    } />
                    
                    <Route path="/activities" element={
                      <ErrorBoundary>
                        <ProtectedRoute>
                          <DashboardLayout>
                            <Suspense fallback={<PageLoader />}>
                              <Activities />
                            </Suspense>
                          </DashboardLayout>
                        </ProtectedRoute>
                      </ErrorBoundary>
                    } />
                    
                    <Route path="/profile" element={
                      <ErrorBoundary>
                        <ProtectedRoute>
                          <DashboardLayout>
                            <Suspense fallback={<PageLoader />}>
                              <Profile />
                            </Suspense>
                          </DashboardLayout>
                        </ProtectedRoute>
                      </ErrorBoundary>
                    } />
                    
                    <Route path="/achievements" element={
                      <ErrorBoundary>
                        <ProtectedRoute>
                          <DashboardLayout>
                            <Suspense fallback={<PageLoader />}>
                              <Achievements />
                            </Suspense>
                          </DashboardLayout>
                        </ProtectedRoute>
                      </ErrorBoundary>
                    } />
                    
                    <Route path="/audio" element={
                      <ErrorBoundary>
                        <ProtectedRoute>
                          <DashboardLayout>
                            <Suspense fallback={<PageLoader />}>
                              <Audio />
                            </Suspense>
                          </DashboardLayout>
                        </ProtectedRoute>
                      </ErrorBoundary>
                    } />

                    {/* Redirect old index to home */}
                    <Route path="/index" element={<Navigate to="/" replace />} />
                    
                    {/* 404 Route */}
                    <Route path="*" element={
                      <ErrorBoundary>
                        <NotFound />
                      </ErrorBoundary>
                    } />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </BrowserRouter>
          </AuthProvider>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;