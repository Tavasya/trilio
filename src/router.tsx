import { Routes, Route, Navigate } from "react-router";
import { Suspense } from "react";

import Landing from "@/pages/landing/Landing";
import Dashboard from "@/pages/dashboard/Dashboard";
import AppLayout from "./layouts/AppLayout";
import Research from '@/pages/research/Research'
import Posts from '@/pages/posts/Posts'
import Onboarding from '@/pages/onboarding/Onboarding'
import ProtectedRoute from '@/components/ProtectedRoute'

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
                <Route path="/onboarding" element={<Navigate to="/onboarding/1" replace />} />
                <Route path="/onboarding/:step" element={
                    <ProtectedRoute>
                        <Onboarding />
                    </ProtectedRoute>
                } />
                <Route element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                } >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="/posts" element={<Posts />} />
                </Route>
            </Routes>
        </Suspense>
    )
}
