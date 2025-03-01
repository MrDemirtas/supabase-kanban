import { useContext, useEffect, useRef, useState } from "react";

import { DataContext } from "../App";
import dropdownArrowSvg from "/images/dropdown-arrow.svg";
import logoSvg from "/images/logo.svg";
import plusSvg from "/images/plus.svg";
import { supabase } from "../../supabaseClient";
import threeDotSvg from "/images/three-dot.svg";

const Main = () => {
  const { sessionRef, selectedBoard } = useContext(DataContext);
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

const CardItem = ({ id, task, subtasks, description, category_id }) => {
  const { selectedBoard, taskData, setTaskData } = useContext(DataContext);
  const dialogRef = useRef(null);

  const handleStatusChange = async (e) => {
    const thisCategory = selectedBoard.categories.find((x) => x.id === category_id);
    thisCategory.tasks = thisCategory.tasks.filter((x) => x.id !== id);

    const newCategory = selectedBoard.categories.find((x) => x.name === e.target.value);
    const { data, error } = await supabase
      .from("tasks")
      .update({ category_id: newCategory.id, updated_at: new Date() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      alert("An error occurred while updating the task.");
      return;
    }
    newCategory.tasks.push(data);
    setTaskData([...taskData]);
  };

  return (
    <>
      <div className="column-item-card" onClick={() => dialogRef.current.showModal()}>
        <h5>{task}</h5>
        <p>
          {subtasks?.filter((x) => x.done).length || "0"} of {subtasks?.length || "0"} substasks
        </p>
      </div>
      <dialog ref={dialogRef}>
        <div className="dialog-container">
          <div className="dialog-top">
            <h3>{task}</h3>
            <button onClick={() => dialogRef.current.close()}>X</button>
          </div>
          <p>{description}</p>
          <div className="dialog-subtasks-content">
            <h3>
              Subtasks ({subtasks?.filter((x) => x.done).length || "0"} of {subtasks?.length || "0"})
            </h3>

            <ul>
              {subtasks?.map((subtask, i) => (
                <SubtaskItem key={i} {...subtask} subtasks={subtasks} taskId={id} categoryId={category_id} />
              ))}
            </ul>
          </div>

          <div className="dialog-current-status">
            <h3>Current Status</h3>
            <select
              onChange={handleStatusChange}
              value={selectedBoard.categories.find((x) => x.id === category_id).name}
            >
              {selectedBoard.categories.map((category) => (
                <option key={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </dialog>
    </>
  );
};

const SubtaskItem = ({ subtask, done, subtasks, taskId, categoryId }) => {
  const { selectedBoard, taskData, setTaskData } = useContext(DataContext);

  const handleSubtaskChange = async () => {
    const thisSubtask = subtasks.find((x) => x.subtask === subtask);
    thisSubtask.done = !done;
    const thisCategory = selectedBoard.categories.find((x) => x.id === categoryId);
    thisCategory.tasks.find((x) => x.id === taskId).subtasks = subtasks;

    const { error } = await supabase.from("tasks").update({ subtasks, updated_at: new Date() }).eq("id", taskId);

    if (error) {
      alert("An error occurred while updating the subtask.");
      return;
    }
    setTaskData([...taskData]);
  };

  return (
    <li>
      <label>
        <input type="checkbox" checked={done} onChange={handleSubtaskChange} />
        {subtask}
      </label>
    </li>
  );
};

export default Main;
