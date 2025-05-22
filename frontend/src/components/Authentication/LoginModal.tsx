import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";

import { useSnackbar } from "@context/SnackbarContext";
import { useAuthentication } from "@/context/AuthenticationContext";
import { login } from "@/API/authService";
import { jwtDecode } from "jwt-decode";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

interface DecodedToken {
  id: string;
  username: string;
  role: "ADMIN" | "USER" | "GUEST" | string;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 400 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const { showSnackbar } = useSnackbar();
  const { setUser } = useAuthentication();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailValid = !!email;
    const passwordValid = !!password;

    setEmailError(!emailValid);
    setPasswordError(!passwordValid);

    if (!emailValid || !passwordValid) return;

    try {
      const token = await login(email, password);

      if (!token) {
        showSnackbar("Login failed", "error");
        return;
      }

      try {
        const decoded: DecodedToken = jwtDecode(token);

        const user = {
          id: Number(decoded.id),
          username: decoded.username,
          role:
            decoded.role === "ADMIN" || decoded.role === "USER"
              ? decoded.role
              : "GUEST",
        } as { id: number; username: string; role: import("@/context/AuthenticationContext").UserRole };

        setUser(user);
        showSnackbar("Login successful", "success");
        onClose();
      } catch (err) {
        console.error("Invalid token", err);
        showSnackbar("Login failed: invalid token", "error");
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Login failed", "error");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="login-modal-title" variant="h5" component="h2" gutterBottom>
          Login
        </Typography>
        <Typography
          id="login-modal-description"
          sx={{ mt: 1, mb: 3 }}
          color="text.secondary"
        >
          Enter your credentials to access your account
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email / Username"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            helperText={emailError ? "Email is required" : ""}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            helperText={passwordError ? "Password is required" : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
