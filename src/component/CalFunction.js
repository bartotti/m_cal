import React, { useState } from "react";

function Calculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);

  const calculate = () => {
    let numStack = [];
    let opStack = [];

    for (let i = 0; i < input.length; i++) {
      let token = input[i];

      if (!isNaN(token)) {
        let num = token;

        while (!isNaN(input[i + 1])) {
          num += input[i + 1];
          i++;
        }

        numStack.push(parseFloat(num));
      } else if (token === "(") {
        opStack.push(token);

        if (isNumber(input[i - 1])) {
          opStack.push("*");
        }
      } else if (token === ")") {
        while (opStack[opStack.length - 1] !== "(") {
          let num2 = numStack.pop();
          let num1 = numStack.pop();
          let op = opStack.pop();

          let result = applyOperator(num1, num2, op);
          numStack.push(result);
        }

        opStack.pop();

        if (opStack.length > 0 && isNumber(opStack[opStack.length - 1])) {
          let num2 = numStack.pop();
          let num1 = numStack.pop();
          let op = opStack.pop();

          let result = applyOperator(num1, num2, op);
          numStack.push(result);
        }
      } else if (isOperator(token)) {
        while (
          opStack.length > 0 &&
          hasPrecedence(token, opStack[opStack.length - 1])
        ) {
          let num2 = numStack.pop();
          let num1 = numStack.pop();
          let op = opStack.pop();

          let result = applyOperator(num1, num2, op);
          numStack.push(result);
        }

        opStack.push(token);
      }
    }

    while (opStack.length > 0) {
      let num2 = numStack.pop();
      let num1 = numStack.pop();
      let op = opStack.pop();

      let result = applyOperator(num1, num2, op);
      numStack.push(result);
    }

    const calculation = `${input}=${numStack[0]}`;
    setResult(numStack[0]);

    setHistory([...history, calculation]);

    setInput("");
  };

  const isOperator = token => {
    return token === "+" || token === "-" || token === "*" || token === "/";
  };

  const isNumber = token => {
    return !isNaN(token);
  };

  const hasPrecedence = (op1, op2) => {
    if (op2 === "(" || op2 === ")") return false;
    if ((op1 === "*" || op1 === "/") && (op2 === "+" || op2 === "-"))
      return false;
    return true;
  };

  const applyOperator = (num1, num2, op) => {
    switch (op) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "*":
        return num1 * num2;
      case "/":
        return num1 / num2;
      default:
        return 0;
    }
  };
  const clearHistory = () => {
    setHistory([]);
  };

  const handleInputChange = event => {
    setInput(event.target.value);
  };

  return (
    <div className="calculator">
      <h1>Calculator</h1>
      <div>
        <input type="text" value={input} onChange={handleInputChange} />
        <button onClick={calculate}>Calculate</button>
      </div>
      {result && <div className="result">Result: {result}</div>}
      <h2>History</h2>
      <button onClick={clearHistory}>Clear History</button>
      <ul>
        {history.map((calculation, index) => (
          <li key={index}>{calculation}</li>
        ))}
      </ul>
    </div>
  );
}

export default Calculator;
