<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import { Button } from '@ui/button';
import type { Rating } from '@/config/constants';

interface RatingConfirmationModalProps {
  rating: Rating | null;
  isSubmitting?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

const { rating, isSubmitting, onConfirm, onCancel } = defineProps<RatingConfirmationModalProps>();
const open = defineModel<boolean>('open', { required: true });

function handleCancel() {
  onCancel?.();
  open.value = false;
}

function handleConfirm() {
  onConfirm();
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <div @click.stop>
        <DialogHeader>
          <DialogTitle>Confirm Rating</DialogTitle>
          <DialogDescription>
            You are about to rate this landmark
            <strong class="text-foreground">{{ rating }} out of 5</strong> stars.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter class="mt-4">
          <Button variant="outline" @click="handleCancel"> Cancel </Button>
          <Button @click="handleConfirm" :disabled="isSubmitting">
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</template>
