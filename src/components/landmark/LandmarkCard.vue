<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@ui/card';
import { Star } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const MAX_RATING_STARS = 5;

export interface LandmarkCardProps {
  id?: string;
  title: string;
  description: string;
  rating: number;
  visits: number;
}

const { title, description, rating, visits, id } = withDefaults(
  defineProps<LandmarkCardProps & { id: string }>(),
  {
    rating: 0,
  }
);

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
    <CardHeader>
      <CardTitle class="text-lg line-clamp-1">{{ title }}</CardTitle>
      <CardDescription class="line-clamp-2">{{ description }}</CardDescription>
    </CardHeader>
    <CardContent class="flex justify-between items-center">
      <div class="flex items-center gap-1.5">
        <Star
          v-for="star in MAX_RATING_STARS"
          :key="star"
          :class="[
            'w-4 h-4',
            star <= Math.ceil(rating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300',
          ]"
        />
        <span class="text-sm text-muted-foreground ml-1">{{ rating.toFixed(1) }}</span>
      </div>
      <div class="flex items-center gap-1 text-sm text-muted-foreground">
        <Star class="w-4 h-4" />
        <span>{{ visits }} visits</span>
      </div>
    </CardContent>
  </Card>
</template>
