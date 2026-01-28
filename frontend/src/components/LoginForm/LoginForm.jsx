/**
 * LoginForm Component
 * Handles user authentication/username entry
 * Props: onLogin, isConnecting, error
 */

import { useState } from "react";
import { UI_CONFIG } from "../../constants/config";
import "./LoginForm.css";

const LoginForm = ({ onLogin, isConnecting, error }) => {
  const [username, setUsername] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!username.trim()) {
      setValidationError("Username is required");
      return;
    }

    if (username.length > UI_CONFIG.MAX_USERNAME_LENGTH) {
      setValidationError(
        `Username must be ${UI_CONFIG.MAX_USERNAME_LENGTH} characters or less`,
      );
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setValidationError(
        "Username can only contain letters, numbers, and underscores",
      );
      return;
    }

    setValidationError("");
    onLogin(username);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (validationError) setValidationError("");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>💬 Real-Time Chat</h1>
          <p>Enter your username to join the conversation</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={handleUsernameChange}
              maxLength={UI_CONFIG.MAX_USERNAME_LENGTH}
              disabled={isConnecting}
              className={validationError || error ? "error" : ""}
              autoFocus
            />
            {validationError && (
              <span className="error-message">{validationError}</span>
            )}
            {error && <span className="error-message">{error}</span>}
          </div>

          <button
            type="submit"
            disabled={isConnecting || !username.trim()}
            className="login-button"
          >
            {isConnecting ? (
              <>
                <span className="spinner"></span>
                Connecting...
              </>
            ) : (
              "Join Chat"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="info-text">Please use a respectful username</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
