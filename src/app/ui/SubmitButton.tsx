'use client';

import { Button } from '@nextui-org/react';
import { useFormStatus } from 'react-dom';

export default function SubmitButton({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type='submit'
      color='primary'
      isLoading={pending}
      isDisabled={pending}
      className={className}
    >
      {text}
    </Button>
  );
}
