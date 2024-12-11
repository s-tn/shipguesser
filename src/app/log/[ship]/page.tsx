export default async function Page({
    params,
  }: {
    params: Promise<{ ship: string }>
  }) {
    const ship = (await params).ship
    console.log(ship)
    return <div>{ship}</div>
  }