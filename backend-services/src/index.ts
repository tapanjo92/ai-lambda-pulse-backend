export const handler = async (event: unknown) => {
  console.log('👋 Hello from Lambda! Event:', JSON.stringify(event));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'OK' }),
  };
};
