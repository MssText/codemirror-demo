<template>
  <div>
    <div
      class="editor"
      id="editor"
      style="text-align: left; margin-bottom: 40px"
    ></div>
    <el-input v-model="value" />
    <el-button type="primary" @click="getEditorValue">获取编辑器内容</el-button>
  </div>
</template>

<script>
import { basicSetup, EditorView } from "codemirror";
import { autocompletion } from "@codemirror/autocomplete";
import { EditorState } from "@codemirror/state";
import { oneDark } from "./theme";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      editorView: null,
      value: "",
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
        { label: "sum(表格4: key4)" },
        { label: "sum(表格5: key5)" },
        { label: "sum(表格6: key6)" },
        { label: "sum(表格7: key7)" },
        { label: "sum(表格8: key8)" },
        { label: "sum(表格9: key9)" },
        { label: "+" },
        { label: "-" },
        { label: "*" },
        { label: "/" },
      ],
    };
  },
  mounted() {
    this.createEditor();
  },
  methods: {
    // 创建编辑器
    createEditor() {
      let state = EditorState.create({
        doc: "",
        extensions: [
          basicSetup,
          // oneDark, // 这里可定制编辑器样式
          autocompletion({
            override: [this.myCompletions],
            icons: false,
            optionClass: this.addOptionClass,
          }),
          EditorState.transactionFilter.of((tr) => {
            return tr.newDoc.lines > 1 ? [] : [tr];
          }),
          EditorView.updateListener.of((viewUpdate) => {

            // doc updated
            this.handleOnUpdate(viewUpdate);

            // doc changed
            if (viewUpdate.docChanged) {
              this.handleOnChange(viewUpdate.state.doc.toString(), viewUpdate);
            }

            // focus state change
            if (viewUpdate.focusChanged) {
              viewUpdate.view.hasFocus
                ? this.handleOnFocus(viewUpdate)
                : this.handleOnBlur(viewUpdate);
            }
          }),
        ],
      });
      this.editorView = new EditorView({
        state: state,
        parent: document.getElementById("editor"),
      });
      this.editorView.focus();
    },

    // 自动补全参数
    myCompletions(context) {
      let before = context.matchBefore(/[a-zA-Z0-9_\u4e00-\u9fa5\+\-\*\/]+/);
      if (!context.explicit && !before) return null;
      return {
        from: before ? before.from : context.pos,
        options: this.completions,
        // validFor: /^[a-zA-Z0-9_\u4e00-\u9fa5\+\-\*\/]*$/,
      };
    },

    // 这个函数是否能用来校验错误信息
    handleApply(view, completion, from, to) {
      console.log(completion.value, "== completion ==");
    },

    // 添加额外的样式
    addOptionClass(completion) {
      console.log(completion, "== addOptionClass ==");
    },

    // 获取编辑器内容
    getEditorValue() {
      console.log(this.view.contentDOM.textContent, "= 编辑器的内容 =");
    },

    // 更新的时候的钩子
    handleOnUpdate(viewUpdate) {
      console.log(viewUpdate, '内容更新了viewUpdate==')
    },

    // 编辑内容改变
    handleOnChange() {
      console.log("编辑器内容改变");
    },

    // 获取焦点
    handleOnFocus() {
      console.log("编辑器获取焦点");
    },

    // 失去焦点
    handleOnBlur() {
      console.log("编辑器失去焦点");
    },
  },

  beforeDestroy() {
    // 销毁编辑器实例
    this.view.destroy();
  },
};
</script>

<style>
.ͼ1.cm-editor {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
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
  background: #fff;
  height: 35px;
  line-height: 35px;
  font-size: 16px;
  color: #606266;
}
</style>
