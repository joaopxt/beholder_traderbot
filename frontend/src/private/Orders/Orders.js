import React, { useState, useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import Menu from "../../components/menu/Menu";
import NewOrderButton from "../../components/NewOrder/NewOrderButton";
import NewOrderModal from "../../components/NewOrder/NewOrderModal";
import { getBalance } from "../../services/ExchangeService";
import { getOrders } from "../../services/OrdersService";
import OrderRow from "./OrderRow";
import Pagination from "../../components/Pagination/Pagination";
import SearchSymbol from "../../components/SearchSymbol/SearchSymbol";
import ViewOrderModal from "./ViewOrderModal";
import Footer from "../../components/Footer/Footer";
import Toast from "../../components/Toast/Toast";

function Orders() {
  const { symbol } = useParams();

  const [search, setSearch] = useState(symbol || "");
  const [viewOrder, setViewOrder] = useState("");
  const [notification, setNotification] = useState({ type: "", text: "" });

  const defaultLocation = useLocation();

  function getPage(location) {
    if (!location) location = defaultLocation;
    return new URLSearchParams(location.search).get("page");
  }

  const history = useHistory();

  const [balances, setBalances] = useState({});
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(parseInt(getPage()));

  function getBalanceCall(token) {
    getBalance(token)
      .then((info) => {
        const balances = Object.entries(info).map((item) => {
          return {
            symbol: item[0],
            available: item[1].available,
            onOrder: item[1].onOrder,
          };
        });
        setBalances(balances);
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err.message);
        setNotification({
          type: "error",
          text: err.response ? err.response.data : err.message,
        });
      });
  }

  function getOrdersCall(token) {
    getOrders(search, page || 1, token)
      .then((result) => {
        setOrders(result.rows);
        setCount(result.count);
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err.message);
        setNotification({
          type: "error",
          text: err.response ? err.response.data : err.message,
        });
      });
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    getBalanceCall(token);
    getOrdersCall(token);
  }, [page, search]);

  useEffect(() => {
    return history.listen((location) => {
      setPage(getPage(location));
    });
  }, [history]);

  function onOrderSubmit(order) {
    history.go(0);
  }

  function onSearchChange(event) {
    setSearch(event.target.value);
  }

  function onViewClick(event) {
    const id = parseInt(event.target.id.replace("view", ""));
    setViewOrder(orders.find((o) => o.id === id));
  }

  return (
    <React.Fragment>
      <Menu />
      <main className="content">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <div class="d-block mb-4 mb-md-0">
            <h2 className="h4">Orders</h2>
          </div>
          <div class="btn-toolbar mb-2 mb-md-0">
            <div className="d-inline-flex align=items-center">
              <NewOrderButton />
            </div>
            <div className="btn-group ms-2 ms-lg-3">
              <SearchSymbol
                placeholder="Search Symbol"
                onChange={onSearchChange}
              />
            </div>
          </div>
        </div>
        <div class="card card-body border-0 shadow table-wrapper table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th className="border-gray-200">Order</th>
                <th className="border-gray-200">Date</th>
                <th className="border-gray-200">QTY</th>
                <th className="border-gray-200">Avg Price</th>
                <th className="border-gray-200">Status</th>
                <th className="border-gray-200">View</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length ? (
                orders.map((order) => (
                  <OrderRow
                    key={order.clientOrderId}
                    data={order}
                    onClick={onViewClick}
                  />
                ))
              ) : (
                <React.Fragment></React.Fragment>
              )}
            </tbody>
          </table>
          <Pagination count={count} />
        </div>
        <Footer />
      </main>
      <ViewOrderModal data={viewOrder} />
      <NewOrderModal wallet={balances} onSubmit={onOrderSubmit} />
      <Toast type={notification.type} text={notification.text} />
    </React.Fragment>
  );
}

export default Orders;
