<template>
    <div class="container">
        <div class="plugins-tips">
            wangEditor：轻量级 web 富文本编辑器，配置方便，使用简单。 访问地址：
            <a href="https://www.wangeditor.com/v5/getting-started.html" target="_blank">wangEditor</a>
        </div>
        <div style="border: 1px solid #ccc; margin-bottom: 10px">
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" />
            <Editor
                style="height: 400px; overflow-y: hidden"
                v-model="valueHtml"
                :defaultConfig="editorConfig"
                @onCreated="handleCreated"
            />
        </div>
        <el-button type="primary" @click="syncHTML">提交</el-button>
    </div>
</template>

<script setup lang="ts" name="editor">
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { onBeforeUnmount, ref, reactive, shallowRef, onMounted } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { ImageElement } from '@/types/editor';

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref('<p>hello</p>');

// 模拟 ajax 异步获取内容
onMounted(() => {
    setTimeout(() => {
        valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>';
    }, 1500);
});

const toolbarConfig = {};
const editorConfig = { 
    MENU_CONF: {},
};

// 配置上传图片
editorConfig.MENU_CONF['uploadImage'] = {
    server: 'http://127.0.0.1/my/upload/system/img',
    timeout: 5 * 1000,
    fieldName: 'file',
    maxFileSize: 10 * 1024 * 1024,
    onError(file: File, err: any, res: any) {  // TS 语法
        console.log(`${file.name} 上传出错`, err, res)
    },
};

function customCheckImageFn(src: string, alt: string, url: string): boolean | undefined | string {
    if (!src) {
        return
    }
    if (src.indexOf('http') !== 0) {
        return '图片网址必须以 http/https 开头'
    }
    return true
    // 返回值有三种选择：
    // 1. 返回 true ，说明检查通过，编辑器将正常插入图片
    // 2. 返回一个字符串，说明检查未通过，编辑器会阻止插入。会 alert 出错误信息（即返回的字符串）
    // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止插入。但不会提示任何信息
}

function customParseImageSrc(src: string): string {  // TS 语法
    if (src.indexOf('http') !== 0) {
        return `http://${src}`
    }
    return src
}

editorConfig.MENU_CONF['insertImage'] = {
    onInsertedImage(imageNode: ImageElement | null) {
        if (imageNode == null) return
        const { alt, url } = imageNode
        console.log('inserted image', alt, url)
    },
    checkImage: customCheckImageFn, // 也支持 async 函数
    parseImageSrc: customParseImageSrc, // 也支持 async 函数
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

const handleCreated = (editor: any) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
};
const syncHTML = () => {
    console.log(valueHtml.value);
};
</script>

<style></style>
