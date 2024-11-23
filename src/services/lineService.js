const sendMessage = async (message) => {
    try {
      if (!message) {
        throw new Error('message not found');
      }
      console.log(message);
      console.log(userId);
      const response = await axios.post(
        'https://fc73-2001-fb1-bf-507b-8495-5cf5-4582-d455.ngrok-free.app/send-message',
        {
          userId,
          message
        }
      );
      console.log('response', response.data);
      return response.data;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  };
  
  const logOut = () => {
    liff.logout();
    window.location.reload();
  };