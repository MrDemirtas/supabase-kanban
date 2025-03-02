import { useContext, useEffect, useState } from "react";

import { DataContext } from "../App";
import { supabase } from "../../supabaseClient";

const AddColumnModal = ({ addNewColumnRef }) => {
  const { selectedBoard, taskData, setTaskData } = useContext(DataContext);
  const [columns, setColumns] = useState([]);
  const [deletedColumnsId, setDeletedColumnsId] = useState([]);

  useEffect(() => {
    const boardColumns = [];
    selectedBoard.categories.map((x) => {
      const boardColumnObj = {
        id: x.id,
        name: x.name,
        board_id: x.board_id,
      };
      boardColumns.push(boardColumnObj);
    });
    setColumns(boardColumns);
  }, [taskData]);

  const handleChange = (e, i) => {
    columns[i].name = e.target.value;
    setColumns([...columns]);
  };

  const handleAddColumn = async () => {
    const newColumnObj = {
      name: "",
      board_id: selectedBoard.id,
    };
    setColumns([...columns, newColumnObj]);
  };

  const handleDelete = (columnId, isNew = false) => {
    if (!isNew) {
      setDeletedColumnsId([...deletedColumnsId, columnId]);
      setColumns(columns.filter((x) => x.id !== columnId));
    } else {
      setColumns(columns.filter((_, i) => i !== columnId));
    }
  };

  const handleSave = async () => {
    const updatingData = columns.filter((x) => x.id);
    const insertingData = columns.filter((x) => !x.id);

    if (insertingData.length > 0) {
      const { data, error } = await supabase.from("categories").insert(insertingData);
      if (error) {
        console.error("Insert error:", error);
        return;
      }
    }

    if (updatingData.length > 0) {
      const { data, error } = await supabase.from("categories").upsert(updatingData);
      if (error) {
        console.error("Update error:", error);
        return;
      }
    }

    if (deletedColumnsId.length > 0) {
      const { error } = await supabase.from("categories").delete().in("id", deletedColumnsId);

      if (error) {
        console.error("Delete error:", deleteError);
      }
    }

    supabase
      .from("boards")
      .select("*, categories(*, tasks(*))")
      .then(({ data }) => {
        setTaskData(data);
      });

    addNewColumnRef.current?.close();
  };

  return (
    <dialog ref={addNewColumnRef}>
      <div className="dialog-add-column-container">
        <h1>Add New Column</h1>
        <label>
          Board Name
          <input type="text" value={selectedBoard.name} disabled />
        </label>
        <div className="dialog-add-column-list">
          Column Name
          {columns.map((column, i) => (
            <label key={i}>
              <input type="text" value={column.name} onChange={(e) => handleChange(e, i)} />
              <button onClick={() => handleDelete(column.id || i, !column.id && true)}>X</button>
            </label>
          ))}
          {columns.length < 6 && <button onClick={handleAddColumn}>+ Add New Column</button>}
        </div>
        <button onClick={handleSave}>Save Changes</button>
      </div>
    </dialog>
  );
};

export default AddColumnModal;
