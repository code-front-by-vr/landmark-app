<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { landmarkSchema } from '@/schemas/landmark';
import leaflet, {
  type LeafletMouseEvent,
  type LatLngExpression,
  type Marker,
  type Map,
} from 'leaflet';

import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@ui/dialog';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@ui/form';
import { Input } from '@ui/input';
import { Textarea } from '@ui/textarea';
import { Button } from '@ui/button';
import { Label } from '@ui/label';
import { Upload, MapPin } from 'lucide-vue-next';
import type { NewLandmarkInput } from '@/types/landmark';
import { useAuthStore } from '@/stores/auth';
import { useLandmarkStore } from '@/stores/landmark';

const isLoading = ref(false);

const authStore = useAuthStore();
const landmarkStore = useLandmarkStore();
const emit = defineEmits<{
  close: [];
}>();

let map: Map | null = null;
let marker: Marker | null = null;
const uploadedFiles = ref<File[]>([]);
const formSchema = toTypedSchema(landmarkSchema);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    photos: [],
  },
});

const handleFiles = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  uploadedFiles.value = files;
  form.setFieldValue('photos', files);
};

onMounted(() => {
  map = leaflet.map('landmark-map').setView([53.9006, 27.559], 12);

  leaflet
    .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    })
    .addTo(map);

  map.on('click', (e: LeafletMouseEvent) => {
    if (!map) return;

    if (marker) {
      map.removeLayer(marker);
    }
    marker = leaflet.marker(e.latlng as LatLngExpression).addTo(map);
  });
});

const onSubmit = form.handleSubmit(async values => {
  isLoading.value = true;

  try {
    if (!marker) {
      throw new Error('Please select a location on the map');
    }

    if (!authStore.user) {
      throw new Error('User not authenticated');
    }

    const newLandmark: NewLandmarkInput = {
      title: values.title,
      description: values.description,
      location: { lat: marker.getLatLng().lat, lng: marker.getLatLng().lng },
      createdBy: authStore.user.uid,
      rating: values.userRating,
    };

    await landmarkStore.createLandmark(newLandmark, values.photos);

    form.resetForm();
    uploadedFiles.value = [];
    marker = null;

    emit('close');
  } catch (error) {
    console.error('Add landmark error:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <DialogHeader>
      <DialogTitle>Add Landmark</DialogTitle>
      <DialogDescription>Fill all fields and select a location on the map.</DialogDescription>
    </DialogHeader>

    <form @submit.prevent="onSubmit" class="space-y-5 px-4 pb-4">
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
            <div
              :class="[
                'relative border-2 border-dashed rounded-lg p-6 transition-all',
                'border-border hover:border-primary/50 hover:bg-accent/30',
                uploadedFiles.length >= 5 ? 'opacity-50 pointer-events-none' : '',
              ]"
            >
              <input
                type="file"
                multiple
                accept="image/*"
                @change="handleFiles"
                :disabled="isLoading || uploadedFiles.length >= 5"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />

              <div class="flex flex-col items-center justify-center text-center">
                <Upload class="w-10 h-10 mb-2 text-muted-foreground" />
                <p class="text-sm font-medium text-foreground mb-1">
                  {{
                    uploadedFiles.length >= 5
                      ? 'Maximum files reached'
                      : 'Drop images here or click to upload'
                  }}
                </p>
                <p class="text-xs text-muted-foreground">
                  {{ uploadedFiles.length }}/5 images uploaded
                </p>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <DialogFooter class="flex justify-end">
        <Button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Adding...' : 'Add Landmark' }}
        </Button>
      </DialogFooter>
    </form>
  </div>
</template>
