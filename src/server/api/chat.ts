export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  console.log({ body, apikey: config.OPENAI_API_KEY });

  return {
    success: true,
  };
});
