<template>
  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    isActive: {
      get() {
        return this.show;
      },
      set(value) {
        this.$emit('update:show', value);
      },
    },
  },

};
</script>

<style>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 110%);
  width: 100%;
  height: 25%;
  z-index: 20;
  overflow-y: auto;
 
}

.modal.is-active {
  display: flex;
  justify-content: flex-start;
}

.modal-background {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(10, 10, 10, 0.5);
}

.modal-content {
  background-color: rgb(249, 249, 249);
  padding: 1.5rem;
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: rgb(0, 0, 0);
  font-size: 1.5rem;
  border: none;
  background: transparent;
}


</style>