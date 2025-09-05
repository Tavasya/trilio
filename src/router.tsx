import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";

import App from "./App";
import Dashboard from "@/pages/dashboard/Dashboard";
import AppLayout from "./layouts/AppLayout";
import Research from '@/pages/research/Research'
import Posts from '@/pages/posts/Posts'

const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
)

export default function AppRoutes() {
    return(
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path="/" element={<App />} />
                <Route element={<AppLayout />} >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="/posts" element={<Posts />} />
                </Route>

            </Routes>
        </Suspense>
    )
}
