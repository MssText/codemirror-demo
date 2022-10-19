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
      console.log(context, '== context ==')
      // eslint-disable-next-line no-useless-escape
      let word = context.matchBefore(/\w+[\u4e00-\u9fa5]+[\+\-\*/]+/)
      if (word && word.from == word.to) return null

      console.log(word, '== word ==')
      console.log(word, '== word ==')
      let from = word ? word.from : null
      return {
        from,
        options: this.completions,
        // eslint-disable-next-line no-useless-escape
        validFor: /\w+[\u4e00-\u9fa5]+[\+\-\*/]+/,
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
