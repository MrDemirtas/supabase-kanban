import { DataContext } from "../App";
import dropdownArrowSvg from "/images/dropdown-arrow.svg";
import logoSvg from "/images/logo.svg";
import plusSvg from "/images/plus.svg";
import threeDotSvg from "/images/three-dot.svg";
import { useContext } from "react";

const Main = () => {
  const { sessionRef, selectedBoard, setSelectedBoard } =
    useContext(DataContext);
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
            {selectedBoard.name} <img src={dropdownArrowSvg} alt="" />
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
          {selectedBoard.categories.map((category) => (
            <ColumnItem key={category.id} category={category} />
          ))}
        </div>
      </main>
    </>
  );
};

const ColumnItem = ({ category }) => {
  console.log(category);

  return (
    <div className="column-item">
      <h4>
        {category.name} ({category.tasks.length})
      </h4>
      <div className="column-item-cards">
        {category.tasks.map((task) => (
          <CardItem key={task.id} {...task} />
        ))}
      </div>
    </div>
  );
};

const CardItem = ({ task, subtasks }) => {
  return (
    <div className="column-item-card">
      <h5>{task}</h5>
      <p>
        {subtasks?.filter((x) => x.done).length || "0"} of {subtasks?.length || "0"} substasks
      </p>
    </div>
  );
};

export default Main;
