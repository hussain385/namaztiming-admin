import axios from 'axios';

export const sendNotification = (token, title, body) =>
  axios.post(
    'https://fcm.googleapis.com/fcm/send',
    {
      to: token,
      notification: {
        title,
        body,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAAE5W6Aqg:APA91bFw_t03bZFaOIdMQj-irRXr5eygS8UBqL3Vd7UYUpS9u3n96rCPxiwfTLBpyb69og2zOr7amP2bpgKVqjzY7qUdxd2Etdfkxm7qik013Z6cUrzji1P2Q-ehfl-RvcWQ91ROD_4G',
      },
    },
  );
