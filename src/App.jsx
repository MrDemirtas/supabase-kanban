import { createContext, useEffect, useRef, useState } from "react";

import { getPage } from "./helper";
import { supabase } from "../supabaseClient";

export const DataContext = createContext(null);
const App = () => {
  const sessionRef = useRef(null);
  const [route, setRoute] = useState(location.hash.substring(1) || "/");
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      sessionRef.current = session;
      if (event === "INITIAL_SESSION") {
        location.hash = session ? "/" : "/login";
      } else if (event === "SIGNED_IN") {
        const userCheck = async () => {
          const { data, error } = await supabase
            .from("users")
            .select("name")
            .eq("id", session.user.id)
            .single();
          if (data.length === 0) {
            const name = prompt("YENİ KAYIT!\n\nAdınızı girin:");
            const { data, error } = await supabase
              .from("users")
              .insert({ id: session.user.id, name })
              .select("name")
              .eq("id", session.user.id)
              .single();
            setUser(data.name);
          } else {
            setUser(data.name);
          }
        };
        userCheck();
        location.hash = "/";
      } else if (event === "SIGNED_OUT") {
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

    window.addEventListener("hashchange", () => {
      setRoute(location.hash.substring(1));
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
        tasks,
        setTasks,
        boards,
        setBoards,
        sessionRef,
      }}
    >
      {getPage(route)}
    </DataContext.Provider>
  );
};

export default App;
