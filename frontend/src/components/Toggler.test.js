import React from "react";
import Toggler from "./Toggler";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let container;

describe("<Toggler />", () => {
  beforeEach(() => {
    container = render(
      <Toggler buttonLabel="show...">
        <div className="testDiv">content that toggles</div>
      </Toggler>
    ).container;
  });

  test("render its children", async () => {
    await screen.findAllByText("content that toggles");
  });

  test("at start the children are not displayed", () => {
    const div = container.querySelector(".togglerContent");
    expect(div).toHaveStyle("display: none");
  });

  test("after clicking the button, children are displayed", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("show...");
    await user.click(button);

    const div = container.querySelector(".togglerContent");
    expect(div).not.toHaveStyle("display: none");
  });

  test("content can be closed", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("show...");
    await user.click(button);

    const cancelButton = screen.getByText("cancel");
    await user.click(cancelButton);

    const div = container.querySelector(".togglerContent");
    expect(div).toHaveStyle("display: none");
  });
});
