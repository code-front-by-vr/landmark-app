<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@ui/card';
import { RatingConfirmationModal } from '@ui/rating-confirmation-modal';
import { Rating } from '@ui/rating';
import { Eye } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { type Rating as RatingType } from '@/config/constants';
import { useLandmarkMutation } from '@/composables/useLandmarkQueries';
import { useAuthStore } from '@/stores/auth';
import { toast } from 'vue-sonner';
import type { Landmark } from '@/types/landmark';

const props = defineProps<Landmark>();
const router = useRouter();
const authStore = useAuthStore();
const { rateMutation } = useLandmarkMutation();

const isRatingDialogOpen = ref(false);
const pendingRating = ref<RatingType | null>(null);

function handleClick() {
  router.push(`/landmark/${props.id}`);
}

function handleStarClick(starRating: number) {
  if (!authStore.user) {
    toast.error('Please sign in to rate this landmark');
    return;
  }

  pendingRating.value = starRating as RatingType;
  isRatingDialogOpen.value = true;
}

async function confirmRating() {
  if (!authStore.user || !pendingRating.value) return;

  try {
    await rateMutation.mutateAsync({
      landmarkId: props.id,
      userId: authStore.user.uid,
      rating: pendingRating.value,
    });

    toast.success(
      `You rated this landmark ${pendingRating.value} star${pendingRating.value === 1 ? '' : 's'}`
    );
    isRatingDialogOpen.value = false;
    pendingRating.value = null;
  } catch (error) {
    console.error('Failed to rate landmark:', error);
    toast.error('Failed to submit rating');
  }
}

function cancelRating() {
  isRatingDialogOpen.value = false;
  pendingRating.value = null;
}

function getUserRating() {
  if (!authStore.user || !props.userRatings) return null;

  return props.userRatings[authStore.user.uid];
}
</script>

<template>
  <div>
    <Card
      class="hover:bg-accent/50 transition-colors cursor-pointer border border-border/50"
      @click="handleClick"
    >
      <CardHeader>
        <CardTitle class="text-lg line-clamp-1">{{ props.title }}</CardTitle>
        <CardDescription class="line-clamp-2">{{ props.description }}</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap justify-between items-center gap-2">
        <div class="flex items-center gap-1.5 min-w-0">
          <Rating :model-value="Math.ceil(props.rating)" size="sm" @click="handleStarClick" />
          <span class="text-sm text-muted-foreground ml-1 whitespace-nowrap">
            {{ props.rating.toFixed(1) }}
            <span v-if="getUserRating()" class="text-xs ml-0.5"
              >(yours: {{ getUserRating() }})</span
            >
          </span>
        </div>
        <div class="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
          <Eye class="w-4 h-4" />
          <span>{{ props.visits }}</span>
        </div>
      </CardContent>
    </Card>

    <RatingConfirmationModal
      v-model:open="isRatingDialogOpen"
      :rating="pendingRating"
      :is-submitting="rateMutation.isPending.value"
      :on-confirm="confirmRating"
      :on-cancel="cancelRating"
    />
  </div>
</template>
