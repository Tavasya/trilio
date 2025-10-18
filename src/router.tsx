import { Routes, Route } from "react-router";
import { Suspense, lazy } from "react";

import Landing from "@/pages/landing/Landing";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminRoute from '@/components/AdminRoute'
import LinkedInContentStrategies from '@/pages/blog/LinkedInContentStrategies';
import AIReplacingMarketers from '@/pages/blog/AIReplacingMarketers';
import PersonalBrandFounder from '@/pages/blog/PersonalBrandFounder';
import StudentLinkedInGuide from '@/pages/blog/StudentLinkedInGuide';
import LinkedInCharacterCounter from '@/pages/tools/LinkedInCharacterCounter';
import LinkedInHashtagGenerator from '@/pages/tools/LinkedInHashtagGenerator';
import RateLinkedIn from '@/pages/rate-linkedin/RateLinkedIn';
import ReviewResume from '@/pages/review-resume/ReviewResume';

// Lazy load all protected routes
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Voice = lazy(() => import('@/pages/voice/Voice'));
const Research = lazy(() => import('@/pages/research/Research'));
const Scheduler = lazy(() => import('@/pages/scheduler/Scheduler'));
const Posts = lazy(() => import('@/pages/posts/Posts'));
const CreatePost = lazy(() => import('@/pages/create-post/CreatePost'));
const Generate = lazy(() => import('@/pages/generate/Generate'));
const IdentityTest = lazy(() => import('@/pages/test/IdentityTest'));
const DevDashboard = lazy(() => import('@/pages/dev-dashboard/DevDashboard'));
const PaymentSuccess = lazy(() => import('@/pages/payment/PaymentSuccess'));

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
                <Route path="/blog/linkedin-content-strategies" element={<LinkedInContentStrategies />} />
                <Route path="/blog/ai-replacing-linkedin-marketers" element={<AIReplacingMarketers />} />
                <Route path="/blog/personal-brand-founder-linkedin" element={<PersonalBrandFounder />} />
                <Route path="/blog/student-linkedin-opportunities-guide" element={<StudentLinkedInGuide />} />
                <Route path="/tools/linkedin-character-counter" element={<LinkedInCharacterCounter />} />
                <Route path="/tools/linkedin-hashtag-generator" element={<LinkedInHashtagGenerator />} />
                <Route path="/rate-linkedin" element={<RateLinkedIn />} />
                <Route path="/review-resume" element={<ReviewResume />} />
                {/* <Route path="/onboarding" element={<Navigate to="/onboarding/1" replace />} />
                <Route path="/onboarding/:step" element={
                    <ProtectedRoute>
                        <Onboarding />
                    </ProtectedRoute>
                } /> */}
                <Route path="/payment-success" element={
                    <ProtectedRoute>
                        <PaymentSuccess />
                    </ProtectedRoute>
                } />
                <Route element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                } >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/voice" element={<Voice />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="/scheduler" element={<Scheduler />} />
                    <Route path="/posts" element={<Posts />} />

                    <Route path="/create-post" element={<CreatePost />} />
                    <Route path="/generate" element={<Generate />} />
                    <Route path="/test/identity" element={<IdentityTest />} />
                </Route>
                <Route path="/dev-dashboard" element={
                    <AdminRoute>
                        <AppLayout />
                    </AdminRoute>
                } >
                    <Route index element={<DevDashboard />} />
                </Route>
            </Routes>
        </Suspense>
    )
}
