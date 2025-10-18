export const healthService = async () => {
     const data = {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        status: 'ok',
  };
  return data;
};