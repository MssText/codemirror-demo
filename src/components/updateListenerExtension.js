import { EditorView } from "@codemirror/view";
import { completionStatus, selectedCompletion } from "@codemirror/autocomplete";

const onAutocompleteChanged = (open, from, options, result) => {
  console.log(result, ' == result == ')
};

export const updateListenerExtension = EditorView.updateListener.of((v) => {
  const startStatus = completionStatus(v.startState);
  const endStatus = completionStatus(v.state);
  let selectedList = []
  if (startStatus !== "active" && endStatus === "active") {
    const { transactions } = v;
    const autocompleteResults = [];
    selectedList = selectedCompletion(v.state)


    for (let transaction of transactions) {
      const { effects } = transaction;
      if (effects) {
        for (let effect of effects) {
          const { value: values } = effect;
          if (values) {
            for (let value of values) {
              const { result } = value;
              if (result && typeof result === "object") {
                const { from, options } = result;
                if (from !== undefined && options !== undefined) {
                  autocompleteResults.push({ from, options });
                }
              }
            }
          }
        }
      }
    }

    if (autocompleteResults.length > 0) {
      if (autocompleteResults.length > 1) {
        console.error(
          "multiple autocomplete results found in update transactions"
        );
      }
      const { from, options } = autocompleteResults[0];
      onAutocompleteChanged(true, from, options, selectedList);
    }
  } else if (startStatus !== null && endStatus === null) {
    onAutocompleteChanged(false);
  }
});