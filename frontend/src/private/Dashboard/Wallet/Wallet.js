import React, { useState, useEffect } from "react";
import { getBalance } from "../../../services/ExchangeService";
import { useHistory } from "react-router-dom";
import "../Dashboard.css";

/**
 * props:
 * - data
 */

function Wallet(props) {
  //if (!props || !props.data) return <React.Fragment></React.Fragment>;

  const history = useHistory();
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    getBalance(token)
      .then((info) => {
        Object.entries(info).map((item) => {
          return {
            symbol: item[0],
            available: item[1].available,
            onOrder: item[1].onOrder,
          };
        });

        setBalances([info]);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401)
          return history.push("/");
        console.error(err);
      });
  }, []);

  return <React.Fragment>{JSON.stringify(balances)}</React.Fragment>;
}

export default Wallet;
