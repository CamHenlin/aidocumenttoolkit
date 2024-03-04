<template>
    <div class="document-input">
        <h2>DOCUMENT CHUNK ANALYZER</h2>
        <div>
            <div>chunk size:</div>
            <input v-model="chunkSize" type="number" />
        </div>
        <div class="analysis-container">
            <div class="analysis-left">
                <ul>
                    <li v-for="(mutatedLine, index) in leftChunks" :key="index" class="list-container">
                        <div class="list-left">
                            <textarea
                                class="text-area"
                                v-model="leftChunks[index]"
                            ></textarea>
                            <div class="smallbutton" @click="runAIOnChunk(index)">run ai on this chunk</div>
                        </div>
                        <div class="list-right">
                            <textarea
                                class="text-area"
                                v-model="rightChunks[index]"
                            ></textarea>
                            <div class="smallbutton" @click="runAIOnChunk(index)">send chunk left</div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="analysis-right">
                <div class="configuration-item">
                    <div>ai rules to run against each chunk</div>
                    <textarea v-model="ai"></textarea>
                    <div class="button" @click="runAI">run ai on all chunks</div>
                </div>
                <div class="button" @click="combineAndAnalyzeChunks">combine and send to combined chunk analyzer</div>
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
    name: "DocumentSplitAndAnalyze",
    data() {
      return {
        text: "",
        ai: ``,
        tempInput: ``,
        chunkSize: 10,
        leftChunks: [],
        rightChunks: []
      };
    },
    watch: {
        textInput: {
            immediate: true,
            async handler(newValue) {
                this.tempInput = newValue
                await this.recalculate(newValue)
            }
        },
        chunkSize: {
            immediate: true,
            async handler() {
                await this.recalculate(this.tempInput)
            }
        }
    },
    methods: {
        async recalculate(newValue) {

            console.log(`DocumentSplitAndAnalyze received input: ${newValue}`)
            let paragraphs = newValue.split('\n');
            let chunkOutput = ''; // this is the "chunk" of paragraphs that will be sent to the AI
            let internalParagraphCounter = 0;

            this.leftChunks = [];
            this.rightChunks = [];

            for (let line of paragraphs) {

                if (line.trim() !== '') {

                    chunkOutput += line + '\n';
                    continue
                }

                // we have hit a paragraph delimeter
                internalParagraphCounter++

                if (internalParagraphCounter === this.chunkSize) {

                    if (chunkOutput !== '') {
                        this.leftChunks.push(chunkOutput)
                    }

                    // zero chunkOutput to the last line reviewed, to help retain context of conversation threads across chunks
                    chunkOutput = line + '\n';
                    internalParagraphCounter = 0;
                }
            }

            if (chunkOutput !== '') {
                this.leftChunks.push(chunkOutput)
            }

            console.log(`DocumentSplitAndAnalyze leftChunks: `)
            console.log(this.leftChunks)
        },
        runAI() {
            for (let i = 0; i < this.leftChunks.length; i++) {
                this.runAIOnChunk(i);
            }
        },
        async runAIOnChunk(index) {
            console.log(`running AI on chunk ${index}: ${this.leftChunks[index]}`)
            this.rightChunks[index] = await aiCall(`${this.ai}\n${this.leftChunks[index]}`);
        },
        combineAndAnalyzeChunks() {
            let combinedChunks = this.rightChunks.join('\n');
            this.$emit("combineAndAnalyzeChunks", combinedChunks);
        }
    },
  };
  </script>
  
  <style scoped>
  .document-input {
    width: 100%;
  }
  
  .text-area {
    width: 100%;
    height: 200px;
    resize: vertical;
  }

  .analysis-container {
      display: flex;
      flex-direction: row;
  }

  .analysis-left {
      width: 65%;
      float: left;
  }

  .analysis-right {
      width: 30%;
      float: right;
  }
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


.configuration-item {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  background-color: #f5f5f5;
}

.list-container {
    display: flex;
    flex-direction: row;
}

.list-left {
    width: 50%;
    float: left;
}
.list-right {
    width: 50%;
    float: right;
}
  </style>
  