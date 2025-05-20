import type React from "react"

import { useState } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import CloseIcon from "@mui/icons-material/Close"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Link from "@mui/material/Link"
import { useAuthentication } from "../../context/AuthenticationContext"
import { register } from "../../utils/authApi"
import { useSnackbar } from '@context/SnackbarContext';

interface RegisterModalProps {
  open: boolean
  onClose: () => void
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
}

export default function RegisterModal({ open, onClose }: RegisterModalProps) {
  const { showSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const [nameError, setNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const [termsError, setTermsError] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show)
  const { setRole } = useAuthentication()

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validName = !!name;
    const validEmail = isValidEmail(email);
    const validPassword = !!password;
    const passwordsMatch = password === confirmPassword;
    const agreed = agreeToTerms;

    setNameError(!validName);
    setEmailError(!validEmail);
    setPasswordError(!validPassword);
    setConfirmPasswordError(!passwordsMatch);
    setTermsError(!agreed);

    if (!validName || !validEmail || !validPassword || !passwordsMatch || !agreed) {
      return;
    }

    try {
      const response = await register(name, email, password);
      if (response?.role === "admin") {
        setRole("admin");
      } else if (response?.role === "user") {
        setRole("user");
      }
      onClose();
    } catch (error) {
      showSnackbar("Registration failed", "error");
      console.error(error);
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
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={nameError}
            helperText={nameError ? "Name is required" : ""}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
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
            name="confirmPassword"
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
  )
}