import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { searchSymbols, syncSymbols } from "../../services/SymbolsService";
import SymbolRow from "./SymbolRow";
import SelectQuote, {
  getDefaultQuote,
  setDefaultQuote,
} from "../../components/SelectQuote/SelectQuote";
import SymbolModal from "./SymbolModal";
import Pagination from "../../components/Pagination/Pagination";

function Symbols() {
  const history = useHistory();

  const defaultLocation = useLocation();
  function getPage(location) {
    if (!location) location = defaultLocation;
    return new URLSearchParams(location.search).get("page") || 1;
  }
  useEffect(() => {
    return history.listen((location) => {
      setPage(getPage(location));
    });
  }, [history]);

  const [page, setPage] = useState(getPage());
  const [symbols, setSymbols] = useState([]);
  const [error, setError] = useState("");
  const [quote, setQuote] = useState(getDefaultQuote());
  const [success, setSuccess] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [count, setCount] = useState(0);
  const [editSymbol, setEditSymbol] = useState({
    symbol: "",
    basePrecision: 0,
    quotePrecision: 0,
    minLotSize: "",
    minNotional: "",
  });

  function onSyncClick(event) {
    const token = localStorage.getItem("token");
    setIsSyncing(true);
    syncSymbols(token)
      .then((response) => setIsSyncing(false))
      .catch((err) => {
        if (err.response && err.response.status === 401)
          return history.push("/");
        console.error(err.message);
        setError(err.message);
        setSuccess("");
      });
  }

  function onQuoteChange(event) {
    setQuote(event.target.value);
    setDefaultQuote(event.target.value);
  }

  function loadSymbols(selectedValue) {
    const token = localStorage.getItem("token");
    const search = selectedValue === "FAVORITES" ? "" : selectedValue;
    const onlyFavorites = selectedValue === "FAVORITES";
    searchSymbols(search, onlyFavorites, getPage(), token)
      .then((result) => {
        setSymbols(result.rows);
        setCount(result.count);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401)
          return history.push("/");
        console.error(err.message);
        setError(err.message);
        setSuccess("");
      });
  }

  useEffect(() => {
    loadSymbols(quote);
  }, [isSyncing, quote, page]);

  function onEditSymbol(event) {
    const symbol = event.target.id.replace("edit", "");
    const symbolObj = symbols.find((s) => s.symbol === symbol);
    setEditSymbol(symbolObj);
  }

  function onModalSubmit(event) {
    loadSymbols(event.target.value);
  }

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-12">
          <div className="col-12 mb-4">
            <div className="card border-0 shadow">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col">
                    <h2 className="fs-5 fw-bold mb-0">Symbols</h2>
                  </div>
                  <div className="col">
                    <SelectQuote onChange={onQuoteChange} />
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table align-items-center table-flush">
                  <thead className="thead-light">
                    <tr>
                      <th className="border-bottom" scope="col">
                        Symbol
                      </th>
                      <th className="border-bottom" scope="col">
                        Base Prec
                      </th>
                      <th className="border-bottom" scope="col">
                        Quote Prec
                      </th>
                      <th className="border-bottom" scope="col">
                        Min Notional
                      </th>
                      <th className="border-bottom" scope="col">
                        Min Lot Size
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {symbols.map((item) => (
                      <SymbolRow
                        key={item.symbol}
                        data={item}
                        onClick={onEditSymbol}
                      />
                    ))}
                  </tbody>
                </table>
                <Pagination count={count} />
                <div className="card-footer">
                  <div className="row">
                    <div className="col">
                      <button
                        className="btn btn-primary animate-up-2"
                        type="button"
                        onClick={onSyncClick}
                      >
                        <svg
                          className="icon icon-xs"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {isSyncing ? "Syncing..." : "Sync"}
                      </button>
                    </div>
                  </div>
                  <div className="col">
                    {error ? (
                      <div className="alert alert-danger">{error}</div>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                    {error ? (
                      <div className="alert alert-success">{success}</div>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SymbolModal data={editSymbol} onSubmit={onModalSubmit} />
    </React.Fragment>
  );
}

export default Symbols;
