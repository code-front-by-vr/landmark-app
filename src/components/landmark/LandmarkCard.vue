<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@ui/card';
import { Star } from 'lucide-vue-next';
import type { LandmarkCardProps } from '@/types/landmark';
import { useRouter } from 'vue-router';

const { title, description, rating, visits, id } = defineProps<
  LandmarkCardProps & { id: string }
>();

const router = useRouter();

const handleClick = () => {
  if (id) {
    router.push(`/landmark/${id}`);
  }
};
</script>

<template>
  <Card
    class="hover:bg-accent/50 transition-colors cursor-pointer border border-border/50"
    @click="handleClick"
  >
    <CardHeader class="pb-3">
      <CardTitle class="text-lg line-clamp-1">{{ title }}</CardTitle>
      <CardDescription class="line-clamp-2">{{ description }}</CardDescription>
    </CardHeader>
    <CardContent class="flex justify-between items-center">
      <div class="flex items-center gap-1.5">
        <Star
          v-for="i in 5"
          :key="i"
          :class="[
            'w-4 h-4',
            i <= Math.ceil(rating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300',
          ]"
        />
        <span class="text-sm text-muted-foreground ml-1">{{ rating.toFixed(1) }}</span>
      </div>
      <div class="flex items-center gap-1 text-sm text-muted-foreground">
        <Star class="w-4 h-4" />
        <span>{{ visits }} ratings</span>
      </div>
    </CardContent>
  </Card>
</template>
