<template>
    <div class="document-input">
        <h2>COMBINED DOCUMENT CHUNK ANALYZER</h2>
        <div class="analysis-container">
            <div class="analysis-left">
                <ul>
                    <li>
                        <div class="list-left">
                            <textarea
                                class="text-area"
                                v-model="leftChunk"
                            ></textarea>
                        </div>
                        <div class="list-right">
                            <textarea
                                class="text-area"
                                v-model="rightChunk"
                            ></textarea>
                            <div class="smallbutton" @click="sendLeft">send chunk left</div>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="analysis-right">
                <div class="configuration-item">
                <div>ai rules to run against combined chunks</div>
                <textarea v-model="ai"></textarea>
                <div class="button" @click="runAI">run ai on combined chunks</div>
                </div>
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
    name: "CombinedDocumentChunkAnalyzer",
    data() {
      return {
        text: "",
        ai: ``,
        chunkSize: 1,
        leftChunks: [],
        rightChunks: []
      };
    },
    watch: {
        textInput: {
            immediate: true,
            async handler(newValue) {
                this.leftChunk = newValue
            }
        }
    },
    methods: {
        async runAI() {
            console.log(`running AI on chunk: ${this.leftChunk}`)
            this.rightChunk = await aiCall(`${this.ai}\n${this.leftChunk}`);
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
  