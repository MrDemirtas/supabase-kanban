import { useContext, useState } from "react";

import { DataContext } from "../App";
import { supabase } from "../../supabaseClient";

const Login = () => {
  const { sessionRef } = useContext(DataContext);
  if (sessionRef.current) {
    location.hash = "/";
    return;
  }
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSendCode = async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
    });
    if (!error) {
      setIsCodeSent(true);
    } else {
      alert("Kod gönderilemedi. Lütfen e-posta adresinizi kontrol edin.");
    }
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    console.log(data, error);
  };

  return (
    <div className="login-container">
      <h2>Giriş Yap</h2>
      {!isCodeSent ? (
        <div>
          <input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendCode}>Kodu Gönder</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Kod"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={handleLogin}>Giriş Yap</button>
        </div>
      )}
    </div>
  );
};

export default Login;
