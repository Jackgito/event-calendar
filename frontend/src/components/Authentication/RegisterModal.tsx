"use client";

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
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";

import { useSnackbar } from '@context/SnackbarContext';
import { useAuthentication } from "@/context/AuthenticationContext";
import { register } from '@/API/authService'; // your register API function
import { jwtDecode } from "jwt-decode";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
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
  maxHeight: "90vh",
  overflow: "auto",
};

export default function RegisterModal({ open, onClose }: RegisterModalProps) {
  const { showSnackbar } = useSnackbar();
  const { setUser } = useAuthentication();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validUsername = username.trim().length > 0;
    const validEmail = isValidEmail(email);
    const validPassword = password.length > 0;
    const passwordsMatch = password === confirmPassword;
    const agreed = agreeToTerms;

    setUsernameError(!validUsername);
    setEmailError(!validEmail);
    setPasswordError(!validPassword);
    setConfirmPasswordError(!passwordsMatch);
    setTermsError(!agreed);

    if (!validUsername || !validEmail || !validPassword || !passwordsMatch || !agreed) {
      return;
    }

    try {
      // Call your register API - it should return a token or user info after successful registration
      const response = await register(username, email, password);

      if (!response) {
        showSnackbar("Registration failed", "error");
        return;
      }

      // If your register returns a JWT token, decode it to get user info
      if (response.token) {
        const decoded: any = jwtDecode(response.token);
        const newUser = {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role === "ADMIN" || decoded.role === "USER" ? decoded.role : "GUEST",
        };
        setUser(newUser);
        localStorage.setItem("authToken", response.token); // Save token if needed
      }

      showSnackbar("Registration succesfull", "success");
      onClose();
    } catch (error) {
      console.error(error);
      showSnackbar("Registration failed", "error");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="register-modal-title"
      aria-describedby="register-modal-description"
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
        <Typography id="register-modal-title" variant="h5" component="h2" gutterBottom>
          Create an Account
        </Typography>
        <Typography id="register-modal-description" sx={{ mt: 1, mb: 3 }} color="text.secondary">
          Fill in your details to create a new account
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={usernameError}
            helperText={usernameError ? "Username is required" : ""}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            helperText={emailError ? "Valid email is required" : ""}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="new-password"
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
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPasswordError}
            helperText={confirmPasswordError ? "Passwords do not match" : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                value="agreeToTerms"
                color="primary"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2">
                I agree to the{" "}
                <Link href="#" underline="hover">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" underline="hover">
                  Privacy Policy
                </Link>
              </Typography>
            }
          />
          {termsError && (
            <Typography variant="caption" color="error">
              You must agree to the terms to continue
            </Typography>
          )}

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Create Account
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
