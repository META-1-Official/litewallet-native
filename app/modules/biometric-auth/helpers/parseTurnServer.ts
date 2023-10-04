import config from '../../../config';

interface Server {
  urls: string;
  username?: string;
  credential?: string;
}

const parseTurnServer = (): Server[] => {
  const serversList = JSON.parse(config.TURN_SERVERS);

  return serversList.map((turnServer: string) => {
    const servers = turnServer.split('@');
    const server: Server = {
      urls: servers[servers.length - 1], // Get the last element as 'urls'
    };

    if (servers.length > 1) {
      const [username, credential] = servers[0].split(':');
      server.username = username;
      server.credential = credential;
    }

    return server;
  });
};

export default parseTurnServer;
