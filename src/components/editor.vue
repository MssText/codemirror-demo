<template>
  <div>
    <div
      class="editor"
      id="editor"
      style="text-align: left; margin-bottom: 40px"
    ></div>
    <el-button type="primary" @click="getEditorValue">获取编辑器内容</el-button>
    <selectDemo ref="selectDemo" />
  </div>
</template>

<script>
import { EditorView, placeholder } from "@codemirror/view";
import { autocompletion } from "@codemirror/autocomplete";
import { search } from "@codemirror/search";
import { EditorState, Compartment, StateEffect } from "@codemirror/state";
import { updateListenerExtension } from './updateListenerExtension'
import selectDemo from './selectDemo.vue'


export default {
  components: { selectDemo },
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      editorView: null,
      placeholder: "公式格式：参数1 + 参数2 + sum(表格1: column1)",
      list: [],
      completions: [
        { label: "1245" },
        { label: "参数1" },
        { label: "参数2" },
        { label: "sum(表格1: column1)" },
        { label: "sum(表格1: column2)" },
        { label: "sum(表格1: column3)" },
        { label: "sum(表格1: column4)" },
        { label: "sum(表格2: column1)" },
        { label: "sum(表格2: column2)" },
        { label: "sum(表格2: column3)" },
        { label: "sum(表格2: column4)" },
        { label: "sum(表格3: column1)" },
        { label: "sum(表格3: column2)" },
        { label: "sum(表格3: column3)" },
        { label: "sum(表格3: column4)" },
        { label: "+" },
        { label: "-" },
        { label: "*" },
        { label: "/" },
      ],
    };
  },
  mounted() {
    this.createEditor();
    this.setPlaceholder(this.placeholder);
  },
  methods: {
    // 创建编辑器
    createEditor() {
      let state = EditorState.create({
        doc: "",
        extensions: [
          // oneDark, // 这里可定制编辑器样式
          search(),
          autocompletion({
            icons: false,
            optionClass: this.addOptionClass,
            override: [this.myCompletions],
          }),
          updateListenerExtension,
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
      let before = context.matchBefore(/[a-zA-Z\(\:\)0-9_\u4e00-\u9fa5\+\-\*\/]+/);
      if (!before) return null;
      if (before && before.from == before.to && !context.explicit) return null;
      return {
        from: before ? before.from : null,
        options: this.completions,
        // 删除的时候是否触发匹配
        // validFor: /^[a-zA-Z0-9_\u4e00-\u9fa5\+\-\*\/]*$/,
      };
    },

    // 选中每一项时会触发
    handleApply(view, completion, from, to) {
      console.log(completion, "== completion ==");
    },

    // 设置编辑器的placeholder
    setPlaceholder(value) {
      const { run: rePlaceholder } = this.createEditorCompartment(
        this.editorView
      );
      rePlaceholder(placeholder(value));
    },

    // 创建对比内容管理器
    // https://github.com/surmon-china/vue-codemirror/blob/main/src/codemirror.ts
    createEditorCompartment(view) {
      const compartment = new Compartment();
      const run = (extension) => {
        compartment.get(view.state)
          ? view.dispatch({ effects: compartment.reconfigure(extension) }) // reconfigure
          : view.dispatch({
              effects: StateEffect.appendConfig.of(compartment.of(extension)),
            });
      };
      return { compartment, run };
    },

    // 添加额外的样式
    addOptionClass(completion) {
      return "option";
    },

    // 获取编辑器内容
    getEditorValue() {
      // console.log(this.editorView.contentDOM.textContent, "= 编辑器的内容 =");
    },

    // 更新的时候的钩子
    handleOnUpdate(viewUpdate) {
      // console.log(viewUpdate, '内容更新了viewUpdate==')
    },

    // 编辑内容改变
    handleOnChange() {
      // console.log("编辑器内容改变");
    },

    // 获取焦点
    handleOnFocus() {
      // console.log("编辑器获取焦点");
    },

    // 失去焦点
    handleOnBlur() {
      // console.log("编辑器失去焦点");
    },
  },

  beforeDestroy() {
    // 销毁编辑器实例
    this.editorView.destroy();
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
  font-size: 14px;
  color: #606266;
}
.option {
  font-size: 14px;
  padding: 0 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: black;
  height: 34px;
  line-height: 34px;
  box-sizing: border-box;
  cursor: pointer;
  background: #fff;
}
.myH1 {
  color: rebeccapurple;
}
</style>
