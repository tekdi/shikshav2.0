import * as React from 'react';
import { TextField, Box } from '@mui/material';

export default function Otp({
  separator,
  length,
  value,
  onChange,
}: Readonly<{
  separator: React.ReactNode;
  length: number;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}>) {
  const inputRefs = React.useRef<HTMLInputElement[]>(
    new Array(length).fill(null)
  );

  const focusInput = (targetIndex: number) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput.focus();
  };

  const selectInput = (targetIndex: number) => {
    const targetInput = inputRefs.current[targetIndex];
    targetInput.select();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case ' ':
        event.preventDefault();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (currentIndex < length - 1) {
          focusInput(currentIndex + 1);
          selectInput(currentIndex + 1);
        }
        break;
      case 'Delete':
        event.preventDefault();
        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });

        break;
      case 'Backspace':
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }

        onChange((prevOtp) => {
          const otp =
            prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
          return otp;
        });
        break;

      default:
        break;
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    const currentValue = event.target.value;
    if (!/^\d*$/.test(currentValue)) {
      return;
    }
    let newOtp = value.split('');
    newOtp[currentIndex] = currentValue;
    let indexToEnter = 0;

    while (indexToEnter <= currentIndex) {
      if (
        inputRefs.current[indexToEnter].value &&
        indexToEnter < currentIndex
      ) {
        indexToEnter += 1;
      } else {
        break;
      }
    }
    onChange(newOtp.join(''));
    if (currentValue !== '' && currentIndex < length - 1) {
      focusInput(currentIndex + 1);
    }
  };

  const handleClick = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    currentIndex: number
  ) => {
    selectInput(currentIndex);
  };

  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;

    // Check if there is text data in the clipboard
    if (clipboardData.types.includes('text/plain')) {
      let pastedText = clipboardData.getData('text/plain');
      pastedText = pastedText.substring(0, length).trim().replace(/[^\d]/g, ''); // Only allow digits
      pastedText = pastedText.substring(0, length).trim();
      let indexToEnter = 0;

      while (indexToEnter <= currentIndex) {
        if (
          inputRefs.current[indexToEnter].value &&
          indexToEnter < currentIndex
        ) {
          indexToEnter += 1;
        } else {
          break;
        }
      }

      const otpArray = value.split('');

      for (let i = indexToEnter; i < length; i += 1) {
        const lastValue = pastedText[i - indexToEnter] ?? ' ';
        otpArray[i] = lastValue;
      }

      onChange(otpArray.join(''));
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      {new Array(length).fill(null).map((_, index) => {
        const uniqueKey = `otp-input-${index}-${length}`;
        return (
          <React.Fragment key={uniqueKey}>
            <TextField
              inputRef={(el) => {
                if (el) {
                  inputRefs.current[index] = el;
                }
              }}
              aria-label={`Digit ${index + 1} of OTP`}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
                handleKeyDown(event, index)
              }
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(event, index)
              }
              onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                handleClick(
                  event as React.MouseEvent<HTMLInputElement, MouseEvent>,
                  index
                )
              }
              onPaste={(event: React.ClipboardEvent<HTMLInputElement>) =>
                handlePaste(event, index)
              }
              value={value[index] ?? ''}
            />
            {index === length - 1 ? null : separator}
          </React.Fragment>
        );
      })}
    </Box>
  );
}
