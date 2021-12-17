export default async function sleep(time: number) {
  // eslint-disable-next-line promise/param-names
  return new Promise((res) => setTimeout(res, time))
}
