<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { landmarkSchema } from '@/schemas/landmark';

import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@ui/dialog';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@ui/form';
import { Input } from '@ui/input';
import { Textarea } from '@ui/textarea';
import { Button } from '@ui/button';

const formSchema = toTypedSchema(landmarkSchema);

const form = useForm({
  validationSchema: formSchema,
});

const isLoading = ref(false);
const onSubmit = form.handleSubmit(async () => {
  isLoading.value = true;

  try {
    // TODO: add landmark to firebase
  } catch (error) {
    console.error('Add landmark error:', error);
  } finally {
    isLoading.value = false;
  }
});

const handleFiles = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    // TODO: handle file upload
  }
};
</script>

<template>
  <DialogHeader>
    <DialogTitle>Add Landmark</DialogTitle>
    <DialogDescription> Fill all fields and click Add Landmark. </DialogDescription>
  </DialogHeader>

  <form @submit.prevent="onSubmit" class="space-y-4 px-4">
    <FormField v-slot="{ componentField }" name="title">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="Landmark name" :disabled="isLoading" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Textarea
            v-bind="componentField"
            placeholder="Description"
            rows="3"
            class="max-w-full resize-none min-w-0"
            :disabled="isLoading"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="userRating">
      <FormItem>
        <FormLabel>Rating</FormLabel>
        <FormControl>
          <Input
            type="number"
            v-bind="componentField"
            min="1"
            max="5"
            step="1"
            :disabled="isLoading"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="photos">
      <FormItem class="space-y-2">
        <FormLabel>Photos (max 5)</FormLabel>
        <Input
          type="file"
          multiple
          accept="image/*"
          v-bind="componentField"
          @change="handleFiles"
          :disabled="isLoading"
          class="w-full text-gray-600 file:mr-4 file:cursor-pointer hover:file:text-gray-700"
        />
      </FormItem>
    </FormField>

    <DialogFooter class="flex justify-end gap-2">
      <Button type="submit" :disabled="isLoading">{{
        isLoading ? 'Adding...' : 'Add Landmark'
      }}</Button>
    </DialogFooter>
  </form>
</template>
