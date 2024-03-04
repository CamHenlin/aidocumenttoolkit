<template>
  <div class="document-input">
    <h2>DOCUMENT INPUT</h2>
    <h5>Enter your main document text. The idea is that this can go beyond current single LLM context input limits</h5>
    <textarea
      class="text-area"
      v-model="text"
      @input="updateValue"
      @resize="resizeTextArea"
    ></textarea>
  </div>
</template>

<script>
export default {
  name: "DocumentInput",
  data() {
    return {
      text: "",
    };
  },
  methods: {
    updateValue() {
        if (typeof this.text === "string") {
            this.$emit("input", this.text);
        }
    },
    resizeTextArea(event) {
      event.target.style.height = "auto";
      event.target.style.height = event.target.scrollHeight + "px";
    },
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
</style>
