<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="unset"
    @keydown.left="setFocusToOk()"
    @keydown.right="setFocusToAnnuler()"
  >
    <v-card>
      <v-card-title :color="color" class="headline" dark>{{ windowTitle }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="mt-5">{{ message }}</v-card-text>
      <v-card-actions>
        <span tabindex="1" @focus="setFocusToAnnuler()" />
        <v-spacer></v-spacer>
        <v-btn ref="btnOk" tabindex="2" :color="color" text @click="sendResponse(true)">{{ this.btnLabel }}</v-btn>
        <v-btn ref="btnAnnuler" tabindex="3" v-if="displayButtonCancel" text @click="sendResponse(false)"
          >Annuler</v-btn
        >
        <span tabindex="4" @focus="setFocusToOk()" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'Confirm'
})
export default class extends Vue {
  private dialog = false;
  private windowTitle = '';
  private message = '';
  private color = 'primary';
  private resolve: any;
  private reject: any;
  private btnLabel = 'Oui';
  @Prop({ default: true })
  readonly displayButtonCancel!: boolean;
  @Prop({ default: false })
  readonly focusOk!: boolean;

  public open(windowTitle: string, message: string, color?: string, btnLabel?: string): Promise<boolean> {
    setTimeout(() => {
      if (this.displayButtonCancel && !this.focusOk) (this.$refs.btnAnnuler as any)?.$el?.focus();
      else if (this.focusOk) (this.$refs.btnOk as any)?.$el?.focus();
    });
    this.windowTitle = windowTitle;
    this.message = message;
    this.color = color ? color : 'primary';
    this.btnLabel = btnLabel ? btnLabel : 'Oui';
    this.dialog = true;

    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  private setFocusToOk() {
    (this.$refs.btnOk as any)?.$el.focus();
  }

  private setFocusToAnnuler() {
    (this.$refs.btnAnnuler as any)?.$el.focus();
  }

  private sendResponse(value: boolean) {
    this.dialog = false;
    this.resolve(value);
  }
}
</script>

<style></style>
