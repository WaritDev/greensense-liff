const sendMessage = async (message) => {
    try {
      if (!message) {
        throw new Error('message not found');
      }
      const response = await axios.post(
        'https://7fc3-2001-fb1-bf-507b-783d-6cb0-d043-5cad.ngrok-free.app/send-message',
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