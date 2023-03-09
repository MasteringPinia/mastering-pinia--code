export async function tipOnFail(fn: () => unknown, messageTip: string) {
  try {
    await fn()
  } catch (e) {
    console.log(`__MESSAGE[tip] ${messageTip}`)
    throw e
  }
}
