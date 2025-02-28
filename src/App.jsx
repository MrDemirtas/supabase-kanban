import { createContext, useEffect, useState } from "react";

import Login from "./components/Login";
import { supabase } from "../supabaseClient";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        // handle initial session
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
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        // handle sign out event
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
    <>
      <button onClick={() => supabase.auth.signOut()}>Çıkış {user}</button>
      <Login />
    </>
  );
};

export default App;
