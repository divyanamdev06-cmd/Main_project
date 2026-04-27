import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiPost, getApiErrorMessage } from "../lib/apiClient.js";

const STORAGE_KEY = "jobnest_auth";

function normalizeStoredUser(user) {
  if (!user || typeof user !== "object") return user;
  if (user.role === "user") return { ...user, role: "job_seeker" };
  return user;
}

function loadInitialState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, user: null };
    const parsed = JSON.parse(raw);
    return {
      token: parsed?.token ?? null,
      user: normalizeStoredUser(parsed?.user ?? null),
    };
  } catch {
    return { token: null, user: null };
  }
}

function persistAuth({ token, user }) {
  try {
    const u = normalizeStoredUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: u }));
  } catch {
    // ignore storage failures
  }
}

function clearAuth() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function pickAuthFromPayload(payload) {
  const data = payload?.data;
  const token = data?.token ?? payload?.token ?? null;
  const user = normalizeStoredUser(data?.user ?? payload?.user ?? null);
  return { token, user, message: payload?.message };
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const payload = await apiPost("/user/login", { email, password });
      return pickAuthFromPayload(payload);
    } catch (err) {
      return rejectWithValue(getApiErrorMessage(err));
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (body, { rejectWithValue }) => {
    try {
      const payload = await apiPost("/user/signup", body);
      return pickAuthFromPayload(payload);
    } catch (err) {
      return rejectWithValue(getApiErrorMessage(err));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...loadInitialState(),
    status: "idle",
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
      clearAuth();
    },
    setCredentials(state, action) {
      const { token = null, user = null } = action.payload || {};
      state.token = token;
      state.user = normalizeStoredUser(user);
      persistAuth({ token: state.token, user: state.user });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
        persistAuth({ token: state.token, user: state.user });
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
        persistAuth({ token: state.token, user: state.user });
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;

/** Role used for routing / guards (JWT + stored user are normalized). */
export function selectEffectiveRole(state) {
  const r = state?.auth?.user?.role;
  if (!r || r === "user") return "job_seeker";
  return r;
}
