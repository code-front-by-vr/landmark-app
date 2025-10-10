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

const formSchema = toTypedSchema(landmarkSchema);

const form = useForm({
  validationSchema: formSchema,
});

const isLoading = ref(false);

let map: Map | null = null;
let marker: Marker | null = null;

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

const onSubmit = form.handleSubmit(async () => {
  isLoading.value = true;

  try {
  } catch (error) {
    console.error('Add landmark error:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
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
            placeholder="1-5"
            :disabled="isLoading"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <div
      class="relative border-2 border-dashed rounded-lg p-6 transition-all border-border hover:border-primary/50 hover:bg-accent/30"
    >
      <input
        type="file"
        multiple
        accept="image/*"
        :disabled="isLoading"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id="file-upload"
      />

      <div class="flex flex-col items-center justify-center text-center">
        <Upload class="w-10 h-10 mb-2 text-muted-foreground" />
        <p class="text-sm font-medium text-foreground mb-1">Drop images here or click to upload</p>
        <p class="text-xs text-muted-foreground">0/5 images uploaded</p>
      </div>
    </div>

    <DialogFooter class="flex justify-end">
      <Button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Adding...' : 'Add Landmark' }}
      </Button>
    </DialogFooter>
  </form>
</template>
