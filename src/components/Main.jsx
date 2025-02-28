import { DataContext } from "../App";
import dropdownArrowSvg from "/images/dropdown-arrow.svg";
import logoSvg from "/images/logo.svg";
import plusSvg from "/images/plus.svg";
import threeDotSvg from "/images/three-dot.svg";
import { useContext } from "react";

const Main = () => {
  const { sessionRef } = useContext(DataContext);
  if (!sessionRef.current) {
    location.hash = "/login";
    return;
  }

  return (
    <>
      <header>
        <div className="header-left">
          <img src={logoSvg} alt="" />
          <h1>
            Platform Launch <img src={dropdownArrowSvg} alt="" />
          </h1>
        </div>
        <div className="header-right">
          <button className="header-newTaskBtn">
            <img src={plusSvg} alt="" />
          </button>
          <button>
            <img src={threeDotSvg} alt="" />
          </button>
        </div>
      </header>
      <main>
        <div className="column-group">
          <div className="column-item">
            <h4>TODO (4)</h4>
            <div className="column-item-cards">
              <div className="column-item-card">
                <h5></h5>
                <p></p>
              </div>
              <div className="column-item-card">
                <h5></h5>
                <p></p>
              </div>
            </div>
          </div>
          <div className="column-item">
            <h4>TODO (4)</h4>
            <div className="column-item-cards">
              <div className="column-item-card">
                <h5></h5>
                <p></p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Main;
