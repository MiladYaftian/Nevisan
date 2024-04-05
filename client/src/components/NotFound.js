import logo from "../assets/typewriter.jpg";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="not-found-container-wrapper">
      <div className="not-found-container">
        <img src={logo} className="not-found-img" />
        <p className="not-found-text">مطلبی که دنبال آن بودید یافت نشد</p>
        <Link to="/">
          <div className="not-found-btn-container">
            <button type="button" className="not-found-btn">
              برو به صفحه اصلی!
            </button>
          </div>
        </Link>
      </div>
    </main>
  );
}
