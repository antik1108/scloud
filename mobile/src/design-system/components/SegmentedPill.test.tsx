import { fireEvent, render, screen } from "@testing-library/react-native";

import { SegmentedPill } from "./SegmentedPill";

describe("SegmentedPill", () => {
  const options = ["FullHD", "4K", "Max"] as const;

  it("selects an unlocked option", async () => {
    const onChange = jest.fn();
    await render(<SegmentedPill options={options} value="4K" onChange={onChange} />);
    await fireEvent.press(screen.getByRole("radio", { name: "FullHD" }));
    expect(onChange).toHaveBeenCalledWith("FullHD");
  });

  it("routes locked options to onLockedPress instead of selecting", async () => {
    const onChange = jest.fn();
    const onLockedPress = jest.fn();
    await render(
      <SegmentedPill
        options={options}
        value="4K"
        onChange={onChange}
        isLocked={(o) => o === "Max"}
        onLockedPress={onLockedPress}
      />,
    );
    await fireEvent.press(screen.getByRole("radio", { name: "Max, Pro" }));
    expect(onLockedPress).toHaveBeenCalledWith("Max");
    expect(onChange).not.toHaveBeenCalled();
  });
});
