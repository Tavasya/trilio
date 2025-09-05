import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";

import App from "./App";
import Dashboard from "@/pages/dashboard/Dashboard";
import AppLayout from "./layouts/AppLayout";

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
                </Route>

            </Routes>
        </Suspense>
    )
}
