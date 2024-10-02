import { describe, expect, it } from "vitest";
import { validateEmail } from "./email";

describe("email", () => {
  it("succeed to validate emails", async () => {
    expect(validateEmail("test@example.com")).toBeTruthy();
    expect(validateEmail("test")).toBeFalsy();
    expect(validateEmail("test@")).toBeFalsy();
    expect(validateEmail("test@example.com.jp")).toBeTruthy();
  });
});
