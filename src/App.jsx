import { createContext, useEffect, useRef, useState } from "react";

import Login from "./components/Login";
import Main from "./components/Main";
import { supabase } from "../supabaseClient";

export const DataContext = createContext(null);
const App = () => {
  const isFirstLogin = useRef(true);
  const sessionRef = useRef(null);
  const [user, setUser] = useState(null);
  const [taskData, setTaskData] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);

  useEffect(() => {
    setSelectedBoard(taskData[0]);
  }, [taskData]);

  const userCheck = async () => {
    const { data, error } = await supabase.from("users").select("name").eq("id", sessionRef.current.user.id).single();
    if (data.length === 0) {
      const name = prompt("YENİ KAYIT!\n\nAdınızı girin:");
      const { data, error } = await supabase
        .from("users")
        .insert({ id: sessionRef.current.user.id, name })
        .select("name")
        .eq("id", sessionRef.current.user.id)
        .single();
      setUser(data.name);
    } else {
      setUser(data.name);
    }
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      sessionRef.current = session;
      if (event === "INITIAL_SESSION") {
        location.hash = session ? "/" : "/login";
      } else if (event === "SIGNED_IN" && isFirstLogin.current) {
        isFirstLogin.current = false;
        userCheck();
        supabase
          .from("boards")
          .select("*, categories(*, tasks(*))")
          .then(({ data }) => {
            setTaskData(data);
          });
        location.hash = "/";
      } else if (event === "SIGNED_OUT") {
        isFirstLogin.current = true;
        location.hash = "/login";
        setUser(null);
      } else if (event === "PASSWORD_RECOVERY") {
        // handle password recovery event
      } else if (event === "TOKEN_REFRESHED") {
        // handle token refreshed event
      } else if (event === "USER_UPDATED") {
        // handle user updated event
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <DataContext.Provider
      value={{
        user,
        setUser,
        taskData,
        setTaskData,
        selectedBoard,
        setSelectedBoard,
        sessionRef,
      }}
    >
      {sessionRef.current ? selectedBoard && <Main /> : <Login />}
    </DataContext.Provider>
  );
};

export default App;
