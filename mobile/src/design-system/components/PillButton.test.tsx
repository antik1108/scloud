import { fireEvent, render, screen } from "@testing-library/react-native";

import { PillButton } from "./PillButton";

describe("PillButton", () => {
  it("calls onPress", async () => {
    const onPress = jest.fn();
    await render(<PillButton title="Get Started" onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button", { name: "Get Started" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("is busy and ignores presses while loading", async () => {
    const onPress = jest.fn();
    await render(<PillButton title="Continue" loading onPress={onPress} />);
    const button = screen.getByRole("button", { name: "Continue" });
    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeBusy();
    expect(button).toBeDisabled();
  });
});
