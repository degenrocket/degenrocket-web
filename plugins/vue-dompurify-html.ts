import VueDOMPurifyHTML from 'vue-dompurify-html'

// This plugin allows the use of DOMPurify via
// 'v-dompurify-html' in the templates, e.g.:
// <div v-dompurify-html="dirtyHtml" />
// <div v-dompurify-html="(marked(dirtyMarkdown, {breaks:true}))" />
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDOMPurifyHTML)
})

// You can test 'v-dompurify-html' with:
// const dirtyHtml = `<img src=x onerror=alert(1)//>'); // becomes <img src="x">`
// const dirtyHtml = `<svg><g/onload=alert(2)//<p>'); // becomes <svg><g></g></svg>`
// const dirtyHtml = `<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>'); // becomes <p>abc</p>`
// const dirtyHtml = `<math><mi//xlink:href="data:x,<script>alert(4)</script>">'); // becomes <math><mi></mi></math>`
// const dirtyHtml = `<TABLE><tr><td>HELLO</tr></TABL>'); // becomes <table><tbody><tr><td>HELLO</td></tr></tbody></table>`
// const dirtyHtml = `<UL><li><A HREF=//google.com>click</UL>'); // becomes <ul><li><a href="//google.com">click</a></li></ul>`
