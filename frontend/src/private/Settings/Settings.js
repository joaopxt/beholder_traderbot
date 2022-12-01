import React, { useEffect, useState, useRef } from "react";
import { getSettings, updateSettings } from "../../services/SettingsService";
import Menu from "../../components/menu/Menu";
import Symbols from "./Symbols";
import Footer from "../../components/Footer/Footer";
import Toast from "../../components/Toast/Toast";

function Settings() {
  const inputConfirmPassword = useRef("");
  const [settings, setSettings] = useState({});

  const [notification, setNotification] = useState({ type: "", text: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    getSettings(token)
      .then((settings) => {
        delete settings.password;
        delete settings.secretKey;
        setSettings(settings);
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err.message);
        setNotification({
          type: "error",
          text: err.response ? err.response.data : err.message,
        });
      });
  }, []);

  function onInputChange(event) {
    setSettings((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  }

  function onFormSubmit(event) {
    if (
      (settings.password || inputConfirmPassword.current.value) &&
      settings.password !== inputConfirmPassword.current.value
    ) {
      return setNotification({
        type: "error",
        text: "The fields New Password and Confirm Password must be equals",
      });
    }

    const token = localStorage.getItem("token");
    updateSettings(settings, token)
      .then((result) => {
        if (result) {
          setNotification({
            type: "success",
            text: "Settings updated successfully!",
          });
        } else {
          setNotification({ type: "error", text: "Can't update the settings" });
        }
      })
      .catch((error) => {
        console.error(error.response ? error.response.data : error.message);
        return setNotification({
          type: "error",
          text: "Can't update the settings",
        });
      });
  }
  return (
    <React.Fragment>
      <Menu />
      <main className="content">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <div className="d-block mb-4 mb-md-0">
            <h1 className="h4">Settings</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card card-body border-0 shadow mb-4">
              <h2 className="h5 mb-4">Personal Settings</h2>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      onChange={onInputChange}
                      className="form-control"
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      defaultValue={settings.email}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-group">
                    <label htmlFor="email">Phone</label>
                    <input
                      onChange={onInputChange}
                      className="form-control"
                      id="phone"
                      type="tel"
                      placeholder="+5561912345678"
                      defaultValue={settings.phone}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      onChange={onInputChange}
                      className="form-control"
                      id="newPassword"
                      type="password"
                      placeholder="Enter your new password"
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      ref={inputConfirmPassword}
                      className="form-control"
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap">
                  <div className="col-sm-3">
                    <button
                      className="btn btn-gray-800 mt-2 animate-up-2"
                      type="button"
                      onClick={onFormSubmit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card card-body border-0 shadow mb-4">
              <h2 className="h5 my-4">Allert Settings</h2>
              <div className="row">
                <div className="col-sm-12 mb-3">
                  <div className="form-group">
                    <label htmlFor="sendGridKey">SendGrid Api Key</label>
                    <input
                      onChange={onInputChange}
                      className="form-control"
                      id="sendGridKey"
                      type="text"
                      placeholder="Enter your SendGrid API Key"
                      defaultValue={settings.sendGridKey}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-group">
                    <label htmlFor="twilioPhone">Twilio Phone</label>
                    <input
                      onChange={onInputChange}
                      className="form-control"
                      id="twilioPhone"
                      type="tel"
                      placeholder="Enter the Twilio sender phone number (Ex: +11234567890)"
                      defaultValue={settings.twilioPhone}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 mb-3">
                  <div className="form-group">
                    <label htmlFor="twilioSid">Twilio Sid</label>
                    <input
                      onChange={onInputChange}
                      className="form-control"
                      id="twilioSid"
                      type="text"
                      placeholder="Enter the Twilio SID"
                      defaultValue={settings.twilioSid}
                    />
                  </div>
                </div>
                <div className="col-sm-12 mb-3">
                  <div className="form-group">
                    <label htmlFor="twilioToken">Twilio Token</label>
                    <input
                      onChange={onInputChange}
                      className="form-control"
                      id="twilioToken"
                      type="password"
                      placeholder="Enter the Twilio Token"
                      defaultValue={settings.twilioToken}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap">
                  <div className="col-sm-3">
                    <button
                      className="btn btn-gray-800 mt-2 animate-up-2"
                      type="button"
                      onClick={onFormSubmit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card card-body border-0 shadow mb-4">
              <h2 className="h5 my-4">Binance Settings</h2>
              <div className="row">
                <div className="col-sm-12 mb-3">
                  <div className="form-group">
                    <label htmlFor="apiUrl">API URL</label>
                    <input
                      onChange={onInputChange}
                      className="form-control"
                      id="apiUrl"
                      type="text"
                      placeholder="Enter your API URL"
                      defaultValue={settings.apiUrl}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 mb-3">
                  <div className="form-group">
                    <label htmlFor="streamUrl">STREAM URL</label>
                    <input
                      onChange={onInputChange}
                      className="form-control"
                      id="streamUrl"
                      type="text"
                      placeholder="Enter your STREAM URL"
                      defaultValue={settings.streamUrl}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 mb-3">
                  <div className="form-group">
                    <label htmlFor="accessKey">Access Key</label>
                    <input
                      onChange={onInputChange}
                      className="form-control"
                      id="accessKey"
                      type="text"
                      placeholder="Enter your Access Key"
                      defaultValue={settings.accessKey}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 mb-3">
                  <div className="form-group">
                    <label htmlFor="secretKey">Secret Key</label>
                    <input
                      onChange={onInputChange}
                      className="form-control"
                      id="secretKey"
                      type="password"
                      placeholder="Enter your API Secret Key"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap">
                  <div className="col-sm-3">
                    <button
                      className="btn btn-gray-800 mt-2 animate-up-2"
                      type="button"
                      onClick={onFormSubmit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Symbols />
        <Footer />
      </main>
      <Toast type={notification.type} text={notification.text} />
    </React.Fragment>
  );
}

export default Settings;
