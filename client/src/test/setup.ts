import "@testing-library/jest-dom/vitest";

import useAuthStore from "../store/authStore";

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({
    token: null,
    user: null,
    organization: null,
  });
});
