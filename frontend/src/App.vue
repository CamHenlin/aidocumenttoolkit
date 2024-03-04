<template>
  <h1>AI Document Toolkit</h1>
  <DocumentInput @input="handleDocumentInput"/>
  <DocumentBreakdown :textInput="MainDocumentText" @sendForSplitAndAnalysis="handleSendForSplitAndAnalysis"/>
  <DocumentSplitAndAnalyze :textInput="SanitizedDocumentText" @combineAndAnalyzeChunks="handleCombineAndAnalyzeChunks"/>
  <CombinedDocumentChunkAnalyzer :textInput="CombinedChunks"/>
</template>

<script>
import DocumentInput from './components/DocumentInput.vue'
import DocumentBreakdown from './components/DocumentBreakdown.vue'
import DocumentSplitAndAnalyze from './components/DocumentSplitAndAnalyze.vue'
import CombinedDocumentChunkAnalyzer from './components/CombinedDocumentChunkAnalyzer.vue'

export default {
  name: 'App',
  components: {
    DocumentInput,
    DocumentBreakdown,
    DocumentSplitAndAnalyze,
    CombinedDocumentChunkAnalyzer
  },
  data() {
    return {
      MainDocumentText: '',
      SanitizedDocumentText: '',
      CombinedChunks: ``
    }
  },
  methods: {
    handleDocumentInput(value) {
      // console.log('Received input:');
      // console.log(value)
      if (typeof value === "string") {
        this.MainDocumentText = value;
      }
    },
    handleSendForSplitAndAnalysis(value) {
      console.log('Received input:');
      console.log(value)
      if (typeof value === "string") {
        this.SanitizedDocumentText = value;
      }
    },
    handleCombineAndAnalyzeChunks(value) {
      this.CombinedChunks = value;
    }
  },
  watch: {
    // MainDocumentText(newValue) {
    //   // Do something with the updated value of MainDocumentText
    //   // console.log(newValue);
    // }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
