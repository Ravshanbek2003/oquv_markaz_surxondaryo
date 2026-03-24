import { ThemeProvider } from "@mui/material";
import { themes } from "./theme";
import { lazy, Suspense, useEffect } from "react";
import { Layout } from "./layouts/layout";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Loader, Protected } from "./components";
import { useStorage } from "./utils";
import { useHandleRequest } from "./hooks";
import { useLazyMeQuery } from "./app/api/authApi/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setBranch, setTheme } from "./app/slices";
import { useGetSettingsQuery } from "./app/api";
import { ThemesColor } from "./constants";
import ProfilePage from "./pages/Profile";
import "./App.css";
import { NotFound } from "./pages/NotFound";

const LoginPage = lazy(() => import("./pages/Login"));
const DashboardPage = lazy(() => import("./pages/Dashboard"));
const TeachersPage = lazy(() => import("./pages/Teachers"));
const GroupsPage = lazy(() => import("./pages/Groups"));
const StudentsPage = lazy(() => import("./pages/Students"));
const BudgetPage = lazy(() => import("./pages/Budget"));
const CeoPage = lazy(() => import("./pages/Ceo"));
const CoursePage = lazy(() => import("./pages/Course"));
const ArchivePage = lazy(() => import("./pages/Archive"));
const GeneralPage = lazy(() => import("./pages/General"));
const StudentPage = lazy(() => import("./pages/Student"));
const OfficePage = lazy(() => import("./pages/Office"));
const NotificationPage = lazy(() => import("./pages/Notification"));
const GroupPage = lazy(() => import("./pages/Group"));
const LeadsPage = lazy(() => import("./pages/Leads"));
const TeacherTabs = lazy(
  () => import("./pages/Teachers/_components/TeacherTabs")
);

export const App = () => {
  const { data: settings, isLoading: isSettings } = useGetSettingsQuery("");
  const [getUser, { isError, isLoading, data: user }] = useLazyMeQuery();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const { theme } = useSelector(
    (state: { theme: { theme: ThemesColor } }) => state.theme
  );
  const handleRequest = useHandleRequest();

  const fetchUser = async () => {
    await handleRequest({
      request: async () => {
        const result = await getUser("");
        return result;
      },
    });
  };

  useEffect(() => {
    const token = useStorage.getTokens().accessToken?.split(" ")[1];

    if (isError) {
      useStorage.removeCredentials();
      return;
    }

    if (token) {
      fetchUser();
    }
  }, [pathname, isError]);

  useEffect(() => {
    document.documentElement.style.setProperty("--scroll-color", theme);
  }, [dispatch, theme]);

  useEffect(() => {
    dispatch(setBranch(localStorage.getItem("branch") || ""));
    if (settings?.color) {
      dispatch(setTheme(settings?.color));
    }
  }, [dispatch, settings?.color]);

  if (isLoading || isSettings) {
    return <Loader />;
  }

  return (
    <ThemeProvider theme={themes[theme]}>
      <Suspense fallback={<Loader />}>
        <Layout>
          <Routes>
            <Route
              path='/login'
              element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
            />
            <Route element={<Protected />}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="/teachers" element={<TeachersPage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/notification" element={<NotificationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings/office" element={<OfficePage />} />
              <Route path="/settings/archive" element={<ArchivePage />} />
              <Route path="/settings/ceo" element={<CeoPage />} />
              <Route path="/settings/general" element={<GeneralPage />} />
              <Route path="/courses/:id" element={<CoursePage />} />
              <Route path="/groups/:id" element={<GroupPage />} />
              <Route path="/students/:id" element={<StudentPage />} />
              <Route path="/teachers/:id" element={<TeacherTabs />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Layout>
      </Suspense>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
};
