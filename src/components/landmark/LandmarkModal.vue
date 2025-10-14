<script setup lang="ts">
import { useLandmarkModal } from '@/composables/useLandmarkModal';
import type { Landmark } from '@/types/landmark';
import { FILE_UPLOAD_ACCEPT } from '@/config/constants';

import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@ui/dialog';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@ui/form';
import { Input } from '@ui/input';
import { Textarea } from '@ui/textarea';
import { Button } from '@ui/button';
import { Label } from '@ui/label';
import { Upload, MapPin, X } from 'lucide-vue-next';

const props = defineProps<{
  isEdit?: boolean;
  landmark?: Landmark;
}>();

const emit = defineEmits<{
  close: [];
}>();

const {
  isLoading,
  error,
  uploadedFiles,
  fileInputRef,
  handleFileSelect,
  handleFileDrop,
  maxNewFiles,
  isEditMode,
  onSubmit,
  removePhoto,
  existingPhotos,
} = useLandmarkModal(props, emit);

const getFilePreview = (file: File) => URL.createObjectURL(file);
</script>

<template>
  <div class="overflow-x-hidden">
    <DialogHeader>
      <DialogTitle>{{ isEditMode ? 'Edit Landmark' : 'Add Landmark' }}</DialogTitle>
      <DialogDescription>{{
        isEditMode
          ? 'Update the landmark information below.'
          : 'Fill all fields and select a location on the map.'
      }}</DialogDescription>
    </DialogHeader>

    <div
      v-if="error"
      class="mx-4 my-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md"
    >
      <p class="text-sm text-destructive">{{ error }}</p>
    </div>

    <form @submit.prevent="onSubmit" class="space-y-5 px-4 py-4 pb-4 overflow-x-hidden">
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

      <div class="space-y-2">
        <Label class="flex items-center gap-2">
          <MapPin class="w-4 h-4" />
          Location (click on the map)
        </Label>
        <div
          id="landmark-map"
          class="h-48 w-full rounded-lg border border-border overflow-hidden"
        ></div>
      </div>

      <FormField v-slot="{ componentField }" name="userRating">
        <FormItem>
          <FormLabel>Your Rating</FormLabel>
          <FormControl>
            <Input
              type="number"
              v-bind="componentField"
              min="1"
              max="5"
              step="1"
              required
              placeholder="1-5"
              :disabled="isLoading"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField name="photos">
        <FormItem>
          <FormLabel>Photos (max 5)</FormLabel>
          <FormControl>
            <div class="space-y-4">
              <div
                @drop.prevent="handleFileDrop"
                @dragover.prevent
                @dragleave.prevent
                :class="[
                  'relative border-2 border-dashed rounded-lg p-4 transition-all',
                  'border-border hover:border-primary/50 hover:bg-accent/30',
                  uploadedFiles.length >= maxNewFiles ? 'opacity-50 pointer-events-none' : '',
                ]"
              >
                <input
                  ref="fileInputRef"
                  type="file"
                  multiple
                  :accept="FILE_UPLOAD_ACCEPT"
                  @change="handleFileSelect"
                  :disabled="isLoading || uploadedFiles.length >= maxNewFiles"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="file-upload"
                />

                <div class="flex items-center gap-3">
                  <Upload class="w-6 h-6 text-muted-foreground flex-shrink-0" />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-foreground truncate">
                      {{
                        uploadedFiles.length >= maxNewFiles
                          ? 'Maximum files reached'
                          : isEditMode
                            ? `Add more images (${maxNewFiles} more allowed)`
                            : 'Drop images here or click to upload'
                      }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      {{ uploadedFiles.length }}/{{ maxNewFiles }} new images selected • Max 10MB
                      per file
                    </p>
                  </div>
                </div>
              </div>

              <div
                v-if="(isEditMode && existingPhotos.length > 0) || uploadedFiles.length > 0"
                class="space-y-2"
              >
                <p class="text-sm font-medium">
                  Photos ({{ existingPhotos.length + uploadedFiles.length }})
                </p>
                <div class="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                  <div
                    v-for="(photo, index) in existingPhotos"
                    :key="`existing-${index}`"
                    class="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-border"
                  >
                    <img
                      :src="photo"
                      :alt="`Photo ${index + 1}`"
                      class="w-full h-full object-cover"
                    />
                    <div
                      class="absolute top-1 right-1 cursor-pointer z-10 bg-destructive/80 hover:bg-destructive rounded-full p-0.5 transition-colors"
                      @click="removePhoto(photo)"
                    >
                      <X class="w-3 h-3 text-destructive-foreground" />
                    </div>
                  </div>

                  <div
                    v-for="(file, index) in uploadedFiles"
                    :key="`new-${index}`"
                    class="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-border"
                  >
                    <img
                      :src="getFilePreview(file)"
                      :alt="`New photo ${existingPhotos.length + index + 1}`"
                      class="w-full h-full object-cover"
                    />
                    <div
                      class="absolute top-1 right-1 cursor-pointer z-10 bg-destructive/80 hover:bg-destructive rounded-full p-0.5 transition-colors"
                      @click="removePhoto(index)"
                    >
                      <X class="w-3 h-3 text-destructive-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <DialogFooter class="flex justify-end">
        <Button type="submit" :disabled="isLoading">
          {{
            isLoading
              ? isEditMode
                ? 'Updating...'
                : 'Adding...'
              : isEditMode
                ? 'Update Landmark'
                : 'Add Landmark'
          }}
        </Button>
      </DialogFooter>
    </form>
  </div>
</template>
