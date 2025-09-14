import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'

// Layouts (pueden seguir importándose normalmente)
import AppLayout from '@/layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import ProfileLayout from './layouts/ProfileLayout'

// Vistas con lazy loading
const DashboardView = lazy(() => import('@/views/DashboardView'))
const CreateProjectView = lazy(() => import('./views/projects/CreateProjectView'))
const EditProjectView = lazy(() => import('./views/projects/EditProjectView'))
const ProjectDetailsView = lazy(() => import('./views/projects/ProjectDetailsView'))
const ProjectTeamView = lazy(() => import('./views/projects/ProjectTeamView'))
const ProfileView = lazy(() => import('./views/profile/ProfileView'))
const ChangePasswordView = lazy(() => import('./views/profile/ChangePasswordView'))
const LoginView = lazy(() => import('./views/auth/LoginView'))
const RegisterView = lazy(() => import('./views/auth/RegisterView'))
const ConfirmAccountView = lazy(() => import('./views/auth/ConfirmAccountView'))
const RequestNewCodeView = lazy(() => import('./views/auth/RequestNewCodeView'))
const ForgotPasswordView = lazy(() => import('./views/auth/ForgotPasswordView'))
const NewPasswordView = lazy(() => import('./views/auth/NewPasswordView'))
const NotFound = lazy(() => import('./views/404/NotFound'))

const projectRoutes = [
    { path: '/', element: <DashboardView />, index: true },
    { path: '/projects/create', element: <CreateProjectView /> },
    { path: '/projects/:projectId', element: <ProjectDetailsView /> },
    { path: '/projects/:projectId/edit', element: <EditProjectView /> },
    { path: '/projects/:projectId/team', element: <ProjectTeamView /> },
]

const profileRoutes = [
    { path: '/profile', element: <ProfileView /> },
    { path: '/profile/password', element: <ChangePasswordView /> },
]

const authRoutes = [
    { path: '/auth/login', element: <LoginView /> },
    { path: '/auth/register', element: <RegisterView /> },
    { path: '/auth/confirm-account', element: <ConfirmAccountView /> },
    { path: '/auth/request-code', element: <RequestNewCodeView /> },
    { path: '/auth/forgot-password', element: <ForgotPasswordView /> },
    { path: '/auth/new-password', element: <NewPasswordView /> },
]

export default function Router() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Cargando...</div>}>
                <Routes>
                    <Route element={<AppLayout />}>
                        {projectRoutes.map(route => (
                            <Route key={route.path} {...route} />
                        ))}
                        <Route element={<ProfileLayout />}>
                            {profileRoutes.map(route => (
                                <Route key={route.path} {...route} />
                            ))}
                        </Route>
                    </Route>
                    <Route element={<AuthLayout />}>
                        {authRoutes.map(route => (
                            <Route key={route.path} {...route} />
                        ))}
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}