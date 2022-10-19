<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import { basicSetup, EditorView } from "codemirror";
import { autocompletion } from "@codemirror/autocomplete";
import { EditorState } from "@codemirror/state";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      view: null,
      completions: [
        { label: "panic" },
        { label: "park" },
        { label: "password" },
        { label: "1245" },
        { label: 'mss' },
        { label: '参数1' },
        { label: '参数2' },
        { label: 'sum(表格1: key1)' },
        { label: 'sum(表格2: key2)' },
        { label: 'sum(表格3: key3)' },
        { label: '+' },
        { label: '-' },
        { label: '*' },
         { label: '/' }
      ],
    };
  },
  mounted() {
    // eslint-disable-next-line no-unused-vars
    if (!this.view) {
      this.view = new EditorView({
        doc: "",
        extensions: [
          basicSetup,
          autocompletion({
            override: [this.myCompletions],
            icons: false,
            aboveCursor: true
          }),
          EditorState.transactionFilter.of((tr) => {
            return tr.newDoc.lines > 1 ? [] : [tr];
          }),
        ],
        parent: document.body,
      });
    }
  },
  methods: {
    myCompletions(context) {
      let before = context.matchBefore(/[a-zA-Z0-9_\u4e00-\u9fa5\+\-\*\/]+/)
      if (!context.explicit && !before) return null
      return {
        from: before ? before.from : context.pos,
        options: this.completions,
        validFor: /^[a-zA-Z0-9_\u4e00-\u9fa5\+\-\*\/]*$/,
      };
    },
  },
};
</script>
