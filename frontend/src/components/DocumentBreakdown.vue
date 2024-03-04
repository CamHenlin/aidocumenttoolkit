<template>
  <div>
    <h2>DOCUMENT LINE BY LINE BREAKDOWN</h2>
    <h5>
      The line by line document breakdown allows two things: 
      First, you can run simple string replacements on a line by line basis. This is useful for cleaning up chat transcript data or providing repeated hints to the LLM calls. 
      Secondly, we can run line by line LLM analysis. This is useful for having the LLM mutate, add context or hints, or other line by line analysis that you may find helpful.
    </h5>
    <div class="list-container">
      <div class="left-list">
        <h3>INPUT</h3>
        <ul>
          <li v-for="(line, index) in lines" :key="index">
            <div class="list-item">
              <input v-model="lines[index]" type="text" @input="updateRightList" />
              <div class="smallbutton" @click="runRegexOnLine(index)">run replace on this line</div>
              <div class="smallbutton" @click="runAIOnLine(index)">run AI on this line</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="center-list">
        <h3>OUTPUT</h3>
        <ul>
          <li v-for="(mutatedLine, index) in mutatedLines" :key="index">
            <div class="list-item">
              <input v-model="mutatedLines[index]" type="text" />
              <div class="smallbutton" @click="sendLineLeft(index)">send line to left</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="right-list">
        <div class="configuration-item">
          <h3>replacement rules</h3>
          <h5>replacements are structured FIND:REPLACE and are split line by line</h5>
          <textarea v-model="replacements"></textarea>
          <div class="button" @click="runRegex">run replace on all lines</div>
        </div>
        <div class="configuration-item">
          <h3>ai rules</h3>
          <h5>ai rules are structured as an LLM call for each line, with the line text itself appended to the end of the LLM call</h5>
          <textarea v-model="ai"></textarea>
          <div class="button" @click="runAI">run replace+ai on all lines</div>
        </div>
        <br>
        <div class="button" @click="sendForSplitAndAnalysis">send document below for split and analysis</div>
      </div>
    </div>
  </div>
</template>

<script>

import aiCall from "../serverlib"
export default {
  props: {
    textInput: {
      type: String
    }
  },
  data() {
    return {
      lines: [],
      mutatedLines: [],
      replacements: ``,
      ai: ``
    };
  },
  watch: {
    textInput: {
      immediate: true,
      handler(newValue) {
        this.lines = newValue.split("\n");
        this.mutatedLines = Array.from({ length: this.lines.length }, () => "");
      }
    }
  },
  methods: {
    updateRightList() {
      // this.$emit("textInput", this.lines.join("\n"));
    },
    runRegex() {
      for (let i = 0; i < this.lines.length; i++) {
        this.runRegexOnLine(i);
      }
    },
    async runAI() {
      // call runAIOnLine for each line
      for (let i = 0; i < this.lines.length; i++) {
        this.runRegexOnLine(i);
        await this.runAIOnLine(i);
      }
    },
    runRegexOnLine(index) {
      let line = this.lines[index]
      
      for (const replacement of this.replacements.split('\n')) {
        if (!line.includes(`:`)) {
          continue
        }
        line = line.replace(new RegExp(`\\b${replacement.split(':')[0]}\\b`, 'gi'), replacement.split(':')[1]);
        line = line.replace(new RegExp(`\\b${replacement.split(':')[0]}(?=[^\\w\\s])`, 'gi'), replacement.split(':')[1]);
      }

      this.mutatedLines[index] = line
    },
    async runAIOnLine(index) {
      console.log(`running AI on line ${index}: ${this.lines[index]}`)
      this.mutatedLines[index] = await aiCall(`${this.ai}\n${this.lines[index]}`);
    },
    sendLineLeft(index) {
      this.lines[index] = this.mutatedLines[index];
    },
    sendForSplitAndAnalysis() {

      if (this.mutatedLines.length > 0) {

        this.$emit("sendForSplitAndAnalysis", this.mutatedLines.join("\n"));
        return
      }

      this.$emit("sendForSplitAndAnalysis", this.lines.join("\n"));
    }
  }
};
</script>

<style scoped>
.list-container {
  display: flex;
  justify-content: space-between;
}

.left-list,
.center-list,
.right-list {
  width: 33%;
}

.list-item {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  background-color: #f5f5f5;
  display: flex;
}

.configuration-item {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  background-color: #f5f5f5;
}

/* Add your component-specific styles here */
/* remove list decorators */
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

div.button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  margin-top: 10px;
}

div.smallbutton {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  margin-top: 10px;
  width: 100px;
}
</style>
