const sendMessage = async (message) => {
    try {
      if (!message) {
        throw new Error('message not found');
      }
      const response = await axios.post(
        'https://2a3d-184-22-231-98.ngrok-free.app/send-message',
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