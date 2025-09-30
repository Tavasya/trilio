import { Routes, Route } from "react-router";
import { Suspense, lazy } from "react";

import Landing from "@/pages/landing/Landing";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from '@/components/ProtectedRoute'

// Lazy load all protected routes
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Research = lazy(() => import('@/pages/research/Research'));
const Scheduler = lazy(() => import('@/pages/scheduler/Scheduler'));
const Posts = lazy(() => import('@/pages/posts/Posts'));
const CreatePost = lazy(() => import('@/pages/create-post/CreatePost'));
const Generate = lazy(() => import('@/pages/generate/Generate'));
const IdentityTest = lazy(() => import('@/pages/test/IdentityTest'));

const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
)

export default function AppRoutes() {
    return(
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path="/" element={<Landing />} />
                {/* <Route path="/onboarding" element={<Navigate to="/onboarding/1" replace />} />
                <Route path="/onboarding/:step" element={
                    <ProtectedRoute>
                        <Onboarding />
                    </ProtectedRoute>
                } /> */}
                <Route element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                } >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="/scheduler" element={<Scheduler />} />
                    <Route path="/posts" element={<Posts />} />

                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/generate" element={<Generate />} />
                    <Route path="/test/identity" element={<IdentityTest />} />
                </Route>
            </Routes>
        </Suspense>
    )
}
