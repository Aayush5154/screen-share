import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="flex min-h-dvh flex-col">
            <Outlet />
        </div>
    );
}
