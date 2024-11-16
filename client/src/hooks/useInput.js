"use client";
const { useState } = require("react");

const useInput = (init) => {
  const [input, setInput] = useState(init || "");
  function updateInput(e) {
    setInput(e.target.value);
  }
  function clear() {
    setInput("");
  }
  return { value: input, onChange: updateInput, clear, setInput };
};
export default useInput;
