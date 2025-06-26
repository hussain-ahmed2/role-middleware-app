import { Link } from "react-router-dom";
import SiteLogo from "./SiteLogo";

function Footer() {
  return (
    <footer className="bg-neutral-900">
      <div className="flex justify-between items-center min-h-20 px-5 max-w-7xl mx-auto">
        <Link to="/">
          <SiteLogo />
        </Link>

        <p>Copyright &copy; 2025 All rights reserved</p>
      </div>
    </footer>
  );
}
export default Footer;
