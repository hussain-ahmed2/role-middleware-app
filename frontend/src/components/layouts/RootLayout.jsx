import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

function RootLayout() {
  return (
    <>
      <div className="fixed bg-neutral-900 left-0 top-0 right-0 z-50">
        <Navbar />
      </div>
      <Outlet />
      <Footer />
    </>
  );
}
export default RootLayout;
