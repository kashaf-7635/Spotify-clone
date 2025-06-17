import {useState} from 'react';
import {Alert} from 'react-native';

export const useRequest = () => {
  const [isLoading, setIsLoading] = useState(false);

  const requestHandler = async ({
    requestFn,
    onSuccess,
    onError,
    successMessage,
  }) => {
    try {
      setIsLoading(true);

      const res = await requestFn();

      if (onSuccess) {
        await onSuccess(res);
      }

      if (successMessage && res) {
        Alert.alert('Success!', successMessage);
      }
    } catch (err) {
      let message = 'Something went wrong!';
      if (err.response) {
        switch (err.response.status) {
          case 401:
            message = 'Unauthorized. Please log in again.';
            break;
          case 403:
            message = 'Forbidden request.';
            break;
          case 500:
            message = 'Server error. Try again later.';
            break;
          default:
            message = err.response.data?.error?.message || message;
        }
      }

      Alert.alert('Error!', message);
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {isLoading, requestHandler};
};
