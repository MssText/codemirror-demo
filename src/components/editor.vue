<template>
  <div>
      <div class="editor" id="editor" style="text-align: left;margin-bottom: 40px;"></div>
      <el-input v-model="value" />
  </div>
</template>

<script>
import { basicSetup, EditorView } from "codemirror";
import { autocompletion } from "@codemirror/autocomplete";
import { EditorState } from "@codemirror/state";
import { oneDark } from './theme'

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      view: null,
      value: '',
      completions: [
        { label: "panic" },
        { label: "park" },
        { label: "password" },
        { label: "1245" },
        { label: "mss" },
        { label: "参数1" },
        { label: "参数2" },
        { label: "sum(表格1: key1)" },
        { label: "sum(表格2: key2)" },
        { label: "sum(表格3: key3)" },
        { label: "+" },
        { label: "-" },
        { label: "*" },
        { label: "/" },
      ],
    };
  },
  mounted() {
    if (!this.view) {
      this.view = new EditorView({
        doc: "",
        extensions: [
          basicSetup,
          autocompletion({
            override: [this.myCompletions],
            icons: false,
            aboveCursor: true,
          }),
          EditorState.transactionFilter.of((tr) => {
            return tr.newDoc.lines > 1 ? [] : [tr];
          }),
        ],
        parent: document.getElementById("editor"),
      });
    }
  },
  methods: {
    myCompletions(context) {
      let before = context.matchBefore(/[a-zA-Z0-9_\u4e00-\u9fa5\+\-\*\/]+/);
      if (!context.explicit && !before) return null;
      return {
        from: before ? before.from : context.pos,
        options: this.completions,
        validFor: /^[a-zA-Z0-9_\u4e00-\u9fa5\+\-\*\/]*$/,
      };
    },
  },
};
</script>

<style>
.ͼ1.cm-editor {
    position: relative;
    font-size: 14px;
    display: inline-block;
    width: 100%;
    background-color: #FFF;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    outline: 0;
}
.ͼ1 .cm-content {
  color: red;
}
.ͼ2 .cm-gutters {
  display: none;
}
.ͼ1.cm-editor.cm-focused {
  outline: 1px solid royalblue;
}

.ͼ2 .cm-activeLine {
  background: #FFF;
  height: 35px;
  line-height: 35px;
  font-size: 16px;
  color: #606266;
}
</style>
