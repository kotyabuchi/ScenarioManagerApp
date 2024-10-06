'use client';

import { Input, Link } from '@nextui-org/react';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useFormState } from 'react-dom';
import { PasswordInput } from '../PasswordInput';
import { authenticate } from '@/app/actions/signin';
import { useRouter, useSearchParams } from 'next/navigation';
import SubmitButton from '../SubmitButton';

export default function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [state, dispatch] = useFormState(authenticate, undefined);

  const [usernameValue, setUsernameValue] = useState('');
  const [isUsernameTouched, setIsUsernameTouched] = useState(false);

  const [passwordValue, setPasswordValue] = useState('');
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);

  const isUsernameInvalid = useMemo(() => {
    return isUsernameTouched && usernameValue === '';
  }, [usernameValue, isUsernameTouched]);

  const isPassowrdInvalid = useMemo(() => {
    return isPasswordTouched && passwordValue === '';
  }, [passwordValue, isPasswordTouched]);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success('ログインに成功しました');
      router.push(callbackUrl);
      router.refresh();
    } else {
      toast.error(state.error);
    }
  }, [callbackUrl, router, state]);

  return (
    <Suspense>
      <form action={dispatch} className='flex w-full flex-col gap-4'>
        <Input
          isRequired
          required
          type='text'
          label='ユーザー名'
          name='username'
          variant='underlined'
          isInvalid={isUsernameInvalid}
          color={isUsernameInvalid ? 'danger' : 'default'}
          errorMessage='ユーザー名は必須です。'
          onValueChange={setUsernameValue}
          onBlur={() => setIsUsernameTouched(true)}
          className='w-full'
          classNames={{
            inputWrapper: 'after:bg-primary-300',
          }}
        />
        <PasswordInput
          isRequired
          required
          variant='underlined'
          label='パスワード'
          name='password'
          autoComplete='current-password'
          isInvalid={isPassowrdInvalid}
          color={isPassowrdInvalid ? 'danger' : 'default'}
          errorMessage='パスワードは必須です。'
          onValueChange={setPasswordValue}
          onBlur={() => setIsPasswordTouched(true)}
          className='w-full'
          classNames={{
            inputWrapper: 'after:bg-primary-300',
          }}
        />
        <SubmitButton text='ログイン' />
      </form>
    </Suspense>
  );
}
