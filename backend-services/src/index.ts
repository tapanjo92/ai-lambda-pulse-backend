export const handler = async (event: any) => {
  console.log('👋 Hello from Lambda! Event:', JSON.stringify(event));
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'OK' })
  };
};
